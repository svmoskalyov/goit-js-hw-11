import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function onError(message) {
  Notify.failure(message, {
    position: 'right-top',
  });
}

export function onSuccess(message) {
  Notify.success(message, {
    position: 'right-top',
  });
}
