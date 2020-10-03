import ACTION_TYPES from '../../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.NEW_MAINTENANCE_LIST_FETCHING_DATA
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

export function clearUploadedImageRes() {
  return {
    type: ACTION_TYPES.CLEAR_MAINTENANCE_UPLOAD_IMG_RES
  }
}


export const tradersChanged = (text) => {
  return {
    type: ACTION_TYPES.MAINTENANCE_TRADERS_CHANGED,
    payload: text
  };
};
export const searchWatcherChanged = (text) => {
  return {
    type: ACTION_TYPES.SEARCH_WATCHER_NAME_CHANGE,
    payload: text
  };
};

 export const propertyNameChanged = (text) => {
  return {
    type: ACTION_TYPES.MAINTENANCE_PROPERTY_NAME_CHANGE,
    payload: text
  };
};
 export const maintenanceBudgetChanged = (text) => {
  return {
    type: ACTION_TYPES.MAINTENANCE_BUDGET_CHANGE,
    payload: text
  };
}; 
export const maintenanceReqNameChanged = (text) => {
  return {
    type: ACTION_TYPES.MAINTENANCE_REQ_NAME_CHANGE,
    payload: text
  };
};
export const maintenanceReqDetailChanged = (text) => {
  return {
    type: ACTION_TYPES.MAINTENANCE_REQ_DETAIL_CHANGE,
    payload: text
  };
};

export const clearAddMaintenanceRes = (text) => {
  return {
    type: ACTION_TYPES.CLEAR_ADD_MAINTENANCE_RES,
    payload: ''
  };
};
