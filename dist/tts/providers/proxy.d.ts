import type { TTSFormat, TTSProvider, TTSResult } from "../types";
/**
 * Call a developer-supplied backend proxy.
 *
 * Expected backend endpoints (match the trainer/ project shape):
 *
 *   POST {proxyUrl}/tts
 *     body:     { text, provider, voice?, format?, speed? }
 *     response: audio bytes (Content-Type: audio/mpeg or audio/wav)
 *
 *   POST {proxyUrl}/tts-with-timestamps    ← ElevenLabs only
 *     body:     { text, voice?, format?, speed? }
 *     response: { audio_base64: string, alignment: {...} | null }
 *
 * When the backend returns HTTP 501 for tts-with-timestamps, falls back to plain /tts.
 */
export declare function proxySynthesize(text: string, proxyUrl: string, provider?: TTSProvider, voice?: string, format?: TTSFormat, speed?: number, apiKey?: string, signal?: AbortSignal): Promise<TTSResult>;
