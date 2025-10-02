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
              <p className="italic text-gray-400">Generating summary...</p>
            ) : (
              <p className="whitespace-pre-line">{summary}</p>
            )}
          </CardContent>
        </motion.div>
      )}
    </Card>
  );
}
