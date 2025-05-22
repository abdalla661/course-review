import { NextResponse } from "next/server";
import connectMongodb from "@/lib/mongodb";
import Resource from "@/models/Resource";
import Student from "@/models/Student";
import ProfessorCourse from "@/models/ProfessorCourse";

export async function GET() {
  try {
    await connectMongodb();

    const pending = await Resource.find({ status: "pending" })
      // .populate("student", "name")
      // .populate("combo");
console.log("📦 Pending resources from DB:", pending);

    return NextResponse.json(pending);
  } catch (error) {
    console.error("❌ Error loading moderation resources:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
