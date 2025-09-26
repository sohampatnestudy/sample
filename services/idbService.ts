
import { StudySession } from '../types';

const DB_NAME = 'JEECompanionDB';
const DB_VERSION = 1;
const STORE_NAME = 'studySessions';

class IndexedDBManager {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  private async getStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = await this.dbPromise;
    return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
  }

  async saveSession(session: StudySession): Promise<void> {
    const store = await this.getStore('readwrite');
    store.put(session);
  }

  async getSession(id: string): Promise<StudySession | undefined> {
    const store = await this.getStore('readonly');
    return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
  }

  async getLastSession(): Promise<StudySession | undefined> {
    const store = await this.getStore('readonly');
    return new Promise((resolve, reject) => {
      const cursorRequest = store.openCursor(null, 'prev');
      cursorRequest.onerror = () => reject(cursorRequest.error);
      cursorRequest.onsuccess = () => {
        resolve(cursorRequest.result ? cursorRequest.result.value : undefined);
      };
    });
  }
  
  async clearAllSessions(): Promise<void> {
    const store = await this.getStore('readwrite');
    store.clear();
  }
}

export const sessionManager = new IndexedDBManager();
