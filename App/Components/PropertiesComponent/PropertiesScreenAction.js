import ACTION_TYPES from '../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.PROPERTY_LIST_FETCHING_DATA
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

export function onTabPressed(data) {

  return {
    type: ACTION_TYPES.TAB_PRESS,
    payload: data
  }
}

export const updateScene = (text) => {
  return {
    type: ACTION_TYPES.UPDATE_PROPERTY_HOME,
    payload: text
  };
};



