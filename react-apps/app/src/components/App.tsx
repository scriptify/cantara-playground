import React, { lazy, Suspense } from 'react';
const QRCodeScanner = lazy(() => import('./QRCodeScanner'));

type Props = {};

console.log('trigger deploy 6');

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
