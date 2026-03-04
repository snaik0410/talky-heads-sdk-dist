export type TTSProvider = "elevenlabs" | "google";
export type TTSFormat = "mp3" | "wav";
/** Configuration passed to useTTS or TalkingHeadWithTTS */
export type TTSConfig = {
    /**
     * PROXY mode (recommended for production).
     * The SDK calls YOUR backend at these URLs:
     *   POST {proxyUrl}/tts
     *   POST {proxyUrl}/tts-with-timestamps   (ElevenLabs only)
     * Your backend holds the API keys. See README for expected request/response shapes.
     */
    mode: "proxy";
    proxyUrl: string;
    provider?: TTSProvider;
    voice?: string;
    speed?: number;
    apiKey?: string;
} | {
    /**
     * DIRECT mode (dev/demo only — API key is visible in browser).
     * The SDK calls the TTS provider directly from the browser.
     */
    mode: "direct";
    provider: TTSProvider;
    apiKey: string;
    voice?: string;
    speed?: number;
    language?: string;
};
/** What useTTS.synthesize() resolves to */
export type TTSResult = {
    audioBlob: Blob;
    alignment: {
        characters: string[];
        character_start_times_seconds: number[];
        character_end_times_seconds: number[];
    } | null;
};
