import { getRefs } from './js/getRefs';
import { PixabayAPI } from './js/PixabayAPI';
import { addMarkup } from './js/addMarkup';
import { onError, onInfo, onSuccess } from './js/notify';
import { simpleLightbox } from './js/simpleLightbox';
import { scrollPage } from './js/scrollPage';

const refs = getRefs();
const pixabayAPI = new PixabayAPI();

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onClick);

async function onSubmit(e) {
  e.preventDefault();

  const { searchQuery } = e.currentTarget.elements;
  clearPage();
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    return onError('You not input query.');
  }

  pixabayAPI.query = query;

  const { hits, totalHits } = await pixabayAPI.getPhotos();
  if (hits.length === 0) {
    return onError(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  pixabayAPI.calculateTotalPages(totalHits);

  if (!pixabayAPI.isShowLoadMore) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  }

  addMarkup(hits, refs.galleryList);
  onSuccess(`Hooray! We found ${totalHits} images.`);
  simpleLightbox();
  // window.addEventListener('scroll', handleInfiniteScroll);
}

async function onClick() {
  pixabayAPI.incrementPage();

  const { hits } = await pixabayAPI.getPhotos();
  addMarkup(hits, refs.galleryList);
  simpleLightbox().refresh();
  scrollPage();

  if (pixabayAPI.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
    return onInfo("We're sorry, but you've reached the end of search results.");
  }
}

function clearPage() {
  refs.galleryList.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
  pixabayAPI.resetPage();
}

// async function handleInfiniteScroll() {
//   const endOfPage =
//     window.scrollY + window.innerHeight >=
//     document.documentElement.scrollHeight;

//   if (endOfPage) {
//     pixabayAPI.incrementPage();

//     const { hits } = await pixabayAPI.getPhotos();
//     addMarkup(hits, refs.galleryList);
//     simpleLightbox().refresh();
//   }

//   if (!pixabayAPI.isShowLoadMore) {
//     window.removeEventListener('scroll', handleInfiniteScroll);
//     onSuccess("We're sorry, but you've reached the end of search results.");
//   }
// }
