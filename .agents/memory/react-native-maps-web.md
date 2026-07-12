---
name: react-native-maps on web
description: react-native-maps has no web build and breaks Metro web bundling if imported outside a platform-specific file; use the .native.tsx/.tsx split pattern.
---

`react-native-maps` internally imports native-only React Native modules (e.g. `codegenNativeCommands`), which are not available in the web bundle. Any file that imports `react-native-maps` directly and is also reachable from the web build (Expo apps in this project run web too) causes Metro to fail bundling with "Importing native-only module ... on web", taking down the entire app on web — not just the map screen.

**Why:** Expo Go / Expo web preview shares one route tree; a single bad import anywhere in the import graph reachable by the web platform breaks the whole app, not just the offending component.

**How to apply:** Never import `react-native-maps` in a plain `.tsx` file that's part of the shared/universal component tree. Instead, create two files with the same export name:
- `ComponentName.native.tsx` — the real implementation using `react-native-maps` (MapView/Marker/Polyline). Used automatically on iOS/Android.
- `ComponentName.tsx` — a web-safe fallback with no `react-native-maps` import (e.g. a static illustration, existing non-map visual, or a "available on mobile" notice). Metro picks this for web since no `.web.tsx` exists.

Consumers just `import { ComponentName } from '@/components/ComponentName'` — the bundler resolves the right file per platform. Verify by restarting the Expo workflow and screenshotting the web preview after any change touching `react-native-maps` imports; a bundling crash shows as a blank white screen with a 500 error in browser console logs.
