"use client";

import { useState } from "react";
import {
  Home,
  Book,
  Link as LinkIcon,
  Lightbulb,
  Tag,
  Archive,
  Star,
  Clock,
  Settings,
  HelpCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/notes", icon: Book, label: "Notes", count: 24 },
  { href: "/dashboard/links", icon: LinkIcon, label: "Links", count: 12 },
  { href: "/dashboard/insights", icon: Lightbulb, label: "Insights", count: 8 },
  { href: "/dashboard/tags", icon: Tag, label: "Tags", count: 15 },
  { href: "/dashboard/archive", icon: Archive, label: "Archive" },
  { href: "/dashboard/favorites", icon: Star, label: "Favorites" },
  { href: "/dashboard/recent", icon: Clock, label: "Recent" },
];

const secondaryItems = [
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  { href: "/docs", icon: HelpCircle, label: "Help & Docs" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col h-[calc(100vh-4rem)] fixed top-16 left-0 ${isCollapsed ? "w-20" : "w-64"} border-r border-gray-200/80 bg-white/90 backdrop-blur-sm transition-all duration-300 overflow-y-auto z-40`}
    >
      {/* Main Navigation */}
      <div className="flex-1 p-4">
        <div className="mb-8">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg mb-4"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-4 h-0.5 bg-gray-400"></div>
            </div>
          </button>

          {!isCollapsed && (
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl mb-6 border border-primary-100/50 cursor-pointer hover:shadow-soft transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Quick Capture
                </p>
                <p className="text-xs text-gray-500">Add new item</p>
              </div>
            </div>
          )}
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${isCollapsed ? "justify-center p-3" : "justify-between p-3"} rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <item.icon
                    className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"}`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && item.count && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Secondary Navigation */}
      <div className="p-4 border-t border-gray-200">
        <nav className="space-y-1">
          {secondaryItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${isCollapsed ? "justify-center p-3" : "p-3"} rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Storage Indicator */}
        {!isCollapsed && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Storage</span>
              <span>45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full w-2/5"></div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
