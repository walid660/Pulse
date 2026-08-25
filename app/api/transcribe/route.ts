import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return NextResponse.json({ error: "Aucun fichier audio" }, { status: 400 });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      language: "fr",
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error: any) {
    console.error("Erreur transcription Whisper:", error?.message || error);
    return NextResponse.json(
      { error: "Erreur de transcription", detail: error?.message || String(error) },
      { status: 500 }
    );
  }
}