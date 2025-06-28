import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AgriMasterDB extends DBSchema {
  crops: {
    key: number;
    value: {
      id: number;
      name: string;
      area: number;
      plantDate: string;
      status: string;
      health: number;
      lastModified: number;
      synced: boolean;
    };
  };
  livestock: {
    key: number;
    value: {
      id: number;
      type: string;
      count: number;
      lastCheckup: string;
      health: string;
      lastModified: number;
      synced: boolean;
    };
  };
  activities: {
    key: number;
    value: {
      id: number;
      date: string;
      activity: string;
      cost?: number;
      income?: number;
      lastModified: number;
      synced: boolean;
    };
  };
  marketPrices: {
    key: string;
    value: {
      crop: string;
      price: number;
      unit: string;
      trend: string;
      change: string;
      timestamp: number;
    };
  };
  weather: {
    key: string;
    value: {
      id: string;
      temperature: number;
      humidity: number;
      rainfall: string;
      forecast: string;
      timestamp: number;
    };
  };
  pendingSync: {
    key: number;
    value: {
      id: number;
      action: string;
      data: any;
      timestamp: number;
    };
  };
}

let db: IDBPDatabase<AgriMasterDB>;

export const initDB = async (): Promise<IDBPDatabase<AgriMasterDB>> => {
  if (db) return db;
  
  db = await openDB<AgriMasterDB>('AgriMasterDB', 2, {
    upgrade(db) {
      // Create object stores
      if (!db.objectStoreNames.contains('crops')) {
        db.createObjectStore('crops', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('livestock')) {
        db.createObjectStore('livestock', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('activities')) {
        db.createObjectStore('activities', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('marketPrices')) {
        db.createObjectStore('marketPrices', { keyPath: 'crop' });
      }
      if (!db.objectStoreNames.contains('weather')) {
        db.createObjectStore('weather', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('pendingSync')) {
        db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  
  return db;
};

// Generic storage functions
export const storeData = async <T extends keyof AgriMasterDB>(
  storeName: T,
  data: AgriMasterDB[T]['value']
): Promise<void> => {
  const database = await initDB();
  await database.put(storeName, data);
};

export const getData = async <T extends keyof AgriMasterDB>(
  storeName: T,
  key: AgriMasterDB[T]['key']
): Promise<AgriMasterDB[T]['value'] | undefined> => {
  const database = await initDB();
  return database.get(storeName, key);
};

export const getAllData = async <T extends keyof AgriMasterDB>(
  storeName: T
): Promise<AgriMasterDB[T]['value'][]> => {
  const database = await initDB();
  return database.getAll(storeName);
};

export const deleteData = async <T extends keyof AgriMasterDB>(
  storeName: T,
  key: AgriMasterDB[T]['key']
): Promise<void> => {
  const database = await initDB();
  await database.delete(storeName, key);
};

// Sync queue management
export const addToSyncQueue = async (action: string, data: any): Promise<void> => {
  const database = await initDB();
  await database.add('pendingSync', {
    action,
    data,
    timestamp: Date.now()
  } as any);
};

export const getSyncQueue = async (): Promise<any[]> => {
  const database = await initDB();
  return database.getAll('pendingSync');
};

export const clearSyncQueue = async (): Promise<void> => {
  const database = await initDB();
  const tx = database.transaction('pendingSync', 'readwrite');
  await tx.store.clear();
};