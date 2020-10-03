import ACTION_TYPES from '../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.TENANT_LIST_FETCHING_DATA
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
    type: ACTION_TYPES.FILTER_NAME_CHANGED,
    payload: text
  };
};


export const cityChanged = (text) => {
  return {
    type: ACTION_TYPES.FILTER_CITY_CHANGED,
    payload: text
  };
};

export const stateChanged = (text) => {
  return {
    type: ACTION_TYPES.FILTER_STATE_CHANGED,
    payload: text
  };
};

export const postalCodeChanged = (text) => {
  return {
    type: ACTION_TYPES.FILTER_POSTAL_CODE_CHANGED,
    payload: text
  };
};
export const clearTenantListRes = (text) => {
  return {
    type: ACTION_TYPES.CLEAR_TENANT_LIST_RES,
    payload: text
  };
};
export const callTenantListOnClearFilter = (text) => {
  return {
    type: ACTION_TYPES.CALL_TENANT_LIST_API_ON_CLEAR_FILTER,
    payload: text
  };
};

export const updateTenantList = (text) => {

  return {
    type: ACTION_TYPES.UPDATE_TENANT_LIST,
    payload: text
  };
  
};
