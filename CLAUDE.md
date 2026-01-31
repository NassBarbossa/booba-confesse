# CLAUDE.md - Booba Confesse

## Projet
**Webapp virale parodique** où les utilisateurs font "avouer" un cartoon de Booba via voice cloning IA. Projet créé pour Sadek pour troller Booba.

## Concept
1. L'utilisateur tape une confession en français
2. L'IA génère la voix de Booba (MiniMax voice cloning)
3. Animation lip-sync avec sprites
4. Partage one-click sur X/Twitter
5. Compteur "Jours depuis que Booba a fui" en watermark

## Stack Technique
- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS v4
- **Voice**: MiniMax API (primary) - XTTS/ElevenLabs (fallback)
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
    ├── minimax.ts         # Client MiniMax (primary)
    ├── xtts.ts            # Client XTTS (self-hosted alternative)
    ├── elevenlabs.ts      # Client ElevenLabs (fallback)
    ├── useLipSync.ts      # Hook animation lip-sync
    └── rateLimit.ts       # Rate limiting
```

## Variables d'Environnement
```bash
# Provider: "minimax" (default), "xtts", ou "elevenlabs"
TTS_PROVIDER=minimax

# MiniMax Config
MINIMAX_API_KEY=xxx
MINIMAX_GROUP_ID=xxx
MINIMAX_VOICE_ID=xxx  # Cloned voice ID
MINIMAX_MODEL=speech-02-hd

# App
DUCK_DATE=2025-01-15
```

## Commandes
```bash
npm run dev    # Dev server localhost:3000
npm run build  # Build production
npm run lint   # ESLint
```

---

## Setup MiniMax Voice Cloning

### 1. Créer un compte MiniMax
1. Aller sur https://platform.minimax.io
2. S'inscrire (version internationale, pas CN)
3. Récupérer l'**API Key** et le **Group ID** (19 chiffres)

### 2. Préparer l'audio de Booba
**Spécifications requises :**
- Format: MP3, M4A, ou WAV
- Durée: 10 secondes à 5 minutes
- Taille: < 20 MB
- Qualité: voix claire, pas de musique de fond

**Sources recommandées :**
- Interviews YouTube/podcasts
- Lives Instagram
- Passages sans beat dans les sons

### 3. Cloner la voix via l'API

**Étape 1: Upload de l'audio**
```bash
curl -X POST "https://api.minimaxi.chat/v1/files/upload?GroupId=YOUR_GROUP_ID" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "purpose=voice_clone" \
  -F "file=@booba_sample.mp3"
```
→ Récupérer le `file_id` de la réponse

**Étape 2: Créer le clone**
```bash
curl -X POST "https://api.minimaxi.chat/v1/voice_clone?GroupId=YOUR_GROUP_ID" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "file_id": "YOUR_FILE_ID",
    "voice_id": "booba_voice_01"
  }'
```

**Étape 3: Configurer le projet**
Mettre `booba_voice_01` dans `MINIMAX_VOICE_ID` du `.env.local`

### 4. Tester la génération
```bash
curl -X POST "https://api.minimaxi.chat/v1/t2a_v2?GroupId=YOUR_GROUP_ID" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "speech-02-hd",
    "text": "Je suis Booba et je confesse",
    "voice_setting": {
      "voice_id": "booba_voice_01"
    }
  }' | jq -r '.audio_file' | base64 -d > test.mp3
```

### Notes importantes
- La voix clonée est **supprimée après 7 jours** si non utilisée
- Utiliser la voix au moins 1x par semaine pour la garder
- Modèles disponibles: `speech-02-hd` (qualité) ou `speech-02-turbo` (rapide)

---

## État d'Avancement

### Fait
- [x] Setup Next.js + Tailwind
- [x] Composants UI (ConfessionBooth, BoobaCharacter, Input, Counter)
- [x] Intégration MiniMax API (primary)
- [x] Intégration XTTS v2 (alternative)
- [x] Intégration ElevenLabs (fallback)
- [x] Système lip-sync (sprite swapping via Web Audio API)
- [x] Partage X via intent link

### À Faire
- [ ] Cloner la voix de Booba sur MiniMax
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
3. MiniMax génère audio avec voix clonée
4. Audio retourné en base64
5. Création HTMLAudioElement + play
6. useLipSync analyse volume → mouthShape
7. BoobaCharacter affiche sprite correspondant
8. Fin audio → state "done" → bouton partage

## Notes
- Style visuel: South Park / paper cutout
- Parodie légale (satire clairement identifiée)
- Rate limit: 3 confessions/IP/jour prévu
- TTS_PROVIDER permet de switch entre MiniMax/XTTS/ElevenLabs

## Sources
- [MiniMax API Docs](https://platform.minimax.io/docs/api-reference/api-overview)
- [Voice Cloning Guide](https://platform.minimax.io/docs/guides/speech-voice-clone)
- [MiniMax Voice Clone Tutorial](https://apidog.com/blog/how-to-clone-a-voice-using-minimaxs-t2a-01-hd-api/)
