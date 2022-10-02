const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

formRef.addEventListener('submit', onSearch);

function fetchImag(term) {
  const API_KEY = '30324311-49af4374e5f205d24fc51a3b0';
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${term}&image_type=photo&orientation=horizontal&safesearch=true`;

  return fetch(URL).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

// fetchImag('cat');

function onSearch(e) {
  e.preventDefault();

  // const form = e.currentTarget;
  // const searchQuery = form.elements.searchQuery.value;
  const { searchQuery } = e.currentTarget.elements;
  const searchText = searchQuery.value;

  //   if (!searchText) {
  //       console.log('NO text input');
  //     return;
  //   }

  // fetchImag(searchText);
  fetchImag(searchText).then(data => {
    // const totalImg = data.totalHits;
    //  console.log('totalImg = ', totalImg);
    // const hitsImg = data.hits.length;
    // console.log("hitsImg = ", hitsImg)
    //   console.log(data.hits[0]);
    const markup = createMarkupImg(data.hits);
    galleryRef.insertAdjacentHTML('beforeend', markup);
  });
}

// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.

function createMarkupImg(images) {
  return images
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => /*html*/ `<div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes:</b> ${likes}
                </p>
                <p class="info-item">
                    <b>Views:</b> ${views}
                 </p>
                <p class="info-item">
                    <b>Comments:</b> ${comments}
                </p>
                <p class="info-item">
                    <b>Downloads:</b> ${downloads}
                </p>
            </div>
        </div>`
    )
    .join('');
}
