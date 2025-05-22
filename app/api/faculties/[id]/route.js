import { NextResponse } from "next/server";
import Faculty from "@/lib/models/Faculty";
import connectMongodb from "@/lib/dbConnection";

export async function GET(_, { params }) {
  await connectMongodb();

  const faculty = await Faculty.findById(params.id).select("name _id");

  if (!faculty) {
    return NextResponse.json({ message: "Faculty not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: faculty });
}


export async function PATCH(req, { params }) {
  await connectMongodb();
  const body = await req.json();

  const updated = await Faculty.findByIdAndUpdate(params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return NextResponse.json({ message: "Faculty not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(req, { params }) {
  try {
    await connectMongodb();

    console.log("🔍 Deleting university with ID:", params.id);

    const deleted = await University.findByIdAndDelete(params.id);

    if (!deleted) {
      console.error("❌ University not found");
      return NextResponse.json({ error: "University not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
