import { useEffect, useState } from 'react';

const wasOpenedFromWebView = window.location.search.includes('isWebView=true');

export function useCheckForWebView() {
  const [isWebview, setIsWebview] = useState(wasOpenedFromWebView);

  useEffect(() => {
    const windowHandle = window.open(
      `${window.location.origin}/?isWebView=true`,
      '_blank',
    );
    if (windowHandle) {
      windowHandle.close();
      setIsWebview(false);
    }
  }, []);

  const isChildWindow = window.parent !== window.top;
  const hasOpener = window.opener !== null;

  return { isWebview, hasOpener };
}
