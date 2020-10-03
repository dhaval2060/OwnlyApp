import ACTION_TYPES from '../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.TRADERS_LIST_FETCHING_DATA
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

 //for filter screen

 export const nameChanged = (text) => {
  return {
    type: ACTION_TYPES.TRADER_FILTER_NAME_CHANGED,
    payload: text
  };
};


export const cityChanged = (text) => {
  return {
    type: ACTION_TYPES.TRADER_FILTER_CITY_CHANGED,
    payload: text
  };
};

export const stateChanged = (text) => {
  return {
    type: ACTION_TYPES.TRADER_FILTER_STATE_CHANGED,
    payload: text
  };
};

export const postalCodeChanged = (text) => {
  return {
    type: ACTION_TYPES.TRADER_FILTER_POSTAL_CODE_CHANGED,
    payload: text
  };
};
export const clearTraderListRes = (text) => {
  return {
    type: ACTION_TYPES.CLEAR_TRADER_LIST_RES,
    payload: text
  };
};
export const callTraderListOnClearFilter = (text) => {
  return {
    type: ACTION_TYPES.CALL_TRADER_LIST_API_ON_CLEAR_FILTER,
    payload: text
  };
};

 