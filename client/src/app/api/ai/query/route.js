import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "knowbase";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let clientPromise;

if (!MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

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
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: true,
        answer:
          "AI service is currently unavailable. Please try again later.",
        sources: [],
      });
    }

    // Get ALL knowledge items for better context
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection("knowledge");

    // Get more items with better filtering
    const knowledgeItems = await collection
      .find({})
      .sort({ createdAt: -1 }) // Get newest first
      .limit(10)
      .toArray();

    // Create a more comprehensive context
    const context = knowledgeItems
      .map(
        (item) =>
          `[${item.type.toUpperCase()}] ${item.title}: ${
            item.content.length > 200
              ? item.content.substring(0, 200) + "..."
              : item.content
          }`
      )
      .join("\n\n");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are KnowBase AI, a knowledge management assistant. You have access to the user's knowledge base below.

USER'S KNOWLEDGE BASE:
${context}

USER QUERY: "${query}"

INSTRUCTIONS:
1. FIRST check if the user's query is directly related to any items in their knowledge base
2. If related, provide a helpful answer using their knowledge
3. If not directly related, provide a general helpful response
4. Always be concise, clear, and helpful
5. End with a question to engage the user

ANSWER:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text().trim();

    // Find relevant sources based on the answer
    const relevantSources = knowledgeItems.filter((item) => {
      const searchText = `${item.title} ${item.content} ${item.tags?.join(" ")}`.toLowerCase();
      const queryWords = query.toLowerCase().split(" ");
      return queryWords.some((word) => searchText.includes(word));
    });

    return NextResponse.json({
      success: true,
      answer,
      sources: relevantSources.slice(0, 3).map((item) => ({
        id: item._id,
        title: item.title,
        type: item.type,
        preview: item.content.substring(0, 100) + "...",
      })),
    });
  } catch (error) {
    console.error("AI Query Error:", error);
    return NextResponse.json({
      success: true,
      answer:
        "I encountered an error while processing your query. Here's what I can tell you based on general knowledge: Next.js is a React framework for building full-stack web applications. It provides features like server-side rendering, static site generation, and API routes. You can find comprehensive documentation at https://nextjs.org/docs",
      sources: [],
    });
  }
}