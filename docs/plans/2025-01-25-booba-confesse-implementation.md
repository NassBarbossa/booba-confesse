# Booba Confesse Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a viral French webapp where users make a cartoon Booba confess embarrassing things with AI voice cloning and one-click X sharing.

**Architecture:** Next.js frontend with API routes for ElevenLabs voice generation and FFmpeg video rendering. South Park-style 2D animation with sprite-swapping lip sync. Twitter OAuth for one-click posting.

**Tech Stack:** Next.js 14, TailwindCSS, ElevenLabs API, FFmpeg, Twitter API v2, Web Audio API, Canvas API

---

## Phase 1: Project Setup

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tailwind.config.js`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`

**Step 1: Create Next.js project with TypeScript and Tailwind**

Run:
```bash
cd ~/vibecoding/booba-confesse
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select defaults when prompted (the flags should handle most).

**Step 2: Verify project runs**

Run:
```bash
npm run dev
```

Expected: Server starts at http://localhost:3000, default Next.js page loads.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js project with TypeScript and Tailwind"
```

---

### Task 2: Set Up Project Structure

**Files:**
- Create: `src/components/.gitkeep`
- Create: `src/lib/.gitkeep`
- Create: `public/booba/.gitkeep`
- Create: `.env.example`
- Create: `.env.local`

**Step 1: Create directory structure**

Run:
```bash
mkdir -p src/components src/lib public/booba
touch src/components/.gitkeep src/lib/.gitkeep public/booba/.gitkeep
```

**Step 2: Create environment file template**

Create `.env.example`:
```env
# ElevenLabs
ELEVENLABS_API_KEY=your_api_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here

# Twitter OAuth
TWITTER_CLIENT_ID=your_client_id
TWITTER_CLIENT_SECRET=your_client_secret
TWITTER_CALLBACK_URL=http://localhost:3000/api/auth/callback

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DUCK_DATE=2025-01-15
```

**Step 3: Create local env file (gitignored)**

Run:
```bash
cp .env.example .env.local
```

**Step 4: Update .gitignore**

Add to `.gitignore`:
```
.env.local
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: set up project structure and environment files"
```

---

