"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  Eye,
  Tag,
  Brain,
  Copy,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import toast from "react-hot-toast";
import { useKnowledgeStore } from "@/store/useKnowledgeStore";

export default function KnowledgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [knowledge, setKnowledge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteKnowledge } = useKnowledgeStore();

  useEffect(() => {
    fetchKnowledgeItem();
  }, [params.id]);

  const fetchKnowledgeItem = async () => {
    try {
      const response = await fetch(`/api/knowledge/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setKnowledge(data.data);
      } else {
        toast.error("Failed to load knowledge item");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to load knowledge item");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this knowledge item?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteKnowledge(params.id);
      toast.success("Knowledge item deleted successfully");
      router.push("/dashboard");

    } catch (error) {
      toast.error("Failed to delete knowledge item");

    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(knowledge.content);
    toast.success("Content copied to clipboard");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mt-12"></div>
      </div>
    );
  }

  if (!knowledge) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                knowledge.type === "note"
                  ? "bg-blue-100 text-blue-800"
                  : knowledge.type === "link"
                    ? "bg-green-100 text-green-800"
                    : "bg-purple-100 text-purple-800"
              }`}
            >
              {knowledge.type.charAt(0).toUpperCase() + knowledge.type.slice(1)}
            </span>
            {knowledge.aiProcessed && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 flex items-center gap-1">
                <Brain className="w-3 h-3" />
                AI Processed
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {knowledge.title}
          </h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(`/dashboard/knowledge/${params.id}/edit`)
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Created</div>
              <div className="font-medium">
                {formatDate(knowledge.createdAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Views</div>
              <div className="font-medium">{knowledge.views || 0}</div>
            </div>
          </div>

          {knowledge.sourceUrl && (
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Source</div>
                <a
                  href={knowledge.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary-600 hover:underline"
                >
                  Visit Link
                </a>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* AI Summary */}
      {knowledge.summary && (
        <Card className="mb-8 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-primary-800 mb-2">
                AI Summary
              </h3>
              <p className="text-primary-700">{knowledge.summary}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Content */}
      <Card className="mb-8">
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-gray-700">
            {knowledge.content}
          </div>
        </div>
      </Card>

      {/* Tags */}
      {(knowledge.tags.length > 0 || knowledge.aiTags?.length > 0) && (
        <Card className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Tags</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {knowledge.tags.map((tag, index) => (
              <span
                key={`tag-${index}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
            {knowledge.aiTags?.map((tag, index) => (
              <span
                key={`ai-${index}`}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-1"
              >
                <Brain className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/dashboard/knowledge/${params.id}/edit`)
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
