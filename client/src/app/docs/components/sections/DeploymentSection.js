
import Card from "@/components/ui/Card";
import { Cloud, Monitor, Server } from "lucide-react";
import { projectURLs } from "../../utils/constants";

export default function DeploymentSection() {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Cloud className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Deployment Guide</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Current Production Deployment
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Monitor className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">
                        Frontend (Vercel)
                      </h4>
                    </div>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span>Next.js 14 with App Router</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span>Automatic HTTPS & SSL</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span>Global CDN distribution</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span>Automatic preview deployments</span>
                      </li>
                    </ul>
                    <a
                      href={projectURLs.frontend}
                      className="text-primary-600 hover:underline text-sm mt-3 inline-block"
                    >
                      {projectURLs.frontend}
                    </a>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Server className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">
                        Backend (Render)
                      </h4>
                    </div>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>Node.js + Express API</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>MongoDB Atlas database</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>Auto-scaling capabilities</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>Zero-downtime deployments</span>
                      </li>
                    </ul>
                    <a
                      href={projectURLs.backend}
                      className="text-primary-600 hover:underline text-sm mt-3 inline-block"
                    >
                      {projectURLs.backend}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Environment Variables
            </h3>
            <div className="space-y-3">
              {[
                {
                  name: "MONGODB_URI",
                  description: "MongoDB connection string",
                  required: true,
                },
                {
                  name: "GEMINI_API_KEY",
                  description: "Google Gemini AI API key",
                  required: true,
                },
                {
                  name: "JWT_SECRET",
                  description: "Secret key for JWT token generation",
                  required: true,
                },
                {
                  name: "NODE_ENV",
                  description: "Environment (development/production)",
                  required: false,
                  default: "development",
                },
                {
                  name: "PORT",
                  description: "Server port",
                  required: false,
                  default: "5000",
                },
                {
                  name: "CLIENT_URL",
                  description: "Frontend URL for CORS",
                  required: false,
                  default: "http://localhost:3000",
                },
              ].map((env, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 border border-gray-200 rounded"
                >
                  <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded shrink-0">
                    {env.name}
                  </code>
                  <span className="text-gray-600 text-sm flex-1">
                    {env.description}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${env.required ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {env.required ? "REQUIRED" : "OPTIONAL"}
                    </span>
                    {env.default && (
                      <span className="text-xs text-gray-500">
                        Default: {env.default}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Local Development Setup
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Backend Setup
                </h4>
                <pre className="text-sm bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
                  {`# Clone repository
                    git clone ${projectURLs.github}
                    cd knowbase-ai

                    # Install dependencies
                    npm install

                    # Set up environment variables
                    cp .env.example .env
                    # Edit .env with your credentials

                    # Start development server
                    npm run dev

                    # API will be available at:
                    # http://localhost:5000`}
                </pre>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Frontend Setup
                </h4>
                <pre className="text-sm bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
                  {`# Navigate to frontend directory
                    cd client

                    # Install dependencies
                    npm install

                    # Set up environment variables
                    # Create .env.local with:
                    NEXT_PUBLIC_API_URL=http://localhost:5000

                    # Start development server
                    npm run dev

                    # Frontend will be available at:
                    # http://localhost:3000`}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Deployment to Other Platforms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Docker Deployment
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Containerize the application for any cloud platform
                </p>
                <code className="text-xs bg-gray-100 p-2 rounded block">
                  docker-compose up -d
                </code>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  AWS Deployment
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Deploy to AWS Elastic Beanstalk or ECS
                </p>
                <code className="text-xs bg-gray-100 p-2 rounded block">
                  eb deploy knowbase-ai
                </code>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Railway Deployment
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  One-click deployment with automatic provisioning
                </p>
                <code className="text-xs bg-gray-100 p-2 rounded block">
                  railway up
                </code>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Monitoring & Maintenance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Health Checks
                </h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span>API Status: GET /health</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span>Database Connection: Monitored automatically</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span>AI Service: Health check on startup</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Logging</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span>Request/Response logging with morgan</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span>Error tracking with structured logs</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span>API usage analytics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
