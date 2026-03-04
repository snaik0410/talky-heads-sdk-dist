/**
 * TalkingHead – self-contained, loosely-coupled talking avatar.
 *
 * Drop-in for any React app:
 *   1. Serve the character folder (base.webp, sprite_manifest.json, atlases/) from public/.
 *   2. Mount <TalkingHead ref={headRef} avatarDir="/avatars/face1" state={avatarState} />
 *   3. Call headRef.current.speak(text, audioBlob, alignment?) when the AI replies.
 *
 * The component owns its audio element, viseme timeline, and canvas rendering.
 * No application-level context, store, or API calls are made internally.
 */
import { type CharacterAlignment } from "../lib/visemeTimeline";
import type { AvatarState } from "../lib/avatar";
export type SpriteManifest = {
    formatVersion: number;
    group: string;
    base: {
        file: string;
        width: number;
        height: number;
    };
    parts: Array<{
        partIndex: number;
        name: string;
        bboxOnBase: {
            x: number;
            y: number;
            w: number;
            h: number;
        };
        atlasPages: Array<{
            file: string;
            columns: number;
            rows: number;
            count: number;
            tileW: number;
            tileH: number;
        }>;
    }>;
    frames: Array<{
        imageName: string;
        imageStem: string;
        frameIndex: number;
        parts: Array<{
            partIndex: number;
            pageIndex: number;
            tileIndex: number;
            atlasX: number;
            atlasY: number;
        }>;
    }>;
    /** Optional eye overlay described by the asset pipeline. */
    eyes?: {
        file: string;
        frameWidth: number;
        frameHeight: number;
        destX: number;
        destY: number;
        states: Array<{
            state: string;
            x: number;
            y: number;
            width: number;
            height: number;
        }>;
    };
};
/** Imperative handle returned via ref: call speak() / stop() from the parent. */
export type TalkingHeadHandle = {
    /**
     * Start playing audioBlob and animate the mouth in sync.
     * @param text    The spoken text (used as fallback timeline when alignment is absent).
     * @param audioBlob  Pre-fetched audio (mp3, wav, opus …).
     * @param alignment  Optional ElevenLabs character-level timing for accurate lip-sync.
     */
    speak(text: string, audioBlob: Blob, alignment?: CharacterAlignment | null): void;
    /** Stop playback immediately and reset to rest pose. */
    stop(): void;
    /** Character directory currently mounted for this TalkingHead instance. */
    avatarDir: string;
};
export type TalkingHeadProps = {
    /**
     * URL prefix to the avatar folder served from public/ (no trailing slash).
     * Must contain:
     *   base.webp                – static face background
     *   rest.webp                – idle pose (shown when not speaking)
     *   sprite_manifest.json     – crop layout produced by the pipeline
     *   atlases/part0_page0.webp – mouth frames atlas
     *   viseme_map.json          – (optional) viseme→frameIndex map for accurate lip-sync
     * Default: "/avatars/Lucy" (bundled with the SDK via talkyHeadsPlugin).
     */
    avatarDir?: string;
    /**
     * Current avatar state from the application.
     * When "SPEAKING", the canvas animates even without an active audio element.
     * Defaults to "IDLE".
     */
    state?: AvatarState;
    /** CSS class applied to the root element. */
    className?: string;
    /** Show source/dest rect overlays for calibration. Default false. */
    debug?: boolean;
    /** Fine-tune audio/lip-sync alignment in ms. Negative = mouth moves earlier. Default 0. */
    syncOffsetMs?: number;
    /**
     * Display shape of the avatar.
     * "circle" clips to a circle; "square" keeps the default rectangle.
     * Default: "square".
     */
    shape?: "circle" | "square";
    /**
     * Scale factor applied when drawing rest.webp, centred on the canvas.
     * Use a value slightly below 1 (e.g. 0.97) if rest.webp appears marginally
     * larger than the speaking composite — a pipeline asset framing difference.
     * Default: 1 (no adjustment).
     */
    restImageScale?: number;
    /**
     * When true, all cross-frame blending and smoothing is disabled (hard cuts
     * between sprite frames, no interpolation, no imageSmoothingEnabled).
     * Default: false (blending enabled).
     */
    disableBlending?: boolean;
    /**
     * Enable automatic eye-blink animation when an eye spritesheet is present in the
     * character's sprite_manifest.json. Set to false to disable blinking entirely.
     * Default: true.
     */
    blinkEnabled?: boolean;
    /** Notify parent when the internal audio-driven speaking state changes. */
    onSpeakingChange?: (speaking: boolean) => void;
};
export declare const TalkingHead: import("react").ForwardRefExoticComponent<TalkingHeadProps & import("react").RefAttributes<TalkingHeadHandle>>;
