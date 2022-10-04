export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api';
  #query = '';
  #page = 1;
  #totalPages = 0;
  #perPage;
  //   total = 0;
  //   totalHits = 0;
  #searchParams = new URLSearchParams({
    key: '30324311-49af4374e5f205d24fc51a3b0',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  constructor({ perPage = 20 } = {}) {
    this.#perPage = perPage;
  }

  getPhotos() {
    const url = `${PixabayAPI.BASE_URL}/?q=${this.#query}&page=${
      this.#page
    }&per_page=${this.#perPage}&${this.#searchParams}`;

    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }

  get query() {
    return this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }

  calculateTotalPages(totalPhotos) {
    this.#totalPages = Math.ceil(totalPhotos / this.#perPage);
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }
}
