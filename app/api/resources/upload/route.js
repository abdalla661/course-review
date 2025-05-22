import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Resource from "@/lib/models/Resource";


export async function POST(req) {
  try {
    await connectMongodb();

    const body = await req.json();

    if (!body.studentId || !body.comboId || !body.file_url || !body.tag) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const resource = await Resource.create({
  student: body.studentId,
  combo: body.comboId,
  tag: body.tag,
  file_url: body.file_url,
  title: body.title || "PDF Resource", // fallback only if truly missing
  status: "pending",
});

    return NextResponse.json({ success: true, data: resource });
  } catch (error) {
    console.error("❌ Resource upload error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}




export async function GET(req) {
  await connectMongodb();

  const { searchParams } = new URL(req.url);
  const comboId = searchParams.get("comboId");

  if (!comboId) {
    return NextResponse.json({ message: "Missing comboId" }, { status: 400 });
  }

  const resources = await Resource.find({
    combo: comboId,
    status: "approved",
  }).select("tag file_url title createdAt");

  return NextResponse.json(resources);
}
