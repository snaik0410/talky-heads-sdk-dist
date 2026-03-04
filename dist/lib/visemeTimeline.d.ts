/**
 * Mouth atlas config and viseme timeline helpers for TalkingHead avatar.
 * Edit layout, frame size, and mouthDestRect here or via calibration UI.
 */
export type MouthAtlasLayout = "row" | "grid";
export type MouthAtlasConfig = {
    /** Number of mouth frames in the atlas */
    frameCount: number;
    /** Width of one frame in the atlas image */
    frameWidth: number;
    /** Height of one frame in the atlas image */
    frameHeight: number;
    /** 'row' = single row (default), 'grid' = multi-row (cols inferred from frameCount) */
    layout: MouthAtlasLayout;
    /** Pixels between frames (horizontal and vertical) */
    padding: number;
};
/** Source rectangle in the atlas image for a single mouth frame */
export type SourceRect = {
    sx: number;
    sy: number;
    sw: number;
    sh: number;
};
/** Destination rectangle on the face (parent image) where the mouth is drawn */
export type MouthDestRect = {
    dx: number;
    dy: number;
    dw: number;
    dh: number;
};
/** Default atlas: 1 row, 8 mouth images. For 667×186 use frameWidth 83 (667÷8), frameHeight 186. */
export declare const DEFAULT_MOUTH_ATLAS: MouthAtlasConfig;
/**
 * Get the source rectangle in the atlas image for mouth frame at index.
 * index is 0..frameCount-1 (viseme 0..7).
 */
export declare function getMouthSourceRect(config: MouthAtlasConfig, index: number): SourceRect;
/**
 * Default mouth placement on the face (in parent image coordinates as 0–1 fractions).
 * Edit these to align the mouth overlay with the base face, or use the Calibration UI.
 * - dx, dy: position of mouth (left, top) as fraction of face width/height
 * - dw, dh: size of mouth overlay as fraction of face width/height
 */
export declare const DEFAULT_MOUTH_DEST_RECT: MouthDestRect;
/** Viseme event: t = seconds from start, v = mouth index 0..N-1 */
export type VisemeEvent = {
    t: number;
    v: number;
};
/** Result of interpolated viseme lookup: blend primary and secondary for coarticulation. */
export type InterpolatedViseme = {
    primaryIndex: number;
    secondaryIndex: number;
    /** 1 = only primary, 0.7 = 70% primary / 30% secondary (coarticulation at boundary) */
    primaryWeight: number;
};
/** Smoothstep for ease-in/ease-out (0 at 0, 1 at 1, smooth S-curve). */
export declare function smoothstep(x: number): number;
/** Minimum time (ms) to hold each viseme before allowing transition (reduces flicker). */
export declare const VISEME_HOLD_MS = 60;
/** Crossfade duration (ms) between consecutive visemes for smooth blending. */
export declare const CROSSFADE_MS = 80;
/**
 * Get current viseme index from timeline at time t (seconds).
 * Applies minimum hold (VISEME_HOLD_MS): don't switch to next viseme until hold has elapsed.
 * If no events, returns 0 (closed mouth).
 */
export declare function getVisemeAtTime(visemeEvents: VisemeEvent[], t: number): number;
export type InterpolatedVisemeOptions = {
    /** Coarticulation window in ms; blend toward next viseme in the last N ms of each segment. */
    blendWindowMs?: number;
    /** At segment boundary: primaryWeight = coarticulationPrimary (e.g. 0.7 = 70% current, 30% next). */
    coarticulationPrimary?: number;
};
/**
 * Get interpolated viseme state at time t for smooth, flicker-free rendering.
 * - Enforces hold + coarticulation: in the last blendWindowMs of a segment, eases toward next viseme (ease-in/ease-out).
 * - Returns primary + secondary indices and primaryWeight for client-side blending (60fps).
 */
