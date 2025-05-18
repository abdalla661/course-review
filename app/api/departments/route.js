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
