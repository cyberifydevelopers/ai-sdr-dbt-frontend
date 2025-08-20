// data.ts

// export type Gender = "male" | "female" | "neutral";

// export interface VoiceData {
//   showName: string;
//   name: string;   // Deepgram voice key (e.g., "asteria")
//   voice: string;  // Deepgram Aura model id (e.g., "aura-asteria-en")
//   gender: Gender;
//   audioSr: string; // local preview path
// }

// // Deepgram Aura voices
// export const deepgramVoices: VoiceData[] = [
//   { showName: "Asteria", name: "asteria", voice: "aura-asteria-en", gender: "female", audioSr: "/Audios/output_Asteria.wav" },
//   { showName: "Luna", name: "luna", voice: "aura-luna-en", gender: "female", audioSr: "/Audios/output_Luna.wav" },
//   { showName: "Stella", name: "stella", voice: "aura-stella-en", gender: "female", audioSr: "/Audios/output_Stella.wav" },
//   { showName: "Athena", name: "athena", voice: "aura-athena-en", gender: "female", audioSr: "/Audios/output_Athena.wav" },
//   { showName: "Hera", name: "hera", voice: "aura-hera-en", gender: "female", audioSr: "/Audios/output_Hera.wav" },
//   { showName: "Orion", name: "orion", voice: "aura-orion-en", gender: "male", audioSr: "/Audios/output_Orion.wav" },
//   { showName: "Arcas", name: "arcas", voice: "aura-arcas-en", gender: "male", audioSr: "/Audios/output_Arcas.wav" },
//   { showName: "Perseus", name: "perseus", voice: "aura-perseus-en", gender: "male", audioSr: "/Audios/output_Perseus.wav" },
//   { showName: "Angus", name: "angus", voice: "aura-angus-en", gender: "male", audioSr: "/Audios/output_Angus.wav" },
//   { showName: "Orpheus", name: "orpheus", voice: "aura-orpheus-en", gender: "male", audioSr: "/Audios/output_Orpheus.wav" },
//   { showName: "Helios", name: "helios", voice: "aura-helios-en", gender: "male", audioSr: "/Audios/output_Helios.wav" },
//   { showName: "Zeus", name: "zeus", voice: "aura-zeus-en", gender: "male", audioSr: "/Audios/output_Zeus.wav" },
// ];

// // --- Backwards compatibility ---
// // If other files import { voiceset2, voiceset3 }, keep those names pointing to Deepgram.
// export const voiceset1 = deepgramVoices;
// export const voiceset2 = deepgramVoices;
// export const voiceset3 = deepgramVoices;
// // Optional: default export
// export default deepgramVoices;





export type Gender = "male" | "female" | "neutral";
export type VoiceProvider = "deepgram" | "openai";

export interface VoiceData {
  showName: string;
  name: string;    // short key (e.g., "asteria", "nova")
  voice: string;   // model id (e.g., "aura-asteria-en", "gpt-4o-mini-tts")
  gender: Gender;
  audioSr: string; // local preview path
  provider?: VoiceProvider; // optional; added for clarity
}

/* -------------------------------
   Deepgram Aura voices (provider: deepgram)
--------------------------------- */
export const deepgramVoices: VoiceData[] = [
  { showName: "Asteria", name: "asteria", voice: "aura-asteria-en", gender: "female", audioSr: "/Audios/output_Asteria.wav", provider: "deepgram" },
  { showName: "Luna",    name: "luna",    voice: "aura-luna-en",    gender: "female", audioSr: "/Audios/output_Luna.wav",    provider: "deepgram" },
  { showName: "Stella",  name: "stella",  voice: "aura-stella-en",  gender: "female", audioSr: "/Audios/output_Stella.wav",  provider: "deepgram" },
  { showName: "Athena",  name: "athena",  voice: "aura-athena-en",  gender: "female", audioSr: "/Audios/output_Athena.wav",  provider: "deepgram" },
  { showName: "Hera",    name: "hera",    voice: "aura-hera-en",    gender: "female", audioSr: "/Audios/output_Hera.wav",    provider: "deepgram" },

  { showName: "Orion",   name: "orion",   voice: "aura-orion-en",   gender: "male",   audioSr: "/Audios/output_Orion.wav",   provider: "deepgram" },
  { showName: "Arcas",   name: "arcas",   voice: "aura-arcas-en",   gender: "male",   audioSr: "/Audios/output_Arcas.wav",   provider: "deepgram" },
  { showName: "Perseus", name: "perseus", voice: "aura-perseus-en", gender: "male",   audioSr: "/Audios/output_Perseus.wav", provider: "deepgram" },
  { showName: "Angus",   name: "angus",   voice: "aura-angus-en",   gender: "male",   audioSr: "/Audios/output_Angus.wav",   provider: "deepgram" },
  { showName: "Orpheus", name: "orpheus", voice: "aura-orpheus-en", gender: "male",   audioSr: "/Audios/output_Orpheus.wav", provider: "deepgram" },
  { showName: "Helios",  name: "helios",  voice: "aura-helios-en",  gender: "male",   audioSr: "/Audios/output_Helios.wav",  provider: "deepgram" },
  { showName: "Zeus",    name: "zeus",    voice: "aura-zeus-en",    gender: "male",   audioSr: "/Audios/output_Zeus.wav",    provider: "deepgram" },
];

/* -------------------------------
   OpenAI TTS voices (provider: openai)
--------------------------------- */
export const openAIVoices: VoiceData[] = [
  { showName: "nova",  name: "nova",  voice: "gpt-4o-mini-tts", gender: "female", audioSr: "/Audios/nova.mp3",  provider: "openai" },
  { showName: "onyx",  name: "onyx",  voice: "gpt-4o-mini-tts", gender: "male",   audioSr: "/Audios/onyx.mp3",  provider: "openai" },
  { showName: "alloy", name: "alloy", voice: "gpt-4o-mini-tts", gender: "female", audioSr: "/Audios/alloy.mp3", provider: "openai" },
];

/* -------------------------------
   Combined & sets
   - Keep voiceset1/2/3 pointing to Deepgram only for backward compatibility
   - Use allVoices if you have a UI that supports multiple providers
--------------------------------- */
export const allVoices: VoiceData[] = [...deepgramVoices, ...openAIVoices];

// Backwards compatibility (Deepgram-only sets)
export const voiceset1 = deepgramVoices.filter((v) => v.gender === "female");
export const voiceset2 = deepgramVoices.filter((v) => v.gender === "male");
export const voiceset3 = deepgramVoices;

// Optional: provider-specific sets for OpenAI
export const openAISet1 = openAIVoices.filter((v) => v.gender === "female");
export const openAISet2 = openAIVoices.filter((v) => v.gender === "male");

// Default export remains Deepgram to avoid breaking existing imports
export default deepgramVoices ;
