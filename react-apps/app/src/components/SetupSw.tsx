import { IonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { reloadOutline } from 'ionicons/icons';

import { useSetupServiceWorker } from '../util/pwa';

interface Props {}

const SetupSw = (props: Props) => {
  // Set up updatable SW
  const setupServiceWorker = useSetupServiceWorker();

  const [onPerformUpdate, setUpdateFn] = useState<() => void>();
  const [toastOpen, setToastOpen] = useState<boolean>(false);

  useEffect(() => {
    setupServiceWorker({
      // Setup SW and listen to route changes,
      // so that the SW can be updated.
      onUpdateAvailable: (cb) => {
        setUpdateFn(() => cb);
        setToastOpen(true);
      },
    });
  }, [setupServiceWorker]);

  return (
    <IonToast
      isOpen={toastOpen}
      onDidDismiss={() => setToastOpen(false)}
      message={'An update is available. Tap button to install.'}
      position="bottom"
      buttons={[
        {
          side: 'end',
          // text: 'Update now',
          icon: reloadOutline,
          role: 'cancel',
          handler: () => {
            if (onPerformUpdate) onPerformUpdate();
          },
        },
      ]}
    />
  );
};

export default SetupSw;
