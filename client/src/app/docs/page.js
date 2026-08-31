"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Search, MessageCircle, Mail } from "lucide-react";
import DocsHeader from "./components/DocsHeader";
import DocsSidebar from "./components/DocsSidebar";
import OverviewSection from "./components/sections/OverviewSection";
import ArchitectureSection from "./components/sections/ArchitectureSection";
import ApiSection from "./components/sections/ApiSection";
import AiSection from "./components/sections/AiSection";
import DeploymentSection from "./components/sections/DeploymentSection";
import FeaturesSection from "./components/sections/FeaturesSection";
import UsageSection from "./components/sections/UsageSection";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I create a new note?",
      answer:
        "You can create a new note by clicking the 'New Note' button on the Dashboard or Notes page. Fill in the title, content, and tags, then click Save.",
    },
    {
      id: 2,
      question: "Can I organize my knowledge with tags?",
      answer:
        "Yes! Tags help you organize and categorize your knowledge. You can add multiple tags to each item and browse by tags on the Tags page.",
    },
    {
      id: 3,
      question: "How does the AI processing work?",
      answer:
        "When you add a new item, our AI automatically processes it to extract insights, generate summaries, and suggest related items from your knowledge base.",
    },
    {
      id: 4,
      question: "Can I search across all my items?",
      answer:
        "Absolutely! Use the search bar to find items by title, content, or tags. The search works across all your items in the knowledge base.",
    },
    {
      id: 5,
      question: "How do I backup my data?",
      answer:
        "Go to Settings > Data & Storage and click 'Export All Data' to download your data in JSON format. You can also schedule automatic backups.",
    },
    {
      id: 6,
      question: "Can I archive items?",
      answer:
        "Yes, you can archive items to hide them from your main view. Archived items can be restored anytime from the Archive page.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <DocsHeader />

        <div className="grid lg:grid-cols-4 gap-8">
          <DocsSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          <div className="lg:col-span-3 space-y-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === "overview" && <OverviewSection />}
              {activeSection === "architecture" && <ArchitectureSection />}
              {activeSection === "api" && <ApiSection />}
              {activeSection === "ai" && <AiSection />}
              {activeSection === "deployment" && <DeploymentSection />}
              {activeSection === "features" && <FeaturesSection />}
              {activeSection === "usage" && <UsageSection />}
            </motion.div>

            {/* FAQ Section - Only show on overview */}
            {activeSection === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Frequently Asked Questions
                  </h2>

                  <div className="space-y-4">
                    {faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                      >
                        <button
                          onClick={() =>
                            setExpandedFAQ(
                              expandedFAQ === faq.id ? null : faq.id,
                            )
                          }
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 text-left">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 transition-transform ${
                              expandedFAQ === faq.id ? "transform rotate-180" : ""
                            }`}
                          />
                        </button>

                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-6 py-4 bg-gray-50 border-t border-gray-200"
                          >
                            <p className="text-gray-700">{faq.answer}</p>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Support Section - Only show on overview */}
            {activeSection === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Need Help?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Can't find what you're looking for? Our support team is here
                    to help!
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 justify-center"
                    >
                      <Mail className="w-4 h-4" />
                      Contact Support
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 justify-center"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Join Community
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
