"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Lock,
  Database,
  Palette,
  LogOut,
  Save,
  Check,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profile Settings
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    bio: "Knowledge enthusiast and developer",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newItemNotifications: true,
    dailyDigest: false,
    weeklyReport: true,
    aiInsights: true,
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "private",
    allowSearch: false,
    shareAnalytics: false,
    dataRetention: "6-months",
  });

  // Theme Settings
  const [theme, setTheme] = useState({
    mode: "auto",
    accentColor: "blue",
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Profile updated successfully!");
      setIsSaving(false);
    }, 1000);
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Notification preferences saved!");
      setIsSaving(false);
    }, 1000);
  };

  const handleSavePrivacy = async () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Privacy settings updated!");
      setIsSaving(false);
    }, 1000);
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Theme settings saved!");
      setIsSaving(false);
    }, 1000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Lock },
    { id: "theme", label: "Appearance", icon: Palette },
    { id: "data", label: "Data & Storage", icon: Database },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 lg:ml-64 flex flex-col overflow-hidden">
        <Header />

        {/* Page Header */}
        <div className="border-b border-gray-200 bg-white px-8 py-4 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <Settings className="w-6 h-6 text-gray-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-5xl mx-auto">
            {/* Tabs */}
            <div
              className="mb-8 flex gap-2 border-b border-gray-200 overflow-x-auto"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-all ${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Profile Information
                  </h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <Input
                          value={profile.firstName}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <Input
                          value={profile.lastName}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              lastName: e.target.value,
                            })
                          }
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        placeholder="Enter email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) =>
                          setProfile({ ...profile, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        rows="4"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-red-200 bg-red-50">
                  <h2 className="text-xl font-semibold text-red-900 mb-4">
                    Danger Zone
                  </h2>
                  <p className="text-red-700 mb-4">
                    Be careful with these actions. They cannot be undone.
                  </p>
                  <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {[
                      {
                        key: "emailNotifications",
                        label: "Email Notifications",
                        description: "Receive updates and notifications via email",
                      },
                      {
                        key: "newItemNotifications",
                        label: "New Item Alerts",
                        description:
                          "Get notified when you add new items to your knowledge base",
                      },
                      {
                        key: "dailyDigest",
                        label: "Daily Digest",
                        description:
                          "Receive a daily summary of your activity",
                      },
                      {
                        key: "weeklyReport",
                        label: "Weekly Report",
                        description: "Get a weekly summary of insights",
                      },
                      {
                        key: "aiInsights",
                        label: "AI Insights",
                        description:
                          "Receive AI-generated insights from your knowledge",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              [item.key]: e.target.checked,
                            })
                          }
                          className="w-5 h-5 mt-1 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Button
                      onClick={handleSaveNotifications}
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Privacy & Security Tab */}
            {activeTab === "privacy" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Privacy Settings
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Visibility
                      </label>
                      <select
                        value={privacy.profileVisibility}
                        onChange={(e) =>
                          setPrivacy({
                            ...privacy,
                            profileVisibility: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="private">Private (Only you)</option>
                        <option value="team">Team Only</option>
                        <option value="public">Public</option>
                      </select>
                    </div>

                    <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Allow in Search
                        </p>
                        <p className="text-sm text-gray-500">
                          Allow your profile to appear in search results
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.allowSearch}
                        onChange={(e) =>
                          setPrivacy({
                            ...privacy,
                            allowSearch: e.target.checked,
                          })
                        }
                        className="w-5 h-5 mt-1 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Share Analytics
                        </p>
                        <p className="text-sm text-gray-500">
                          Help us improve by sharing usage analytics
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.shareAnalytics}
                        onChange={(e) =>
                          setPrivacy({
                            ...privacy,
                            shareAnalytics: e.target.checked,
                          })
                        }
                        className="w-5 h-5 mt-1 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Retention
                      </label>
                      <select
                        value={privacy.dataRetention}
                        onChange={(e) =>
                          setPrivacy({
                            ...privacy,
                            dataRetention: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="3-months">3 Months</option>
                        <option value="6-months">6 Months</option>
                        <option value="1-year">1 Year</option>
                        <option value="forever">Forever</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Button
                      onClick={handleSavePrivacy}
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Settings
                        </>
                      )}
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Two-Factor Authentication
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </Card>
              </motion.div>
            )}

            {/* Appearance Tab */}
            {activeTab === "theme" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Appearance Settings
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Theme Mode
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {["light", "dark", "auto"].map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setTheme({ ...theme, mode })}
                            className={`p-4 rounded-lg border-2 transition-all text-center ${
                              theme.mode === mode
                                ? "border-primary-500 bg-primary-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <p className="font-medium text-gray-900 capitalize">
                              {mode}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {mode === "auto" ? "Follow system" : mode}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Accent Color
                      </label>
                      <div className="grid grid-cols-5 gap-4">
                        {["blue", "purple", "green", "red", "orange"].map(
                          (color) => (
                            <button
                              key={color}
                              onClick={() =>
                                setTheme({ ...theme, accentColor: color })
                              }
                              className={`w-16 h-16 rounded-lg border-2 transition-all ${
                                theme.accentColor === color
                                  ? "border-gray-900 scale-105"
                                  : "border-gray-200"
                              }`}
                              style={{
                                backgroundColor: `var(--color-${color}-500, #3b82f6)`,
                              }}
                            >
                              {theme.accentColor === color && (
                                <Check className="w-6 h-6 text-white mx-auto" />
                              )}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Button
                      onClick={handleSaveTheme}
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Theme
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Data & Storage Tab */}
            {activeTab === "data" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Storage Usage
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          Total Storage Used
                        </span>
                        <span className="text-gray-600">2.4 GB / 10 GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full"
                          style={{ width: "24%" }}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                      {[
                        { label: "Notes", size: "1.2 GB" },
                        { label: "Links", size: "0.8 GB" },
                        { label: "Attachments", size: "0.4 GB" },
                      ].map((item) => (
                        <div key={item.label} className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">{item.label}</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {item.size}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Data Export & Backup
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Download your data in JSON format for backup or migration
                  </p>
                  <div className="flex gap-4">
                    <Button>Export All Data</Button>
                    <Button variant="outline">Schedule Backup</Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Danger Zone
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Permanently delete all your data. This action cannot be
                    undone.
                  </p>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Delete All Data
                  </Button>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
