import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import AddToHomescreen from './AddToHomescreen';
import SetupSw from './SetupSw';
import Shell from './Shell';

import '../css/theme.css';

type Props = {
  cool?: string;
};

const App = (props: Props) => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <IonApp>
          {/* <SetupSw /> */}
          <AddToHomescreen />
          <Shell />
        </IonApp>
      </Suspense>
    </>
  );
};

export default App;
