"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Grid,
  List,
  BookOpen,
  ArrowUpDown,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import KnowledgeGrid from "@/components/knowledge/KnowledgeGrid";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import { useKnowledgeStore } from "@/store/useKnowledgeStore";

export default function NotesPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const { knowledgeItems, isLoading, fetchKnowledge, stats } =
    useKnowledgeStore();

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const notes = knowledgeItems.filter((item) => item.type === "note");

  const filteredNotes = notes.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "title":
        return a.title.localeCompare(b.title);
      case "views":
        return b.views - a.views;
      default:
        return 0;
    }
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 lg:ml-64 flex flex-col overflow-hidden">
        <Header />

        {/* Page Header */}
        <div className="border-b border-gray-200 bg-white px-8 py-4 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  {sortedNotes.length} note{sortedNotes.length !== 1 ? "s" : ""} • {stats.notes} total
                </p>
              </div>
            </div>
            <Link href="/dashboard/knowledge/new">
              <Button className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Note
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-8 space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={Search}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded transition-colors ${
                        viewMode === "grid"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded transition-colors ${
                        viewMode === "list"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="relative group">
                    <Button variant="outline" className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4" />
                      Sort
                    </Button>
                    <div className="absolute hidden group-hover:block right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      {["newest", "oldest", "title", "views"].map((option) => (
                        <button
                          key={option}
                          onClick={() => setSortBy(option)}
                          className={`w-full text-left px-4 py-2 transition-colors ${
                            sortBy === option
                              ? "bg-blue-50 text-blue-600"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            {isLoading ? (
              <Loader />
            ) : sortedNotes.length === 0 ? (
              <Card className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <BookOpen className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No notes found
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by creating a new note to build your knowledge base.
                </p>
                <Link href="/dashboard/knowledge/new">
                  <Button>Create your first note</Button>
                </Link>
              </Card>
            ) : (
              <KnowledgeGrid items={sortedNotes} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
