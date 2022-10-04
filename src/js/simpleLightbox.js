import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export function simpleLightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    enableKeyboard: true,
  });
  lightbox.refresh();
}
