"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

export function EipAiSummary({ eipNo, content }: { eipNo: string; content: string }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fetched, setFetched] = useState(false);

  const toggleExpand = async () => {
    setExpanded((prev) => !prev);

    if (!fetched && !loading && !summary && !expanded) {
      setLoading(true);
      try {
        const res = await fetch("/api/ai-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eipNo, content }),
        });

        const data = await res.json();
        if (data.summary) {
          setSummary(data.summary);
        } else {
          setSummary(`❌ ${data.error || "Failed to generate summary."}`);
        }
      } catch {
        setSummary("❌ Failed to load summary.");
      } finally {
        setFetched(true);
        setLoading(false);
      }
    }
  };

  return (
    <Card className="my-6 border border-gray-600 bg-gray-800 text-gray-100 rounded-2xl shadow-md">
      <CardHeader
        className="flex flex-row justify-between items-center cursor-pointer"
        onClick={toggleExpand}
      >
        <h3 className="font-semibold text-base"> 🤖AI Summary</h3>
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </Button>
      </CardHeader>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CardContent className="text-sm text-gray-200">
            {loading ? (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                <span>Generating AI summary...</span>
              </div>
            ) : summary ? (
              <div 
                className="prose prose-invert prose-sm max-w-none [&>h4]:text-blue-400 [&>h4]:font-semibold [&>h4]:mt-4 [&>h4]:mb-2 [&>p]:mb-3 [&>div]:mb-2 [&_strong]:text-blue-300"
                dangerouslySetInnerHTML={{ __html: summary }}
              />
            ) : (
              <p className="text-gray-400">❌ No summary available.</p>
            )}
          </CardContent>
        </motion.div>
      )}
    </Card>
  );
}
