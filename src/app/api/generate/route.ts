import { NextRequest, NextResponse } from "next/server";
import { generateAudio as generateAudioElevenLabs } from "@/lib/elevenlabs";
import { generateAudioXTTS } from "@/lib/xtts";
import { generateAudioMiniMax } from "@/lib/minimax";
import { checkRateLimit } from "@/lib/rateLimit";

// TTS Provider: "minimax" (default), "xtts", or "elevenlabs"
const TTS_PROVIDER = process.env.TTS_PROVIDER || "minimax";

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Limite atteinte. Reviens demain!" },
      { status: 429 }
    );
  }

  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (text.length > 200) {
      return NextResponse.json(
        { error: "Text too long (max 200 characters)" },
        { status: 400 }
      );
    }

    let audioBuffer: ArrayBuffer;
    let contentType: string;

    if (TTS_PROVIDER === "minimax") {
      // Use MiniMax (primary)
      audioBuffer = await generateAudioMiniMax({ text });
      contentType = "audio/mpeg";
    } else if (TTS_PROVIDER === "xtts") {
      // Use XTTS
      audioBuffer = await generateAudioXTTS({ text });
      contentType = "audio/wav";
    } else {
      // Use ElevenLabs (fallback)
      const voiceId = process.env.ELEVENLABS_VOICE_ID;
      if (!voiceId) {
        return NextResponse.json(
          { error: "Voice not configured" },
          { status: 500 }
        );
      }
      audioBuffer = await generateAudioElevenLabs({ text, voiceId });
      contentType = "audio/mpeg";
    }

    const base64Audio = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json(
      {
        audio: base64Audio,
        contentType,
        remaining,
        provider: TTS_PROVIDER,
      },
      {
        headers: {
          "X-RateLimit-Remaining": remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Generate audio error:", error);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}
