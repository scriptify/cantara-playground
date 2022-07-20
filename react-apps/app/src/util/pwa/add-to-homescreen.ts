import { useState } from 'react';

let triggerAddToHomeScreen: (() => Promise<boolean>) | undefined = undefined;

let triggerFnChanged: () => any = () => {};
function onCallbackFnChange(fn: () => any) {
  triggerFnChanged = fn;
}

export function setupAddToHomeScreenListener() {
  window.addEventListener('beforeinstallprompt', (e: any) => {
    e.preventDefault();

    triggerAddToHomeScreen = () => {
      console.log('triggerAddToHomeScreen');
      e.prompt();
      return e.userChoice.then(({ outcome }: { outcome: string }) => {
        console.log({ outcome });
        return outcome === 'accepted';
      });
    };
    triggerFnChanged();
  });
}

export function useAddToHomescreen() {
  const [addToHomescreenFn, setFn] = useState<(() => Promise<boolean>) | undefined>(
    () => triggerAddToHomeScreen
  );

  onCallbackFnChange(() => {
    setFn(() => triggerAddToHomeScreen);
  });

  async function trigger() {
    if (!addToHomescreenFn) return;
    const result = await addToHomescreenFn();
    return result;
  }

  return addToHomescreenFn ? trigger : undefined;
}
