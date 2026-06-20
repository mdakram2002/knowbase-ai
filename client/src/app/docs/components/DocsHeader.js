import Link from "next/link";
import Card from "@/components/ui/Card";
import { Monitor, Server, GitPullRequest, ArrowLeft } from "lucide-react";
import { projectURLs } from "../utils/constants";

export default function DocsHeader() {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            KnowBase AI Documentation
          </h1>
          <p className="text-gray-600">
            Complete technical documentation for the AI-powered knowledge management system.
          </p>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-primary-300 hover:text-primary-600">
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>
      </div>
      {/* Project Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <a href={projectURLs.frontend} target="_blank" rel="noopener noreferrer" className="group">
          <Card className="hover:border-primary-400 transition-colors">
            <div className="p-4 flex items-center gap-3">
              <Monitor className="w-5 h-5 text-primary-600" />
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                  Live Frontend
                </h3>
                <p className="text-sm text-gray-500 truncate">{projectURLs.frontend}</p>
              </div>
            </div>
          </Card>
        </a>

        <a href={projectURLs.backend} target="_blank" rel="noopener noreferrer" className="group">
          <Card className="hover:border-primary-400 transition-colors">
            <div className="p-4 flex items-center gap-3">
              <Server className="w-5 h-5 text-primary-600" />
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                  Backend API
                </h3>
                <p className="text-sm text-gray-500 truncate">{projectURLs.backend}</p>
              </div>
            </div>
          </Card>
        </a>

        <a href={projectURLs.github} target="_blank" rel="noopener noreferrer" className="group">
          <Card className="hover:border-primary-400 transition-colors">
            <div className="p-4 flex items-center gap-3">
              <GitPullRequest className="w-5 h-5 text-primary-600" />
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                  Source Code
                </h3>
                <p className="text-sm text-gray-500">GitHub Repository</p>
              </div>
            </div>
          </Card>
        </a>
      </div>
    </div>
  );
}