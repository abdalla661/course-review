import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Admin from "@/lib/models/Admin";

export async function POST(req) {
  await connectMongodb();
  const { name, email, password } = await req.json();

  const exists = await Admin.findOne({ email });
  if (exists) {
    return NextResponse.json({ message: "Admin already exists" }, { status: 400 });
  }

  const newAdmin = await Admin.create({ name, email, password });
  return NextResponse.json({ success: true, data: newAdmin });
}
