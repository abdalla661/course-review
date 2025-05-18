import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Professor from "@/lib/models/Professor";

export async function PATCH(req, { params }) {
  await connectMongodb();
  const body = await req.json();

  const updated = await Professor.findByIdAndUpdate(params.id, body, {
    new: true,
    runValidators: true,
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(_, { params }) {
  await connectMongodb();
  const deleted = await Professor.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true, data: deleted });
}