### Task 3: Create Base Layout with French UI

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/app/globals.css` (modify existing)

**Step 1: Update layout.tsx with French metadata**

Replace `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Booba Confesse - Fais-le avouer",
  description: "Fais avouer Booba. La vérité sort enfin.",
  openGraph: {
    title: "Booba Confesse",
    description: "Fais avouer Booba. La vérité sort enfin.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Step 2: Create basic landing page structure**

Replace `src/app/page.tsx`:
```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Duck Counter */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Booba Confesse
          </h1>
          <p className="text-xl text-zinc-400">
            Fais-le avouer la vérité
          </p>
        </header>

        {/* Main confession area - placeholder */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-zinc-800 rounded-lg p-8 text-center">
            <p className="text-zinc-400">Confession booth à venir...</p>
          </div>
        </div>

        {/* Parody disclaimer */}
        <footer className="text-center mt-12 text-sm text-zinc-600">
          PARODIE - Ceci est une satire
        </footer>
      </div>
    </main>
  );
}
```

**Step 3: Update globals.css for dark theme**

Replace content in `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #09090b;
  color: #fafafa;
}
```

**Step 4: Verify page loads**

Run:
```bash
npm run dev
```

Expected: Dark page with "Booba Confesse" title and placeholder.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: create base layout with French UI and dark theme"
```

---

## Phase 2: Visual Assets

### Task 4: Generate Booba Character Assets

**Files:**
- Create: `public/booba/character.png`
- Create: `public/booba/mouth-closed.png`
- Create: `public/booba/mouth-open-small.png`
- Create: `public/booba/mouth-open-medium.png`
- Create: `public/booba/mouth-open-wide.png`
- Create: `public/booba/mouth-o.png`
- Create: `public/booba/mouth-ee.png`
- Create: `public/background.png`

**Step 1: Generate base Booba caricature**

Use Midjourney, DALL-E, or similar with prompt:
```
South Park style cartoon caricature of a bald Black French rapper with beard, front facing, flat 2D paper cutout style, simple shapes, solid colors, transparent background, confession booth setting implied
```

Save as `public/booba/character.png` (without mouth - we'll overlay mouths)

**Step 2: Create mouth sprite variants**

Either:
- Edit the character image to create 6 mouth variants
- Or use Canva/Figma to draw simple mouth shapes

Required mouths (all same size, positioned to overlay on character):
- `mouth-closed.png` - lips together
- `mouth-open-small.png` - slightly open
- `mouth-open-medium.png` - medium open
- `mouth-open-wide.png` - wide open (loud sounds)
- `mouth-o.png` - O shape
- `mouth-ee.png` - wide smile/E shape

**Step 3: Create confession booth background**

Use AI or find/create:
```
Dark wooden confession booth interior, church confessional, dim lighting, cartoon flat style, 2D illustration
```

Save as `public/background.png`

**Step 4: Verify assets exist**

Run:
```bash
ls -la public/booba/
ls -la public/background.png
```

Expected: All asset files present.

**Step 5: Commit**

```bash
git add public/
git commit -m "feat: add Booba character sprites and background assets"
```

---

## Phase 3: Core UI Components

### Task 5: Create Duck Counter Component

**Files:**
- Create: `src/components/DuckCounter.tsx`

**Step 1: Create the counter component**

Create `src/components/DuckCounter.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";

export function DuckCounter() {
  const [days, setDays] = useState<number>(0);

  useEffect(() => {
    const duckDate = new Date(process.env.NEXT_PUBLIC_DUCK_DATE || "2025-01-15");
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - duckDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setDays(diffDays);
  }, []);

  return (
    <div className="bg-red-900/50 border border-red-500 rounded-lg px-6 py-4 inline-block">
      <p className="text-sm text-red-300 uppercase tracking-wide">
        Jours depuis que Booba a fui
      </p>
      <p className="text-5xl font-bold text-red-500">{days}</p>
    </div>
  );
}
```

**Step 2: Add env variable to next.config**

Update `next.config.js` (or create if using .mjs, convert):
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_DUCK_DATE: process.env.DUCK_DATE,
  },
};

module.exports = nextConfig;
```

**Step 3: Update .env.local with actual duck date**

Set the date Booba backed out in `.env.local`:
```
DUCK_DATE=2025-01-15
```

**Step 4: Add counter to page**

Update `src/app/page.tsx` to import and use:
```tsx
import { DuckCounter } from "@/components/DuckCounter";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Duck Counter */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Booba Confesse
          </h1>
          <p className="text-xl text-zinc-400 mb-6">
            Fais-le avouer la vérité
          </p>
          <DuckCounter />
        </header>

        {/* Main confession area - placeholder */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-zinc-800 rounded-lg p-8 text-center">
            <p className="text-zinc-400">Confession booth à venir...</p>
          </div>
        </div>

        {/* Parody disclaimer */}
        <footer className="text-center mt-12 text-sm text-zinc-600">
          PARODIE - Ceci est une satire
        </footer>
      </div>
    </main>
  );
}
```

**Step 5: Verify counter displays**

Run:
```bash
npm run dev
```

Expected: Counter shows number of days since duck date.

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add Days Since Booba Ducked counter component"
```

---

### Task 6: Create Booba Character Component

**Files:**
- Create: `src/components/BoobaCharacter.tsx`

**Step 1: Create the animated character component**

Create `src/components/BoobaCharacter.tsx`:
```tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type MouthShape = "closed" | "small" | "medium" | "wide" | "o" | "ee";

interface BoobaCharacterProps {
  mouthShape?: MouthShape;
  isAnimating?: boolean;
}

const mouthImages: Record<MouthShape, string> = {
  closed: "/booba/mouth-closed.png",
  small: "/booba/mouth-open-small.png",
  medium: "/booba/mouth-open-medium.png",
  wide: "/booba/mouth-open-wide.png",
  o: "/booba/mouth-o.png",
  ee: "/booba/mouth-ee.png",
};

export function BoobaCharacter({
  mouthShape = "closed",
  isAnimating = false
}: BoobaCharacterProps) {
  const [currentMouth, setCurrentMouth] = useState<MouthShape>(mouthShape);

  useEffect(() => {
    if (!isAnimating) {
      setCurrentMouth(mouthShape);
      return;
    }

    // Random mouth animation when animating (will be replaced by audio-driven)
    const interval = setInterval(() => {
      const shapes: MouthShape[] = ["closed", "small", "medium", "wide", "o", "ee"];
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      setCurrentMouth(randomShape);
    }, 100);

    return () => clearInterval(interval);
  }, [isAnimating, mouthShape]);

  return (
    <div className="relative w-64 h-80 mx-auto">
      {/* Base character */}
      <Image
        src="/booba/character.png"
        alt="Booba"
        fill
        className="object-contain"
        priority
      />

      {/* Mouth overlay */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-16 h-8">
        <Image
          src={mouthImages[currentMouth]}
          alt="mouth"
          fill
          className="object-contain transition-opacity duration-75"
        />
      </div>
    </div>
  );
}
```

**Step 2: Verify component renders (needs placeholder images first)**

If assets aren't ready yet, create placeholder PNGs or skip visual verification.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add BoobaCharacter component with mouth animation"
```

---

### Task 7: Create Confession Input Component

**Files:**
- Create: `src/components/ConfessionInput.tsx`

**Step 1: Create the input component**

Create `src/components/ConfessionInput.tsx`:
```tsx
"use client";

import { useState } from "react";

interface ConfessionInputProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
  maxLength?: number;
}

export function ConfessionInput({
  onSubmit,
  isLoading = false,
  maxLength = 200
}: ConfessionInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="mb-4">
        <label
          htmlFor="confession"
          className="block text-lg font-medium mb-2 text-zinc-300"
        >
          Fais avouer Booba...
        </label>
        <textarea
          id="confession"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxLength))}
          placeholder="J'ai peur de Sadek..."
          className="w-full h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg
                     text-white placeholder-zinc-500 resize-none
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          disabled={isLoading}
        />
        <p className="text-right text-sm text-zinc-500 mt-1">
          {text.length}/{maxLength}
        </p>
      </div>

      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700
                   disabled:cursor-not-allowed rounded-lg font-bold text-lg
                   transition-colors duration-200"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Booba avoue...
          </span>
        ) : (
          "Fais-le avouer"
        )}
      </button>
    </form>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add ConfessionInput component with French UI"
```

---

### Task 8: Create Confession Booth (Main Component)

**Files:**
- Create: `src/components/ConfessionBooth.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create the main booth component**

Create `src/components/ConfessionBooth.tsx`:
```tsx
"use client";

import { useState } from "react";
import { BoobaCharacter } from "./BoobaCharacter";
import { ConfessionInput } from "./ConfessionInput";

type BoothState = "idle" | "loading" | "playing" | "done";

export function ConfessionBooth() {
  const [state, setState] = useState<BoothState>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleConfession = async (text: string) => {
    setState("loading");

    try {
      // TODO: Call ElevenLabs API
      // For now, simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Set actual audio URL from API response
      setState("playing");

      // Simulate playback duration
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setState("done");
    } catch (error) {
      console.error("Error generating confession:", error);
      setState("idle");
    }
  };

  const handleReset = () => {
    setState("idle");
    setAudioUrl(null);
  };

  return (
    <div className="relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 rounded-lg"
        style={{ backgroundImage: "url('/background.png')" }}
      />

      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Character */}
        <div className="mb-8">
          <BoobaCharacter
            isAnimating={state === "playing"}
            mouthShape={state === "playing" ? undefined : "closed"}
          />
        </div>

        {/* Input or Result */}
        {state === "idle" && (
          <ConfessionInput onSubmit={handleConfession} />
        )}

        {state === "loading" && (
          <div className="text-center">
            <ConfessionInput onSubmit={() => {}} isLoading={true} />
          </div>
        )}

        {state === "playing" && (
          <div className="text-center">
            <p className="text-xl text-zinc-300 animate-pulse">
              Booba avoue...
            </p>
          </div>
        )}

        {state === "done" && (
          <div className="text-center space-y-4">
            <button
              onClick={() => {/* TODO: Share to X */}}
              className="w-full max-w-sm py-4 px-6 bg-blue-500 hover:bg-blue-600
                         rounded-lg font-bold text-lg transition-colors"
            >
              Partager sur X
            </button>

            <button
              onClick={handleReset}
              className="text-zinc-400 hover:text-white underline"
            >
              Nouvelle confession
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Update page to use ConfessionBooth**

Replace `src/app/page.tsx`:
```tsx
import { DuckCounter } from "@/components/DuckCounter";
import { ConfessionBooth } from "@/components/ConfessionBooth";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Duck Counter */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Booba Confesse
          </h1>
          <p className="text-xl text-zinc-400 mb-6">
            Fais-le avouer la vérité
          </p>
          <DuckCounter />
        </header>

        {/* Main confession booth */}
        <div className="max-w-2xl mx-auto">
          <ConfessionBooth />
        </div>

        {/* Parody disclaimer */}
        <footer className="text-center mt-12 text-sm text-zinc-600">
          PARODIE - Ceci est une satire
        </footer>
      </div>
    </main>
  );
}
```

**Step 3: Verify full UI flow**

Run:
```bash
npm run dev
```

Expected: Full UI with character, input, loading state simulation, and share button.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add ConfessionBooth component with full UI flow"
```

---

## Phase 4: ElevenLabs Voice Integration

### Task 9: Create ElevenLabs API Client

**Files:**
- Create: `src/lib/elevenlabs.ts`

**Step 1: Create the API client**

Create `src/lib/elevenlabs.ts`:
```ts
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

interface GenerateAudioOptions {
  text: string;
  voiceId: string;
}

export async function generateAudio({
  text,
  voiceId
}: GenerateAudioOptions): Promise<ArrayBuffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY not configured");
  }

  const response = await fetch(
    `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${error}`);
  }

  return response.arrayBuffer();
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add ElevenLabs API client"
```

---

### Task 10: Create Generate Audio API Route

**Files:**
- Create: `src/app/api/generate/route.ts`

**Step 1: Create the API route**

Create `src/app/api/generate/route.ts`:
```ts
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
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add /api/generate route for voice synthesis"
```

---

### Task 11: Connect Frontend to Voice API

**Files:**
- Modify: `src/components/ConfessionBooth.tsx`

**Step 1: Update ConfessionBooth to call API and play audio**

Replace `src/components/ConfessionBooth.tsx`:
```tsx
"use client";

import { useState, useRef } from "react";
import { BoobaCharacter } from "./BoobaCharacter";
import { ConfessionInput } from "./ConfessionInput";

type BoothState = "idle" | "loading" | "playing" | "done";

export function ConfessionBooth() {
  const [state, setState] = useState<BoothState>("idle");
  const [confessionText, setConfessionText] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleConfession = async (text: string) => {
    setState("loading");
    setConfessionText(text);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const { audio, contentType } = await response.json();

      // Create audio element and play
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audio), c => c.charCodeAt(0))],
        { type: contentType }
      );
      const audioUrl = URL.createObjectURL(audioBlob);

      const audioElement = new Audio(audioUrl);
      audioRef.current = audioElement;

      setState("playing");

      audioElement.onended = () => {
        setState("done");
        URL.revokeObjectURL(audioUrl);
      };

      await audioElement.play();
    } catch (error) {
      console.error("Error generating confession:", error);
      setState("idle");
      alert("Erreur lors de la génération. Réessaie.");
    }
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setState("idle");
    setConfessionText("");
  };

  return (
    <div className="relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 rounded-lg"
        style={{ backgroundImage: "url('/background.png')" }}
      />

      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Character */}
        <div className="mb-8">
          <BoobaCharacter
            isAnimating={state === "playing"}
            mouthShape={state === "playing" ? undefined : "closed"}
          />
        </div>

        {/* Confession text display during playback */}
        {(state === "playing" || state === "done") && confessionText && (
          <div className="mb-6 p-4 bg-black/50 rounded-lg">
            <p className="text-lg text-white italic text-center">
              "{confessionText}"
            </p>
          </div>
        )}

        {/* Input or Result */}
        {state === "idle" && (
          <ConfessionInput onSubmit={handleConfession} />
        )}

        {state === "loading" && (
          <div className="text-center">
            <ConfessionInput onSubmit={() => {}} isLoading={true} />
          </div>
        )}

        {state === "playing" && (
          <div className="text-center">
            <p className="text-xl text-red-400 animate-pulse">
              Booba avoue...
            </p>
          </div>
        )}

        {state === "done" && (
          <div className="text-center space-y-4">
            <button
              onClick={() => {/* TODO: Share to X */}}
              className="w-full max-w-sm py-4 px-6 bg-black hover:bg-zinc-900
                         border border-zinc-700 rounded-lg font-bold text-lg
                         transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Partager sur X
            </button>

            <button
              onClick={handleReset}
              className="text-zinc-400 hover:text-white underline"
            >
              Nouvelle confession
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Test with ElevenLabs (requires API key)**

Add your ElevenLabs API key and voice ID to `.env.local`, then test.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: connect frontend to voice API with audio playback"
```

---

## Phase 5: Audio-Driven Lip Sync

### Task 12: Create Lip Sync Hook

**Files:**
- Create: `src/lib/useLipSync.ts`

**Step 1: Create the lip sync hook**

Create `src/lib/useLipSync.ts`:
```ts
"use client";

import { useState, useEffect, useRef } from "react";

type MouthShape = "closed" | "small" | "medium" | "wide" | "o" | "ee";

interface UseLipSyncOptions {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
}

export function useLipSync({ audioElement, isPlaying }: UseLipSyncOptions): MouthShape {
  const [mouthShape, setMouthShape] = useState<MouthShape>("closed");
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioElement || !isPlaying) {
      setMouthShape("closed");
      return;
    }

    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audioElement);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const animate = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average volume
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      // Map volume to mouth shape
      let shape: MouthShape;
      if (average < 10) {
        shape = "closed";
      } else if (average < 40) {
        shape = "small";
      } else if (average < 80) {
        shape = "medium";
      } else if (average < 120) {
        shape = "wide";
      } else {
        // Add some variety for high volumes
        shape = Math.random() > 0.5 ? "wide" : "o";
      }

      setMouthShape(shape);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audioContext.close();
    };
  }, [audioElement, isPlaying]);

  return mouthShape;
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add useLipSync hook for audio-driven mouth animation"
```

---

### Task 13: Integrate Lip Sync with Character

**Files:**
- Modify: `src/components/ConfessionBooth.tsx`
- Modify: `src/components/BoobaCharacter.tsx`

**Step 1: Update BoobaCharacter to accept external mouth control**

Replace `src/components/BoobaCharacter.tsx`:
```tsx
"use client";

