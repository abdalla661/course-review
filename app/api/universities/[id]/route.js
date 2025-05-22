import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import University from "@/lib/models/University"; // make sure path is correct

export async function GET(request, { params }) {
  await connectMongodb();
  const { id } = params;

  try {
    const university = await University.findById(id).lean();
    if (!university) {
      return NextResponse.json({ message: "University not found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: university._id,
      name: university.name,
      emailDomains: university.emailDomains,
    });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  await connectMongodb();
  const body = await req.json();

  const updated = await University.findByIdAndUpdate(params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return NextResponse.json({ message: "University not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(req,{params}) {
  try {
    await connectMongodb();

    const deleted = await University.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "University not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
