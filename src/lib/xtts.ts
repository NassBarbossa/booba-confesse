/**
 * XTTS v2 Client
 *
 * Connects to a self-hosted XTTS server (xtts-api-server or custom FastAPI)
 * Server repo: https://github.com/daswer123/xtts-api-server
 */

interface XTTSGenerateOptions {
  text: string;
  speakerWav?: string; // Path to reference audio on server, or base64
  language?: string;
}

interface XTTSConfig {
  serverUrl: string;
  speakerWav: string; // Default speaker reference
  language: string;
}

function getConfig(): XTTSConfig {
  const serverUrl = process.env.XTTS_SERVER_URL;
  const speakerWav = process.env.XTTS_SPEAKER_WAV || "booba_reference.wav";
  const language = process.env.XTTS_LANGUAGE || "fr";

  if (!serverUrl) {
    throw new Error("XTTS_SERVER_URL not configured");
  }

  return { serverUrl, speakerWav, language };
}

export async function generateAudioXTTS({
  text,
  speakerWav,
  language,
}: XTTSGenerateOptions): Promise<ArrayBuffer> {
  const config = getConfig();

  const response = await fetch(`${config.serverUrl}/tts_to_audio/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      speaker_wav: speakerWav || config.speakerWav,
      language: language || config.language,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`XTTS API error: ${error}`);
  }

  return response.arrayBuffer();
}

/**
 * Alternative endpoint for streaming (if supported by server)
 */
export async function generateAudioXTTSStream({
  text,
  speakerWav,
  language,
}: XTTSGenerateOptions): Promise<ReadableStream<Uint8Array> | null> {
  const config = getConfig();

  const response = await fetch(`${config.serverUrl}/tts_stream/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      speaker_wav: speakerWav || config.speakerWav,
      language: language || config.language,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`XTTS Stream API error: ${error}`);
  }

  return response.body;
}

/**
 * Check if XTTS server is healthy
 */
export async function checkXTTSHealth(): Promise<boolean> {
  try {
    const config = getConfig();
    const response = await fetch(`${config.serverUrl}/`, {
      method: "GET",
    });
    return response.ok;
  } catch {
    return false;
  }
}
