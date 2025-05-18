import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Professor from "@/lib/models/Professor";

export async function GET(req) {
  await connectMongodb();

  const { searchParams } = new URL(req.url);
  const departmentId = searchParams.get("departmentId");

  const filter = departmentId ? { department: departmentId } : {};

  const professors = await Professor.find(filter).sort({ createdAt: -1 });

  return NextResponse.json(professors);
}
export async function POST(req) {
  await connectMongodb();
  const body = await req.json();

  try {
    const professor = await Professor.create(body);
    return NextResponse.json({ success: true, data: professor }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
