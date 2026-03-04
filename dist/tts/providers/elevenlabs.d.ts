import type { TTSFormat, TTSResult } from "../types";
/** Call ElevenLabs /text-to-speech/{voice_id}/with-timestamps directly from the browser. */
export declare function elevenLabsSynthesize(text: string, apiKey: string, voiceId: string, format?: TTSFormat, speed?: number, signal?: AbortSignal): Promise<TTSResult>;
