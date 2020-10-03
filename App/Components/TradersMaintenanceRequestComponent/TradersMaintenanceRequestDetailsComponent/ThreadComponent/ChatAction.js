import ACTION_TYPES from '../../../../Action/ActionsType';

//call for show progress 
export function showLoading() {
  return {
    type: ACTION_TYPES.SHARE_IMAGE_FOR_CHAT_SHOW_LOADING
  } 
}

//call for clear the reducer data
export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

export const updateScene = (text) => {
  return {
    type: ACTION_TYPES.UPDATE_THREAD_SCREEN,
    payload: text
  };
};

export const clearUploadedImageRes = (text) => {
  return {
    type: ACTION_TYPES.CLEAR_SHARE_IMAGE_FOR_CHAT_RESPONSE,
    payload: ''
  };
};
 

