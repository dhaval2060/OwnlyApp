import ACTION_TYPES from '../../../Action/ActionsType';

//call for show progress 
export function showLoading() {
  return {
    type: ACTION_TYPES.ADD_PROPERTY_OWNER_LOADING
  }
}

//call for clear the reducer data
export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

export const propertyOwnerFirstNameChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_OWNER_FIRSTNAME_CHANGED,
    payload: text
  };
};
export const propertyOwnerLastNameChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_OWNER_LASTNAME_CHANGED,
    payload: text
  };
};

export const propertyOwnerEmailChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_OWNER_EMAIL_CHANGED,
    payload: text
  };
};

export const propertyOwnerMobileChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_OWNER_MOBILE_CHANGED,
    payload: text
  };
};

export const clearAddOwnerRes = (text) => {
  return {
    type: ACTION_TYPES.CLEAR_ADD_OWNER_RES,
    payload: ''
  };
};



 
 