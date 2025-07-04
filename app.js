/* Main application logic for Pocket Beat */
document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('Service Worker registered'))
      .catch(err => console.error('Service Worker registration failed:', err));
  }
  initApp();
});

async function initApp() {
  try {
    await storage.initDB();
    renderTrackList();
    document.getElementById('fileInput').addEventListener('change', handleFiles);
  } catch (err) {
    console.error('Failed to initialize storage:', err);
  }
}

async function handleFiles(event) {
  const files = Array.from(event.target.files || []);
  for (const file of files) {
    try {
      await storage.addTrack(file);
    } catch (err) {
      console.error('Failed to store file', file.name, err);
    }
  }
  event.target.value = '';
  renderTrackList();
}

async function renderTrackList() {
  const listEl = document.getElementById('trackList');
  listEl.innerHTML = '';
  let tracks = [];
  try {
    tracks = await storage.getAllTracks();
  } catch (err) {
    console.error('Failed to retrieve tracks', err);
  }
  tracks.sort((a, b) => b.dateAdded - a.dateAdded);
  for (const track of tracks) {
    const li = document.createElement('li');
    li.className = 'track-item';
    const nameSpan = document.createElement('span');
    nameSpan.textContent = track.name;
    li.appendChild(nameSpan);
    const playBtn = document.createElement('button');
    playBtn.textContent = 'Play';
    playBtn.addEventListener('click', () => playTrack(track.id));
    li.appendChild(playBtn);
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', async () => {
      if (confirm(`Delete "${track.name}"?`)) {
        await storage.deleteTrack(track.id);
        renderTrackList();
      }
    });
    li.appendChild(deleteBtn);
    listEl.appendChild(li);
  }
}

async function playTrack(id) {
  try {
    const track = await storage.getTrack(id);
    if (!track) return;
    const audio = document.getElementById('audioPlayer');
    const url = URL.createObjectURL(track.blob);
    audio.src = url;
    audio.play();
  } catch (err) {
    console.error('Failed to play track', err);
  }
}