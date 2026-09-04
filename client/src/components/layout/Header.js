"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Brain,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavbar } from "@/contexts/NavbarContext";

const mobileNavItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/notes", label: "Notes" },
  { href: "/dashboard/links", label: "Links" },
  { href: "/dashboard/insights", label: "Insights" },
  { href: "/dashboard/tags", label: "Tags" },
  { href: "/dashboard/archive", label: "Archive" },
  { href: "/dashboard/favorites", label: "Favorites" },
  { href: "/dashboard/recent", label: "Recent" },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/docs", label: "Help & Docs" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isNavbarVisible, hideNavbar, showNavbar } = useNavbar();
  const { user, isAuthenticated, logout } = useAuth();

  // Hide navbar when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      {/* Hover trigger to show navbar */}
      <div
        className="fixed top-0 left-0 right-0 h-2 z-50 cursor-pointer"
        onMouseEnter={showNavbar}
      />

      <header
        className={`glass-nav fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          isNavbarVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              <Link
                href={isAuthenticated ? "/dashboard" : "/"}
                className="ml-4 lg:ml-0 flex items-center space-x-3 group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/25 group-hover:shadow-lg transition-shadow">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient hidden sm:block">
                  KnowBase AI
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* Authenticated User View */}
                  <button className="relative p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-3 p-1.5 pr-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition-all"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-sm overflow-hidden">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-slide-up">
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                        <div className="border-t border-gray-100 my-1.5" />
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Guest User View */}
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors hidden sm:inline-block"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {isAuthenticated && isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
