// app/api/muscle-workout-summary/route.ts
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: NextRequest) {
  const { muscleNames } = await req.json();

  const response = await streamText({
    model: google("models/gemini-2.5-flash-lite"),
    messages: [
      {
        role: "system",
        content:
          "You're a certified personal trainer. For each muscle name provided, respond with a single, concise sentence describing a typical workout targeting that muscle. Keep it clear and actionable.",
      },
      {
        role: "user",
        content: `Muscles:\n${muscleNames.join("\n")}`,
      },
    ],
  });

  return response.toTextStreamResponse();
}
