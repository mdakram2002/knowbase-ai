
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "knowbase";
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY,
);

let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
  
} else {
  const client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("knowledge");

    // Get the knowledge item
    const item = await collection.findOne({ _id: id });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Knowledge item not found" },
        { status: 404 },
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate summary
    const summaryPrompt = `Summarize in 2 sentences: ${item.content}`;
    const summaryResult = await model.generateContent(summaryPrompt);
    const summary = (await summaryResult.response).text();

    // Generate tags
    const tagPrompt = `Suggest 3-5 tags for: ${item.content}\nTags (comma-separated):`;
    const tagResult = await model.generateContent(tagPrompt);
    const tagText = (await tagResult.response).text();
    const aiTags = tagText
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t);

    // Update the item
    await collection.updateOne(
      { _id: id },
      {
        $set: {
          summary,
          aiTags,
          aiProcessed: true,
          updatedAt: new Date().toISOString(),
        },
      },
    );

    return NextResponse.json({
      success: true,
      message: "AI processing completed",
      summary,
      aiTags,
    });
  } catch (error) {
    console.error("AI Processing Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "AI processing failed",
      },
      { status: 500 },
    );
  }
}
