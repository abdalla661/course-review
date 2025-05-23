import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Resource from "@/lib/models/Resource";
import Student from "@/lib/models/Student";
import ProfessorCourse from "@/models/ProfessorCourse";

export async function GET() {
  try {
    await connectMongodb();

    const pending = await Resource.find({ status: "pending" })
  .populate("student", "name")
  .populate({
    path: "combo",
    populate: [
      { path: "course", select: "name" },
      { path: "professor", select: "name" },
    ],
  });


console.log("📦 Pending resources from DB:", pending);

    return NextResponse.json(pending);
  } catch (error) {
    console.error("❌ Error loading moderation resources:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
