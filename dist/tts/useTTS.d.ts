import type { TTSConfig, TTSResult } from "./types";
export type UseTTSState = {
    loading: boolean;
    error: string | null;
};
export type UseTTSReturn = UseTTSState & {
    /** Synthesize text and return audio blob + optional alignment. */
    synthesize(text: string): Promise<TTSResult>;
    /** Cancel any in-progress synthesis request. */
    cancel(): void;
};
/**
 * React hook for TTS synthesis.
 * Returns { synthesize, cancel, loading, error }.
 *
 * Usage:
 *   const { synthesize, loading, error } = useTTS(config);
 *   const { audioBlob, alignment } = await synthesize("Hello world");
 *   headRef.current.speak("Hello world", audioBlob, alignment);
 */
export declare function useTTS(config: TTSConfig): UseTTSReturn;
