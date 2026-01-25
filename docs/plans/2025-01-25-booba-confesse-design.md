# Booba Confesse - Design Document

## Overview

A viral webapp where users make a cartoon Booba "confess" embarrassing things using AI voice cloning. One-click share to X for maximum virality. Built for Sadek to troll Booba.

## Core Concept

- **Cartoon cutout Booba** in a confession booth (South Park / Monty Python style)
- **User types any confession** in French
- **AI voice clone** speaks the confession (ElevenLabs)
- **Lip-synced animation** with sprite-swapping mouths
- **One-click post to X** with auto-generated caption
- **"Days Since Booba Ducked"** counter as side feature + video watermark

---

## User Flow

1. User lands on site → sees cartoon Booba in confessional booth
2. Text input: "Fais avouer Booba..."
3. User types confession (e.g., "J'ai peur de Sadek")
4. Clicks "Fais-le avouer" button
5. Loading state (3-5 seconds) while AI generates voice + animation
6. Booba animates and speaks the confession
7. "Partager sur X" button → one-click posts video to user's timeline

### Auto-Generated Tweet Caption
```
Booba avoue enfin la vérité 💀

#BoobaConfesse #Sadek
[link to site]
```

---

## Tech Stack

### Frontend
- **Next.js** (React) - Fast, SEO-friendly, Vercel deployment
- **TailwindCSS** - Mobile-first responsive styling
- **Canvas API** - Render animation frames for video export

### Backend / APIs
- **Next.js API routes** - Handle voice generation requests
- **ElevenLabs API** - Voice cloning with Booba samples
- **FFmpeg (server-side)** - Combine animation + audio into MP4
- **Web Audio API** - Analyze audio for lip sync timing

### X/Twitter Integration
- **Twitter OAuth 2.0** - User authorization for posting
- **Twitter API v2** - Media upload + tweet posting

### Hosting & Storage
- **Vercel** - Frontend + API routes
- **Cloudflare R2 or AWS S3** - Temporary video storage (auto-delete after 24h)
- **Upstash Redis** - Rate limiting

---

## Visual Design

### Style
- South Park / paper cutout aesthetic
- Flat 2D illustrations
- Intentionally simple = funnier

### Assets Needed
1. **Booba character** - Front-facing caricature in confessional booth
2. **Mouth sprites** - 6-8 shapes (closed, open, wide, O, E, etc.)
3. **Background** - Confession booth interior (dim, church vibe)
4. **Optional expressions** - Nervous, crying, defeated variants

### How to Create (Free)
- Generate base Booba caricature with Midjourney/DALL-E (flat cartoon style prompt)
- Edit mouth shapes in Figma/Canva
- Keep consistent style across all assets

### Animation System
- Sprite swap synced to audio volume/peaks
- Web Audio API detects loudness → maps to mouth openness
- CSS transitions for smooth swapping
- Subtle wobble on whole character for life

---

## Voice Cloning

### ElevenLabs Setup
1. Create account
2. Upload 3-5 minutes of clean Booba audio samples
   - Sources: interviews, Instagram lives, YouTube clips
   - Clear voice, minimal background noise
3. Train custom voice clone (~5 min process)

### API Integration
- User submits text → POST to `/api/generate`
- API calls ElevenLabs → returns audio
- Audio stored temporarily for video generation

### Cost Management
- Free tier: 10,000 chars/month (~100 confessions)
- Paid: $5/month for 30,000 chars
- Rate limit: 3 confessions per user per day (IP-based)

---

## X/Twitter Integration

### OAuth Flow
1. User clicks "Partager sur X"
2. Redirect to Twitter OAuth 2.0 consent
3. User authorizes posting permissions
4. Return to site with auth token

### Video Posting
1. Generate MP4 server-side (FFmpeg)
2. Upload via Twitter Media Upload API
3. Create tweet with video + caption
4. Include watermark: "Jour XX - BoobaConfesse.com"

### Developer Account
- Apply for Twitter API access (free tier)
- Need "Elevated" access for media uploads
- Approval takes 1-2 days

---

## "Days Since Booba Ducked" Feature

### Counter Display
- Prominent on homepage (header/sidebar)
- Big number: "XX jours depuis que Booba a fui le combat"
- Auto-updates daily

### Implementation
- Hardcoded start date (day he backed out)
- JS calculation: `Math.floor((today - duckDate) / 86400000)`
- No backend needed

### Video Watermark
- Counter appears in corner of every video
- Format: "Jour 47 - BoobaConfesse.com"
- Free branding on every share

---

## Rate Limiting & Abuse Prevention

- 3 confessions per IP per day (without login)
- Profanity filter optional (or embrace chaos)
- Video storage auto-deletes after 24h
- Queue system for traffic spikes

---

## Domain Options

- boobaconfesse.fr
- boobaconfession.fr
- laconfessiondebooba.fr
- faisavouerbooba.fr

---

## Legal Considerations

- Clearly labeled "PARODIE" on site
- Cartoon style = obvious satire
- French parody law protective of satire
- No claim of authenticity

---

## Launch Strategy

1. Site ready and tested
2. Sadek creates first confession
3. Posts to X, tags Booba
4. Chaos ensues
5. Add token CA to site after launch

---

## Token Integration (Post-Launch)

- No token gating or requirements
- Simply display contract address on site
- Let community do the rest

---

## Implementation Steps

### Phase 1: Setup
- [ ] Create Next.js project with TailwindCSS
- [ ] Set up project structure
- [ ] Create ElevenLabs account and train Booba voice
- [ ] Apply for Twitter Developer API access

### Phase 2: Assets
- [ ] Generate Booba caricature with AI (Midjourney/DALL-E)
- [ ] Create mouth sprite variants (6-8 shapes)
- [ ] Create confession booth background
- [ ] Export all assets as PNGs

### Phase 3: Core Features
- [ ] Build landing page UI (French)
- [ ] Implement text input and submission
- [ ] Integrate ElevenLabs API for voice generation
- [ ] Build lip sync animation system (sprite swapping)
- [ ] Add "Days Since Booba Ducked" counter

### Phase 4: Video & Sharing
- [ ] Set up FFmpeg for server-side video rendering
- [ ] Generate MP4 from animation + audio
- [ ] Implement Twitter OAuth flow
- [ ] Build one-click share to X feature
- [ ] Add watermark to videos

### Phase 5: Polish & Launch
- [ ] Add rate limiting
- [ ] Mobile optimization
- [ ] Test full flow end-to-end
- [ ] Deploy to Vercel
- [ ] Register domain
- [ ] Sadek launches first confession

---

## File Structure

```
booba-confesse/
├── public/
│   ├── booba/
│   │   ├── character.png
│   │   ├── mouth-closed.png
│   │   ├── mouth-open.png
│   │   └── ...
│   └── background.png
├── src/
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── layout.tsx
│   │   └── api/
│   │       ├── generate/     # Voice generation
│   │       ├── render/       # Video rendering
│   │       └── auth/         # Twitter OAuth
│   ├── components/
│   │   ├── ConfessionBooth.tsx
│   │   ├── BoobaCharacter.tsx
│   │   ├── TextInput.tsx
│   │   ├── ShareButton.tsx
│   │   └── DuckCounter.tsx
│   └── lib/
│       ├── elevenlabs.ts
│       ├── twitter.ts
│       ├── ffmpeg.ts
│       └── lipsync.ts
├── docs/
│   └── plans/
│       └── 2025-01-25-booba-confesse-design.md
└── package.json
```
