export function createGalleryCards(images) {
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
            <img class="gallery-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes: </b>${likes}
                </p>
                <p class="info-item">
                    <b>Views: </b>${views}
                 </p>
                <p class="info-item">
                    <b>Comments: </b>${comments}
                </p>
                <p class="info-item">
                    <b>Downloads: </b>${downloads}
                </p>
            </div>
        </div>`
    )
    .join('');
}
