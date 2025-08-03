"use client";

import { useEffect, useState, useRef } from "react";

interface MuscleInsightsProps {
  muscleKeys: string[];
  onUpdate?: (summaries: Record<string, string>) => void;
}

export default function MuscleInsights({ muscleKeys, onUpdate }: MuscleInsightsProps) {
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (muscleKeys.length === 0) return;

    const fetchSummaries = async () => {
      setLoading(true);

      // Check sessionStorage first
      const cached = sessionStorage.getItem("muscleSummaries");
      const cachedSummaries: Record<string, string> = cached ? JSON.parse(cached) : {};
      const alreadyHaveAll = muscleKeys.every((key) => cachedSummaries[key]);

      if (alreadyHaveAll) {
        setSummaries(cachedSummaries);
        onUpdate?.(cachedSummaries);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/muscle-info", {
          method: "POST",
          body: JSON.stringify({ muscleNames: muscleKeys }),
        });

        // Retry logic for 429
        if (res.status === 429) {
          console.warn("⚠️ Gemini quota exceeded. Retrying in 45 seconds...");
          setTimeout(fetchSummaries, 45000);
          return;
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          fullText += decoder.decode(value);
        }

        const lines = fullText
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => line.replace(/^[-•]\s*/, ""));

        const newSummaries: Record<string, string> = { ...cachedSummaries };
        muscleKeys.forEach((key, i) => {
          newSummaries[key] = lines[i] || "Summary unavailable.";
        });

        sessionStorage.setItem("muscleSummaries", JSON.stringify(newSummaries));
        setSummaries(newSummaries);
        onUpdate?.(newSummaries);
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch summaries:", err);
        setLoading(false);
      }
    };

    // Debounce fetch
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(fetchSummaries, 1200);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [muscleKeys]);

  if (loading) {
    return <p className="text-sm text-blue-400 mt-4 animate-pulse">Fetching Gemini summaries...</p>;
  }

  return (
    <div className="mt-4 space-y-2">
      {muscleKeys.map((key) => (
        <div key={key} className="text-sm text-white/90 bg-white/10 p-2 rounded-lg">
          <strong>{key}:</strong> {summaries[key] ?? "Loading..."}
        </div>
      ))}
    </div>
  );
}
