import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import clientPromise from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const title = formData.get("title");
    const description = formData.get("description");
    const location = formData.get("location");
    const date = formData.get("date");
    const images = formData.getAll("images");

    // Handle file uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imagePaths = [];
    for (const image of images) {
      if (image instanceof Blob) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = `${Date.now()}-${image.name}`;
        const filepath = path.join(uploadDir, filename);

        await fs.promises.writeFile(filepath, buffer);
        imagePaths.push(`/uploads/${filename}`);
      }
    }

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db(); // Use your actual database name here if needed
    await db.collection("project").insertOne({
      title,
      description,
      location,
      date,
      images: imagePaths,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const client = await clientPromise;
  const db = client.db("yourDatabaseName");
  const projects = await db.collection("project").find({}).toArray();
  return Response.json(projects);
}
