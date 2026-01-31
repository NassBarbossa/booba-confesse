/**
 * MiniMax TTS Client
 *
 * API Docs: https://platform.minimax.io/docs/api-reference/api-overview
 * Voice Cloning: https://platform.minimax.io/docs/guides/speech-voice-clone
 */

const MINIMAX_API_BASE = "https://api.minimaxi.chat/v1";

interface MiniMaxConfig {
  apiKey: string;
  groupId: string;
  voiceId: string;
  model: string;
}

interface GenerateAudioOptions {
  text: string;
  voiceId?: string;
  speed?: number;
  volume?: number;
  pitch?: number;
}

function getConfig(): MiniMaxConfig {
  const apiKey = process.env.MINIMAX_API_KEY;
  const groupId = process.env.MINIMAX_GROUP_ID;
  const voiceId = process.env.MINIMAX_VOICE_ID || "default";
  const model = process.env.MINIMAX_MODEL || "speech-02-hd";

  if (!apiKey) {
    throw new Error("MINIMAX_API_KEY not configured");
  }
  if (!groupId) {
    throw new Error("MINIMAX_GROUP_ID not configured");
  }

  return { apiKey, groupId, voiceId, model };
}

/**
 * Generate audio from text using MiniMax TTS
 */
export async function generateAudioMiniMax({
  text,
  voiceId,
  speed = 1.0,
  volume = 1.0,
  pitch = 0,
}: GenerateAudioOptions): Promise<ArrayBuffer> {
  const config = getConfig();

  const response = await fetch(
    `${MINIMAX_API_BASE}/t2a_v2?GroupId=${config.groupId}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        text,
        voice_setting: {
          voice_id: voiceId || config.voiceId,
          speed,
          vol: volume,
          pitch,
        },
        audio_setting: {
          sample_rate: 32000,
          bitrate: 128000,
          format: "mp3",
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiniMax API error: ${error}`);
  }

  const data = await response.json();

  // Check for API-level errors
  if (data.base_resp?.status_code !== 0) {
    throw new Error(
      `MiniMax API error: ${data.base_resp?.status_msg || "Unknown error"}`
    );
  }

  // The audio is returned as base64 in the response
  if (!data.audio_file) {
    throw new Error("No audio data in response");
  }

  // Decode base64 to ArrayBuffer
  const binaryString = atob(data.audio_file);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

/**
 * Upload audio file for voice cloning
 */
export async function uploadAudioForCloning(
  audioBuffer: ArrayBuffer,
  filename: string
): Promise<string> {
  const config = getConfig();

  const formData = new FormData();
  formData.append("purpose", "voice_clone");
  formData.append(
    "file",
    new Blob([audioBuffer], { type: "audio/wav" }),
    filename
  );

  const response = await fetch(
    `${MINIMAX_API_BASE}/files/upload?GroupId=${config.groupId}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiniMax upload error: ${error}`);
  }

  const data = await response.json();
  return data.file?.file_id;
}

/**
 * Clone a voice from uploaded audio
 */
export async function cloneVoice(
  fileId: string,
  voiceId: string,
  previewText?: string
): Promise<void> {
  const config = getConfig();

  const body: Record<string, unknown> = {
    file_id: fileId,
    voice_id: voiceId,
  };

  if (previewText) {
    body.text = previewText;
    body.model = config.model;
  }

  const response = await fetch(
    `${MINIMAX_API_BASE}/voice_clone?GroupId=${config.groupId}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiniMax voice clone error: ${error}`);
  }

  const data = await response.json();

  if (data.base_resp?.status_code !== 0) {
    throw new Error(
      `MiniMax voice clone error: ${data.base_resp?.status_msg || "Unknown error"}`
    );
  }
}

/**
 * Check if MiniMax API is accessible
 */
export async function checkMiniMaxHealth(): Promise<boolean> {
  try {
    const config = getConfig();
    // Simple test - just verify we have valid config
    return !!(config.apiKey && config.groupId);
  } catch {
    return false;
  }
}
