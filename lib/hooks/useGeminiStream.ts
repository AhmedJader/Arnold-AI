// lib/hooks/useGeminiStream.ts
import { useState } from "react";

export function useGeminiStream() {
  const [streamedText, setStreamedText] = useState("");
  const [loading, setLoading] = useState(false);

  const streamCues = async (input: string) => {
    setLoading(true);
    setStreamedText("");

    const res = await fetch("/api/stream-gemini-form-cues", {
      method: "POST",
      body: JSON.stringify({ input }),
    });

    if (!res.body) {
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      setStreamedText(prev => prev + chunk);
    }

    setLoading(false);
  };

  return { streamedText, loading, streamCues };
}
