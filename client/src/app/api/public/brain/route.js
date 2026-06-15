import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "knowbase";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: "Query parameter (q) is required",
          usage: "GET /api/public/brain?q=your+question",
        },
        { status: 400 },
      );
    }

    // Get public knowledge items (those with isPublic flag or all if not implemented)
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("knowledge");

    const publicItems = await collection.find({}).limit(10).toArray();

    let answer;
    let sources = [];

    if (process.env.GEMINI_API_KEY && publicItems.length > 0) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const context = publicItems
        .map(
          (item) =>
            `Title: ${item.title}\nSummary: ${item.summary || item.content.substring(0, 200)}...`,
        )
        .join("\n\n");

      const prompt = `Based on the following knowledge base, answer the user's question.
      If the answer isn't in the knowledge base, say "I don't have enough information about that."

      Question: ${query}

      Knowledge Base:
      ${context}

      Answer:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      answer = response.text();

      // Find relevant sources
      sources = publicItems
        .filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some((tag) =>
              tag.toLowerCase().includes(query.toLowerCase()),
            ),
        )
        .slice(0, 3)
        .map((item) => ({
          title: item.title,
          type: item.type,
          summary: item.summary || item.content.substring(0, 100) + "...",
        }));
    } else {
      answer =
        "This is a public API endpoint for the KnowBase AI knowledge base. To get AI-powered answers, please set up the Gemini API key.";
    }

    return NextResponse.json({
      success: true,
      query,
      answer: answer.trim(),
      sources,
      timestamp: new Date().toISOString(),
      api_version: "1.0",
    });
  } catch (error) {
    console.error("Public API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process query",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
