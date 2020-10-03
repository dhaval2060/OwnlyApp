import ACTION_TYPES from '../../../Action/ActionsType';

//call for show progress 
export function showLoading() {
  return {
    type: ACTION_TYPES.USER_IMAGE_LIST_FETCHING
  }
}

//call for clear the reducer data
export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}



