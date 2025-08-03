// app/api/muscle-workout-tts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

interface Workout {
  name: string;
  cues: string;
}

export async function POST(req: NextRequest) {
  const { muscleName, workouts }: { muscleName: string; workouts: Workout[] } = await req.json();

  const ttsApiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY;
  if (!ttsApiKey) {
    return NextResponse.json({ error: "Missing TTS API key" }, { status: 500 });
  }

  // 👇 Dynamically generate Gemini form tips for each workout
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  const tips: string[] = [];

  for (const workout of workouts) {
    const prompt = `Give 1 sentence, 10–20 words max, form-focused coaching tip for: ${workout.name}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    tips.push(`For ${workout.name}, remember: ${text}`);
  }

  const narrationText = `Here are your workout form tips for the ${muscleName} muscle group. ` + tips.join(" ");

  const ttsRes = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${ttsApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text: narrationText },
        voice: {
          languageCode: "en-US",
          name: "en-US-Wavenet-D",
        },
        audioConfig: {
          audioEncoding: "MP3",
        },
      }),
    }
  );

  if (!ttsRes.ok) {
    const errText = await ttsRes.text();
    console.error("Google TTS Error:", errText);
    return NextResponse.json({ error: errText }, { status: 500 });
  }

  const json = await ttsRes.json();
  const base64Audio = json.audioContent;

  if (!base64Audio) {
    return NextResponse.json({ error: "No audio returned" }, { status: 500 });
  }

  return NextResponse.json({ base64Audio });
}