import Image from "next/image";

export type MouthShape = "closed" | "small" | "medium" | "wide" | "o" | "ee";

interface BoobaCharacterProps {
  mouthShape?: MouthShape;
}

const mouthImages: Record<MouthShape, string> = {
  closed: "/booba/mouth-closed.png",
  small: "/booba/mouth-open-small.png",
  medium: "/booba/mouth-open-medium.png",
  wide: "/booba/mouth-open-wide.png",
  o: "/booba/mouth-o.png",
  ee: "/booba/mouth-ee.png",
};

export function BoobaCharacter({ mouthShape = "closed" }: BoobaCharacterProps) {
  return (
    <div className="relative w-64 h-80 mx-auto">
      {/* Base character */}
      <Image
        src="/booba/character.png"
        alt="Booba"
        fill
        className="object-contain"
        priority
      />

      {/* Mouth overlay */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-16 h-8">
        <Image
          src={mouthImages[mouthShape]}
          alt="mouth"
          fill
          className="object-contain transition-opacity duration-75"
        />
      </div>
    </div>
  );
}
```

**Step 2: Update ConfessionBooth to use lip sync**

Update `src/components/ConfessionBooth.tsx` (add imports and hook usage):
```tsx
"use client";

import { useState, useRef } from "react";
import { BoobaCharacter, MouthShape } from "./BoobaCharacter";
import { ConfessionInput } from "./ConfessionInput";
import { useLipSync } from "@/lib/useLipSync";

type BoothState = "idle" | "loading" | "playing" | "done";

export function ConfessionBooth() {
  const [state, setState] = useState<BoothState>("idle");
  const [confessionText, setConfessionText] = useState<string>("");
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const mouthShape = useLipSync({
    audioElement,
    isPlaying: state === "playing"
  });

  const handleConfession = async (text: string) => {
    setState("loading");
    setConfessionText(text);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const { audio, contentType } = await response.json();

      // Create audio element
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audio), c => c.charCodeAt(0))],
        { type: contentType }
      );
      const audioUrl = URL.createObjectURL(audioBlob);

      const newAudio = new Audio(audioUrl);
      newAudio.crossOrigin = "anonymous";
      setAudioElement(newAudio);

      setState("playing");

      newAudio.onended = () => {
        setState("done");
        URL.revokeObjectURL(audioUrl);
      };

      await newAudio.play();
    } catch (error) {
      console.error("Error generating confession:", error);
      setState("idle");
      alert("Erreur lors de la génération. Réessaie.");
    }
  };

  const handleReset = () => {
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }
    setState("idle");
    setConfessionText("");
  };

  return (
    <div className="relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 rounded-lg"
        style={{ backgroundImage: "url('/background.png')" }}
      />

      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Character with lip sync */}
        <div className="mb-8">
          <BoobaCharacter mouthShape={state === "playing" ? mouthShape : "closed"} />
        </div>

        {/* Confession text display during playback */}
        {(state === "playing" || state === "done") && confessionText && (
          <div className="mb-6 p-4 bg-black/50 rounded-lg">
            <p className="text-lg text-white italic text-center">
              "{confessionText}"
            </p>
          </div>
        )}

        {/* Input or Result */}
        {state === "idle" && (
          <ConfessionInput onSubmit={handleConfession} />
        )}

        {state === "loading" && (
          <div className="text-center">
            <ConfessionInput onSubmit={() => {}} isLoading={true} />
          </div>
        )}

        {state === "playing" && (
          <div className="text-center">
            <p className="text-xl text-red-400 animate-pulse">
              Booba avoue...
            </p>
          </div>
        )}

        {state === "done" && (
          <div className="text-center space-y-4">
            <button
              onClick={() => {/* TODO: Share to X */}}
              className="w-full max-w-sm py-4 px-6 bg-black hover:bg-zinc-900
                         border border-zinc-700 rounded-lg font-bold text-lg
                         transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Partager sur X
            </button>

            <button
              onClick={handleReset}
              className="text-zinc-400 hover:text-white underline"
            >
              Nouvelle confession
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 3: Test lip sync animation**

Run:
```bash
npm run dev
```

Expected: Character's mouth animates in sync with audio volume.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: integrate audio-driven lip sync with character animation"
```

---

## Phase 6: Video Generation & X Sharing

### Task 14: Set Up FFmpeg for Video Rendering

**Files:**
- Create: `src/lib/ffmpeg.ts`
- Update: `package.json` (add dependency)

**Step 1: Install FFmpeg dependency**

Run:
```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

**Step 2: Create FFmpeg utility**

Create `src/lib/ffmpeg.ts`:
```ts
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null = null;

export async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  return ffmpeg;
}

interface RenderVideoOptions {
  frames: Blob[];
  audio: Blob;
  fps: number;
  watermarkText: string;
}

export async function renderVideo({
  frames,
  audio,
  fps,
  watermarkText,
}: RenderVideoOptions): Promise<Blob> {
  const ffmpeg = await getFFmpeg();

  // Write frames
  for (let i = 0; i < frames.length; i++) {
    const frameData = await fetchFile(frames[i]);
    await ffmpeg.writeFile(`frame${i.toString().padStart(4, "0")}.png`, frameData);
  }

  // Write audio
  const audioData = await fetchFile(audio);
  await ffmpeg.writeFile("audio.mp3", audioData);

  // Render video with watermark
  await ffmpeg.exec([
    "-framerate", fps.toString(),
    "-i", "frame%04d.png",
    "-i", "audio.mp3",
    "-vf", `drawtext=text='${watermarkText}':x=10:y=h-30:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.5`,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-shortest",
    "output.mp4",
  ]);

  const data = await ffmpeg.readFile("output.mp4");
  return new Blob([data], { type: "video/mp4" });
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add FFmpeg utility for client-side video rendering"
```

---

### Task 15: Create Video Recording Component

**Files:**
- Create: `src/components/VideoRecorder.tsx`
- Create: `src/lib/useVideoRecorder.ts`

**Step 1: Create video recorder hook**

Create `src/lib/useVideoRecorder.ts`:
```ts
"use client";

import { useRef, useState, useCallback } from "react";

interface UseVideoRecorderOptions {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fps?: number;
}

export function useVideoRecorder({ canvasRef, fps = 30 }: UseVideoRecorderOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const framesRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(() => {
    if (!canvasRef.current) return;

    framesRef.current = [];
    setIsRecording(true);

    intervalRef.current = setInterval(() => {
      if (!canvasRef.current) return;

      canvasRef.current.toBlob((blob) => {
        if (blob) {
          framesRef.current.push(blob);
        }
      }, "image/png");
    }, 1000 / fps);
  }, [canvasRef, fps]);

  const stopRecording = useCallback((): Blob[] => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRecording(false);
    return framesRef.current;
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    frames: framesRef.current,
  };
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add useVideoRecorder hook for canvas frame capture"
```

---

### Task 16: Create Twitter OAuth Flow

**Files:**
- Create: `src/app/api/auth/twitter/route.ts`
- Create: `src/app/api/auth/callback/route.ts`
- Create: `src/lib/twitter.ts`

**Step 1: Create Twitter utility**

Create `src/lib/twitter.ts`:
```ts
const TWITTER_API_URL = "https://api.twitter.com/2";

export function getTwitterAuthUrl(state: string): string {
  const clientId = process.env.TWITTER_CLIENT_ID!;
  const redirectUri = encodeURIComponent(process.env.TWITTER_CALLBACK_URL!);
  const scope = encodeURIComponent("tweet.read tweet.write users.read offline.access");

  return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const clientId = process.env.TWITTER_CLIENT_ID!;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET!;
  const redirectUri = process.env.TWITTER_CALLBACK_URL!;

  const response = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code_verifier: "challenge",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  const data = await response.json();
  return data.access_token;
}

export async function postTweet(
  accessToken: string,
  text: string,
  mediaId?: string
): Promise<string> {
  const body: any = { text };
  if (mediaId) {
    body.media = { media_ids: [mediaId] };
  }

  const response = await fetch(`${TWITTER_API_URL}/tweets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to post tweet");
  }

  const data = await response.json();
  return data.data.id;
}
```

**Step 2: Create auth route**

Create `src/app/api/auth/twitter/route.ts`:
```ts
import { NextResponse } from "next/server";
import { getTwitterAuthUrl } from "@/lib/twitter";

