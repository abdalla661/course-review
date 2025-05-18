import { NextResponse } from "next/server";
import Faculty from "@/lib/models/Faculty";
import University from "@/lib/models/University";
import connectMongodb from "@/lib/dbConnection";

export async function GET(request) {
  await connectMongodb();
  const { searchParams } = new URL(request.url);
  const universityId = searchParams.get("universityId");

  if (!universityId) {
    return NextResponse.json({ message: "University ID is required" }, { status: 400 });
  }

  const faculties = await Faculty.find({ university: universityId }).select("name _id");
  return NextResponse.json(faculties);
}

export async function POST(request) {
  try {
    await connectMongodb();

    const { searchParams } = new URL(request.url);
    const universityId = searchParams.get("universityId");
    const body = await request.json();

    if (!universityId) {
      return NextResponse.json({ message: "University ID is required" }, { status: 400 });
    }

    const university = await University.findById(universityId);
    if (!university) {
      return NextResponse.json({ message: "University not found" }, { status: 404 });
    }

    const newFaculty = await Faculty.create({
      name: body.name,
      university: universityId,
    });

    return NextResponse.json({ success: true, data: newFaculty }, { status: 201 });
  } catch (error) {
    console.error("POST faculties failed:", error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
