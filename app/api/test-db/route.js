import connectMongodb from "@/lib/dbConnection";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongodb();
    return NextResponse.json({ message: "connected to mongodb 🎉" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
