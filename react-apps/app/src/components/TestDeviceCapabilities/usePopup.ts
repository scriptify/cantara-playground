import { useEffect } from 'react';

export function usePopup() {
  function createOpenPopup(
    mode: '_blank' | '_self' | '_parent' | '_top' = '_self',
  ) {
    return () => {
      const windowHandle = window.open(
        `${window.location.origin}/open`,
        mode,
        'opener',
      );
      if (windowHandle && mode === '_blank') {
        windowHandle.close();
      }
    };
  }

  useEffect(() => {
    createOpenPopup('_blank')();
  }, []);

  const isChildWindow = window.parent !== window.top;
  const hasParentWindow = window.parent !== window;
  const hasOpener = window.opener !== null;

  return {
    createOpenPopup,
    hasOpener,
    isChildWindow,
    hasParentWindow,
  };
}
