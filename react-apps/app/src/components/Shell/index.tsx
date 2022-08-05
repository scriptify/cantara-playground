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

let firstUrl = window.location.href;

function v4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const deviceId = v4();

function getManifestUrl(data: string = deviceId) {
  return '/manifest.json';
  // return `https://0c71-185-187-223-24.ngrok.io/?origin=${window.location.origin}&data=${data}`;
}

function isIOSInAppBrowser() {
  // Check if device is iPad, iPhone or iPod (this bit is naive and should probably check additional stuff)
  if (Boolean(window.navigator.userAgent.match(/iPad|iPhone|iPod/)) === false)
    return false;

  // Check if navigator is standalone but display-mode isn't
  if (
    (window.navigator as any).standalone === true &&
    window.matchMedia('(display-mode: standalone)').matches === false
  ) {
    return true;
  } else {
    return false;
  }
}

function iosInfo() {
  const standalone = (window.navigator as any).standalone;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const safari = /safari/.test(userAgent);
  const ios = /iphone|ipod|ipad/.test(userAgent);
  const standaloneDisplayMode = window.matchMedia(
    '(display-mode: standalone)',
  ).matches;
  const isInAppBrowser = Boolean(standalone && !standaloneDisplayMode);
  const isPWA = Boolean(standalone && standaloneDisplayMode);

  let safariType: 'safari_normal' | 'safari_pwa' | 'safari_inapp' | 'not_ios' =
    'not_ios';

  if (ios) {
    if (!standalone && safari) {
      safariType = 'safari_normal';
    } else if (standalone && !safari) {
      //standalone
      safariType = 'safari_pwa';
    } else if (!standalone && !safari) {
      //uiwebview
      safariType = 'safari_inapp';
    }
  }

  return {
    safariType,
    standaloneDisplayMode,
    standalone,
    userAgent,
    safari,
    ios,
    isInAppBrowser,
    isPWA,
  };
}

const Shell = (props: Props) => {
  const [manifestUrl, setManifestUrl] = React.useState<string>(
    getManifestUrl(),
  );

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
            <p style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(iosInfo(), null, 2)}
            </p>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Shell;
