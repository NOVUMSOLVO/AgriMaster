export interface NetworkStatus {
  isOnline: boolean;
  effectiveType: string;
  downlink: number;
  saveData: boolean;
}

export const getNetworkStatus = (): NetworkStatus => {
  const nav = navigator as any;
  
  return {
    isOnline: navigator.onLine,
    effectiveType: nav.connection?.effectiveType || 'unknown',
    downlink: nav.connection?.downlink || 0,
    saveData: nav.connection?.saveData || false
  };
};

export const isSlowConnection = (): boolean => {
  const network = getNetworkStatus();
  return ['slow-2g', '2g', '3g'].includes(network.effectiveType) || 
         network.downlink < 1.5 || 
         network.saveData;
};

export const shouldLoadHighQualityImages = (): boolean => {
  const network = getNetworkStatus();
  return network.isOnline && 
         !isSlowConnection() && 
         !network.saveData;
};

// Image optimization based on network conditions
export const getOptimizedImageUrl = (baseUrl: string, size: 'small' | 'medium' | 'large' = 'medium'): string => {
  if (!shouldLoadHighQualityImages()) {
    size = 'small';
  }
  
  const sizeMap = {
    small: 'w=200&q=50',
    medium: 'w=400&q=70',
    large: 'w=800&q=85'
  };
  
  return `${baseUrl}?${sizeMap[size]}`;
};

// Data compression for API requests
export const compressData = (data: any): string => {
  return JSON.stringify(data);
};

export const decompressData = (compressedData: string): any => {
  try {
    return JSON.parse(compressedData);
  } catch {
    return null;
  }
};

// Network event listeners
export const addNetworkListeners = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  // Connection change listener for mobile
  const connection = (navigator as any).connection;
  if (connection) {
    const handleConnectionChange = () => {
      if (isSlowConnection()) {
        // Trigger slow connection handling
        console.log('Slow connection detected');
      }
    };
    
    connection.addEventListener('change', handleConnectionChange);
    
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      connection.removeEventListener('change', handleConnectionChange);
    };
  }
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};