import connectMongodb from "@/lib/dbConnection";
import Resource from "@/lib/models/Resource";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongodb();

  const pending = await Resource.find({ status: "pending" })
  .populate("student", "name email")
  .populate({
    path: "combo",
    populate: [
      { path: "course", select: "name" },
      { path: "professor", select: "name" },
    ],
  });

  return NextResponse.json(pending);
}
