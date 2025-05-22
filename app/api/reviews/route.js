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
  await connectMongodb();

  const { searchParams } = new URL(req.url);
  const comboId = searchParams.get("combo");

  if (!comboId) {
    return NextResponse.json({ message: "Missing combo ID" }, { status: 400 });
  }

  const reviews = await Review.find({
    combo: comboId,
    commentStatus: "approved",
    comment: { $ne: "" },
  }).select("comment createdAt"); // only return what's needed

  return NextResponse.json(reviews);
}


