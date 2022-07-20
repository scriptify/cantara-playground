import { setupAddToHomeScreenListener } from './add-to-homescreen';

export { useAddToHomescreen } from './add-to-homescreen';
export * from './sw';

export default async function setupPwa() {
  setupAddToHomeScreenListener();
}
