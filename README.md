# talky-heads-sdk

A React component library for rendering **animated talking-head avatars** with real-time lip-sync, driven by audio from any TTS provider.

## Features

- 🎭 Animated avatar with realistic lip-sync
- 🔊 Works with ElevenLabs, Google TTS, or any audio source
- ⚡ Zero-config setup with bundled "Lucy" avatar
- 🎨 Customizable shapes (circle/square) and styling
- 📦 Vite plugin for automatic asset copying

## Install

```bash
npm install talky-heads-sdk
```

**Peer dependencies:** React 18+

## Quick Start

### 1. Add the Vite plugin (Vite projects)

```ts
// vite.config.ts
import { talkyHeadsPlugin } from "talky-heads-sdk/vite";

export default {
  plugins: [talkyHeadsPlugin()],
};
```

### 2. Use the component

```tsx
import { useRef } from "react";
import { TalkingHead, type TalkingHeadHandle } from "talky-heads-sdk";

function App() {
  const headRef = useRef<TalkingHeadHandle>(null);

  async function speak(text: string) {
    // Get audio from your TTS provider
    const audioBlob = await fetchAudioFromYourTTS(text);
    headRef.current?.speak(text, audioBlob);
  }

  return (
    <TalkingHead
      ref={headRef}
      state="IDLE"
      shape="circle"
      className="w-48 h-48"
    />
  );
}
```

## Non-Vite Projects

Copy the bundled avatar assets manually:

```bash
# macOS/Linux
cp -r node_modules/talky-heads-sdk/assets/avatars/Lucy public/avatars/

# Windows
Copy-Item -Recurse node_modules\talky-heads-sdk\assets\avatars\Lucy public\avatars\
```

## API Reference

### TalkingHead Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ref` | `TalkingHeadHandle` | — | Required for `.speak()` and `.stop()` |
| `avatarDir` | `string` | `"/avatars/Lucy"` | Path to avatar assets |
| `state` | `AvatarState` | `"IDLE"` | `"IDLE"` \| `"LISTENING"` \| `"THINKING"` \| `"SPEAKING"` |
| `shape` | `string` | `"square"` | `"circle"` or `"square"` |
| `className` | `string` | `""` | CSS class |
| `syncOffsetMs` | `number` | `0` | Fine-tune lip-sync timing (ms) |
| `onSpeakingChange` | `(speaking: boolean) => void` | — | Callback when speaking starts/stops |
| `onError` | `(error: string) => void` | — | Callback when avatar fails to load |

### Ref Methods

```tsx
headRef.current?.speak(text, audioBlob, alignment?);  // Start speaking
headRef.current?.stop();                               // Stop immediately
```

## TTS Integration

For the best lip-sync quality, use ElevenLabs with the `/with-timestamps` endpoint:

```tsx
import { useTTS } from "talky-heads-sdk";

const { synthesize } = useTTS({
  mode: "proxy",
  proxyUrl: "http://your-backend:3001",
  provider: "elevenlabs",
});

const { audioBlob, alignment } = await synthesize(text);
headRef.current?.speak(text, audioBlob, alignment ?? undefined);
```

## License

MIT © Talky Heads
