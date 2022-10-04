import { getRefs } from './js/getRefs';
import { PixabayAPI } from './js/PixabayAPI';
import { onError, onSuccess } from './js/notify';
import { createGalleryCards } from './js/createGalleryCards';

const refs = getRefs();
const pixabayAPI = new PixabayAPI({ perPage: 40 });

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onClick);

function onSubmit(e) {
  e.preventDefault();

  const { searchQuery } = e.currentTarget.elements;
  clearPage();
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    console.log('NO input query');
    return;
  }

  pixabayAPI.query = query;

  pixabayAPI
    .getPhotos()
    .then(({ hits, totalHits }) => {
      if (hits.length === 0) {
        onError(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      pixabayAPI.calculateTotalPages(totalHits);

      if (pixabayAPI.isShowLoadMore) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      }

      addMarkup(hits);
      onSuccess(`Hooray! We found ${totalHits} images.`);
    })
    .catch(error => {
      onError(error.message);
      clearPage();
    });
}

function onClick() {
  pixabayAPI.incrementPage();

  if (!pixabayAPI.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
    onSuccess("We're sorry, but you've reached the end of search results.");
    return;
  }

  pixabayAPI
    .getPhotos()
    .then(({ hits }) => {
      addMarkup(hits);
    })
    .catch(error => {
      onError(error.message);
      clearPage();
    });
}

function addMarkup(photos) {
  const markup = createGalleryCards(photos);
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
}

function clearPage() {
  refs.galleryList.innerHTML = '';
  pixabayAPI.resetPage();
  refs.loadMoreBtn.classList.add('is-hidden');
}

// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
