/**
 * Source Attribution Component
 *
 * Displays data source information and verification status
 * Builds trust by showing users where information comes from
 */

import React from "react";
import { ExternalLink, CheckCircle, AlertTriangle, Info } from "lucide-react";

interface SourceAttributionProps {
  sourceUrl?: string;
  sourceName?: string;
  sourceType?: "official" | "verified" | "user_submitted" | "ai_generated" | "third_party";
  verifiedAt?: string | Date;
  lastVerifiedAt?: string | Date;
  dataQualityScore?: number;
  className?: string;
}

const SourceAttribution: React.FC<SourceAttributionProps> = ({
  sourceUrl,
  sourceName,
  sourceType,
  verifiedAt,
  lastVerifiedAt,
  dataQualityScore,
  className = "",
}) => {
  // Don't render if no source info
  if (!sourceUrl && !sourceName && !sourceType) {
    return null;
  }

  // Determine verification status
  const isVerified = !!verifiedAt;
  const isStale =
    lastVerifiedAt &&
    new Date(lastVerifiedAt) < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  // Source type badge color
  const sourceTypeBadge: Record<string, { bg: string; text: string; label: string }> = {
    official: { bg: "bg-green-100", text: "text-green-800", label: "Official Source" },
    verified: { bg: "bg-blue-100", text: "text-blue-800", label: "Verified Source" },
    user_submitted: { bg: "bg-yellow-100", text: "text-yellow-800", label: "User Submitted" },
    ai_generated: { bg: "bg-purple-100", text: "text-purple-800", label: "AI Generated" },
    third_party: { bg: "bg-gray-100", text: "text-gray-800", label: "Third Party" },
  };

  const badge = sourceType ? sourceTypeBadge[sourceType] : null;

  // Quality score indicator
  const getQualityColor = (score?: number) => {
    if (!score) return "text-gray-500";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getQualityLabel = (score?: number) => {
    if (!score) return "Unknown";
    if (score >= 80) return "High Quality";
    if (score >= 60) return "Medium Quality";
    return "Low Quality";
  };

  return (
    <div className={`border border-gray-200 rounded-lg p-4 bg-gray-50 ${className}`}>
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />

        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900">Data Source</h3>

            {/* Source Type Badge */}
            {badge && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
              >
                {badge.label}
              </span>
            )}

            {/* Verification Badge */}
            {isVerified && !isStale && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}

            {/* Stale Warning */}
            {isStale && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <AlertTriangle className="w-3 h-3" />
                Needs Update
              </span>
            )}
          </div>

          {/* Source Link */}
          {sourceName && (
            <div className="text-sm text-gray-700">
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {sourceName}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span>{sourceName}</span>
              )}
            </div>
          )}

          {/* Quality Score & Last Verified */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            {dataQualityScore !== undefined && (
              <div className="flex items-center gap-1">
                <span>Quality:</span>
                <span className={`font-medium ${getQualityColor(dataQualityScore)}`}>
                  {getQualityLabel(dataQualityScore)} ({dataQualityScore}%)
                </span>
              </div>
            )}

            {lastVerifiedAt && (
              <div className="flex items-center gap-1">
                <span>Last verified:</span>
                <span className="font-medium">
                  {new Date(lastVerifiedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500 mt-2">
            All information is sourced from {sourceType === "official" ? "official" : "verified"}{" "}
            sources and regularly updated to ensure accuracy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SourceAttribution;
