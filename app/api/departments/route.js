import { NextResponse } from "next/server";
import Department from "@/lib/models/Department";
import connectMongodb from "@/lib/dbConnection";

export async function GET(request) {
  try {
    await connectMongodb();
    const { searchParams } = new URL(request.url);
    const facultyId = searchParams.get("facultyId");

    if (!facultyId) {
      return NextResponse.json({ message: "Faculty ID is required" }, { status: 400 });
    }

    const departments = await Department.find({ faculty: facultyId }).select("name _id");
    return NextResponse.json(departments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch departments" }, { status: 500 });
  }
}
