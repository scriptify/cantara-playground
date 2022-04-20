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

async function changeManifestJson() {
  const contents = await getManifestJsonContents();
  const newContents = {
    ...contents,
    start_url: `${window.location.origin}/?jwt=6666`,
    icons: contents.icons.map((icon: any) => {
      return {
        src: `${window.location.origin}${icon.src}`,
      };
    }),
  };

  const newManifestUrl = `https://0c71-185-187-223-24.ngrok.io/?${encodeURIComponent(
    JSON.stringify(newContents),
  )}`;

  const linkElem = document.querySelector<HTMLLinkElement>(
    'link[rel="manifest"]',
  );

  if (!linkElem) return;

  linkElem.setAttribute('href', newManifestUrl);

  return newContents;
}

const Shell = (props: Props) => {
  const [manifestJson, setManifestJson] = React.useState<any>();

  useEffect(() => {
    getManifestJsonContents().then((manifestJson) => {
      setManifestJson(manifestJson);
    });

    setTimeout(async () => {
      const newManifest = await changeManifestJson();
      setManifestJson(newManifest);
    }, 2000);
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
