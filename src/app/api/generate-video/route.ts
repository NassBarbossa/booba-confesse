import { NextRequest, NextResponse } from "next/server";
import { generateAudioMiniMax } from "@/lib/minimax";
import sharp from "sharp";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

const VIDEO_WIDTH = 1080;
const VIDEO_HEIGHT = 1080;
const FPS = 24;

type MouthShape = "closed" | "small" | "o";

const MOUTH_FILES: Record<MouthShape, string> = {
  closed: "mouth-closed.png",
  small: "mouth-open-small.png",
  o: "mouth-o.png",
};

export async function POST(request: NextRequest) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "booba-video-"));

  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    console.log("Generating audio...");

    // 1. Generate audio
    const audioBuffer = await generateAudioMiniMax({ text });
    const audioPath = path.join(tempDir, "audio.mp3");
    await fs.writeFile(audioPath, Buffer.from(audioBuffer));

    // 2. Get audio duration
    const duration = await getAudioDuration(audioPath);
    const totalFrames = Math.ceil(duration * FPS);
    console.log(`Audio duration: ${duration}s, frames: ${totalFrames}`);

    // 3. Analyze audio for lip sync
    const volumes = await analyzeAudioVolumes(audioPath, totalFrames);

    // 4. Load assets
    const publicDir = path.join(process.cwd(), "public", "booba");
    const characterBuffer = await fs.readFile(path.join(publicDir, "character.png"));

    const mouthBuffers: Record<MouthShape, Buffer> = {
      closed: await fs.readFile(path.join(publicDir, MOUTH_FILES.closed)),
      small: await fs.readFile(path.join(publicDir, MOUTH_FILES.small)),
      o: await fs.readFile(path.join(publicDir, MOUTH_FILES.o)),
    };

    // 5. Generate frames
    const framesDir = path.join(tempDir, "frames");
    await fs.mkdir(framesDir);

    console.log("Generating frames...");
    for (let i = 0; i < totalFrames; i++) {
      const mouthShape = volumeToMouthShape(volumes[i] || 0);
      const frameBuffer = await generateFrame(
        characterBuffer,
        mouthBuffers[mouthShape]
      );

      const framePath = path.join(framesDir, `frame_${String(i).padStart(5, "0")}.png`);
      await fs.writeFile(framePath, frameBuffer);
    }

    // 6. Combine with FFmpeg
    console.log("Encoding video...");
    const outputPath = path.join(tempDir, "output.mp4");
    await encodeVideo(framesDir, audioPath, outputPath, FPS);

    // 7. Read and return
    const videoBuffer = await fs.readFile(outputPath);

    // Cleanup
    await fs.rm(tempDir, { recursive: true, force: true });

    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="booba-traducteur.mp4"`,
      },
    });
  } catch (error) {
    console.error("Video generation error:", error);
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
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      audioPath,
    ]);

    let output = "";
    ffprobe.stdout.on("data", (data) => (output += data.toString()));
    ffprobe.on("close", (code) => {
      if (code === 0) resolve(parseFloat(output.trim()));
      else reject(new Error("ffprobe failed"));
    });
  });
}

async function analyzeAudioVolumes(audioPath: string, totalFrames: number): Promise<number[]> {
  return new Promise((resolve) => {
    // Extract raw PCM and analyze
    const ffmpeg = spawn("ffmpeg", [
      "-i", audioPath,
      "-ac", "1",
      "-ar", "8000",
      "-f", "s16le",
      "-",
    ]);

    const chunks: Buffer[] = [];
    ffmpeg.stdout.on("data", (data) => chunks.push(data));

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

        let sum = 0;
        for (let j = start; j < end; j++) {
          sum += Math.abs(samples[j]);
        }
        const avg = sum / (end - start);
        const normalized = Math.min(1, avg / 8000);
        volumes.push(normalized);
      }

      resolve(volumes);
    });

    ffmpeg.on("error", () => {
      // Fallback
      const volumes = Array(totalFrames).fill(0).map(() => Math.random() * 0.5);
      resolve(volumes);
    });
  });
}

function volumeToMouthShape(volume: number): MouthShape {
  if (volume < 0.15) return "closed";
  if (volume < 0.4) return "small";
  return "o";
}

async function generateFrame(
  characterBuffer: Buffer,
  mouthBuffer: Buffer
): Promise<Buffer> {
  // Character size (60% of video height)
  const charSize = Math.floor(VIDEO_HEIGHT * 0.6);

  // Resize character
  const resizedChar = await sharp(characterBuffer)
    .resize(charSize, charSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Mouth size (25% of character)
  const mouthWidth = Math.floor(charSize * 0.25);
  const mouthHeight = Math.floor(charSize * 0.2);

  const resizedMouth = await sharp(mouthBuffer)
    .resize(mouthWidth, mouthHeight, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Positions
  const charX = Math.floor((VIDEO_WIDTH - charSize) / 2);
  const charY = Math.floor(VIDEO_HEIGHT * 0.15);

  // Mouth at 52% of character height, centered
  const mouthX = charX + Math.floor((charSize - mouthWidth) / 2);
  const mouthY = charY + Math.floor(charSize * 0.52) - Math.floor(mouthHeight / 2);

  // Create frame
  const frame = await sharp({
    create: {
      width: VIDEO_WIDTH,
      height: VIDEO_HEIGHT,
      channels: 4,
      background: { r: 24, g: 24, b: 27, alpha: 1 },
    },
  })
    .composite([
      { input: resizedChar, left: charX, top: charY },
      { input: resizedMouth, left: mouthX, top: mouthY },
    ])
    .png()
    .toBuffer();

  return frame;
}

async function encodeVideo(
  framesDir: string,
  audioPath: string,
  outputPath: string,
  fps: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-y",
      "-framerate", String(fps),
      "-i", path.join(framesDir, "frame_%05d.png"),
      "-i", audioPath,
      "-c:v", "libx264",
      "-preset", "fast",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac",
      "-b:a", "192k",
      "-shortest",
      outputPath,
    ]);

    ffmpeg.stderr.on("data", (data) => {
      console.log(`FFmpeg: ${data}`);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });

    ffmpeg.on("error", reject);
  });
}
