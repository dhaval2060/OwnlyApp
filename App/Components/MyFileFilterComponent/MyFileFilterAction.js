import ACTION_TYPES from '../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.FILTER_FILE_SHOW_LOADING
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

export const fileNameChanged = (text) => {
  return {
    type: ACTION_TYPES.FILTER_FILE_NAME_CHANGED,
    payload: text
  };
};

export const clearFilter = (text) => {
  return {
    type: ACTION_TYPES.CLEAR_FILE_FILTER,
    payload: text
  };
};