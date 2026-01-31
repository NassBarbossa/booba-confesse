# CLAUDE.md - Booba Confesse

## Projet
**Webapp virale parodique** où les utilisateurs font "avouer" un cartoon de Booba via voice cloning IA. Projet créé pour Sadek pour troller Booba.

## Concept
1. L'utilisateur tape une confession en français
2. L'IA génère la voix de Booba (XTTS v2)
3. Animation lip-sync avec sprites
4. Partage one-click sur X/Twitter
5. Compteur "Jours depuis que Booba a fui" en watermark

## Stack Technique
- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS v4
- **Voice**: XTTS v2 (open-source, self-hosted) - fallback ElevenLabs
- **Déploiement**: Vercel (frontend) + serveur GPU (XTTS)
- **Langue**: TypeScript

## Structure
```
src/
├── app/
│   ├── page.tsx           # Page principale
│   ├── layout.tsx         # Layout avec fonts
│   └── api/generate/      # API voice generation (XTTS/ElevenLabs)
├── components/
│   ├── ConfessionBooth.tsx   # Composant principal (state machine)
│   ├── BoobaCharacter.tsx    # Personnage avec sprites bouche
│   ├── ConfessionInput.tsx   # Input texte confession
│   └── DuckCounter.tsx       # Compteur jours
└── lib/
    ├── xtts.ts            # Client XTTS v2 (primary)
    ├── elevenlabs.ts      # Client ElevenLabs (fallback)
    ├── useLipSync.ts      # Hook animation lip-sync (Web Audio API)
    └── rateLimit.ts       # Rate limiting
```

## Variables d'Environnement
```bash
# Provider: "xtts" (default) ou "elevenlabs"
TTS_PROVIDER=xtts

# XTTS Config
XTTS_SERVER_URL=http://localhost:8000
XTTS_SPEAKER_WAV=booba_reference.wav
XTTS_LANGUAGE=fr

# ElevenLabs (fallback)
ELEVENLABS_API_KEY=xxx
ELEVENLABS_VOICE_ID=xxx

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

## Setup XTTS v2 (Voice Cloning)

### Prérequis
- Python 3.10+
- GPU NVIDIA avec CUDA (recommandé) ou CPU (lent)
- ~4GB VRAM minimum

### Installation du serveur XTTS

**Option 1: xtts-api-server (recommandé)**
```bash
# Clone le repo
git clone https://github.com/daswer123/xtts-api-server
cd xtts-api-server

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou: venv\Scripts\activate  # Windows

# Installer dépendances
pip install -r requirements.txt

# Lancer le serveur
python -m xtts_api_server --host 0.0.0.0 --port 8000
```

**Option 2: Docker**
```bash
docker run -d -p 8000:8000 --gpus all ghcr.io/daswer123/xtts-api-server:latest
```

**Option 3: Google Colab (gratuit, GPU)**
- Utiliser un notebook Colab avec GPU
- Exposer via ngrok ou localtunnel
- Mettre l'URL ngrok dans `XTTS_SERVER_URL`

### Préparer l'audio de référence (Booba)

1. **Collecter des samples audio clean**:
   - Interviews YouTube/podcasts (pas de musique de fond)
   - Lives Instagram
   - Minimum 30 secondes, idéal 2-5 minutes
   - Voix seule, pas de bruit

2. **Nettoyer l'audio**:
   ```bash
   # Avec ffmpeg - extraire audio et normaliser
   ffmpeg -i interview.mp4 -vn -acodec pcm_s16le -ar 22050 -ac 1 booba_raw.wav

   # Optionnel: noise reduction avec Audacity ou
   # https://podcast.adobe.com/enhance (gratuit)
   ```

3. **Placer le fichier**:
   - Copier `booba_reference.wav` dans le dossier `speakers/` du serveur XTTS
   - Ou spécifier le chemin complet dans `XTTS_SPEAKER_WAV`

### Tester le serveur

```bash
# Health check
curl http://localhost:8000/

# Test génération
curl -X POST http://localhost:8000/tts_to_audio/ \
  -H "Content-Type: application/json" \
  -d '{"text": "Je suis Booba et je confesse", "speaker_wav": "booba_reference.wav", "language": "fr"}' \
  --output test.wav
```

### Endpoints XTTS utilisés
- `POST /tts_to_audio/` - Génère audio complet (utilisé)
- `POST /tts_stream/` - Streaming audio (optionnel)
- `GET /` - Health check

---

## État d'Avancement

### Fait
- [x] Setup Next.js + Tailwind
- [x] Composants UI (ConfessionBooth, BoobaCharacter, Input, Counter)
- [x] Intégration ElevenLabs API (fallback)
- [x] Intégration XTTS v2 (primary)
- [x] Système lip-sync (sprite swapping via Web Audio API)
- [x] Partage X via intent link

### À Faire
- [ ] Setup serveur XTTS avec audio Booba
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
3. XTTS (ou ElevenLabs) génère audio
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
- TTS_PROVIDER permet de switch entre XTTS et ElevenLabs
