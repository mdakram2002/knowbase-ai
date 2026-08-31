"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Tag, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import { useKnowledgeStore } from "@/store/useKnowledgeStore";

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("count");
  const { knowledgeItems, isLoading, fetchKnowledge } = useKnowledgeStore();

  useEffect(() => {
    fetchKnowledge();
  }, []);

  // Extract and count all tags
  const tagCounts = {};
  knowledgeItems.forEach((item) => {
    item.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // Convert to array and filter
  const tags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .filter((tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  // Sort tags
  const sortedTags = [...tags].sort((a, b) => {
    switch (sortBy) {
      case "count":
        return b.count - a.count;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Get color variants for tags
  const getTagColor = (index) => {
    const colors = [
      {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        badge: "bg-blue-100",
      },
      {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        badge: "bg-green-100",
      },
      {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-700",
        badge: "bg-purple-100",
      },
      {
        bg: "bg-pink-50",
        border: "border-pink-200",
        text: "text-pink-700",
        badge: "bg-pink-100",
      },
      {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-700",
        badge: "bg-yellow-100",
      },
      {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        badge: "bg-red-100",
      },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 lg:ml-64 flex flex-col overflow-hidden">
        <Header />

        {/* Page Header */}
        <div className="border-b border-gray-200 bg-white px-8 py-4 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <Tag className="w-6 h-6 text-indigo-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
              <p className="text-sm text-gray-600 mt-0.5">
                {sortedTags.length} unique tag{sortedTags.length !== 1 ? "s" : ""} • {knowledgeItems.length} total items
              </p>
            </div>
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
                    placeholder="Search tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={Search}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy("count")}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                      sortBy === "count"
                        ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    By Count
                  </button>
                  <button
                    onClick={() => setSortBy("name")}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                      sortBy === "name"
                        ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    By Name
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            {isLoading ? (
              <Loader />
            ) : sortedTags.length === 0 ? (
              <Card className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Tag className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tags found
                </h3>
                <p className="text-gray-600 mb-4">
                  Add tags to your items to organize and discover them better.
                </p>
                <Link href="/dashboard/knowledge/new">
                  <Button>Create new item with tags</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedTags.map((tag, index) => {
                  const color = getTagColor(index);
                  return (
                    <motion.div
                      key={tag.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={`/dashboard?tag=${tag.name}`}>
                        <Card
                          className={`p-6 ${color.bg} border ${color.border} cursor-pointer hover:shadow-md transition-all group`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-sm font-semibold ${color.text}`}>
                                  # {tag.name}
                                </span>
                                <span
                                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${color.badge} ${color.text}`}
                                >
                                  {tag.count}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {tag.count} item{tag.count !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <ChevronRight
                              className={`w-5 h-5 ${color.text} opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1`}
                            />
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Stats */}
            {!isLoading && sortedTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-12 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tag Statistics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Total Tags</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {sortedTags.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Most Used Tag</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {sortedTags[0]?.name || "—"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {sortedTags[0]?.count || 0} items
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Items per Tag</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {sortedTags.length > 0
                        ? (
                            knowledgeItems.reduce(
                              (sum, item) => sum + item.tags.length,
                              0,
                            ) / sortedTags.length
                          ).toFixed(1)
                        : 0}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
