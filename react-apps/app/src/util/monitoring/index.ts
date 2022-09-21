import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export function setupAppMonitoring() {
  if (process.env.NODE_ENV !== 'production') return;
  Sentry.init({
    dsn: 'https://5d6b2f85653b49d0aa8f578887663a29@o1420425.ingest.sentry.io/6765478',
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}
