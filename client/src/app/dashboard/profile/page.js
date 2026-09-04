"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Edit2,
  Trash2,
  Save,
  X,
  AlertTriangle,
  Camera,
  MapPin,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, updateProfile, changePassword, deleteProfile, logout } =
    useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    location: "",
    avatar: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deleteData, setDeleteData] = useState({
    password: "",
    confirmDelete: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!profileData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        avatar: profileData.avatar,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("All password fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Password change failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = async () => {
    if (!deleteData.password) {
      toast.error("Password is required");
      return;
    }

    if (!deleteData.confirmDelete) {
      toast.error("Please confirm account deletion");
      return;
    }

    setLoading(true);
    try {
      await deleteProfile(deleteData.password);
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account information and security
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={
                          profileData.avatar ||
                          "https://via.placeholder.com/80"
                        }
                        alt={profileData.name}
                        className="w-20 h-20 rounded-full border-4 border-white object-cover"
                      />
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100">
                          <Camera className="w-4 h-4 text-gray-700" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {profileData.name}
                      </h2>
                      <p className="text-blue-100">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="p-8 space-y-6">
                  {!isEditing ? (
                    <>
                      {/* Display Mode */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Full Name
                          </label>
                          <p className="text-lg text-gray-900">
                            {profileData.name}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Email
                          </label>
                          <p className="text-lg text-gray-900 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-gray-400" />
                            {user?.email}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Location
                          </label>
                          <p className="text-lg text-gray-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            {profileData.location || "Not set"}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Bio
                          </label>
                          <p className="text-lg text-gray-900 flex items-start gap-2">
                            <FileText className="w-5 h-5 text-gray-400 mt-1" />
                            <span>{profileData.bio || "No bio added"}</span>
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Member Since
                          </label>
                          <p className="text-lg text-gray-900">
                            {user?.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-6"
                      >
                        <Edit2 className="w-5 h-5" />
                        Edit Profile
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Edit Mode */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              location: e.target.value,
                            })
                          }
                          placeholder="Your location"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              bio: e.target.value,
                            })
                          }
                          placeholder="Tell us about yourself"
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleProfileUpdate}
                          disabled={loading}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <Save className="w-5 h-5" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          disabled={loading}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <X className="w-5 h-5" />
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Security & Danger Zone */}
            <div className="lg:col-span-1 space-y-6">
              {/* Change Password Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  Security
                </h3>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Change Password
                </button>
              </div>

              {/* Danger Zone Card */}
              <div className="bg-red-50 rounded-2xl shadow-lg border-2 border-red-200 p-6">
                <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Danger Zone
                </h3>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Account
                </button>
                <p className="text-xs text-red-700 mt-3">
                  This action cannot be undone. All your data will be
                  permanently deleted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Change Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                disabled={loading}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 border-2 border-red-200">
            <h2 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Delete Account?
            </h2>

            <p className="text-gray-600 mb-6">
              This will permanently delete your account and all associated
              data. This action cannot be undone.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={deleteData.password}
                  onChange={(e) =>
                    setDeleteData({ ...deleteData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={loading}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deleteData.confirmDelete}
                  onChange={(e) =>
                    setDeleteData({
                      ...deleteData,
                      confirmDelete: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300"
                  disabled={loading}
                />
                <span className="text-sm text-gray-600">
                  I understand this action is permanent and all my data will be
                  deleted
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteProfile}
                disabled={loading || !deleteData.confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteData({ password: "", confirmDelete: false });
                }}
                disabled={loading}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
  //   links: knowledgeItems.filter((item) => item.type === "link").length,
  //   insights: knowledgeItems.filter((item) => item.type === "insight").length,
  //   favorites: knowledgeItems.filter((item) => item.isFavorite).length,
  // };

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
