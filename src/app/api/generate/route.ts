import { NextRequest, NextResponse } from "next/server";
import { generateAudio } from "@/lib/elevenlabs";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (text.length > 200) {
      return NextResponse.json(
        { error: "Text too long (max 200 characters)" },
        { status: 400 }
      );
    }

    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    if (!voiceId) {
      return NextResponse.json(
        { error: "Voice not configured" },
        { status: 500 }
      );
    }

    const audioBuffer = await generateAudio({ text, voiceId });

    // Return audio as base64 for client-side playback
    const base64Audio = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({
      audio: base64Audio,
      contentType: "audio/mpeg",
    });
  } catch (error) {
    console.error("Generate audio error:", error);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}
