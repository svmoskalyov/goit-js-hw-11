import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getRefs } from './js/getRefs';
import { PixabayAPI } from './js/PixabayAPI';
import { onError, onSuccess } from './js/notify';
import { createGalleryCards } from './js/createGalleryCards';

const refs = getRefs();
const pixabayAPI = new PixabayAPI();

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onClick);

function onSubmit(e) {
  e.preventDefault();

  const { searchQuery } = e.currentTarget.elements;
  clearPage();
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    return onError('You not input query.');
  }

  pixabayAPI.query = query;

  pixabayAPI.getPhotos().then(({ data: { hits, totalHits } }) => {
    if (hits.length === 0) {
      return onError(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    pixabayAPI.calculateTotalPages(totalHits);

    if (pixabayAPI.isShowLoadMore) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }

    addMarkup(hits);
    onSuccess(`Hooray! We found ${totalHits} images.`);
  });
}

function onClick() {
  pixabayAPI.incrementPage();

  if (!pixabayAPI.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
    return onSuccess(
      "We're sorry, but you've reached the end of search results."
    );
  }

  pixabayAPI.getPhotos().then(({ data: { hits } }) => {
    addMarkup(hits);
  });
}

function addMarkup(photos) {
  const markup = createGalleryCards(photos);
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
  simpleLightbox();
}

function clearPage() {
  refs.galleryList.innerHTML = '';
  pixabayAPI.resetPage();
  refs.loadMoreBtn.classList.add('is-hidden');
}

function simpleLightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    enableKeyboard: true,
  });
  lightbox.refresh();
}
