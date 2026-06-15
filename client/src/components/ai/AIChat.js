/** @format */

"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm your KnowBase AI assistant. I can help you analyze your knowledge, find patterns, answer questions, and generate insights. How can I help you today?",
    timestamp: "10:00 AM",
  },
];

export default function AIChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call your AI API
      const response = await fetch("/api/ai/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();

      const aiResponse = {
        id: messages.length + 2,
        role: "assistant",
        content:
          data.answer ||
          `I understand you're asking about "${input}". Based on your knowledge base, I found several relevant items that might help.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("AI Error:", error);
      const aiResponse = {
        id: messages.length + 2,
        role: "assistant",
        content: `I understand you're asking about "${input}". Based on your knowledge base, here's what I found:\n\nNext.js is a React framework that enables functionality such as server-side rendering and generating static websites. For detailed documentation, visit https://nextjs.org/docs`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sources: [],
      };
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  const quickPrompts = [
    "Summarize my recent notes",
    "Find connections between topics",
    "Generate insights from my links",
    "Help me organize by priority",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header - Fixed height */}
      <div className="bg-white p-4 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-xs text-gray-600">Powered by Gemini</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-900">Pro</span>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="bg-white p-4 border-b border-gray-300">
        <p className="text-sm text-gray-700 mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleQuickPrompt(prompt)}
              className="px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors border border-blue-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Container - Takes most space */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-900 rounded-bl-none border border-gray-200 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`p-1.5 rounded-full ${message.role === "user" ? "bg-blue-600" : "bg-gray-100"}`}
                  >
                    {message.role === "user" ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </div>
                  <span
                    className={`text-xs ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}
                  >
                    {message.role === "user" ? "You" : "Assistant"} •{" "}
                    {message.timestamp}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{message.content}</p>

                {message.role === "assistant" && (
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200">
                    <button
                      className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-700"
                      title="Copy"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-700"
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-700"
                      title="Not helpful"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 text-gray-900 rounded-lg rounded-bl-none p-4 max-w-[85%] shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-full bg-gray-100">
                    <Bot className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-500">
                    Assistant • Thinking...
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    Analyzing your knowledge base...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="bg-white p-4 border-t border-gray-300">
        <form onSubmit={handleSend} className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your knowledge..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="text-sm font-medium">Send</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            AI can make mistakes. Verify important information.
          </p>
        </form>
      </div>
    </div>
  );
}
