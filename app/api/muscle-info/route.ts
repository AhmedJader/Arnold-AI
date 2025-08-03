// app/api/muscle-info/route.ts
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { google } from "@ai-sdk/google"; // Gemini
// ✅ We’ll use .toDataStreamResponse()

export async function POST(req: NextRequest) {
  const { muscleNames } = await req.json();

  const response = await streamText({
    model: google("models/gemini-2.5-flash-lite"),
    messages: [
      {
        role: "system",
        content: `You're a certified fitness coach. For each muscle name, return one sentence summarizing its function.`,
      },
      {
        role: "user",
        content: `Muscles:\n${muscleNames.join("\n")}`,
      },
    ],
  });

  // ✅ This method is stable and matches what works in your other project
  return response.toTextStreamResponse();
}
