import React, { useState } from 'react';
import {
  IonBackdrop,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
  IonLoading,
} from '@ionic/react';

import AddToHomeScreenGif from './a2hsIosVideo.gif';

interface Props {
  open: boolean;
  onClose: () => void;
}

const IOSModal = ({ open, onClose }: Props) => {
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);

  if (!open) return <></>;

  return (
    <>
      {/* <IonLoading isOpen={!isVideoReady} /> */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-11/12">
        <IonCard className="rounded-xl">
          <IonCardHeader>
            <div className="flex justify-end">
              <IonIcon
                icon="close-sharp"
                color="primary"
                className="text-2xl"
                onClick={onClose}
              />
            </div>
            <p className="text-xs">Add this App to the Homescreen</p>
          </IonCardHeader>
          <IonCardContent>
            <img src={AddToHomeScreenGif} alt="Download guide" />
          </IonCardContent>
        </IonCard>
      </div>
      <IonBackdrop
        onIonBackdropTap={onClose}
        stopPropagation
        tappable
        className="opacity-80"
      />
    </>
  );
};

export default IOSModal;
