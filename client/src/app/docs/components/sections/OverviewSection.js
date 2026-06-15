
import Card from "@/components/ui/Card";
import { BrainCircuit, Monitor, Code, Terminal, Link as LinkIcon } from "lucide-react";
import { projectURLs } from "../../utils/constants";

export default function OverviewSection() {
  return (
    <div className="space-y-8">
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <BrainCircuit className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Project Overview
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What is KnowBase AI?
              </h3>
              <p className="text-gray-600 mb-4">
                KnowBase AI is an AI-powered knowledge management platform that helps you capture,
                organize, and intelligently retrieve your accumulated knowledge. Think of it as
                "infrastructure for thought" - a personal digital knowledge base that remembers everything
                you learn and helps you make connections.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Key Technologies
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold text-blue-800">Frontend</span>
                  </div>
                  <p className="text-blue-700 text-sm">Next.js 14, React, Tailwind CSS</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-green-800">Backend</span>
                  </div>
                  <p className="text-green-700 text-sm">Node.js, Express, MongoDB</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-semibold text-purple-800">AI</span>
                  </div>
                  <p className="text-purple-700 text-sm">Google Gemini API</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quick Links
              </h3>
              <div className="space-y-3">
                <a href={projectURLs.frontend} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors group">
                  <Monitor className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-primary-600">Launch Application</h4>
                    <p className="text-sm text-gray-500">Access the live dashboard</p>
                  </div>
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                </a>

                <a href={projectURLs.apiDocs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors group">
                  <Code className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-primary-600">API Documentation</h4>
                    <p className="text-sm text-gray-500">Interactive API reference</p>
                  </div>
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                </a>

                <a href={projectURLs.publicAPI + "?q=What+is+knowledge+management"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors group">
                  <Terminal className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-primary-600">Test Public API</h4>
                    <p className="text-sm text-gray-500">Try the AI-powered query endpoint</p>
                  </div>
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}