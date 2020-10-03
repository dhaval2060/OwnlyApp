import ACTION_TYPES from '../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.MAINTENANCE_LIST_FETCHING_DATA
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}


export const updateScene = (text) => {
  return {
    type: ACTION_TYPES.UPDATE_MAINTENANCE_SCREEN,
    payload: text
  };
};

 