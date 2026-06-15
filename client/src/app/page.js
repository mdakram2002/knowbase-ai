"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  Search,
  Zap,
  Tag,
  Globe,
  ChevronRight,
  Shield,
  Cpu,
} from "lucide-react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Capture",
      description:
        "Capture notes, links, and insights with intelligent auto-tagging",
      color: "primary",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI Processing",
      description: "Automatic summarization and intelligent categorization",
      color: "secondary",
    },
    {
      icon: <Tag className="w-6 h-6" />,
      title: "Organize",
      description: "Flexible tagging and metadata system",
      color: "primary",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Public API",
      description: "Access your knowledge from anywhere via API",
      color: "secondary",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure",
      description: "End-to-end encryption for your knowledge",
      color: "primary",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Fast",
      description: "Lightning fast search and retrieval",
      color: "secondary",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-300 rounded-full mix-blend-multiply blur-3xl opacity-20"
        />
      </div>

      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Brain className="w-8 h-8 text-primary-600" />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-secondary-500" />
            </motion.div>
            <span className="text-2xl font-bold text-gradient">
              KnowBase AI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/docs"
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Docs
            </Link>
            <Link href="/dashboard" className="btn-primary text-sm !px-5 !py-2.5">
              <span>Launch App</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center p-3 bg-gradient-primary rounded-2xl mb-8"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Your <span className="text-gradient">KnowBase AI</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              An AI-powered knowledge management platform that captures,
              organizes, and intelligently surfaces your accumulated knowledge.
              Think of it as infrastructure for thought.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link href="/dashboard" className="btn-primary text-lg">
                Get Started Free
              </Link>
              <Link href="/docs" className="btn-outline text-lg">
                View Documentation
              </Link>
            </div>
          </motion.div>

          {/* Preview Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative mx-auto max-w-5xl"
          >
            <div className="bg-white rounded-2xl shadow-2xl shadow-primary-500/10 p-2 border border-gray-200/80 overflow-hidden ring-1 ring-gray-100">
              <div className="relative rounded-xl h-64 md:h-96 bg-gradient-to-br from-gray-50 to-gray-100">
                <Image
                  src="/dashboard.png"
                  alt="Interactive Dashboard Preview"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                  priority
                />
                {/* Optional: Overlay text for the image */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
                  <p className="text-sm font-medium">Interactive Dashboard Preview</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your knowledge efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`glass-card p-8 rounded-2xl hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 ${
                  feature.color === "primary"
                    ? "hover:border-primary-200"
                    : "hover:border-secondary-200"
                }`}
              >
                <div
                  className={`inline-flex p-3 rounded-xl mb-6 ${
                    feature.color === "primary"
                      ? "bg-primary-100 text-primary-600"
                      : "bg-secondary-100 text-secondary-600"
                  }`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-primary py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="max-w-4xl mx-auto text-center px-6 relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Start Building Your Knowledge Base Today
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join thousands of users who have transformed how they capture,
                organize, and retrieve knowledge.
              </p>
              <Link href="/dashboard">
                <button className="px-10 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 hover:shadow-xl transition-all duration-300 font-semibold text-lg flex items-center justify-center mx-auto">
                  <Brain className="w-5 h-5 mr-2" />
                  Launch Dashboard
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <Brain className="w-6 h-6 text-primary-400" />
              <span className="text-lg font-semibold text-white">
                KnowBase AI
              </span>
            </div>
                </div>
        </div>
      </footer>
    </div>
  );
}
