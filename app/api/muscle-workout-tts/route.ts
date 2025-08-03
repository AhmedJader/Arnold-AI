// app/api/muscle-workout-tts/route.ts
import { NextRequest, NextResponse } from "next/server";

interface Workout {
  name: string;
  cues: string;
}

export async function POST(req: NextRequest) {
  const { muscleName, workouts }: { muscleName: string; workouts: Workout[] } = await req.json();

  const apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const tipIntro = `Here are your workout form tips for the ${muscleName} muscle group. `;
  const tips = workouts.map(w => `For ${w.name}, remember: ${w.cues}`).join(" ");

  const text = tipIntro + tips;

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
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

  if (!response.ok) {
    const errText = await response.text();
    console.error("Google TTS Error:", errText);
    return NextResponse.json({ error: errText }, { status: 500 });
  }

  const json = await response.json();
  const base64Audio = json.audioContent;

  if (!base64Audio) {
    return NextResponse.json({ error: "No audio returned" }, { status: 500 });
  }

  return NextResponse.json({ base64Audio });
}
