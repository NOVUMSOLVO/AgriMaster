import { getAllData, storeData, getSyncQueue, clearSyncQueue, addToSyncQueue } from './storage';
import { getNetworkStatus } from './network';

const API_BASE_URL = 'https://api.agrimaster.app';

// Mock API for demonstration
const mockAPI = {
  async post(endpoint: string, data: any) {
    console.log(`Mock API POST to ${endpoint}:`, data);
    return { success: true, data };
  },
  
  async get(endpoint: string) {
    console.log(`Mock API GET from ${endpoint}`);
    return { 
      success: true, 
      data: endpoint.includes('weather') ? 
        { temperature: 24, humidity: 68, rainfall: 'Light rain', forecast: 'Partly cloudy' } :
        []
    };
  },
  
  async put(endpoint: string, data: any) {
    console.log(`Mock API PUT to ${endpoint}:`, data);
    return { success: true, data };
  }
};

export const syncData = async (): Promise<boolean> => {
  const networkStatus = getNetworkStatus();
  
  if (!networkStatus.isOnline) {
    console.log('Cannot sync: device is offline');
    return false;
  }
  
  try {
    // Get pending sync operations
    const pendingOperations = await getSyncQueue();
    
    for (const operation of pendingOperations) {
      try {
        switch (operation.action) {
          case 'CREATE_CROP':
            await mockAPI.post('/crops', operation.data);
            break;
          case 'UPDATE_CROP':
            await mockAPI.put(`/crops/${operation.data.id}`, operation.data);
            break;
          case 'CREATE_ACTIVITY':
            await mockAPI.post('/activities', operation.data);
            break;
          case 'UPDATE_LIVESTOCK':
            await mockAPI.put(`/livestock/${operation.data.id}`, operation.data);
            break;
          default:
            console.log('Unknown sync operation:', operation.action);
        }
      } catch (error) {
        console.error('Failed to sync operation:', operation, error);
        // Keep the operation in queue for retry
        continue;
      }
    }
    
    // Clear sync queue after successful sync
    await clearSyncQueue();
    
    // Fetch latest data from server
    await fetchLatestData();
    
    console.log('Data sync completed successfully');
    return true;
  } catch (error) {
    console.error('Sync failed:', error);
    return false;
  }
};

export const fetchLatestData = async (): Promise<void> => {
  try {
    // Fetch weather data
    const weatherResponse = await mockAPI.get('/weather');
    if (weatherResponse.success) {
      await storeData('weather', {
        id: 'current',
        ...weatherResponse.data,
        timestamp: Date.now()
      });
    }
    
    // Fetch market prices
    const pricesResponse = await mockAPI.get('/market-prices');
    if (pricesResponse.success && Array.isArray(pricesResponse.data)) {
      for (const price of pricesResponse.data) {
        await storeData('marketPrices', {
          ...price,
          timestamp: Date.now()
        });
      }
    }
  } catch (error) {
    console.error('Failed to fetch latest data:', error);
  }
};

// Background sync using service worker
export const registerBackgroundSync = (): void => {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then((registration) => {
      return (registration as any).sync.register('background-sync');
    }).catch((error) => {
      console.error('Background sync registration failed:', error);
    });
  }
};

// Add data to sync queue when offline
export const queueForSync = async (action: string, data: any): Promise<void> => {
  await addToSyncQueue(action, data);
  
  // Try immediate sync if online
  const networkStatus = getNetworkStatus();
  if (networkStatus.isOnline) {
    await syncData();
  }
};

// Automatic sync when coming back online
let syncInProgress = false;

export const startAutoSync = (): void => {
  const handleOnline = async () => {
    if (syncInProgress) return;
    
    syncInProgress = true;
    try {
      await syncData();
    } finally {
      syncInProgress = false;
    }
  };
  
  window.addEventListener('online', handleOnline);
  
  // Initial sync if online
  if (navigator.onLine) {
    handleOnline();
  }
};