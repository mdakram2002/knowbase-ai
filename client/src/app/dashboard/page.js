"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Brain,
  TrendingUp,
  Zap,
  ChevronDown,
  Grid,
  List,
  BookOpen,
  Link as LinkIcon,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import KnowledgeGrid from "@/components/knowledge/KnowledgeGrid";
import KnowledgeCard from "@/components/knowledge/KnowledgeCard";
import AIChat from "@/components/ai/AIChat";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
import { useKnowledgeStore } from "@/store/useKnowledgeStore";

export default function Dashboard() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { knowledgeItems, isLoading, fetchKnowledge, stats } =
    useKnowledgeStore();

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesFilter = filterType === "all" || item.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
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

  // Stats with animations
  const statsData = [
    {
      id: "total",
      label: "Total Items",
      value: stats.total,
      color: "primary",
      icon: Brain,
      description: "All knowledge items",
      gradient: "from-primary-500 to-secondary-500",
    },
    {
      id: "notes",
      label: "Notes",
      value: stats.notes,
      color: "blue",
      icon: BookOpen,
      description: "Written notes & documents",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "links",
      label: "Links",
      value: stats.links,
      color: "green",
      icon: LinkIcon,
      description: "Saved URLs & resources",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "insights",
      label: "Insights",
      value: stats.insights,
      color: "purple",
      icon: Sparkles,
      description: "Key takeaways & ideas",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <Header />

      <div className="flex mt-16">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 lg:ml-64">
          {/* Dashboard Header */}
          <div className="mb-8 rounded-[2rem] border border-gray-200 bg-white/90 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary-50 to-secondary-50 px-4 py-2 mb-4 text-sm font-semibold text-primary-700 ring-1 ring-primary-100">
                    <Brain className="w-4 h-4" />
                    Knowledge hub refreshed
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Your Knowledge Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2 max-w-2xl">
                    Quickly scan your latest notes, links, insights, and tags with a clean, modern workspace.
                  </p>
                </motion.div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="hidden sm:flex hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button
                  href="/dashboard/knowledge/new"
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Knowledge
                </Button>
              </div>
            </div>
            {/* <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 p-5 text-white shadow-xl">
                <p className="text-sm uppercase tracking-[0.2em] opacity-90">
                  Knowledge score
                </p>
                <p className="mt-3 text-4xl font-bold">{stats.total}</p>
                <p className="mt-2 text-sm opacity-90">
                  A fresh overview of your current content and activity.
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Notes</p>
                <p className="mt-3 text-3xl font-bold text-gray-900">{stats.notes}</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Links</p>
                <p className="mt-3 text-3xl font-bold text-gray-900">{stats.links}</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Insights</p>
                <p className="mt-3 text-3xl font-bold text-gray-900">{stats.insights}</p>
              </div>
            </div> */}
          </div>

            {/* Enhanced Stats Cards - Removed blinking effects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statsData.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition-all duration-300 overflow-hidden bg-white">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            {stat.label}
                          </p>
                          <div className="flex items-baseline space-x-2">
                            <p className="text-3xl lg:text-4xl font-bold text-gray-900">
                              {stat.value}
                            </p>
                            <span className="text-sm text-gray-500">items</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {stat.description}
                          </p>
                        </div>
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white`}
                        >
                          <stat.icon className="w-6 h-6" />
                        </div>
                      </div>

                      {/* Progress bar for total items */}
                      {stat.id === "total" && stats.total > 0 && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>
                              {Math.round(
                                (stats.total / (stats.total * 1.5)) * 100,
                              )}
                              %
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.round(
                                  (stats.total / (stats.total * 1.5)) * 100,
                                )}%`,
                              }}
                              transition={{ delay: 0.5, duration: 1 }}
                              className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                            />
                          </div>
                        </div>
                      )}

                      {/* Type distribution */}
                      {stat.id !== "total" && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Share of total</span>
                            <span>
                              {stats.total > 0
                                ? `${Math.round(
                                    (stat.value / stats.total) * 100,
                                  )}%`
                                : "0%"}
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.round(
                                  (stat.value / stats.total) * 100,
                                )}%`,
                              }}
                              transition={{ delay: 0.7, duration: 1 }}
                              className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Search and Controls */}
            <Card className="mb-8 border border-gray-200 bg-white">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search knowledge by title, content, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white appearance-none pr-10 cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      <option value="all">All Types</option>
                      <option value="note">Notes</option>
                      <option value="link">Links</option>
                      <option value="insight">Insights</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white appearance-none pr-10 cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="title">Title A-Z</option>
                      <option value="views">Most Viewed</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-2 transition-colors ${viewMode === "grid" ? "bg-primary-50 text-primary-600 border-r border-gray-300" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-2 transition-colors ${viewMode === "list" ? "bg-primary-50 text-primary-600" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {filteredItems.length}
                  </span>{" "}
                  {filteredItems.length === 1 ? "item" : "items"} found
                  {searchQuery && ` for "${searchQuery}"`}
                </div>
                {filteredItems.length > 0 && (
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-500">Quick actions:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          filteredItems.map((item) => item.title).join("\n"),
                        );
                        toast.success("Titles copied!");
                      }}
                      className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                    >
                      Copy titles
                    </button>
                    <span className="text-gray-300">•</span>
                    <button
                      onClick={() => {
                        const tags = [
                          ...new Set(
                            filteredItems.flatMap((item) => item.tags),
                          ),
                        ];
                        navigator.clipboard.writeText(tags.join(", "));
                        toast.success("Tags copied!");
                      }}
                      className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                    >
                      Copy tags
                    </button>
                  </div>
                )}
              </div>
            </Card>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Knowledge Section */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Loader />
                    </motion.div>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <Card className="text-center py-16 border border-gray-200 bg-white">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
                      <Brain className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {searchQuery
                        ? "No matching items found"
                        : "Your knowledge base is empty"}
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      {searchQuery
                        ? "Try adjusting your search terms or filters to find what you're looking for."
                        : "Start building your knowledge base by adding notes, links, and insights."}
                    </p>
                    <Button
                      href="/dashboard/knowledge/new"
                      size="lg"
                      className="hover:shadow-sm transition-shadow"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Item
                    </Button>
                  </motion.div>
                </Card>
              ) : viewMode === "grid" ? (
                <KnowledgeGrid items={sortedItems} />
              ) : (
                <div className="space-y-4">
                  {sortedItems.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <KnowledgeCard item={item} listView />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Chat Sidebar */}
            <div className="lg:col-span-1">
              <AIChat />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
