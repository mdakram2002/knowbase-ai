"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Edit,
  Share2,
  Download,
  MessageSquare,
  BookOpen,
  Link as LinkIcon,
  Lightbulb,
  Trophy,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import { useKnowledgeStore } from "@/store/useKnowledgeStore";

export default function ProfilePage() {
  const { knowledgeItems, isLoading, fetchKnowledge } = useKnowledgeStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    bio: "Knowledge enthusiast and full-stack developer passionate about AI and learning.",
    location: "San Francisco, CA",
    title: "Senior Developer",
    joinDate: "2024-01-01",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  });

  useEffect(() => {
    fetchKnowledge();
  }, []);

  // Calculate stats
  const stats = {
    totalItems: knowledgeItems.length,
    notes: knowledgeItems.filter((item) => item.type === "note").length,
    links: knowledgeItems.filter((item) => item.type === "link").length,
    insights: knowledgeItems.filter((item) => item.type === "insight").length,
    favorites: knowledgeItems.filter((item) => item.isFavorite).length,
  };

  // Get recent items
  const recentItems = [...knowledgeItems].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  ).slice(0, 5);

  // Get most viewed items
  const topItems = [...knowledgeItems].sort((a, b) => b.views - a.views).slice(0, 3);

  const handleSaveProfile = () => {
    setIsEditMode(false);
    // In a real app, you'd save to backend here
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 lg:ml-64 flex flex-col overflow-hidden">
        <Header />

        {/* Page Header */}
        <div className="border-b border-gray-200 bg-white px-8 py-4 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  View and manage your profile information
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditMode(!isEditMode)}
              className="flex items-center gap-2"
              variant={isEditMode ? "outline" : "default"}
            >
              <Edit className="w-4 h-4" />
              {isEditMode ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-6xl mx-auto">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {/* Profile Header Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                      {/* Avatar */}
                      <div>
                        <img
                          src={profile.avatar}
                          alt={profile.firstName}
                          className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                        />
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1">
                        {isEditMode ? (
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  value={profile.firstName}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      firstName: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Last Name
                                </label>
                                <input
                                  type="text"
                                  value={profile.lastName}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      lastName: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={profile.title}
                                onChange={(e) =>
                                  setProfile({
                                    ...profile,
                                    title: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bio
                              </label>
                              <textarea
                                value={profile.bio}
                                onChange={(e) =>
                                  setProfile({ ...profile, bio: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows="3"
                              />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Location
                                </label>
                                <input
                                  type="text"
                                  value={profile.location}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      location: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  value={profile.email}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      email: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 pt-4">
                              <Button
                                onClick={handleSaveProfile}
                                className="flex items-center gap-2"
                              >
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="mb-4">
                              <h1 className="text-3xl font-bold text-gray-900">
                                {profile.firstName} {profile.lastName}
                              </h1>
                              <p className="text-lg text-blue-600 font-medium mt-1">
                                {profile.title}
                              </p>
                              <p className="text-gray-600 mt-1">{profile.bio}</p>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {profile.email}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {profile.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                Joined{" "}
                                {new Date(profile.joinDate).toLocaleDateString()}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
                >
                  {[
                    {
                      label: "Total Items",
                      value: stats.totalItems,
                      icon: BookOpen,
                      color: "text-blue-600",
                      bg: "bg-blue-50",
                    },
                    {
                      label: "Notes",
                      value: stats.notes,
                      icon: BookOpen,
                      color: "text-cyan-600",
                      bg: "bg-cyan-50",
                    },
                    {
                      label: "Links",
                      value: stats.links,
                      icon: LinkIcon,
                      color: "text-green-600",
                      bg: "bg-green-50",
                    },
                    {
                      label: "Insights",
                      value: stats.insights,
                      icon: Lightbulb,
                      color: "text-yellow-600",
                      bg: "bg-yellow-50",
                    },
                    {
                      label: "Favorites",
                      value: stats.favorites,
                      icon: Trophy,
                      color: "text-purple-600",
                      bg: "bg-purple-50",
                    },
                  ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={`p-6 ${stat.bg} border-0`}>
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className={`w-5 h-5 ${stat.color}`} />
                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                              {stat.label}
                            </span>
                          </div>
                          <p className={`text-3xl font-bold ${stat.color}`}>
                            {stat.value}
                          </p>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Most Viewed */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="lg:col-span-2"
                  >
                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                        <h2 className="text-xl font-semibold text-gray-900">
                          Top Viewed Items
                        </h2>
                      </div>

                      {topItems.length === 0 ? (
                        <p className="text-gray-500 py-8 text-center">
                          No items yet
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {topItems.map((item, index) => (
                            <div
                              key={item._id}
                              className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="text-sm font-bold text-orange-600">
                                    #{index + 1}
                                  </span>
                                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                  </h3>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {item.type.charAt(0).toUpperCase() +
                                    item.type.slice(1)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  {item.views}
                                </p>
                                <p className="text-xs text-gray-500">views</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </motion.div>

                  {/* Activity Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Card className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        Quick Actions
                      </h2>

                      <div className="space-y-3">
                        <Link href="/dashboard">
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Browse Items
                          </Button>
                        </Link>
                        <Link href="/dashboard/knowledge/new">
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Add New Item
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export Profile
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Profile
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="mt-8"
                >
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Recent Items
                    </h2>

                    {recentItems.length === 0 ? (
                      <p className="text-gray-500 py-8 text-center">
                        No recent items
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {recentItems.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {item.title}
                              </h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                                  {item.type}
                                </span>
                                <span>
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                                <span>{item.views} views</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
