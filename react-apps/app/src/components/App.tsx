import React, { lazy, Suspense } from 'react';
const QRCodeScanner = lazy(() => import('./QRCodeScanner'));

type Props = {};

const App = (props: Props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QRCodeScanner
        onClose={() => {}}
        onError={(e: string) => {}}
        onScanned={(e: string) => {}}
      />
    </Suspense>
  );
};

export default App;
