import { NextRequest, NextResponse } from "next/server";
import { generateAudio } from "@/lib/elevenlabs";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
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
    const base64Audio = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json(
      {
        audio: base64Audio,
        contentType: "audio/mpeg",
        remaining,
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
