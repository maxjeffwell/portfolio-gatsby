// Custom script worker for offloading third-party scripts
// Modern alternative to deprecated Partytown

class ScriptWorker {
  constructor() {
    this.worker = null;
    this.isWorkerSupported = typeof Worker !== 'undefined';
    this.queue = [];
    this.initialized = false;
  }

  init() {
    if (!this.isWorkerSupported || this.initialized) return;

    try {
      // Create inline worker to avoid external file dependencies
      const workerScript = `
        // Web Worker for handling third-party script execution
        const scriptCache = new Map();
        
        self.onmessage = async function(e) {
          const { type, url, config, id } = e.data;
          
          switch (type) {
            case 'LOAD_SCRIPT':
              try {
                let scriptContent = scriptCache.get(url);
                
                if (!scriptContent) {
                  const response = await fetch(url);
                  scriptContent = await response.text();
                  scriptCache.set(url, scriptContent);
                }
                
                // Execute script in worker context
                eval(scriptContent);
                
                self.postMessage({
                  type: 'SCRIPT_LOADED',
                  id,
                  success: true
                });
              } catch (error) {
                self.postMessage({
                  type: 'SCRIPT_ERROR',
                  id,
                  error: error.message
                });
              }
              break;
              
            case 'EXECUTE_FUNCTION':
              try {
                // Execute analytics functions
                if (config.function === 'gtag') {
                  // Handle gtag calls in worker
                  self.postMessage({
                    type: 'FUNCTION_EXECUTED',
                    id,
                    success: true
                  });
                }
              } catch (error) {
                self.postMessage({
                  type: 'FUNCTION_ERROR',
                  id,
                  error: error.message
                });
              }
              break;
          }
        };
      `;

      const blob = new Blob([workerScript], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));

      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = this.handleWorkerError.bind(this);

      this.initialized = true;
      this.processQueue();
    } catch (error) {
      console.warn('ScriptWorker initialization failed:', error);
      this.fallbackToMainThread();
    }
  }

  handleWorkerMessage(e) {
    const { id, success, error } = e.data;

    // Find and resolve promise in queue
    const queueItem = this.queue.find((item) => item.id === id);
    if (queueItem) {
      if (success) {
        queueItem.resolve();
      } else {
        queueItem.reject(new Error(error));
      }
      this.queue = this.queue.filter((item) => item.id !== id);
    }
  }

  handleWorkerError(error) {
    console.warn('ScriptWorker error:', error);
    this.fallbackToMainThread();
  }

  fallbackToMainThread() {
    // Fallback to regular script loading if worker fails
    this.isWorkerSupported = false;
    this.processQueue();
  }

  loadScript(url, config = {}) {
    return new Promise((resolve, reject) => {
      // Early return if not in browser environment
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      const id = Math.random().toString(36).substr(2, 9);

      this.queue.push({ id, resolve, reject, url, config, type: 'LOAD_SCRIPT' });

      if (this.initialized) {
        this.processQueue();
      } else if (!this.isWorkerSupported) {
        this.loadScriptMainThread(url, config).then(resolve).catch(reject);
      }
    });
  }

  processQueue() {
    if (!this.worker || !this.initialized) return;

    this.queue.forEach((item) => {
      if (!item.sent) {
        this.worker.postMessage({
          type: item.type,
          url: item.url,
          config: item.config,
          id: item.id,
        });
        item.sent = true;
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  loadScriptMainThread(url, config = {}) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.defer = config.defer || false;

      // Use requestIdleCallback for better performance
      const loadScript = () => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      };

      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(loadScript, { timeout: 2000 });
      } else {
        setTimeout(loadScript, 100);
      }
    });
  }

  executeFunction(functionName, args, config = {}) {
    if (!this.isWorkerSupported || !this.initialized) {
      // Fallback to main thread execution
      if (typeof window !== 'undefined' && typeof window[functionName] === 'function') {
        return window[functionName](...args);
      }
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substr(2, 9);

      this.queue.push({
        id,
        resolve,
        reject,
        type: 'EXECUTE_FUNCTION',
        config: { function: functionName, args, ...config },
      });

      this.worker.postMessage({
        type: 'EXECUTE_FUNCTION',
        id,
        config: { function: functionName, args, ...config },
      });
    });
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.queue = [];
    this.initialized = false;
  }
}

// Create singleton instance
const scriptWorker = new ScriptWorker();

// Initialize on next tick to avoid blocking
if (typeof window !== 'undefined') {
  setTimeout(() => scriptWorker.init(), 0);
}

export default scriptWorker;