export declare function getInterpolatedVisemeAtTime(visemeEvents: VisemeEvent[], t: number, options?: InterpolatedVisemeOptions): InterpolatedViseme;
/** Demo: cycle through all atlas visemes at this interval (seconds per frame). */
export declare const DEMO_VISEME_INTERVAL: number;
export type SingleImageFrame = {
    /** Left edge of this frame in the image (pixels) */
    x: number;
    /** Top edge of this frame in the image (pixels) */
    y: number;
    /** Width of this frame (pixels) */
    width: number;
    /** Height of this frame (pixels) */
    height: number;
    /** Viseme label (e.g. M, FV, TH, SZ, KG) */
    viseme: string;
    /** Phonemes for this viseme (e.g. "P, B, M") */
    phonemes: string;
};
export type SingleImageAtlasConfig = {
    /** URL to the single image (e.g. /janeDoe1.png) */
    imageUrl: string;
    /** One entry per head/frame; order = frame index 0, 1, 2, ... */
    frames: SingleImageFrame[];
};
/**
 * Permanent default for single-image avatar (e.g. janeDoe1.png).
 * Edit the x, y, width, height (pixels) and viseme/phonemes below to match your image.
 * These are used when "Use single image" is enabled and no calibration has been saved
 * (or after clicking Reset in the Calibrate mouth panel).
 */
export declare const DEFAULT_SINGLE_IMAGE_ATLAS: SingleImageAtlasConfig;
/** Returns the current single-image frames from code (used at draw time so dimensions are always from here). */
export declare function getSingleImageFrames(): SingleImageFrame[];
/** Minimum hold time per viseme (ms). Segments shorter than this are merged to reduce flicker. */
export declare const VISEME_MIN_HOLD_MS = 80;
/** Drop events that would create segments shorter than this (ms). */
export declare const VISEME_DROP_SEGMENT_MS = 50;
/**
 * Replace digit sequences in text with spoken word form so the talking head
 * can map them to visemes (e.g. "5" -> "five", "42" -> "forty-two").
 */
export declare function numbersToWords(text: string): string;
/**
 * Smooth viseme timeline: enforce minimum hold and drop very short segments.
 * - Drops events that create a segment < dropSegmentMs (merge with previous).
 * - Ensures each kept segment is at least minHoldMs.
 */
export declare function smoothVisemeTimeline(events: VisemeEvent[], minHoldMs?: number, dropSegmentMs?: number): VisemeEvent[];
/**
 * Build a viseme timeline from response text and audio duration.
 * frameCount defaults to DEFAULT_MOUTH_SPRITE_ATLAS.frames.length (16).
 * Pass a custom frameCount when the target atlas has a different number of frames.
 * Pause characters (.,!?;:\n) receive proportionally more time so REST events
 * are wide enough to survive smoothing and produce visible pauses between sentences.
 */
