import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("yourDatabaseName"); // <-- replace with your DB name
    const projects = await db.collection("project").find({}).toArray();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id"); // expects ?id=... in the URL
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const location = formData.get("location");
    const date = formData.get("date");

    // Handle images
    const images = [];
    const files = formData.getAll("images");
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    for (const file of files) {
      if (file && typeof file.arrayBuffer === "function") {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + "-" + file.name.replace(/\s/g, "_");
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, buffer);
        images.push("/uploads/" + filename);
      }
    }

    const client = await clientPromise;
    const db = client.db("yourDatabaseName");

    // Only update images if new ones are uploaded
    const update = {
      title,
      description,
      location,
      date,
    };
    if (images.length > 0) update.images = images;

    await db
      .collection("project")
      .updateOne({ _id: new ObjectId(id) }, { $set: update });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const location = formData.get("location");
    const date = formData.get("date");

    // Handle images
    const images = [];
    const files = formData.getAll("images");
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    for (const file of files) {
      if (file && typeof file.arrayBuffer === "function") {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + "-" + file.name.replace(/\s/g, "_");
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, buffer);
        images.push("/uploads/" + filename);
      }
    }

    const client = await clientPromise;
    const db = client.db("yourDatabaseName"); // <-- replace with your DB name

    await db.collection("project").insertOne({
      title,
      description,
      location,
      date,
      images,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
