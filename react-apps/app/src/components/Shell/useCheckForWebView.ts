import { useEffect, useState } from 'react';

const wasOpenedFromWebView = window.location.search.includes('isWebView=true');

export function useCheckForWebView() {
  const [isWebview, setIsWebview] = useState(wasOpenedFromWebView);

  function createOpenPopup(
    mode: '_blank' | '_self' | '_parent' | '_top' = '_self',
  ) {
    return () => {
      if (wasOpenedFromWebView) return;
      const windowHandle = window.open(
        `${window.location.origin}/?isWebView=true`,
        mode,
      );
      if (windowHandle) {
        windowHandle.close();
        setIsWebview(false);
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
    isWebview,
    createOpenPopup,
    hasOpener,
    isChildWindow,
    hasParentWindow,
  };
}
