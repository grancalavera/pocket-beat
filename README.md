# Pocket Beat

Pocket Beat is a simple Progressive Web App (PWA) that lets users store and play audio files locally on their mobile devices. It works fully offline by leveraging browser storage APIs and service workers.

## Features

- Add/import audio files from local device
- Store audio files in persistent local storage
- Play, pause, seek, and delete audio tracks
- Offline-first experience: all functionality available without network
- Simple, responsive UI optimized for mobile devices
- Installable to home screen via PWA manifest

## Architecture Overview

1. App Shell: HTML/CSS/JS UI for file management and playback
2. Service Worker: handles caching of static assets and offline routing
3. Storage Layer: IndexedDB (via localForage or Dexie.js) to store binary audio blobs
4. Audio Playback: HTML5 `<audio>` element or Howler.js / Web Audio API
5. Manifest: defines PWA installability, icons, display modes

## Implementation Ideas

### 1. PWA Setup

- Create `manifest.json` with name, icons, start_url, display mode (`standalone`), theme colors
- Register a service worker (`sw.js`) in the main script
- Precache static assets (HTML, CSS, JS, icons)

### 2. Offline Caching Strategy

- Cache app shell (static)
- Use Cache API or Workbox for routing:
  - `NetworkFirst` for manifest and dynamic content if needed
  - `CacheFirst` for static assets
- Fallback to cached shell when offline

### 3. Audio Storage

- Use IndexedDB directly or via a wrapper:
  - localForage (simple API for key–value, stores blobs seamlessly)
  - Dexie.js (more powerful IndexedDB wrapper)
- Store each audio file as a blob with metadata (id, name, size, dateAdded)
- Manage storage quota: detect storage usage and prompt user to free space if needed

### 4. File Import & Management

- Provide a file input or drag-and-drop area to import audio (`<input type="file" accept="audio/*" multiple>`)
- Read files as blobs
- Save to IndexedDB storage layer
- Display a list of stored tracks with metadata
- Allow deletion of tracks to release space

### 5. Audio Playback

- Use an `<audio>` element for basic playback controls
- Or integrate Howler.js / Web Audio API for advanced features:
  - Custom play/pause buttons, progress bar, seeking
  - Preloading and decoding for smooth playback
- Ensure UI reflects playback state (playing, paused, ended)

### 6. UI & UX Considerations

- Responsive layout: list view for tracks, playback controls at bottom
- Provide visual feedback for import progress
- Show offline/online status
- Confirm before deleting a track

## Technology Stack

- JavaScript (ES6+)
- HTML5 & CSS3 (responsive design, flexbox/grid)
- Service Worker & Cache API
- IndexedDB (via localForage or Dexie.js)
- Optional: Workbox for simplified service worker setup
- Optional: Howler.js for enhanced audio playback

## Next Steps

1. Scaffold project with a basic HTML, CSS, and JS setup
2. Implement service worker with caching strategies
3. Integrate IndexedDB wrapper for storage
4. Build UI for file import and track listing
5. Add audio playback controls
6. Test on mobile devices (iOS & Android) and ensure offline functionality
7. Deploy via GitHub Pages, Netlify, or similar
