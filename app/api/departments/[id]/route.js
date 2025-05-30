import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Department from "@/lib/models/Department";

export async function GET(req, context) {
  await connectMongodb();

  const params = await context.params;  // 🔥 Await context.params
  const department = await Department.findById(params.id);

  if (!department) {
    return NextResponse.json({ message: "Department not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: department });
}


export async function POST(req) {
  await connectMongodb();

  const { searchParams } = new URL(req.url);
  const facultyId = searchParams.get("facultyId");

  const body = await req.json();

  if (!facultyId) {
    return NextResponse.json({ message: "facultyId is required" }, { status: 400 });
  }

  try {
    const department = await Department.create({
      name: body.name,
      faculty: facultyId,
    });

    return NextResponse.json({ success: true, data: department });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function PATCH(req, { params }) {
  await connectMongodb();
  const body = await req.json();

  try {
    const updated = await Department.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(_, { params }) {
  await connectMongodb();

  try {
    const deleted = await Department.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, data: deleted });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
