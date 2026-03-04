import type { TTSConfig } from "../tts/types";
export type TalkingHeadWithTTSProps = {
    /** Path under public/ containing avatar assets. Defaults to "/avatars/Lucy". */
    avatarDir?: string;
    /** TTS configuration — proxy URL or direct API key. */
    ttsConfig: TTSConfig;
    /** Placeholder text for the input box. */
    placeholder?: string;
    className?: string;
    /** Inline styles for the root element (e.g. `{ width: 340, height: 420 }`). */
    style?: React.CSSProperties;
    debug?: boolean;
    /**
     * Display shape of the avatar. "circle" clips to a circle; "square" keeps rectangle.
     * Default: "square".
     */
    shape?: "circle" | "square";
    /** Fine-tune audio/lip-sync alignment in ms. Negative = mouth moves earlier. Default 0. */
    syncOffsetMs?: number;
    /**
     * When true, disables all cross-frame blending and smoothing (hard cuts between frames).
     * Default: false.
     */
    disableBlending?: boolean;
    /**
     * Scale factor for rest.webp, centred on the canvas. Use slightly below 1 (e.g. 0.97) if
     * the idle image appears marginally larger than the speaking composite. Default: 1.
     */
    restImageScale?: number;
};
/**
 * Complete ready-to-use component: avatar + text input + speak button.
 *
 * Example:
 *   <TalkingHeadWithTTS
 *     ttsConfig={{ mode: "proxy", proxyUrl: "http://localhost:3001", provider: "elevenlabs" }}
 *   />
 */
export declare function TalkingHeadWithTTS({ avatarDir, ttsConfig, placeholder, className, style, debug, shape, syncOffsetMs, disableBlending, restImageScale, }: TalkingHeadWithTTSProps): import("react/jsx-runtime").JSX.Element;
