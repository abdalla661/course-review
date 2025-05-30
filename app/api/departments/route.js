import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Department from "@/lib/models/Department";

export async function GET(req) {
  await connectMongodb();

  const { searchParams } = new URL(req.url);
  const facultyId = searchParams.get("facultyId");

  const filter = facultyId ? { faculty: facultyId } : {};

  const departments = await Department.find(filter).sort({ createdAt: -1 });

  return NextResponse.json(departments);
}
export async function POST(req) {
  try {
    await connectMongodb();

    const { searchParams } = new URL(req.url);
    const facultyId = searchParams.get("facultyId");

    const body = await req.json();
    const { name } = body;

    if (!name || !facultyId) {
      return NextResponse.json({ message: "Missing department name or facultyId" }, { status: 400 });
    }

    const newDepartment = await Department.create({ name, faculty: facultyId });

    return NextResponse.json({ success: true, data: newDepartment }, { status: 201 });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
