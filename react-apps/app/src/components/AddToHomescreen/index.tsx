import React, { useRef, useState } from 'react';
import { download as installIcon } from 'ionicons/icons';
import { useAddToHomescreen } from '../../util/pwa';
import { IonFab, IonFabButton, IonIcon, isPlatform } from '@ionic/react';
import IOSModal from './IOSModal';

interface Props {}

const isIos = isPlatform('ios');
const isIosStandalone = isIos && (window.navigator as any).standalone;

// Only show once during app lifecycle
let didShowIosModalBefore = false;

const AddToHomescreen = ({}: Props) => {
  let addToHomescreenFn = useAddToHomescreen();
  const hideBtn = (!isIos && !addToHomescreenFn) || isIosStandalone;
  const [showIosModal, setShowIosModal] = useState<boolean>(
    !didShowIosModalBefore && isIos && !isIosStandalone,
  );

  if (showIosModal) {
    didShowIosModalBefore = true;
  }

  const btnRef = useRef<HTMLIonFabButtonElement>(null);

  return (
    <>
      <IOSModal
        open={showIosModal}
        onClose={() => {
          setShowIosModal(false);
        }}
      />
      <IonFab hidden={hideBtn} vertical="bottom" horizontal="end">
        <IonFabButton
          ref={btnRef}
          style={{
            '--color': 'var(--ion-color-secondary)',
          }}
          onClick={(e) => {
            if (isIos) {
              setShowIosModal(true);
            } else if (addToHomescreenFn) {
              addToHomescreenFn();
            }
          }}
        >
          <IonIcon icon={installIcon} />
        </IonFabButton>
      </IonFab>
    </>
  );
};

export default AddToHomescreen;
