// app/api/muscle-workout-tts/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { muscleName } = await req.json();

  const apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing Google TTS API key" }, { status: 500 });
  }

  const prompt = `Here is a motivational workout tip to target your ${muscleName} muscle.`;

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text: prompt },
        voice: {
          languageCode: "en-US",
          name: "en-US-Wavenet-D", // You can change this voice
        },
        audioConfig: {
          audioEncoding: "MP3",
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("Google TTS API Error:", errText);
    return NextResponse.json({ error: errText }, { status: 500 });
  }

  const json = await response.json();
  const base64Audio = json.audioContent;

  if (!base64Audio) {
    return NextResponse.json({ error: "No audio content returned" }, { status: 500 });
  }

  return NextResponse.json({ base64Audio });
}
