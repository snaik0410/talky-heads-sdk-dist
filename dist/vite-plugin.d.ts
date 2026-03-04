/**
 * Vite plugin for talky-heads-sdk.
 * Automatically copies bundled avatar assets to public/avatars/ on dev/build.
 *
 * Usage:
 *   // vite.config.ts
 *   import { talkyHeadsPlugin } from 'talky-heads-sdk/vite';
 *   export default defineConfig({
 *     plugins: [react(), talkyHeadsPlugin()],
 *   });
 */
import type { Plugin } from "vite";
export interface TalkyHeadsPluginOptions {
    /**
     * Destination folder relative to project root.
     * Default: "public/avatars"
     */
    destDir?: string;
    /**
     * Whether to copy assets. Set to false to disable.
     * Default: true
     */
    copyAssets?: boolean;
}
/**
 * Copies the bundled Lucy avatar from node_modules to public/avatars/
 * so it's served at /avatars/Lucy automatically.
 */
export declare function talkyHeadsPlugin(options?: TalkyHeadsPluginOptions): Plugin;
export default talkyHeadsPlugin;
