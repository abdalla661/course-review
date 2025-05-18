import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Course from "@/lib/models/Course";

export async function GET(req) {
  await connectMongodb();

  const { searchParams } = new URL(req.url);
  const departmentId = searchParams.get("departmentId");

  const filter = departmentId ? { department: departmentId } : {};
  const courses = await Course.find(filter).sort({ createdAt: -1 });

  return NextResponse.json(courses);
}

export async function POST(req) {
  await connectMongodb();

  const body = await req.json();
  try {
    const course = await Course.create(body);
    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
