import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  try {
    const id = params.id;
    // Parse multipart/form-data for images
    const formData = await request.arrayBuffer();
    const stream = require("stream").Readable.from(formData);
    const contentType = request.headers.get("content-type");
    stream.headers = { "content-type": contentType };

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({
      multiples: true,
      uploadDir,
      keepExtensions: true,
      maxFiles: 3,
      maxFileSize: 10 * 1024 * 1024,
      filter: ({ mimetype }) => mimetype && mimetype.startsWith("image/"),
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(stream, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { title, description, location, date } = fields;
    let images = [];
    if (Array.isArray(files.images)) {
      images = files.images.map(
        (file) => "/uploads/" + path.basename(file.filepath)
      );
    } else if (files.images) {
      images = ["/uploads/" + path.basename(files.images.filepath)];
    }

    const client = await clientPromise;
    const db = client.db("yourDatabaseName");
    await db.collection("project").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          location,
          date,
          images,
        },
      }
    );

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const client = await clientPromise;
    const db = client.db("yourDatabaseName");
    await db.collection("project").deleteOne({ _id: new ObjectId(id) });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
