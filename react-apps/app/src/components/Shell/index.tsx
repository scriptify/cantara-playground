import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useCheckForWebView } from './useCheckForWebView';
import { copyTextToClipboard } from './util';

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

function getNavigatorInformation() {
  const keys: string[] = [
    'appCodeName',
    'appName',
    'appVersion',
    'bluetooth',
    'clipboard',
    'connection',
    'cookieEnabled',
    'credentials',
    'deviceMemory',
    'doNotTrack',
    'geolocation',
    'hardwareConcurrency',
    'hid',
    'ink',
    'keyboard',
    'language',
    'languages',
    'locks',
    'managed',
    'maxTouchPoints',
    'mediaCapabilities',
    'mediaDevices',
    'mediaSession',
    'mimeTypes',
    'onLine',
    'pdfViewerEnabled',
    'permissions',
    'platform',
    'plugins',
    'presentation',
    'product',
    'productSub',
    'scheduling',
    'serial',
    'serviceWorker',
    'storage',
    'usb',
    'userActivation',
    'userAgent',
    'userAgentData',
    'vendor',
    'vendorSub',
    'virtualKeyboard',
    'wakeLock',
    'webdriver',
    'webkitPersistentStorage',
    'webkitTemporaryStorage',
    'xr',
  ];
  return keys.reduce((acc, key) => {
    return {
      ...acc,
      [key]: navigator[key as keyof typeof window.navigator],
    };
  }, {} as any);
}

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
  const isGetUserMediaDefined = !!navigator.mediaDevices.getUserMedia;

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
    isGetUserMediaDefined,
    safariType,
    standaloneDisplayMode,
    standalone,
    userAgent,
    safari,
    ios,
    isInAppBrowser,
    isPWA,
    navigatorInformation: getNavigatorInformation(),
  };
}

const Shell = (props: Props) => {
  const [manifestUrl, setManifestUrl] = React.useState<string>(
    getManifestUrl(),
  );

  const { createOpenPopup, ...WEB_VIEW_INFO } = useCheckForWebView();

  let infoToPrint = iosInfo() as any;

  infoToPrint = {
    WEB_VIEW_INFO,
    ...infoToPrint,
  };

  let deviceInfo = JSON.stringify(infoToPrint, null, 2);

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
            <div>
              <button onClick={createOpenPopup('_blank')}>Open _blank</button>
              <button onClick={createOpenPopup('_self')}>Open _self</button>
              <button onClick={createOpenPopup('_top')}>Open _top</button>
              <button onClick={createOpenPopup('_parent')}>Open _parent</button>

              <button
                onClick={() => {
                  copyTextToClipboard(deviceInfo);
                }}
                style={{}}
              >
                Copy to clipboard
              </button>

              <div
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <a
                  href="https://en.wikipedia.org/wiki/Phrases_from_The_Hitchhiker%27s_Guide_to_the_Galaxy"
                  target="_blank"
                >
                  Open _blank link
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/Phrases_from_The_Hitchhiker%27s_Guide_to_the_Galaxy"
                  target="_self"
                >
                  Open _self link
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/Phrases_from_The_Hitchhiker%27s_Guide_to_the_Galaxy"
                  target="_top"
                >
                  Open _top link
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/Phrases_from_The_Hitchhiker%27s_Guide_to_the_Galaxy"
                  target="_parent"
                >
                  Open _parent link
                </a>
              </div>
            </div>
            <p style={{ whiteSpace: 'pre-wrap' }}>{deviceInfo}</p>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Shell;