export async function GET() {
  const state = Math.random().toString(36).substring(7);
  const authUrl = getTwitterAuthUrl(state);

  return NextResponse.redirect(authUrl);
}
```

**Step 3: Create callback route**

Create `src/app/api/auth/callback/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/twitter";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  try {
    const accessToken = await exchangeCodeForToken(code);

    // In production, store this securely (encrypted cookie, database, etc.)
    // For now, redirect with token in URL (NOT secure - demo only)
    return NextResponse.redirect(
      new URL(`/?twitter_token=${accessToken}`, request.url)
    );
  } catch (error) {
    console.error("Twitter auth error:", error);
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }
}
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add Twitter OAuth flow for X sharing"
```

---

### Task 17: Create Share to X API Route

**Files:**
- Create: `src/app/api/share/route.ts`

**Step 1: Create the share route**

Create `src/app/api/share/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const video = formData.get("video") as File;
    const text = formData.get("text") as string;
    const accessToken = formData.get("accessToken") as string;

    if (!video || !text || !accessToken) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step 1: Upload media to Twitter
    const mediaBuffer = await video.arrayBuffer();

    // Twitter media upload is complex - requires chunked upload for videos
    // For MVP, we'll use a simplified approach or external service

    // For now, post text-only tweet with link
    const tweetText = `${text}\n\n#BoobaConfesse #Sadek`;

    const tweetResponse = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: tweetText }),
    });

    if (!tweetResponse.ok) {
      const error = await tweetResponse.text();
      throw new Error(`Tweet failed: ${error}`);
    }

    const tweetData = await tweetResponse.json();

    return NextResponse.json({
      success: true,
      tweetId: tweetData.data.id,
      tweetUrl: `https://twitter.com/i/status/${tweetData.data.id}`,
    });
  } catch (error) {
    console.error("Share error:", error);
    return NextResponse.json(
      { error: "Failed to share" },
      { status: 500 }
    );
  }
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add /api/share route for posting to X"
```

---

### Task 18: Integrate Share Button

**Files:**
- Modify: `src/components/ConfessionBooth.tsx`

**Step 1: Add share functionality to ConfessionBooth**

Add share handler to the component (update the button onClick):

```tsx
// Add this function inside ConfessionBooth component
const handleShare = async () => {
  // For MVP: Open Twitter intent URL (simpler than full OAuth)
  const tweetText = encodeURIComponent(
    `Booba avoue enfin la vérité 💀\n\n"${confessionText}"\n\n#BoobaConfesse #Sadek`
  );
  const siteUrl = encodeURIComponent(window.location.origin);

  window.open(
    `https://twitter.com/intent/tweet?text=${tweetText}&url=${siteUrl}`,
    "_blank",
    "width=550,height=420"
  );
};

