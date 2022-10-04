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

  // pixabayAPI.getPhotos().then(data => {
  //   console.log(data);
  // })

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

  // pixabayAPI(query);
  // pixabayAPI(query).then(data => {
  //   // const totalImg = data.totalHits;
  //   //  console.log('totalImg = ', totalImg);
  //   // const hitsImg = data.hits.length;
  //   // console.log("hitsImg = ", hitsImg)
  //   //   console.log(data.hits[0]);
  //   const markup = createMarkupImg(data.hits);
  //   refs.galleryList.insertAdjacentHTML('beforeend', markup);
  // });
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

// function createMarkupImg(images) {
//   return images
//     .map(
//       ({
//         webformatURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => /*html*/ `<div class="photo-card">
//             <img class="gallery-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
//             <div class="info">
//                 <p class="info-item">
//                     <b>Likes: </b>${likes}
//                 </p>
//                 <p class="info-item">
//                     <b>Views: </b>${views}
//                  </p>
//                 <p class="info-item">
//                     <b>Comments: </b>${comments}
//                 </p>
//                 <p class="info-item">
//                     <b>Downloads: </b>${downloads}
//                 </p>
//             </div>
//         </div>`
//     )
//     .join('');
// }
