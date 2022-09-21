import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  getAllTimestamps,
  writeTimestampToAllStorageApis,
} from './storage-apis';

type Props = {};

type Timestamps = Awaited<ReturnType<typeof getAllTimestamps>>;

const TestDeviceStorage = (props: Props) => {
  const [timestamps, setTimestamps] = useState<Timestamps>([]);

  async function onUpdateTimestamps() {
    const newTimestamps = await writeTimestampToAllStorageApis();
    setTimestamps(newTimestamps);
  }

  useEffect(() => {
    (async () => {
      const timestamps = await getAllTimestamps();
      setTimestamps(timestamps);
    })();
  }, []);

  return (
    <>
      <Helmet>
        <link rel="manifest" href="/manifest.json" />
      </Helmet>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>PWA Capabilites Test</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <p>
            This page is used to test all the device storage APIs. Write to the
            storage and then check back after a few days to see if it is still
            there or was deleted by the OS. <br />
            Thanks for helping resolve this issue!
          </p>
          <IonList>
            {timestamps.map((timestamp) => (
              <IonItem key={timestamp.storageType}>
                <IonLabel>
                  {timestamp.storageType}:{' '}
                  {timestamp.timestamp ? (
                    new Date(parseFloat(timestamp.timestamp)).toLocaleString()
                  ) : (
                    <b>NOT SET!</b>
                  )}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
          <IonButton onClick={onUpdateTimestamps}>Update timestamps</IonButton>
        </IonContent>
      </IonPage>
    </>
  );
};

export default TestDeviceStorage;
