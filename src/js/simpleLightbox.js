import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export function simpleLightbox() {
  return new SimpleLightbox('.gallery a', {
    enableKeyboard: true,
  });
}
