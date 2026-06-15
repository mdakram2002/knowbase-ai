import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "knowbase";

let client;
let clientPromise;

if (!MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;

} else {
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("knowledge");

    const knowledge = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!knowledge) {
      return NextResponse.json(
        { success: false, error: "Knowledge not found" },
        { status: 404 },
      );
    }

    // Increment views
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } },
    );

    return NextResponse.json({
      success: true,
      data: knowledge,
    });
    
  } catch (error) {
    console.error("Error fetching knowledge item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch knowledge item" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("knowledge");

    const updateData = {
      ...body,
      tags: (body.tags || []).map((tag) => tag.toLowerCase().trim()),
      updatedAt: new Date().toISOString(),
      aiProcessed: false, // Reset AI processing when content is updated
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" },
    );

    if (!result.value) {
      return NextResponse.json(
        { success: false, error: "Knowledge not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result.value,
    });
  } catch (error) {
    console.error("Error updating knowledge:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update knowledge" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("knowledge");

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Knowledge not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Knowledge deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting knowledge:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete knowledge" },
      { status: 500 },
    );
  }
}
