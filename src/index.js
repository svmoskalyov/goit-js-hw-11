import { getRefs } from './js/getRefs';
import { PixabayAPI } from './js/PixabayAPI';
import { addMarkup } from './js/addMarkup';
import { onError, onSuccess } from './js/notify';

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

    addMarkup(hits, refs.galleryList);
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
    addMarkup(hits, refs.galleryList);
  });
}

function clearPage() {
  refs.galleryList.innerHTML = '';
  pixabayAPI.resetPage();
  refs.loadMoreBtn.classList.add('is-hidden');
}
