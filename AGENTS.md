# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

Pomello is an Electron-based Pomodoro desktop application built with a monorepo architecture using pnpm workspaces. The app integrates with task management services (Trello, Zen, etc.) to help users track pomodoros against their tasks.

## Architecture

### Monorepo Structure

The codebase uses a pnpm workspace with four packages:

- **packages/main**: Electron main process (Node.js runtime)
  - Handles app lifecycle, window management, menu creation
  - Manages stores (electron-store) and app configuration
  - Implements auto-updates via electron-updater
  - Logging via winston

- **packages/renderer**: Electron renderer process (SolidJS UI)
  - Multiple entry points: app.html, auth.html, dashboard.html, select.html
  - SolidJS for reactive UI with @tanstack/solid-query for data fetching
  - SCSS for styling
  - Tests with Vitest + SolidJS Testing Library
  - MSW for API mocking in tests

- **packages/preload**: Electron preload scripts
  - Bridges main and renderer processes securely via contextBridge
  - Exposes safe IPC methods to renderer

- **packages/domain**: Shared domain types and models
  - TypeScript types and interfaces shared across all packages
  - No runtime code, pure type definitions
  - Imported as `@pomello-desktop/domain` in other packages

### Key Design Patterns

**Service Architecture**: The app uses a plugin-like service system where each task management integration (Trello, Zen, Mock) is a separate service implementing the `ServiceFactory` interface. Services are registered in `packages/renderer/src/services/index.tsx` and provide task selection, creation, and management capabilities.

**IPC Communication**: Main and renderer processes communicate via Electron IPC. The preload scripts expose a `window.app` API that renderer processes use to call main process functions. Event-based updates flow from main to renderer.

**Store Management**: Main process uses electron-store for persistent configuration. The app has separate stores for settings, pomello config, and service-specific configs managed by StoreManager.

**Context Providers**: The renderer uses nested SolidJS context providers (RuntimeProvider, ServiceProvider, PomelloProvider, etc.) to manage global state and dependencies throughout the UI.

## Common Commands

### Development

```bash
# Start dev server with hot reload
pnpm start

# Build all packages
pnpm build

# Compile Electron app to dist/ (no packaging)
pnpm compile
```

### Code Quality

```bash
# Run all linters (ESLint + Stylelint)
pnpm lint

# Check formatting (Prettier)
pnpm format

# Format code
pnpm format:check

# Type check all packages
pnpm typecheck

# Run all verification checks
pnpm verify
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode (renderer package only)
cd packages/renderer && pnpm test

# Run specific test file
cd packages/renderer && pnpm test path/to/file.spec.tsx

# Run tests with UI
cd packages/renderer && pnpm test --ui
```

Tests are only in the renderer package. Use `.spec.tsx` or `.spec.ts` extension for test files.

### Package Management

```bash
# Sort package.json files
pnpm package:format

# Check if package.json files are sorted
pnpm package:check
```

## Working with the Codebase

### Adding a New Service Integration

1. Create a new directory in `packages/renderer/src/services/[service-name]/`
2. Implement a ServiceFactory that returns a Service object
3. Register it in `packages/renderer/src/services/index.tsx`
4. Service must provide methods like `initialize`, `getSelectItems`, `onTaskStart`, etc.

### Adding New Types

Add shared types to `packages/domain/src/` and export them from `packages/domain/src/index.ts`. These types are accessible in all packages via `@pomello-desktop/domain`.

### Main Process Development

When modifying main process code in `packages/main/`, changes trigger a rebuild via Vite watch mode (scripts/start.js). The Electron app automatically restarts to reflect changes.

### Renderer Process Development

The renderer uses Vite dev server with HMR. Changes to renderer code hot-reload without restarting the app. Multiple windows (app, auth, dashboard, select) are built from separate HTML entry points defined in vite.config.js.

### IPC Changes

When adding IPC methods:
1. Add handler in main process (packages/main/src/helpers/initializeListeners.ts or events/)
2. Expose via preload script (packages/preload/src/)
3. Add TypeScript definition to window.app interface in types/

## Build and Release

The app uses electron-builder for packaging. Configuration is in `.electron-builder.config.cjs`. Releases are deployed to S3 with auto-update support.

Environment variables are loaded from `.env` file at project root (not in version control). See README.md for required deployment variables.

## Technology Stack

- **Runtime**: Electron 40
- **UI Framework**: SolidJS 1.9
- **Build Tool**: Vite 7
- **Package Manager**: pnpm 10
- **Styling**: SCSS
- **Testing**: Vitest + SolidJS Testing Library + MSW
- **Data Fetching**: @tanstack/solid-query
- **Routing**: @solidjs/router
- **State Management**: SolidJS stores (immer for immutability)
