import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "knowbase";

let client;
let clientPromise;

if (!MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env");
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("knowledge");

    // Build filter
    const filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
        { aiTags: { $regex: query, $options: "i" } },
      ];
    }

    if (type && type !== "all") {
      filter.type = type;
    }

    // Get total count
    const total = await collection.countDocuments(filter);

    // Get items
    const sortOrder = order === "desc" ? -1 : 1;
    const items = await collection
      .find(filter)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        total,
        limit,
        skip,
        hasMore: total > skip + limit,
      },
    });
  } catch (error) {
    console.error("Error fetching knowledge:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch knowledge" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content || !body.type) {
      return NextResponse.json(
        { success: false, error: "Title, content, and type are required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("knowledge");

    const knowledge = {
      ...body,
      title: body.title.trim(),
      content: body.content.trim(),
      tags: (body.tags || []).map((tag) => tag.toLowerCase().trim()),
      aiTags: [],
      summary: "",
      aiProcessed: false,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(knowledge);
    knowledge._id = result.insertedId;

    return NextResponse.json(
      {
        success: true,
        data: knowledge,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating knowledge:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create knowledge" },
      { status: 500 },
    );
  }
}
