import { NextResponse } from "next/server";
import Faculty from "@/lib/models/Faculty";
import connectMongodb from "@/lib/dbConnection";

export async function GET(request) {
  try {
    await connectMongodb();
    const { searchParams } = new URL(request.url);
    const universityId = searchParams.get("universityId");

    if (!universityId) {
      return NextResponse.json({ message: "University ID is required" }, { status: 400 });
    }

    const faculties = await Faculty.find({ university: universityId }).select("name _id");
    return NextResponse.json(faculties);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch faculties" }, { status: 500 });
  }
}
