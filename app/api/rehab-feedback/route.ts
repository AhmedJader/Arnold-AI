// app/api/rehab-feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

interface Keypoint {
  x: number;
  y: number;
  score: number;
  name: string;
}

interface GeminiModel {
  name: string;
}

async function listAvailableModels(): Promise<string[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`
  );
  if (!res.ok) throw new Error(`ListModels failed: ${await res.text()}`);
  const json = await res.json();
  return (json.models || []).map((m: GeminiModel) => m.name);
}

export async function POST(req: NextRequest) {
  const { keypoints }: { keypoints: Keypoint[] } = await req.json();
  const ttsApiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY;

  if (!ttsApiKey || !keypoints || keypoints.length === 0) {
    return NextResponse.json(
      { error: "Missing keypoints or TTS key" },
      { status: 400 }
    );
  }

  // Prefer best available Gemini model
  let modelId: string;
  try {
    const models = await listAvailableModels();
    modelId =
      models.find((m) => m.startsWith("gemini-2.5-pro")) ||
      models.find((m) => m.startsWith("gemini-2.5-flash")) ||
      models.find((m) => m.startsWith("gemini-1.5-pro")) ||
      models[0];

    if (!modelId) {
      return NextResponse.json(
        { error: "No Gemini models available." },
        { status: 500 }
      );
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to list models", details: msg },
      { status: 500 }
    );
  }

  const model = genAI.getGenerativeModel({ model: modelId });

  const formattedPose = keypoints
    .map(
      (kp) =>
        `${kp.name}: (x=${kp.x.toFixed(1)}, y=${kp.y.toFixed(
          1
        )}, score=${kp.score.toFixed(2)})`
    )
    .join(", ");

  const prompt = `
You are a physical therapist. Analyze human body pose from 2D keypoints and give 1-2 sentences of corrective advice.
Focus on safety, injury prevention, joint angles, symmetry, or posture.
Do not reference the keypoints directly. Speak like a coach watching a client move.

Here is the observed pose:
${formattedPose}
`.trim();

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const feedback = result.response?.text?.() ?? "";

  // TTS request
  const ttsRes = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${ttsApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text: feedback },
        voice: { languageCode: "en-US", name: "en-US-Wavenet-D" },
        audioConfig: { audioEncoding: "MP3" },
      }),
    }
  );

  if (!ttsRes.ok) {
    const errText = await ttsRes.text();
    return NextResponse.json({ error: errText }, { status: 500 });
  }

  const ttsJson = await ttsRes.json();
  return NextResponse.json({ feedback, base64Audio: ttsJson.audioContent });
}
