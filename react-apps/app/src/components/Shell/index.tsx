import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

type Props = {};

let firstUrl = window.location.href;

function getManifestUrl(data: string = 'yoyoyo') {
  return `https://0c71-185-187-223-24.ngrok.io/?origin=${window.location.origin}&data=${data}`;
}

const Shell = (props: Props) => {
  const [manifestUrl, setManifestUrl] = React.useState<string>(
    getManifestUrl(),
  );

  useEffect(() => {
    setTimeout(() => {
      setManifestUrl(getManifestUrl('after2s'));
    }, 2000);
  }, []);

  return (
    <>
      <Helmet>
        <link rel="manifest" href={manifestUrl} />
      </Helmet>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Cantara PWA</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div style={{ padding: '1rem' }}>
            <p>
              This app is used to test different PWA capabilities, mostly on iOS
              🤡
            </p>
            <p>
              <b>First URL: </b>
              {firstUrl}
            </p>
            <p>
              <b>Manifest URL: </b>
              <br />
              <span>{manifestUrl}</span>
            </p>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Shell;