// Update the share button onClick
<button
  onClick={handleShare}
  className="w-full max-w-sm py-4 px-6 bg-black hover:bg-zinc-900
             border border-zinc-700 rounded-lg font-bold text-lg
             transition-colors flex items-center justify-center gap-2 mx-auto"
>
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
  Partager sur X
</button>
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add Twitter intent share button"
```

---

## Phase 7: Polish & Deploy

### Task 19: Add Rate Limiting

**Files:**
- Create: `src/lib/rateLimit.ts`
- Modify: `src/app/api/generate/route.ts`

**Step 1: Create simple rate limiter**

Create `src/lib/rateLimit.ts`:
```ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const LIMIT = 3; // requests per window
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: LIMIT - 1 };
  }

  if (record.count >= LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: LIMIT - record.count };
}
```

**Step 2: Add rate limiting to generate route**

Update `src/app/api/generate/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { generateAudio } from "@/lib/elevenlabs";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || "unknown";
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
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add rate limiting to voice generation API"
```

---

### Task 20: Mobile Optimization

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/BoobaCharacter.tsx`
- Modify: `src/components/ConfessionInput.tsx`

**Step 1: Update character for mobile**

Update `src/components/BoobaCharacter.tsx` to be responsive:
```tsx
<div className="relative w-48 h-64 md:w-64 md:h-80 mx-auto">
```

