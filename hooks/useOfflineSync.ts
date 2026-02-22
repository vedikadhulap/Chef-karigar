import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface OfflineQueueItem {
  id: string;
  type: string;
  payload: unknown;
  timestamp: number;
  label?: string;
}

const QUEUE_KEY = 'chef_karigar_offline_queue';

function loadQueue(): OfflineQueueItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as OfflineQueueItem[]) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: OfflineQueueItem[]): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    /* storage full – silently fail */
  }
}

/**
 * useOfflineSync
 *
 * Queues actions when the device is offline and automatically
 * flushes them when the connection is restored.
 *
 * @param onFlush  Called with all queued items when the app comes back online.
 *                 Return true/void for success, throw to keep item in queue.
 */
export function useOfflineSync(
  onFlush?: (items: OfflineQueueItem[]) => Promise<void> | void
) {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [queue, setQueue] = useState<OfflineQueueItem[]>(loadQueue);
  const [isSyncing, setIsSyncing] = useState(false);

  // Persist queue changes to localStorage
  useEffect(() => {
    saveQueue(queue);
  }, [queue]);

  // Listen for online / offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored. Syncing...', {
        id: 'online-sync',
        icon: '🌐',
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast('You are offline. Actions will be queued.', {
        id: 'offline-notice',
        icon: '📴',
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-flush when back online
  useEffect(() => {
    if (isOnline && queue.length > 0 && onFlush && !isSyncing) {
      const flush = async () => {
        setIsSyncing(true);
        try {
          await onFlush([...queue]);
          setQueue([]);
          toast.success(`${queue.length} queued action${queue.length > 1 ? 's' : ''} synced!`, {
            icon: '✅',
            duration: 3000,
          });
        } catch (err) {
          toast.error('Sync failed. Will retry on next connection.', {
            icon: '⚠️',
            duration: 4000,
          });
        } finally {
          setIsSyncing(false);
        }
      };
      flush();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  /**
   * Enqueue an action. If online, executes `onFlush` immediately.
   * If offline, stores to localStorage queue.
   */
  const enqueue = useCallback(
    (type: string, payload: unknown, label?: string) => {
      const item: OfflineQueueItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        payload,
        timestamp: Date.now(),
        label,
      };

      if (!isOnline) {
        setQueue(prev => [...prev, item]);
        toast(`Saved offline: ${label || type}`, {
          icon: '💾',
          duration: 2500,
        });
      } else {
        // Online — execute immediately via flush
        if (onFlush) {
          Promise.resolve(onFlush([item])).catch(() => {
            setQueue(prev => [...prev, item]);
            toast.error(`Failed to sync "${label || type}". Queued for retry.`);
          });
        }
      }
    },
    [isOnline, onFlush]
  );

  /** Manually clear the queue (use after successful server sync) */
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    isOnline,
    isSyncing,
    queueLength: queue.length,
    queue,
    enqueue,
    clearQueue,
  };
}
