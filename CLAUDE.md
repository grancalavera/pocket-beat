# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Since this is a vanilla JavaScript PWA, there are no build tools or test frameworks configured. The project runs directly in the browser:

- **Development**: Open `index.html` in a browser or serve via a local HTTP server
- **Testing**: Manual testing in browser (no automated test suite exists)

## Architecture Overview

Pocket Beat is a Progressive Web App (PWA) for offline audio storage and playback. The architecture consists of:

### Core Components

1. **App Shell** (`index.html`, `styles.css`): Basic UI structure and responsive design
2. **Application Logic** (`app.js`): Main entry point, handles file import, track management, and playback
3. **Storage Layer** (`storage.js`): IndexedDB wrapper using vanilla JS promises for audio blob storage
4. **Service Worker** (`sw.js`): Implements cache-first strategy for offline functionality
5. **PWA Manifest** (`manifest.json`): Defines installability and PWA metadata

### Data Flow

- Audio files are imported via file input and stored as blobs in IndexedDB
- Track metadata includes: `id`, `name`, `size`, `dateAdded`, and `blob`
- Playback uses HTML5 `<audio>` element with blob URLs created from stored files
- All functionality works offline once assets are cached

### Storage Architecture

The app uses a custom IndexedDB wrapper (`storage.js`) with:
- Database: `pocket-beat-db`
- Object Store: `tracks` (keyPath: 'id', autoIncrement: true)
- Index: `date` on `dateAdded` field

### Key Design Patterns

- **Module Pattern**: `storage.js` uses IIFE to expose a clean API
- **Promise-based**: All async operations use native Promises
- **Offline-first**: Service worker caches all static assets for offline access
- **Progressive Enhancement**: Core functionality works without service worker

## Important Implementation Details

- No external dependencies or build tools - pure vanilla JavaScript
- IndexedDB operations are wrapped in Promises for easier async handling
- Service worker uses cache-first strategy with fallback to network
- Audio playback creates temporary blob URLs that should be cleaned up (currently not implemented)
- File import accepts multiple files and processes them sequentially