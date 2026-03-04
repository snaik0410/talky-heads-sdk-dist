import type { TTSFormat, TTSResult } from "../types";
/**
 * Call Google Cloud Text-to-Speech REST API directly from the browser.
 * The API key must have "Cloud Text-to-Speech API" enabled in Google Cloud Console.
 * Docs: https://cloud.google.com/text-to-speech/docs/reference/rest/v1/text/synthesize
 */
export declare function googleTTSSynthesize(text: string, apiKey: string, voiceName?: string, languageCode?: string, format?: TTSFormat, signal?: AbortSignal): Promise<TTSResult>;
