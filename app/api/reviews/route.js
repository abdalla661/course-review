import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Review from "@/lib/models/Review";
import ProfessorCourse from "@/lib/models/ProfessorCourse";
import Student from "@/lib/models/Student";

export async function POST(req) {
  await connectMongodb();

  const {
    student,
    combo,
    gradingFairness,
    organization,
    availability,
    teachingQuality,
    comment,
  } = await req.json();

  if (!student || !combo) {
    return NextResponse.json({ message: "Missing student or combo" }, { status: 400 });
  }

  const review = await Review.create({
    student,
    combo,
    gradingFairness,
    organization,
    availability,
    teachingQuality,
    comment,
    commentStatus: "pending", // required if moderation is enabled
  });

  return NextResponse.json({ success: true, data: review }, { status: 201 });
}

export async function GET(req) {
  try {
    await connectMongodb();

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const comboId = searchParams.get("combo");

    let filter = {};
    if (comboId) {
  filter = {
    combo: comboId,
    commentStatus: "approved",
    comment: { $ne: "" },
  };
} else if (studentId && studentId !== "undefined") {
  filter = { student: studentId };
} else {
  return NextResponse.json({ message: "Missing valid combo or studentId" }, { status: 400 });
}


    console.log("Fetching reviews with filter:", filter);

    const reviews = await Review.find(filter)
      .populate({
        path: "combo",
        populate: [
          { path: "course", select: "name" },
          { path: "professor", select: "name" }
        ]
      })
      .select("gradingFairness organization availability teachingQuality comment commentStatus combo");

    console.log("Fetched reviews:", reviews);

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("❌ Error in /api/reviews GET:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}




