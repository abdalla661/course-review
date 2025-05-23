import { NextResponse } from "next/server";
import connectMongodb from "@/lib/mongodb";
import Resource from "@/models/Resource";

// ✅ These are needed for .populate() to work
import Student from "@/lib/models/Student"
import ProfessorCourse from "@/lib/models/ProfessorCourse";

export async function GET() {
  try {
    await connectMongodb();

    const resources = await Resource.find({ status: "pending" })
      .populate("student", "name")
      .populate({
        path: "combo",
        populate: [
          { path: "course", select: "name" },
          { path: "professor", select: "name" },
        ],
      });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("❌ Error loading moderation resources:", error);
    return NextResponse.json(
      { error: "Failed to load resources" },
      { status: 500 }
    );
  }
}
