import { useCallback } from 'react';

interface SetupSwParams {
  /**
   * External consumers need
   * to execute the passed
   * callback function
   * when the user express
   * the intention to do so.
   * This will result in a
   * full reload.
   */
  onUpdateAvailable: (updateFn: () => any) => any;
}

let swRegistration: ServiceWorkerRegistration | undefined = undefined;

export function getServiceWorkerRegistration() {
  return swRegistration;
}

/**
 * For help, have a look
 * at: https://whatwebcando.today/articles/handling-service-worker-updates/
 */
export function useSetupServiceWorker() {
  const setup = useCallback(async ({ onUpdateAvailable }: SetupSwParams) => {
    if ('serviceWorker' in navigator) {
      const originalSW = navigator.serviceWorker.controller;
      return new Promise(async (resolve, reject) => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          swRegistration = registration;
          /**
           * Once executed,
           * updates the SW and
           * reloads the page after
           * updated on the next
           * route change
           */
          function onUpdateSw() {
            console.log('[SW] onUpdateSw');
            onUpdateAvailable(() => {
              if (registration.waiting) {
                console.log('[SW] onApplyUpdate', registration.waiting);
                // let waiting Service Worker know it should become active
                registration.waiting.postMessage('SKIP_WAITING');
              }
            });
          }

          // detect Service Worker update available and wait for it to become installed
          registration.addEventListener('updatefound', () => {
            console.log('[SW] updatefound');
            if (registration.installing) {
              // wait until the new Service worker is actually installed (ready to take over)
              registration.installing.addEventListener('statechange', () => {
                if (registration.waiting) {
                  // if there's an existing controller (previous Service Worker), show the prompt
                  if (navigator.serviceWorker.controller) {
                    onUpdateSw();
                  } else {
                    // otherwise it's the first install, nothing to do
                    console.log('[SW] Service Worker initialized for the first time');
                  }
                }
              });
            }
          });

          // Makes sure that we don't refresh multiple times
          let refreshing = false;

          // detect controller change and refresh the page
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
              if (originalSW) {
                // New SW incoming, replacing original SW
                console.log('[SW] controllerchange, performing reload');
                // As we only trigger a SW update
                // after a click on the update button
                window.location.reload();
                refreshing = true;
              }
            }
          });

          // ensure the case when the updatefound event was missed is also handled
          // by re-invoking the prompt when there's a waiting Service Worker
          if (registration.waiting) {
            onUpdateSw();
          }

          resolve(registration);
        } catch (e) {
          console.log('SW setup error', e);
        }
      });
    }
    return null;
  }, []);

  return setup;
}
