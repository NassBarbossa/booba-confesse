import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

const VIDEO_WIDTH = 1080;
const VIDEO_HEIGHT = 1080;
const FPS = 30;

// Mouth shapes available
const MOUTH_SHAPES = ["closed", "small", "medium", "o"] as const;
type MouthShape = (typeof MOUTH_SHAPES)[number];

const MOUTH_FILES: Record<MouthShape, string> = {
  closed: "mouth-closed.png",
  small: "mouth-open-small.png",
  medium: "mouth-open-medium.png",
  o: "mouth-o.png",
};

export async function POST(request: NextRequest) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "booba-video-"));

  try {
    const { text, audioBase64 } = await request.json();

    if (!text || !audioBase64) {
      return NextResponse.json(
        { error: "Missing text or audio" },
        { status: 400 }
      );
    }

    // Save audio to temp file
    const audioBuffer = Buffer.from(audioBase64, "base64");
    const audioPath = path.join(tempDir, "audio.mp3");
    await fs.writeFile(audioPath, audioBuffer);

    // Get audio duration using ffprobe
    const duration = await getAudioDuration(audioPath);
    const totalFrames = Math.ceil(duration * FPS);

    // Load base assets
    const publicDir = path.join(process.cwd(), "public", "booba");
    const characterBuffer = await fs.readFile(
      path.join(publicDir, "character.png")
    );

    // Load all mouth images
    const mouthBuffers: Record<MouthShape, Buffer> = {} as Record<
      MouthShape,
      Buffer
    >;
    for (const shape of MOUTH_SHAPES) {
      mouthBuffers[shape] = await fs.readFile(
        path.join(publicDir, MOUTH_FILES[shape])
      );
    }

    // Analyze audio to get volume data for lip sync
    const volumeData = await analyzeAudio(audioPath, totalFrames);

    // Generate frames
    const framesDir = path.join(tempDir, "frames");
    await fs.mkdir(framesDir);

    console.log(`Generating ${totalFrames} frames...`);

    for (let i = 0; i < totalFrames; i++) {
      const mouthShape = volumeToMouthShape(volumeData[i] || 0);
      const frameBuffer = await generateFrame(
        characterBuffer,
        mouthBuffers[mouthShape],
        text,
        VIDEO_WIDTH,
        VIDEO_HEIGHT
      );

      const framePath = path.join(framesDir, `frame_${String(i).padStart(5, "0")}.png`);
      await fs.writeFile(framePath, frameBuffer);

      if (i % 30 === 0) {
        console.log(`Frame ${i}/${totalFrames}`);
      }
    }

    // Combine frames + audio with FFmpeg
    const outputPath = path.join(tempDir, "output.mp4");
    await combineWithFFmpeg(framesDir, audioPath, outputPath, FPS);

    // Read output video
    const videoBuffer = await fs.readFile(outputPath);

    // Cleanup temp dir
    await fs.rm(tempDir, { recursive: true, force: true });

    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="booba-traducteur.mp4"`,
      },
    });
  } catch (error) {
    console.error("Video generation error:", error);

    // Cleanup on error
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {}

    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
  }
}

async function getAudioDuration(audioPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      audioPath,
    ]);

    let output = "";
    ffprobe.stdout.on("data", (data) => {
      output += data.toString();
    });

    ffprobe.on("close", (code) => {
      if (code === 0) {
        resolve(parseFloat(output.trim()));
      } else {
        reject(new Error("ffprobe failed"));
      }
    });
  });
}

async function analyzeAudio(
  audioPath: string,
  totalFrames: number
): Promise<number[]> {
  const duration = await getAudioDuration(audioPath);
  const frameDuration = duration / totalFrames;

  return new Promise((resolve, reject) => {
    // Use FFmpeg to extract RMS volume for each frame period
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      audioPath,
      "-af",
      `astats=metadata=1:reset=${Math.ceil(1 / frameDuration)}`,
      "-f",
      "null",
      "-",
    ]);

    let stderr = "";
    ffmpeg.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    ffmpeg.on("close", (code) => {
      // Parse RMS levels from FFmpeg output
      const rmsMatches = stderr.matchAll(/RMS level dB: ([-\d.]+)/g);
      const rmsValues: number[] = [];

      for (const match of rmsMatches) {
        const db = parseFloat(match[1]);
        // Convert dB to 0-1 range (typical speech is -30 to -10 dB)
        // -60 dB = silence, -10 dB = loud
        const normalized = Math.max(0, Math.min(1, (db + 50) / 40));
        rmsValues.push(normalized);
      }

      // If we got RMS values, interpolate to match frame count
      if (rmsValues.length > 0) {
        const volumes = interpolateToFrames(rmsValues, totalFrames);
        resolve(volumes);
      } else {
        // Fallback: analyze using raw PCM data
        analyzeAudioFallback(audioPath, totalFrames).then(resolve).catch(reject);
      }
    });

    ffmpeg.on("error", () => {
      analyzeAudioFallback(audioPath, totalFrames).then(resolve).catch(reject);
    });
  });
}

async function analyzeAudioFallback(
  audioPath: string,
  totalFrames: number
): Promise<number[]> {
  return new Promise((resolve) => {
    // Extract raw PCM and analyze volume
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      audioPath,
      "-ac",
      "1", // mono
      "-ar",
      "8000", // 8kHz sample rate
      "-f",
      "s16le", // 16-bit signed little-endian
      "-",
    ]);

    const chunks: Buffer[] = [];
    ffmpeg.stdout.on("data", (data) => {
      chunks.push(data);
    });

    ffmpeg.on("close", () => {
      const pcmData = Buffer.concat(chunks);
      const samples = new Int16Array(
        pcmData.buffer,
        pcmData.byteOffset,
        pcmData.length / 2
      );

      const samplesPerFrame = Math.floor(samples.length / totalFrames);
      const volumes: number[] = [];

      for (let i = 0; i < totalFrames; i++) {
        const start = i * samplesPerFrame;
        const end = Math.min(start + samplesPerFrame, samples.length);

        // Calculate RMS for this frame
        let sum = 0;
        for (let j = start; j < end; j++) {
          sum += samples[j] * samples[j];
        }
        const rms = Math.sqrt(sum / (end - start));

        // Normalize to 0-1 (max 16-bit value is 32767)
        const normalized = Math.min(1, rms / 10000);
        volumes.push(normalized);
      }

      resolve(volumes);
    });

    ffmpeg.on("error", () => {
      // Ultimate fallback: generate based on typical speech pattern
      const volumes: number[] = [];
      for (let i = 0; i < totalFrames; i++) {
        volumes.push(Math.random() * 0.5 + 0.2);
      }
      resolve(volumes);
    });
  });
}

function interpolateToFrames(values: number[], targetCount: number): number[] {
  if (values.length === targetCount) return values;

  const result: number[] = [];
  for (let i = 0; i < targetCount; i++) {
    const srcIndex = (i / targetCount) * values.length;
    const lower = Math.floor(srcIndex);
    const upper = Math.min(lower + 1, values.length - 1);
    const fraction = srcIndex - lower;
    result.push(values[lower] * (1 - fraction) + values[upper] * fraction);
  }
  return result;
}

function volumeToMouthShape(volume: number): MouthShape {
  if (volume < 0.2) return "closed";
  if (volume < 0.45) return "small";
  if (volume < 0.7) return "medium";
  return "o";
}

async function generateFrame(
  characterBuffer: Buffer,
  mouthBuffer: Buffer,
  text: string,
  width: number,
  height: number
): Promise<Buffer> {
  // Create background
  const background = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 24, g: 24, b: 27, alpha: 1 }, // zinc-900
    },
  });

  // Resize character to fit (centered, 60% of height)
  const characterSize = Math.floor(height * 0.6);
  const resizedCharacter = await sharp(characterBuffer)
    .resize(characterSize, characterSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Resize mouth to appropriate size
  const mouthWidth = Math.floor(characterSize * 0.25);
  const mouthHeight = Math.floor(characterSize * 0.2);
  const resizedMouth = await sharp(mouthBuffer)
    .resize(mouthWidth, mouthHeight, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Calculate positions
  const charX = Math.floor((width - characterSize) / 2);
  const charY = Math.floor(height * 0.1);

  // Mouth position (52% from top of character, centered)
  const mouthX = charX + Math.floor((characterSize - mouthWidth) / 2);
  const mouthY = charY + Math.floor(characterSize * 0.52) - Math.floor(mouthHeight / 2);

  // Create subtitle overlay
  const subtitleHeight = 120;
  const subtitleY = height - subtitleHeight - 50;

  // Wrap text for subtitle
  const maxCharsPerLine = 40;
  const wrappedText = wrapText(text, maxCharsPerLine);

  const subtitleSvg = `
    <svg width="${width}" height="${subtitleHeight}">
      <rect x="40" y="0" width="${width - 80}" height="${subtitleHeight}" rx="10" fill="rgba(0,0,0,0.8)"/>
      <text x="${width / 2}" y="${subtitleHeight / 2 + 8}"
            font-family="Arial, sans-serif" font-size="32" font-weight="bold"
            fill="white" text-anchor="middle" dominant-baseline="middle">
        ${escapeXml(wrappedText)}
      </text>
    </svg>
  `;
  const subtitleBuffer = Buffer.from(subtitleSvg);

  // Composite everything
  const frame = await background
    .composite([
      { input: resizedCharacter, left: charX, top: charY },
      { input: resizedMouth, left: mouthX, top: mouthY },
      { input: subtitleBuffer, left: 0, top: subtitleY },
    ])
    .png()
    .toBuffer();

  return frame;
}

function wrapText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;

  const words = text.split(" ");
  let lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxChars) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines.slice(0, 2).join(" ");
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function combineWithFFmpeg(
  framesDir: string,
  audioPath: string,
  outputPath: string,
  fps: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-y",
      "-framerate",
      String(fps),
      "-i",
      path.join(framesDir, "frame_%05d.png"),
      "-i",
      audioPath,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-shortest",
      outputPath,
    ]);

    ffmpeg.stderr.on("data", (data) => {
      console.log(`FFmpeg: ${data}`);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on("error", reject);
  });
}