**Step 2: Update input for mobile**

Update `src/components/ConfessionInput.tsx` textarea:
```tsx
<textarea
  // ... other props
  className="w-full h-24 md:h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg
             text-white text-base placeholder-zinc-500 resize-none
             focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
/>
```

**Step 3: Update page layout**

Update `src/app/page.tsx`:
```tsx
<h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
```

**Step 4: Test on mobile viewport**

Use browser dev tools to test mobile responsiveness.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add mobile-responsive styling"
```

---

### Task 21: Deploy to Vercel

**Step 1: Install Vercel CLI (if not installed)**

Run:
```bash
npm install -g vercel
```

**Step 2: Login to Vercel**

Run:
```bash
vercel login
```

**Step 3: Deploy**

Run:
```bash
cd ~/vibecoding/booba-confesse
vercel
```

Follow prompts to set up project.

**Step 4: Set environment variables in Vercel**

Go to Vercel dashboard → Project → Settings → Environment Variables

Add:
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID`
- `TWITTER_CLIENT_ID`
- `TWITTER_CLIENT_SECRET`
- `TWITTER_CALLBACK_URL` (update to production URL)
- `DUCK_DATE`

**Step 5: Redeploy with env vars**

Run:
```bash
vercel --prod
```

**Step 6: Commit any remaining changes**

