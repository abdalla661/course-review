import connectMongodb from "@/lib/dbConnection";
import Resource from "@/lib/models/Resource";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectMongodb();

  const { searchParams } = new URL(req.url);
  const comboId = searchParams.get("comboId");

  if (!comboId) {
    return NextResponse.json({ message: "Missing comboId" }, { status: 400 });
  }

  const approved = await Resource.find({
  combo: comboId,
  status: "approved",
}).select("file_url tag title");


  return NextResponse.json(approved);
}
