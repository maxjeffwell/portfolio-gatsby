import { useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for managing web workers efficiently
 * @param {string} workerScript - Path to worker script
 * @returns {Function} - Function to execute worker tasks
 */
function useWebWorker(workerScript) {
  const workerRef = useRef(null);
  const callbacksRef = useRef(new Map());
  const messageIdRef = useRef(0);

  // Initialize worker
  useEffect(() => {
    const callbacks = callbacksRef.current;

    if (typeof Worker !== 'undefined') {
      try {
        // Create worker from URL or inline script
        const workerUrl = new URL(workerScript, import.meta.url);
        workerRef.current = new Worker(workerUrl);

        // Handle messages from worker
        workerRef.current.onmessage = (e) => {
          const { messageId, ...data } = e.data;
          const callback = callbacksRef.current.get(messageId);

          if (callback) {
            callback(data);
            callbacksRef.current.delete(messageId);
          }
        };

        // Handle worker errors
        workerRef.current.onerror = (error) => {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('Web Worker error:', error);
          }
          // Reject all pending callbacks
          callbacksRef.current.forEach((callback) => {
            callback({ success: false, error: 'Worker error' });
          });
          callbacksRef.current.clear();
        };
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn('Web Worker not supported or failed to initialize:', error);
        }
      }
    }

    // Cleanup worker on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      callbacks.clear();
    };
  }, [workerScript]);

  // Execute worker task
  const executeTask = useCallback((data) => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        // Fallback to main thread if worker unavailable
        resolve({ success: false, error: 'Worker not available' });
        return;
      }

      const messageId = messageIdRef.current;
      messageIdRef.current += 1;

      // Store callback for this message
      callbacksRef.current.set(messageId, (result) => {
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error(result.error));
        }
      });

      // Send task to worker
      workerRef.current.postMessage({ messageId, ...data });

      // Set timeout to prevent hanging
      setTimeout(() => {
        if (callbacksRef.current.has(messageId)) {
          callbacksRef.current.delete(messageId);
          reject(new Error('Worker task timeout'));
        }
      }, 5000); // 5 second timeout
    });
  }, []);

  return executeTask;
}

export default useWebWorker;
