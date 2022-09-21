import pdfjs from 'pdfjs-dist';
import { useEffect, useMemo, useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/lib/pdf.worker',
  import.meta.url,
).toString();

type LoadPdfResult = {
  page: pdfjs.PDFPageProxy;
  pdfDocument: pdfjs.PDFDocumentProxy;
};

interface LoadPageParams {
  fileUrl: string;
  pageNumber?: number;
  pdfDocument?: pdfjs.PDFDocumentProxy;
}

async function loadPage({
  fileUrl,
  pageNumber = 1,
  pdfDocument,
}: LoadPageParams): Promise<LoadPdfResult> {
  const pdf = pdfDocument
    ? pdfDocument
    : await pdfjs.getDocument(fileUrl).promise;
  const page = await pdf.getPage(pageNumber);

  return {
    page,
    pdfDocument: pdf,
  };
}

interface RenderPageParams {
  canvasContainer: HTMLDivElement;
  page: pdfjs.PDFPageProxy;
}

/**
 * iOS oh iOS, how much I love you.
 * https://pqina.nl/blog/total-canvas-memory-use-exceeds-the-maximum-limit/
 */
function releaseCanvas(canvas: HTMLCanvasElement) {
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 1, 1);
  }
}

async function renderPage({ canvasContainer, page }: RenderPageParams) {
  canvasContainer.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.style.height = '100%';
  canvas.style.width = '100%';
  canvasContainer.appendChild(canvas);

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Could not get canvas context');
  }

  const pixelRatio = window.devicePixelRatio || 1;
  const viewport = page.getViewport({ scale: pixelRatio });
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext = {
    canvasContext: context,
    viewport,
  };

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();

  await page.render(renderContext);

  return { canvas };
}

export interface UseRenderPdfParams {
  canvasContainer?: HTMLDivElement;
  isVisible?: boolean;
  fileUrl?: string;
  pageNumber?: number;
  onDocumentLoaded?: (docInfo: { title: string; numPages: number }) => void;
}

// Only render PDF it was visible for at least `RENDER_DELAY` milliseconds
const RENDER_DELAY = 100;

// Free up memory if document is invisible for at least `FREE_MEMORY_DELAY` milliseconds
const DESTROY_DOCUMENT_AFTER = 2000;

export function useRenderPdf({
  canvasContainer,
  isVisible = true,
  fileUrl,
  pageNumber = 1,
  onDocumentLoaded,
}: UseRenderPdfParams) {
  const [lastHeight, setLastHeight] = useState<number>();
  const [canvasElem, setCanvasElem] = useState<HTMLCanvasElement>();

  const [displayState, setDisplayState] = useState<
    'idle' | 'loading' | 'loaded' | 'error' | 'rendered'
  >('idle');

  const [loadedPdf, setPdf] = useState<
    LoadPdfResult & { pageNumber: number }
  >();

  const log = useMemo(() => {
    return function log(...msg: any[]) {
      if (process.env.NODE_ENV === 'development') {
        const filename = pdfjs.getFilenameFromUrl(fileUrl ?? '');
        console.log(`[${filename}]`, ...msg);
      }
    };
  }, [fileUrl]);

  useEffect(() => {
    // When URL changes, reset the loaded document so the one with
    // the new URL can be loaded (otherwise the document object will
    // be reused)
    if (fileUrl && loadedPdf) {
      log(`URL changed, resetting loaded document`);
      setPdf(undefined);
    }
  }, [fileUrl]);

  useEffect(() => {
    let didCancel = false;

    if (
      isVisible &&
      fileUrl &&
      (loadedPdf?.pageNumber === undefined ||
        loadedPdf.pageNumber !== pageNumber)
    ) {
      setTimeout(() => {
        if (!didCancel) {
          (async () => {
            setDisplayState('loading');
            const result = await loadPage({
              fileUrl,
              pageNumber,
              pdfDocument: loadedPdf?.pdfDocument,
            });
            setDisplayState('loaded');
            setPdf({
              ...result,
              pageNumber,
            });
          })();
        }
      }, RENDER_DELAY);
    }

    return () => {
      didCancel = true;
    };
  }, [isVisible, fileUrl, pageNumber, loadedPdf?.pdfDocument]);

  useEffect(() => {
    let didCancel = false;
    if (
      loadedPdf?.page &&
      isVisible &&
      canvasContainer &&
      displayState !== 'rendered'
    ) {
      setTimeout(() => {
        if (!didCancel) {
          (async () => {
            log(`Rendering page ${pageNumber}`);
            const { canvas } = await renderPage({
              canvasContainer,
              page: loadedPdf.page,
            });

            const canvasElemHeight = canvasContainer.clientHeight;
            if (!didCancel) {
              setCanvasElem(canvas);
              setLastHeight(canvasElemHeight);
              setDisplayState('rendered');
            }
          })();
        }
      }, RENDER_DELAY);
    }

    return () => {
      didCancel = true;
    };
  }, [loadedPdf?.page, isVisible, canvasContainer]);

  useEffect(() => {
    let didCancel = false;

    if (fileUrl && loadedPdf?.pdfDocument && onDocumentLoaded) {
      (async () => {
        const metadata = await loadedPdf.pdfDocument.getMetadata();
        const filename = pdfjs.getFilenameFromUrl(fileUrl);
        const docInfo = metadata.info as any;
        const docTitle = docInfo?.Title ?? filename;
        if (!didCancel) {
          onDocumentLoaded({
            title: docTitle,
            numPages: loadedPdf.pdfDocument.numPages,
          });
        }
      })();
    }

    return () => {
      didCancel = true;
    };
  }, [loadedPdf?.pdfDocument, onDocumentLoaded]);

  useEffect(() => {
    let didCancel = false;
    let timeout: number;

    if (!isVisible && loadedPdf?.pdfDocument && displayState === 'rendered') {
      // Free up memory
      timeout = window.setTimeout(() => {
        if (!didCancel && !loadedPdf.page.destroyed) {
          log(`Destroying document`);
          loadedPdf.pdfDocument.destroy();
          if (canvasElem) {
            releaseCanvas(canvasElem);
          }
          setPdf(undefined);
          setDisplayState('idle');
        }
      }, DESTROY_DOCUMENT_AFTER);
    }

    return () => {
      didCancel = true;
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
      }
    };
  }, [loadedPdf?.pdfDocument, isVisible, displayState]);

  return { displayState, lastHeight };
}
