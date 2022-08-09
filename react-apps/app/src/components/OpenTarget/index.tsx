import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';
import { Helmet } from 'react-helmet';

type Props = {};

function getManifestUrl() {
  return '/manifest.json';
  // return `https://0c71-185-187-223-24.ngrok.io/?origin=${window.location.origin}&data=${data}`;
}

function getWindowInfo() {
  const isChildWindow = window.parent !== window.top;
  const hasParentWindow = window.parent !== window;
  const hasOpener = window.opener !== null;

  return {
    isChildWindow,
    hasParentWindow,
    hasOpener,
  };
}

const OpenTarget = (props: Props) => {
  const [manifestUrl, setManifestUrl] = React.useState<string>(
    getManifestUrl(),
  );

  let infoToPrint = JSON.stringify(getWindowInfo(), null, 2);

  return (
    <>
      <Helmet>
        <link rel="manifest" href={manifestUrl} />
      </Helmet>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>External open</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div style={{ padding: '1rem' }}>
            <h1>You have been redirected!</h1>
            {infoToPrint}
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default OpenTarget;
