import { ElevenLabsClient } from "elevenlabs";

const elevenLabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

async function cloneVoice() {
  const voice = await elevenLabs.voices.add({
    name: "Voice",
    description: "Cloned voice",
  });

  return voice.voice_id;
}
