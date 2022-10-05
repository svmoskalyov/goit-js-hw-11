import { createGalleryCards } from './createGalleryCards';

export function addMarkup(photos, item) {
  const markup = createGalleryCards(photos);
  item.insertAdjacentHTML('beforeend', markup);
}
