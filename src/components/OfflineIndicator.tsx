import React from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OfflineIndicatorProps {
  isOnline: boolean;
  isSyncing: boolean;
  isSlowConnection: boolean;
  onSync: () => void;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isOnline,
  isSyncing,
  isSlowConnection,
  onSync
}) => {
  const { t } = useTranslation();

  if (isOnline && !isSyncing && !isSlowConnection) {
    return null;
  }

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
      <div
        className={`px-6 py-3 rounded-2xl shadow-lg flex items-center space-x-3 glass-card hover-lift ${
          !isOnline
            ? 'status-offline'
            : isSlowConnection
            ? 'bg-yellow-500'
            : 'status-syncing'
        }`}
      >
        {!isOnline ? (
          <>
            <WifiOff className="h-5 w-5" />
            <span className="text-sm font-medium text-white">{t('offline')}</span>
          </>
        ) : isSyncing ? (
          <>
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium text-white">{t('syncing')}</span>
          </>
        ) : isSlowConnection ? (
          <>
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm font-medium text-white">{t('connectionSlow')}</span>
          </>
        ) : (
          <>
            <Wifi className="h-5 w-5" />
            <span className="text-sm font-medium text-white">{t('syncComplete')}</span>
          </>
        )}
        
        {!isOnline && (
          <button
            onClick={onSync}
            className="ml-3 px-3 py-1 glass-button rounded-xl text-xs hover-lift text-white"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;