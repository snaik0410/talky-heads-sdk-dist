/** Avatar state model per spec §4 Avatar State Model */
export type AvatarState = "IDLE" | "LISTENING" | "THINKING" | "SPEAKING";
/**
 * Derive avatar state from application events.
 * - IDLE: no activity
 * - LISTENING: user speaking (voice input active)
 * - THINKING: AI generating response (loading)
 * - SPEAKING: AI audio playing
 */
export declare function deriveAvatarState(loading: boolean, speakingAgent: string | null, listening: boolean): AvatarState;
