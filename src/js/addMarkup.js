import { createGalleryCards } from './createGalleryCards';
import { simpleLightbox } from './simpleLightbox';
import { scrollPage } from './scrollPage';

export function addMarkup(photos, item) {
  const markup = createGalleryCards(photos);
  item.insertAdjacentHTML('beforeend', markup);
  simpleLightbox();
  scrollPage();
}
