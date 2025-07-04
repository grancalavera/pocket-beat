/* IndexedDB wrapper for storing audio tracks */
const storage = (() => {
  const DB_NAME = 'pocket-beat-db';
  const STORE_NAME = 'tracks';
  let db;

  function initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = event => {
        db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('date', 'dateAdded', { unique: false });
        }
      };
      request.onsuccess = event => {
        db = event.target.result;
        resolve();
      };
      request.onerror = event => reject(event.target.error);
    });
  }

  function addTrack(file) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record = {
        name: file.name,
        size: file.size,
        dateAdded: Date.now(),
        blob: file
      };
      const req = store.add(record);
      req.onsuccess = () => resolve();
      req.onerror = event => reject(event.target.error);
    });
  }

  function getAllTracks() {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = event => reject(event.target.error);
    });
  }

  function getTrack(id) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = event => reject(event.target.error);
    });
  }

  function deleteTrack(id) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = event => reject(event.target.error);
    });
  }

  return { initDB, addTrack, getAllTracks, getTrack, deleteTrack };
})();