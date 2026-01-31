# CLAUDE.md - Booba Confesse

## Projet
**Webapp virale parodique** où les utilisateurs font "avouer" un cartoon de Booba via voice cloning IA. Projet créé pour Sadek pour troller Booba.

## Concept
1. L'utilisateur tape une confession en français
2. L'IA génère la voix de Booba (ElevenLabs)
3. Animation lip-sync avec sprites
4. Partage one-click sur X/Twitter
5. Compteur "Jours depuis que Booba a fui" en watermark

## Stack Technique
- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS v4
- **Voice**: ElevenLabs API (voice clone Booba)
- **Déploiement**: Vercel
- **Langue**: TypeScript

## Structure
```
src/
├── app/
│   ├── page.tsx           # Page principale
│   ├── layout.tsx         # Layout avec fonts
│   └── api/generate/      # API voice generation
├── components/
│   ├── ConfessionBooth.tsx   # Composant principal (state machine)
│   ├── BoobaCharacter.tsx    # Personnage avec sprites bouche
│   ├── ConfessionInput.tsx   # Input texte confession
│   └── DuckCounter.tsx       # Compteur jours
└── lib/
    ├── elevenlabs.ts      # Client API ElevenLabs
    ├── useLipSync.ts      # Hook animation lip-sync (Web Audio API)
    └── rateLimit.ts       # Rate limiting
```

## Variables d'Environnement
```
ELEVENLABS_API_KEY=xxx
ELEVENLABS_VOICE_ID=cjVigY5qzO86Huf0OWal
DUCK_DATE=2025-01-15  # Date de référence compteur
```

## Commandes
```bash
npm run dev    # Dev server localhost:3000
npm run build  # Build production
npm run lint   # ESLint
```

## État d'Avancement

### Fait
- [x] Setup Next.js + Tailwind
- [x] Composants UI (ConfessionBooth, BoobaCharacter, Input, Counter)
- [x] Intégration ElevenLabs API
- [x] Système lip-sync (sprite swapping via Web Audio API)
- [x] Partage X via intent link

### À Faire
- [ ] Assets graphiques (Booba cartoon, sprites bouche, fond)
- [ ] Génération vidéo MP4 (FFmpeg server-side)
- [ ] Twitter OAuth pour upload vidéo direct
- [ ] Watermark compteur sur vidéos
- [ ] Rate limiting Redis (Upstash)
- [ ] Domaine + déploiement prod

## Flow Technique (ConfessionBooth)
États: `idle` → `loading` → `playing` → `done`

1. User submit texte
2. POST `/api/generate` avec texte
3. ElevenLabs génère audio
4. Audio retourné en base64
5. Création HTMLAudioElement + play
6. useLipSync analyse volume → mouthShape
7. BoobaCharacter affiche sprite correspondant
8. Fin audio → state "done" → bouton partage

## Notes
- Style visuel: South Park / paper cutout
- Parodie légale (satire clairement identifiée)
- Rate limit: 3 confessions/IP/jour prévu
- Pas de token gating, juste affichage CA post-launch
