# Raasta

Raasta is a community-powered public transit app for Pakistan — instead of GPS trackers on buses, riders' own phones (during trips they take and report) build up accurate routes, fares, and arrival times for everyone else.

## Run & Operate

- Mobile app (primary product): workflow `artifacts/mobile: expo` — `pnpm --filter @workspace/mobile run dev`
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- No database or backend is used yet — the mobile app is frontend-only with local persistence (see below).

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo (expo-router, React Native), `artifacts/mobile`
- Local persistence: AsyncStorage (no backend/database wired up yet)
- Also present but not the active product: `artifacts/raasta` (react-vite web scaffold, unbuilt/unused) and `artifacts/api-server` (default Express scaffold, unbuilt/unused)

## Where things live

- `artifacts/mobile/app/` — screens (expo-router file-based routing): onboarding, `(tabs)` (Home, Trips, Rewards, Profile), results, live-ride, fare-report, safety
- `artifacts/mobile/context/AppContext.tsx` — all app state (onboarding flag, saved places, recent searches, trip history, points, settings, active trip) persisted to AsyncStorage
- `artifacts/mobile/lib/routes.ts` — deterministic mock route/fare generator (Saver/Express/Comfort options); stands in for the real crowdsourced backend
- `artifacts/mobile/components/RouteVisual.tsx` — animated stop-by-stop route visualization used on Home (teaser) and Live Ride (driven by real progress)
- `artifacts/mobile/constants/colors.ts` — theme tokens (emerald/marigold/vermillion palette) plus `route` accent colors per route type

## Architecture decisions

- No live GPS/backend exists yet, so "live ride" tracking is a client-side simulated progress bar (compressed ETA) rather than real bus positions — avoids presenting fake real-time data as real.
- Safety/SOS is implemented as a real `Linking.openURL('sms:...')` with the rider's live coordinates (via expo-location), not a simulated/fake alert — trust-critical flows use genuine device capabilities only.
- Route options are generated deterministically from a hash of the From/To text, so the same search always returns the same options during this MVP phase.

## Product

- Search a route (From auto-filled via device location, To free text) and get 3 route options (Saver/Express/Comfort) with fare range, ETA, transfers, and walk distance.
- Boarding guidance → simulated live ride with an animated stop-by-stop progress view → end-trip fare reporting (earns points).
- Trip history, a points/badges rewards screen, saved Home/Work places, preferences, and a Safety Center (emergency contact + SOS via SMS with live location).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `artifacts/raasta` (web) and `artifacts/api-server` exist from initial scaffolding but were superseded when the user asked for the product as an Expo mobile app — they are not part of the active Raasta product.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
