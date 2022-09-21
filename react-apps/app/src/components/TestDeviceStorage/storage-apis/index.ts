abstract class StorageApi {
  abstract STORAGE_TYPE: string;
  abstract get(key: string): Promise<string | null>;
  abstract set(key: string, value: string): Promise<void>;
  abstract remove(key: string): Promise<void>;
  abstract clear(): Promise<void>;
}

class LocalStorageApi extends StorageApi {
  public STORAGE_TYPE = 'localStorage';

  get(key: string): Promise<string | null> {
    return Promise.resolve(localStorage.getItem(key));
  }

  set(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
    return Promise.resolve();
  }

  remove(key: string): Promise<void> {
    localStorage.removeItem(key);
    return Promise.resolve();
  }

  clear(): Promise<void> {
    localStorage.clear();
    return Promise.resolve();
  }
}

class SessionStorageApi extends StorageApi {
  public STORAGE_TYPE = 'sessionStorage';

  get(key: string): Promise<string | null> {
    return Promise.resolve(sessionStorage.getItem(key));
  }

  set(key: string, value: string): Promise<void> {
    sessionStorage.setItem(key, value);
    return Promise.resolve();
  }

  remove(key: string): Promise<void> {
    sessionStorage.removeItem(key);
    return Promise.resolve();
  }

  clear(): Promise<void> {
    sessionStorage.clear();
    return Promise.resolve();
  }
}

class IndexedDbStorageApi extends StorageApi {
  public STORAGE_TYPE = 'indexedDb';

  private db: IDBDatabase | null = null;

  private openDb(): Promise<IDBDatabase> {
    if (this.db) {
      return Promise.resolve(this.db);
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open('test-device-storage', 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore('test-device-storage', {
          keyPath: 'key',
        });
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  private getStore(): Promise<IDBObjectStore> {
    return this.openDb().then((db) => {
      return db
        .transaction('test-device-storage', 'readwrite')
        .objectStore('test-device-storage');
    });
  }

  get(key: string): Promise<string | null> {
    return this.getStore().then((store) => {
      return new Promise((resolve, reject) => {
        const request = store.get(key);

        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest).result?.value);
        };

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  set(key: string, value: string): Promise<void> {
    return this.getStore().then((store) => {
      return new Promise((resolve, reject) => {
        const request = store.put({ key, value });

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  remove(key: string): Promise<void> {
    return this.getStore().then((store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(key);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  clear(): Promise<void> {
    return this.getStore().then((store) => {
      return new Promise((resolve, reject) => {
        const request = store.clear();

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }
}

class CacheStorageApi extends StorageApi {
  public STORAGE_TYPE = 'cacheStorage';

  private cache: Cache | null = null;

  private openCache(): Promise<Cache> {
    if (this.cache) {
      return Promise.resolve(this.cache);
    }

    return caches.open('test-device-storage').then((cache) => {
      this.cache = cache;
      return cache;
    });
  }

  get(key: string): Promise<string | null> {
    return this.openCache().then((cache) => {
      return cache.match(key).then((response) => {
        if (!response) {
          return null;
        }

        return response.text();
      });
    });
  }

  set(key: string, value: string): Promise<void> {
    return this.openCache().then((cache) => {
      return cache.put(key, new Response(value));
    });
  }

  async remove(key: string): Promise<void> {
    await this.openCache().then((cache) => {
      return cache.delete(key);
    });
  }

  async clear(): Promise<void> {
    await this.openCache().then((cache) => {
      return cache.keys().then((keys) => {
        return Promise.all(keys.map((key) => cache.delete(key)));
      });
    });
  }
}

const allStorageApis = [
  new LocalStorageApi(),
  new SessionStorageApi(),
  new IndexedDbStorageApi(),
  new CacheStorageApi(),
];

export function writeTimestampToAllStorageApis() {
  const timestamp = Date.now().toString();
  return Promise.all(
    allStorageApis.map(async (storageApi) => {
      await storageApi.set('timestamp', timestamp);
      return {
        storageType: storageApi.STORAGE_TYPE,
        timestamp,
      };
    }),
  );
}

export function getAllTimestamps() {
  return Promise.all(
    allStorageApis.map(async (storageApi) => {
      return {
        timestamp: await storageApi.get('timestamp'),
        storageType: storageApi.STORAGE_TYPE,
      };
    }),
  );
}

export function getAllStorageApis() {
  return allStorageApis;
}
