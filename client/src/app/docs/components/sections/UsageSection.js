
import Card from "@/components/ui/Card";
import { BookOpen } from "lucide-react";
import { projectURLs } from "../../utils/constants";

export default function UsageSection() {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Usage Guide</h2>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Getting Started
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  1. Access the Application
                </h4>
                <p className="text-blue-700">
                  Visit the live dashboard at{" "}
                  <a
                    href={projectURLs.frontend}
                    className="underline font-medium"
                  >
                    {projectURLs.frontend}
                  </a>
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  2. Explore Features
                </h4>
                <ul className="space-y-2 text-green-700">
                  <li>
                    • <strong>Dashboard:</strong> Overview of all your knowledge
                    items
                  </li>
                  <li>
                    • <strong>Add Knowledge:</strong> Click the "+ Add
                    Knowledge" button
                  </li>
                  <li>
                    • <strong>AI Chat:</strong> Use the right sidebar to ask
                    questions
                  </li>
                  <li>
                    • <strong>Search:</strong> Use the search bar to find
                    specific items
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">
                  3. Test the Public API
                </h4>
                <p className="text-purple-700 mb-2">
                  Try the public API endpoint without authentication:
                </p>
                <code className="block text-sm bg-purple-800 text-purple-100 p-3 rounded">
                  curl "{projectURLs.publicAPI}
                  ?q=What+is+the+benefit+of+knowledge+management?"
                </code>
                <a
                  href={
                    projectURLs.publicAPI +
                    "?q=What+is+the+benefit+of+knowledge+management?"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline text-sm mt-2 inline-block"
                >
                  Try it in your browser →
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Best Practices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  For Knowledge Capture
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                    <span>Add descriptive titles for easy searching</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                    <span>Use tags consistently across related items</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                    <span>Let AI auto-tag first, then refine manually</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  For Organization
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                    <span>Create a consistent tagging hierarchy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                    <span>Use the AI chat to discover connections</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                    <span>Regularly review and archive old items</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Integration Examples
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Using the Public API
                </h4>
                <p className="text-gray-600 mb-3">
                  Integrate the KnowBase AI API into your applications:
                </p>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">
                      JavaScript/Node.js
                    </h5>
                    <pre className="text-sm bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
                      {`    // Query the public API
                            async function queryKnowBase(question) {
                            const response = await fetch(
                                \`${projectURLs.publicAPI}?q=\${encodeURIComponent(question)}\`
                            );
                            return await response.json();
                            }

                            // Example usage
                            const result = await queryKnowBase(
                            "What are the benefits of note-taking?"
                            );
                            console.log(result.answer);
                        `}
                    </pre>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">
                      Python
                    </h5>
                    <pre className="text-sm bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
                      {`import requests

                            def query_knowbase(question):
                                response = requests.get(
                                    "${projectURLs.publicAPI}",
                                    params={"q": question}
                                )
                                return response.json()

                            # Example usage
                            result = query_knowbase(
                                "How to improve learning retention?"
                            )
                            print(result["answer"])
                        `}
                    </pre>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">
                      cURL
                    </h5>
                    <pre className="text-sm bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
                      {`# Basic query
                        curl "${projectURLs.publicAPI}?q=What+is+machine+learning?"

                        # With pretty JSON output
                        curl "${projectURLs.publicAPI}?q=Explain+neural+networks" | jq .`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Troubleshooting
            </h3>
            <div className="space-y-3">
              {[
                {
                  issue: "API returning 404",
                  solution:
                    "Check the base URL and ensure you're using the correct endpoint path",
                  check: "Verify: " + projectURLs.publicAPI + "?q=test",
                },
                {
                  issue: "CORS errors in browser",
                  solution:
                    "Ensure your frontend URL is whitelisted in CORS configuration",
                  check: "Check browser console for specific error details",
                },
                {
                  issue: "Slow response times",
                  solution:
                    "The AI processing may take a few seconds for complex queries",
                  check: "Response times typically 1-3 seconds",
                },
                {
                  issue: "No results from search",
                  solution:
                    "Try different search terms or check if knowledge items exist",
                  check: "Verify you have added knowledge items first",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <span className="text-yellow-800 font-bold">!</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {item.issue}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.solution}
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Check:</span> {item.check}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Tips & Tricks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Keyboard Shortcuts
                </h4>
                <ul className="space-y-1 text-blue-700 text-sm">
                  <li>
                    <kbd className="bg-white border px-2 py-1 rounded">
                      Ctrl/Cmd + K
                    </kbd>{" "}
                    - Quick search
                  </li>
                  <li>
                    <kbd className="bg-white border px-2 py-1 rounded">
                      Ctrl/Cmd + N
                    </kbd>{" "}
                    - New knowledge item
                  </li>
                  <li>
                    <kbd className="bg-white border px-2 py-1 rounded">/</kbd> -
                    Focus search bar
                  </li>
                  <li>
                    <kbd className="bg-white border px-2 py-1 rounded">Esc</kbd>{" "}
                    - Close modal/panel
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  Productivity Tips
                </h4>
                <ul className="space-y-1 text-green-700 text-sm">
                  <li>• Use the browser extension for quick capture</li>
                  <li>• Set up recurring reviews of important items</li>
                  <li>• Export your knowledge as markdown or PDF</li>
                  <li>• Share knowledge items with team members</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
