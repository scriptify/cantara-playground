import React, { useState } from 'react';
import { useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { IonButton, IonIcon } from '@ionic/react';
import { close as CloseIcon } from 'ionicons/icons';

interface Props {
  onScanned: (data: string) => void;
  onError: (e: string) => void;
  onClose: () => void;
}

const INTERVAL = 500;

/**
 * It is possible to simulat the
 * scan of an URL by specifying a
 * `simulateQrUrl` search param
 */
function getSimulationUrl() {
  let simulateUrl = new URLSearchParams(window.location.search).get(
    'simulateQrUrl',
  );
  return decodeURIComponent(simulateUrl ?? '');
}

const QRCodeScanner = ({ onScanned, onError, onClose }: Props) => {
  const [error, setError] = useState<string>();
  const [webcam, setWebcam] = useState<Webcam>();

  function onScanValue(value: string) {
    console.log('SCANNED!', value);
    onScanned(value);
  }

  useEffect(() => {
    const simulateUrl = getSimulationUrl();
    if (simulateUrl) {
      setTimeout(() => {
        onScanValue(simulateUrl);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    let inter: number | undefined = undefined;
    if (webcam) {
      // webcam.stream?.getVideoTracks()?.[0].applyConstraints({advanced: [{torch: true}]})
      inter = window.setInterval(() => {
        try {
          const canvas = webcam.getCanvas();
          if (!canvas) return;
          const canvasCtx = canvas.getContext('2d');
          if (!canvasCtx) return;
          const imageData = canvasCtx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          );
          const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
          if (qrCode) {
            onScanValue(qrCode.data);
          }
        } catch (e) {
          console.error(e);
          onError('Error while scanning QR Code');
          onClose();
        }
      }, INTERVAL);
    }

    return () => {
      if (inter !== undefined) {
        window.clearInterval(inter);
      }
    };
  }, [webcam]);

  return (
    <div
      id="webcam"
      style={{ zIndex: 9999 }}
      className="fixed top-0 left-0 h-full w-full flex items-center justify-center bg-black"
    >
      <IonButton className="fixed top-14 left-5" onClick={onClose}>
        <IonIcon icon={CloseIcon} />
      </IonButton>
      <Webcam
        ref={(ref) => {
          if (ref) {
            setWebcam(ref);
          }
        }}
        videoConstraints={{
          facingMode: 'environment',
          advanced: [{ torch: true } as any],
        }}
        audio={false}
        width={window.innerWidth}
        height={window.innerHeight}
        onError={(e) => {
          onError('Cannot access webcam');

          onClose();
        }}
      />
    </div>
  );
};

export default QRCodeScanner;
