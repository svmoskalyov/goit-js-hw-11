import axios from 'axios';
import { onError } from './notify';

axios.defaults.baseURL = 'https://pixabay.com/api';

export class PixabayAPI {
  #query = '';
  #page = 1;
  #totalPages = 0;
  #perPage = 40;
  #searchParams = {
    params: {
      key: '30324311-49af4374e5f205d24fc51a3b0',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.#perPage,
    },
  };

  async getPhotos() {
    try {
      const url = `/?q=${this.#query}&page=${this.#page}`;
      const { data } = await axios.get(url, this.#searchParams);
      return data;
    } catch (error) {
      onError(error.message);
      clearPage();
    }
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
