import ACTION_TYPES from '../../Action/ActionsType';

// Email Or Username TextField Value Change
export const reviewTextChange = (text) => {
  return {
    type: ACTION_TYPES.WRITE_REVIEW_TEXT_CHANGE,
    payload: text
  };
};

export function showLoading() {
  return {
    type: ACTION_TYPES.WRITE_REVIEW_LOADING
  }
}
export function resetState() {
  return {
    type: ACTION_TYPES.WRITE_REVIEW_RESET_DATA
  }
}

export const updateRating = (text) => {
  return {
    type: ACTION_TYPES.UPDATE_RATINGS,
    payload: text
  };
};

 