import { NextResponse } from "next/server";
import University from "@/lib/models/University";
import connectMongodb from "@/lib/dbConnection";

export async function GET() {
  try {
    await connectMongodb();
    const universities = await University.find().select("name _id");
    return NextResponse.json(universities);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to fetch universities" }, { status: 500 });
  }
}
