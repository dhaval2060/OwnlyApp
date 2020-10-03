import ACTION_TYPES from '../../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.FORWARD_MAINTENANCE_LIST_FETCHING_DATA
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}


export const tradersChanged = (text) => {
  return {
    type: ACTION_TYPES.FORWARD_MAINTENANCE_TRADERS_CHANGED,
    payload: text
  };
};
export const searchWatcherChanged = (text) => {
  return {
    type: ACTION_TYPES.FORWARD_SEARCH_WATCHER_NAME_CHANGE,
    payload: text
  };
};

 export const propertyNameChanged = (text) => {
  return {
    type: ACTION_TYPES.FORWARD_MAINTENANCE_PROPERTY_NAME_CHANGE,
    payload: text
  };
};
 export const maintenanceBudgetChanged = (text) => {
  return {
    type: ACTION_TYPES.FORWARD_MAINTENANCE_BUDGET_CHANGE,
    payload: text
  };
}; 
export const maintenanceReqNameChanged = (text) => {
  return {
    type: ACTION_TYPES.FORWARD_MAINTENANCE_REQ_NAME_CHANGE,
    payload: text
  };
};
export const maintenanceReqDetailChanged = (text) => {
  return {
    type: ACTION_TYPES.FORWARD_MAINTENANCE_REQ_DETAIL_CHANGE,
    payload: text
  };
};

 