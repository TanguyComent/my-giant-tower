# rbxts-template

A Roblox TypeScript template built around:

- `roblox-ts`
- `Flamework` (services/controllers/components)
- `Rojo` (Studio sync)
- `Charm` + `charm-sync` (reactive state and replication)
- `React Roblox` (UI)
- `ProfileStore` (data persistence)

It is designed for multi-place projects with a shared `common` code layer and per-place code.

## What This Template Provides

- Multi-place structure (`places/common` + `places/<your-place>`)
- Place scaffolding script (`createPlace`) from a `PLACE_NAME` template
- Flamework bootstrap for client and server
- Typed networking contracts (client/server events + functions)
- Profile/session management with migration support
- Marketplace helpers:
  - developer product receipt processing hook
  - game pass ownership sync
  - game pass/dev product price fetchers
- Client systems examples:
  - local session synchronization
  - custom proximity prompts
  - backpack controller + UI interface
  - transient message UI handler
- Shared utility and type helpers (`shared/utils`, `TypeWrapper.utils.ts`)

## Repository Layout

```text
places/
  common/
    src/
      client/      # shared client controllers/interfaces/state
      server/      # shared server services/migrations
      shared/      # constants, network declarations, models, utils
  PLACE_NAME/      # template used by createPlace script
    src/
      client/      # place-specific client code
      server/      # place-specific server code
      shared/      # place-specific shared code
```

Key files:

- `package.json`: project scripts and dependencies
- `aftman.toml`: managed tool versions (Rojo)
- `bin/createPlace.sh`: clones `places/PLACE_NAME` into a new place
- `bin/startCompiler.sh`: watch compile for a place
- `bin/startRojoSync.sh`: Rojo server for a place
- `places/PLACE_NAME/PLACE_NAME.project.json`: Rojo tree mapping

## Prerequisites

- Node.js + npm
- A shell that can execute `sh` scripts
  - On Windows: Git Bash or WSL is recommended
- Roblox Studio
- Rojo plugin in Roblox Studio (to connect with `rojo serve`)

Optional but recommended:

- `aftman` to install pinned tools from `aftman.toml`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Aftman tools (Rojo):

```bash
aftman install
```

3. Create your first place from template:

```bash
npm run createPlace -- MyPlace 34872
```

Arguments:

- `MyPlace`: folder name under `places/`
- `34872`: Rojo serve port injected into `<place>.project.json`

The script copies `places/PLACE_NAME` and replaces:

- `PLACE_NAME` placeholder in paths/content
- `-9999` placeholder in the Rojo port field

## Development Workflow

In one terminal, start TypeScript watch compilation:

```bash
npm run dev -- MyPlace
```

In a second terminal, start Rojo sync:

```bash
npm run rojo -- MyPlace
```

In Roblox Studio:

1. Open your `.rbxl`/`.rbxlx` place
2. Connect Rojo plugin to `localhost:<port>` (the place port)

For a one-shot compile:

```bash
npm run build -- MyPlace
```

## How Code Is Composed In Studio

`<place>.project.json` maps compiled output to Roblox services:

- `out/common/src/shared` -> `ReplicatedStorage/CommonShared`
- `out/<place>/src/shared` -> `ReplicatedStorage/PlaceShared`
- `out/common/src/server` -> `ServerScriptService/CommonServer`
- `out/<place>/src/server` -> `ServerScriptService/PlaceServer`
- `out/common/src/client` -> `StarterPlayerScripts/CommonClient`
- `out/<place>/src/client` -> `StarterPlayerScripts/PlaceClient`

## Flamework Bootstrap

Place entrypoints register shared and place paths then call `Flamework.ignite()`:

- `places/PLACE_NAME/src/client/main.client.ts`
- `places/PLACE_NAME/src/server/main.server.ts`

This means you can add controllers/services/components in both `common` and the place folder.

## Built-in Systems

### 1. Profile and Session Data

Files:

- `places/common/src/server/services/Profile.service.ts`
- `places/common/src/shared/profileStore/UserTemplate.ts`
- `places/common/src/server/migrations/*`

Features:

- Loads player profiles with `ProfileStore`
- Keeps an in-memory session map
- Syncs selected field updates to the client via typed events
- Tracks playtime (`OnTick`)
- Includes migration manager abstraction (`MigrationManager`)
- Supports daily stats reset logic with client UTC offset callback

### 2. Typed Networking

Files:

- `places/common/src/shared/network/commonNetwork.ts`
- `places/PLACE_NAME/src/shared/network/network.ts`

Pattern:

- Declare events/functions once in shared
- Instantiate server/client endpoints in each runtime side
- Keep payloads typed end-to-end

### 3. Marketplace Integration Skeleton

Files:

- `places/PLACE_NAME/src/server/services/Market.service.ts`
- `places/common/src/server/services/Player.service.ts`
- `places/common/src/server/services/ProductPrices.service.ts`

Features:

- Receipt processing entrypoint (`purchaseCallbacks` map)
- Purchase logging in player profile
- Game pass ownership update hook
- Periodic product/game pass price fetch into Charm atoms

### 4. Charm and Charm-Sync Replication

Files:

- `places/PLACE_NAME/src/shared/atoms/SharedAtoms.ts`
- `places/PLACE_NAME/src/server/services/CharmSync.service.ts`
- `places/PLACE_NAME/src/client/controllers/CharmSync.controller.ts`

Features:

- Server-side atom sync payload dispatch
- Client hydration + live atom updates
- Enum key normalization after replication

### 5. Client UX Examples

Files:

- `places/common/src/client/controllers/Backpack.controller.ts`
- `places/common/src/client/interfaces/backpack/*`
- `places/common/src/client/controllers/CustomProximityPrompts.controller.ts`
- `places/common/src/client/interfaces/proximity-prompts/*`
- `places/common/src/client/interfaces/messages-handler/*`

Features:

- Backpack hotbar/inventory state model and tool equip flow
- Custom styleable proximity prompts (`style` attribute)
- Message handler system for success/error UI feedback

## Customization Guide

### Add a New Place

1. Run `npm run createPlace -- NewPlace 34873`
2. Add gameplay code under `places/NewPlace/src/*`
3. Start watch + rojo for `NewPlace`

### Add a New Profile Schema Version

1. Create a new migration under `places/common/src/server/migrations/`
2. Register it in your migration setup
3. Increment `currentVersion` in new data shape
4. Update user template/session interfaces as needed

### Add Developer Products

1. Add product IDs in `places/common/src/shared/marketplace/EDevProducts.ts`
2. Implement callback(s) in `Market.service.ts` and wire `purchaseCallbacks`
3. Use `Player.service.ts` helpers to mutate profile-backed state

### Add Game Passes

1. Add IDs in `places/common/src/shared/marketplace/EGamePasses.ts`
2. Handle ownership effects in gameplay/services
3. Use `addGamePass` helper where appropriate

## Notes and Caveats

- `GlobalConfig.ts` contains placeholder IDs (`RELEASE_PLACE_ID`, `DEVELOP_PLACE_ID`) and should be configured for your game.
- The npm scripts call `sh` files, so on Windows use Git Bash/WSL or adapt scripts to PowerShell.
- `out/` folders are generated artifacts. Prefer editing `src/` files only.

## Useful Commands

```bash
# scaffold place
npm run createPlace -- <PlaceName> <RojoPort>

# compile watch for a place
npm run dev -- <PlaceName>

# start rojo for a place
npm run rojo -- <PlaceName>

# one-shot build
npm run build -- <PlaceName>
```

## License

MIT (`package.json`)