```bash
git add .
git commit -m "chore: prepare for production deployment"
```

---

### Task 22: Register Domain & Connect

**Step 1: Purchase domain**

Options:
- boobaconfesse.fr (OVH, Gandi)
- boobaconfesse.com (Namecheap, Google Domains)

**Step 2: Connect to Vercel**

In Vercel dashboard → Project → Settings → Domains → Add domain

Follow Vercel's DNS instructions.

**Step 3: Update environment variables**

Update `NEXT_PUBLIC_SITE_URL` and `TWITTER_CALLBACK_URL` with production domain.

---

## Phase 8: Pre-Launch Checklist

### Task 23: Final Testing

- [ ] Test full flow: type → generate → play → share
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Test rate limiting works
- [ ] Test Twitter share opens correctly
- [ ] Verify "Days Since" counter is accurate
- [ ] Check all French text is correct
- [ ] Verify PARODIE disclaimer visible

### Task 24: Launch

1. Sadek creates first confession
2. Posts to X
3. Tags @boaborazade (Booba)
4. Monitor traffic and API costs
5. Add token CA to site when ready

---

## Summary

**Total Tasks:** 24
**Estimated Phases:** 8
**Key Dependencies:**
- ElevenLabs account + API key
- Booba voice samples for cloning
- Twitter Developer account
- Visual assets (character + mouths + background)

**MVP Features:**
- Cartoon Booba confession booth
- AI voice clone speaks user text
- Audio-driven lip sync
- One-click X share (via Twitter intent)
- Days Since Booba Ducked counter
- Rate limiting (3/day per IP)
- Mobile responsive
- French UI
