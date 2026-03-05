import { type MouthSpriteAtlasConfig, type MouthDestRectPx, type EyeSpriteAtlasConfig, type EyeDestRectPx, type EyeState, type VisemeEvent, type VisemeMap } from "../lib/visemeTimeline";
export type TalkingHeadCanvasProps = {
    /**
     * URL of the base face image.  Defaults to /parent.png (served from public/).
     * Pass a character-specific URL such as "/avatars/face1/base.webp" to use
     * an asset produced by the processing pipeline.
     */
    baseImageUrl?: string;
    /**
     * Optional pre-composited idle/rest image (e.g. "rest.webp" next to base.webp).
     * Shown as-is when the avatar is not speaking, replacing base.webp + overlays.
     * Falls back to base.webp silently if this URL is absent or fails to load.
     */
    restImageUrl?: string;
    /**
     * Scale factor applied when drawing rest.webp, centred on the canvas.
     * Use a value slightly below 1 (e.g. 0.97) if rest.webp appears marginally
     * larger than the base + sprite composite — a common pipeline artefact where
     * the two images have the same pixel dimensions but slightly different face
     * framing. Default: 1 (draw at full canvas size, no adjustment).
     */
    restImageScale?: number;
    /** Optional audio element to sync viseme time to playback */
    audioEl?: HTMLAudioElement | null;
    /** Viseme timeline: t (seconds), v (mouth index 0..N-1). If not provided, demo loop when speaking. */
    visemeEvents?: VisemeEvent[];
    /** When true, mouth animates (timeline or demo loop); when false, show frame 0 (closed). */
    speaking?: boolean;
    /** Canvas width (defaults to parent image natural width) */
    width?: number;
    /** Canvas height (defaults to parent image natural height) */
    height?: number;
    /** Debug mode: draw dest rect outline and show sx/sy/sw/sh & dx/dy/dw/dh */
    debug?: boolean;
    /** Override atlas config (e.g. from calibration) */
    atlas?: MouthSpriteAtlasConfig;
    /** Override mouth destination rect in pixels (e.g. from calibration) */
    mouthDest?: MouthDestRectPx;
    /**
     * Multi-part overlays produced by parseManifest (one per character part).
     * When provided, supersedes the single atlas/mouthDest pair.
     * All parts animate in sync at the same frame index.
     */
    overlays?: Array<{
        atlas: MouthSpriteAtlasConfig;
        dest: MouthDestRectPx;
    }>;
    /**
     * Display shape of the avatar container.
     * "circle" clips the canvas to a circle; "square" uses the default rectangle.
     * Default: "square".
     */
    shape?: "circle" | "square";
    /** Mouth speed relative to audio: 1 = in sync, <1 = slower, >1 = faster (default 1) */
    mouthSpeed?: number;
    /** When set, show this frame on the parent (for calibration); overrides animation */
    previewMouthIndex?: number | null;
    /** Called when the current mouth index changes (for calibration UI) */
    onMouthIndexChange?: (index: number) => void;
    /** Eyes overlay: atlas config (default DEFAULT_EYE_SPRITE_ATLAS) */
    eyeAtlas?: EyeSpriteAtlasConfig;
    /** Eyes overlay: destination rect on parent (default DEFAULT_EYE_DEST_RECT_PX) */
    eyeDest?: EyeDestRectPx;
    /** Override current eye state (open/closed/smile/surprised/half); if set, blink is disabled */
    eyeState?: EyeState;
    /** Override current eye frame index (0..N-1); if set, blink is disabled */
    eyeFrameIndex?: number;
    /** Enable natural blinking when eyeState/eyeFrameIndex not set (default true) */
    blinkEnabled?: boolean;
    /** Sync offset in ms: t = audio.currentTime + syncOffsetMs/1000. Negative = mouth earlier. Default 0. */
    syncOffsetMs?: number;
    /** Called periodically with current audio time, offset, and viseme index (for calibration UI). */
    onTick?: (info: {
        audioTimeSec: number;
        syncOffsetSec: number;
        visemeIndex: number;
    }) => void;
    /**
     * viseme_map.json data for this character. When provided, VisemeEvent.v is
     * treated as a direct atlas frameIndex (not a range-array index). Also used
     * to compute the REST frameIndex for pause/idle detection.
     */
    visemeMap?: VisemeMap;
    className?: string;
    /** Inline styles applied to the root container. Use for explicit dimensions. */
    style?: React.CSSProperties;
    /**
     * When true, all cross-frame blending and smoothing is disabled:
     * - ROI crossfade between viseme sprites is skipped (hard cuts between frames)
     * - Interpolated coarticulation blend is skipped (jump straight to the target frame)
     * - Canvas imageSmoothingEnabled is set to false
     * - The brightness/contrast/saturate filter on sprite draws is removed
     * Default: false (blending enabled).
     */
    disableBlending?: boolean;
    /** Notify parent whenever critical assets (base + mouth atlases) finish loading. */
    onAssetsReady?: (ready: boolean) => void;
};
export declare function TalkingHeadCanvas({ baseImageUrl: baseImageUrlProp, restImageUrl: restImageUrlProp, restImageScale, shape, audioEl, visemeEvents, speaking, width: widthProp, height: heightProp, debug, atlas: atlasOverride, mouthDest: mouthDestOverride, overlays: overlaysProp, mouthSpeed: mouthSpeedProp, previewMouthIndex, onMouthIndexChange, eyeAtlas: eyeAtlasOverride, eyeDest: eyeDestOverride, eyeState: eyeStateOverride, eyeFrameIndex: eyeFrameIndexOverride, blinkEnabled, syncOffsetMs, onTick, visemeMap: visemeMapProp, className, style, disableBlending, onAssetsReady, }: TalkingHeadCanvasProps): import("react/jsx-runtime").JSX.Element;