export declare function buildVisemeTimelineFromText(text: string, durationSeconds: number, frameCount?: number): VisemeEvent[];
export type MouthSpriteFrame = {
    /** Anchor point X absolute position in sprite sheet (pixels) */
    anchorX: number;
    /** Anchor point Y absolute position in sprite sheet (pixels) */
    anchorY: number;
    /** Distance from anchor point to left edge of frame (pixels) */
    widthLeft: number;
    /** Distance from anchor point to right edge of frame (pixels) */
    widthRight: number;
    /** Distance from anchor point to top edge of frame (pixels) */
    heightAbove: number;
    /** Distance from anchor point to bottom edge of frame (pixels) */
    heightBelow: number;
    viseme: string;
    phonemes: string;
};
/** Helper function to calculate x, y, width, height from anchor-based frame definition */
export declare function getFrameRect(frame: MouthSpriteFrame): {
    x: number;
    y: number;
    width: number;
    height: number;
};
export type MouthSpriteAtlasConfig = {
    imageUrl: string;
    frames: MouthSpriteFrame[];
};
export type MouthDestRectPx = {
    /** Anchor X position on parent image (absolute pixels) - all frames align to this */
    anchorX: number;
    /** Anchor Y position on parent image (absolute pixels) - all frames align to this */
    anchorY: number;
    /** Distance from anchor point to left edge of destination rect (pixels) */
    widthLeft: number;
    /** Distance from anchor point to right edge of destination rect (pixels) */
    widthRight: number;
    /** Row 1 (top row, frames 0–7): distance from anchor to top/bottom edge of destination rect (pixels) */
    heightAbove: number;
    heightBelow: number;
    /** Row 2 (bottom row, frames 8–15): destination height can differ. If set, used for frames 8–15. */
    heightAboveRow2?: number;
    heightBelowRow2?: number;
};
/** Helper function to calculate destination rect (x, y, width, height) from anchor-based definition */
export declare function getDestRect(dest: MouthDestRectPx): {
    x: number;
    y: number;
    width: number;
    height: number;
};
/** Destination rect for a specific frame index. Row 1 (0–7) uses heightAbove/heightBelow; row 2 (8–15) uses heightAboveRow2/heightBelowRow2 when set. */
export declare function getDestRectForFrame(dest: MouthDestRectPx, frameIndex: number): {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare const DEFAULT_MOUTH_SPRITE_ATLAS: MouthSpriteAtlasConfig;
export declare const DEFAULT_MOUTH_DEST_RECT_PX: MouthDestRectPx;
export type EyeState = "open" | "closed" | "smile" | "surprised" | "half";
export type EyeSpriteFrame = {
    x: number;
    y: number;
    width: number;
    height: number;
    state: EyeState;
};
export type EyeSpriteAtlasConfig = {
    imageUrl: string;
    frames: EyeSpriteFrame[];
};
export type EyeDestRectPx = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare const DEFAULT_EYE_SPRITE_ATLAS: EyeSpriteAtlasConfig;
export declare const DEFAULT_EYE_DEST_RECT_PX: EyeDestRectPx;
/** Range of frame numbers (1-based) to show for a single viseme, with optional labels. */
export type FullFaceVisemeRange = {
    startFrame: number;
    endFrame: number;
    /** Optional viseme name (e.g. "Rest", "Smile"). */
    viseme?: string;
    /** Optional phonemes (e.g. "P, B, M"). */
    phonemes?: string;
    /** Optional word or label (e.g. "M", "P, B"). */
    word?: string;
};
/**
 * Config for "human face" avatar: a folder of full-face images and a range of
 * image indices per viseme. For viseme index i, images from startFrame to endFrame
 * (inclusive, 1-based) are shown (e.g. female_mode1_frame1.png .. female_mode1_frame17.png).
 */
export type FullFaceConfig = {
    /** Folder path (under public/ or absolute). e.g. "model1" */
    folderPath: string;
    /** Filename prefix before the frame number. Usually empty ("") -> frames are "1.webp", "2.webp", … */
    imagePrefix: string;
    /** Image format extension without dot. Default "webp"; set "png" for PNG-only folders. */
    imageFormat?: "webp" | "png";
    /** One entry per viseme index (0..N-1). startFrame/endFrame are 1-based for single-image mode; for sprite-manifest mode they are 0-based frame indices into manifest.frames. */
    visemeRanges: FullFaceVisemeRange[];
    /**
     * When set, use stitched avatar (base + atlases) from find_common_regions_and_crops output.
     * Base path under public/ (e.g. "/avatars/model4/optimized"). Manifest is at {spriteManifestBaseUrl}/{spriteManifestGroup}/sprite_manifest.json.
     */
    spriteManifestBaseUrl?: string;
    /** Group folder name (e.g. "group_01"). Used only when spriteManifestBaseUrl is set. */
    spriteManifestGroup?: string;
};
/**
 * Fallback full-face config when backend does not supply one (e.g. offline or no character selected).
 * At runtime the UI should fetch config from GET /api/avatars/{name}/viseme-config and use that;
 * this constant is used only when the API is unavailable or as initial/fallback.
 */
export declare const DEFAULT_FULL_FACE_CONFIG: FullFaceConfig;
/** Raw structure of viseme_map.json written by the pipeline. */
export type VisemeMap = {
    /** Maps viseme name (e.g. "MBP", "FV") to list of atlas frameIndices for that viseme. */
    visemeFrames: Record<string, number[]>;
    /** Atlas frameIndices whose phoneme could not be resolved to a known viseme. */
    unknownFrames: number[];
};
/**
 * Pick a single representative frameIndex for a viseme.
 * Uses the middle frame to avoid edge/transition frames.
 */
export declare function pickVisemeFrame(frames: number[]): number;
/**
 * Build a phoneme → full frame-index array lookup from viseme_map.json.
 * Returns every frame the pipeline assigned to each phoneme (individual key
 * preferred over group key, same precedence as buildPhonemeFrameIndex).
 * Used by buildVisemeTimelineFromAlignmentAndMap to spread frames across the
 * phoneme's real time window instead of freezing on a single representative.
 */
export declare function buildPhonemeFrameArrays(visemeMap: VisemeMap): Record<string, number[]>;
/**
 * Build a phoneme-to-frameIndex lookup from viseme_map.json.
 *
 * Maps every known ARPAbet phoneme to the atlas frameIndex the pipeline
 * assigned to that viseme, so timeline functions produce frameIndices that
 * are valid for THIS character's sprite sheet.
 *
 * Phonemes that share a viseme get the same representative frameIndex.
 * Falls back to 0 for any phoneme not covered by the map.
 */
export declare function buildPhonemeFrameIndex(visemeMap: VisemeMap): Record<string, number>;
/**
 * Build a VisemeEvent timeline from ElevenLabs character alignment using
 * the per-character viseme map.
 *
 * Characters are grouped into words. Within each word only a thinned subset
 * of characters is used to drive mouth movement — specifically the first
 * character, every other (alternating) character in the middle, and the last
 * character. Each selected character's timing window is extended to cover the
 * skipped characters between it and the next selected one, so the mouth holds
 * each shape longer and avoids flickering too fast.
 *
 * Example: "Hello" → chars H e l l o → selected H(0) l(2) o(4)
 *   H gets 0→l_start, l gets l_start→o_start, o gets o_start→word_end
 */
export declare function buildVisemeTimelineFromAlignmentAndMap(alignment: CharacterAlignment, visemeMap: VisemeMap): VisemeEvent[];
/**
 * Build a VisemeEvent timeline from text + duration using the per-character
 * viseme map. Each text character is mapped to its ARPAbet phoneme via
 * ELEVENLABS_CHAR_TO_PHONEME and then to the character-specific atlas
 * frameIndex via buildPhonemeFrameIndex, producing mouth shapes that match
 * this character's actual sprite frames.
 */
export declare function buildVisemeTimelineFromTextAndMap(text: string, durationSeconds: number, visemeMap: VisemeMap): VisemeEvent[];
/** Character-level alignment from ElevenLabs with-timestamps API (for lip-sync). */
export type CharacterAlignment = {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
};
/**
 * Build a map from character (lowercase) to full-face viseme index using config.visemeRanges phonemes.
 * Each range's phonemes string (e.g. "IY, EH, E") is split; first character of each token maps to that range index.
 */
export declare function getCharToFullFaceVisemeMap(config: FullFaceConfig): Map<string, number>;
/**
 * Build a viseme timeline from ElevenLabs character alignment and full-face config.
 * Maps each character to a viseme index via config phonemes, uses real start times, merges consecutive same viseme, then smooths.
 */
export declare function buildVisemeTimelineFromAlignment(alignment: CharacterAlignment, config: FullFaceConfig): VisemeEvent[];
