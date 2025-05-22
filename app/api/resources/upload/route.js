import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Resource from "@/lib/models/Resource";

import { writeFile } from "fs/promises";
import path from "path";
import { mkdirSync, existsSync } from "fs";

export async function POST(req) {
  await connectMongodb();

  const formData = await req.formData();
  const file = formData.get("file");
  const tag = formData.get("tag");
  const combo = formData.get("comboId");
  const student = formData.get("studentId");

  if (!file || file.size > 10 * 1024 * 1024 || file.type !== "application/pdf") {
    return NextResponse.json({ message: "Invalid file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "resources");
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadsDir, fileName);

  await writeFile(filePath, buffer);

  const fileUrl = `/uploads/resources/${fileName}`;

  const resource = await Resource.create({
    student,
    combo,
    tag,
    file_url: fileUrl,
    status: "pending",
    title: file?.name,
  });

  return NextResponse.json({ success: true, data: resource }, { status: 201 });
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
