import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Resource from "@/lib/models/Resource";

export async function GET(req) {
  await connectMongodb();

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const comboId = searchParams.get("comboId");

  let filter = {};

  if (studentId) {
    // 🔥 Fetch resources uploaded by the student
    filter.student = studentId;
  } else if (comboId) {
    // 🔥 Fetch approved resources for the combo
    filter.combo = comboId;
    filter.status = "approved";
  } else {
    return NextResponse.json({ message: "Missing studentId or comboId" }, { status: 400 });
  }

  const resources = await Resource.find(filter).select("tag file_url title status");

  return NextResponse.json({ success: true, data: resources });
}

export async function DELETE(req, { params }) {
  await connectMongodb();

  const id = params.id;
  const deleted = await Resource.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ message: "Resource not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Resource deleted" });
}
