import { NextResponse } from "next/server";
import University from "@/lib/models/University";
import connectMongodb from "@/lib/dbConnection";

export async function GET() {
  try {
    await connectMongodb();
    const universities = await University.find().select("name emailDomains _id");
    return NextResponse.json(universities);
  } catch (error) {
    console.error("GET /api/universities ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch universities" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectMongodb();
    const body = await req.json();

    const university = await University.create(body);

    return NextResponse.json(
      { success: true, data: university },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/universities ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 400 }
    );
  }
}
