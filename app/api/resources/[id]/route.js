import connectMongodb from "@/lib/dbConnection";
import Resource from "@/lib/models/Resource";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  await connectMongodb();

  const { id } = params;
  const { status } = await req.json();

  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  const updated = await Resource.findByIdAndUpdate(id, { status }, { new: true });
  return NextResponse.json(updated);
}
export async function DELETE(req, { params }) {
  await connectMongodb();
  const deleted = await Resource.findByIdAndDelete(params.id);
  if (!deleted) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Deleted" });
}