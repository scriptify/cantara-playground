import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect } from 'react';

type Props = {};

let firstUrl = window.location.href;

async function getManifestJsonContents() {
  const linkElem = document.querySelector<HTMLLinkElement>(
    'link[rel="manifest"]',
  );
  if (!linkElem) {
    alert('No manifest file found');
    return;
  }
  const manifestUrl = linkElem.href;
  return fetch(manifestUrl).then((response) => response.json());
}

const Shell = (props: Props) => {
  const [manifestJson, setManifestJson] = React.useState<any>();

  useEffect(() => {
    getManifestJsonContents().then((manifestJson) => {
      setManifestJson(manifestJson);
    });
  }, []);

  return (
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
            <b>Manifest JSON: </b>
            <br />
            <span>
              {manifestJson
                ? JSON.stringify(manifestJson, null, 2)
                : 'Loading manifest...'}
            </span>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Shell;
