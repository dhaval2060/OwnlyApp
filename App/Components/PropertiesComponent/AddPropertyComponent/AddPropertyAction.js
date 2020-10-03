import ACTION_TYPES from '../../../Action/ActionsType';

//call for show progress 
export function showLoading() {
  return {
    type: ACTION_TYPES.AMENITIES_LIST_FETCHING_DATA
  }
}

//call for clear the reducer data
export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}
export function clearAmenitiesRes() {
  return {
    type: ACTION_TYPES.CLEAR_AMENITIES_RES
  }
}
export function clearUploadPropertyImageRes() {
  return {
    type: ACTION_TYPES.CLEAR_UPLOAD_PROPERTY_RES
  }
}
export function clearPropertiesRes() {
  return {
    type: ACTION_TYPES.CLEAR_PROPERTY_OWNER_RES
  }
}
export const propertyNameChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_NAME_CHANGED,
    payload: text
  };
};
export const propertyCountryChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_COUNTRY_CHANGED,
    payload: text
  };
};

export const propertyCategoryChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_CATEGORY_CHANGED,
    payload: text
  };
};

export const propertyTypeChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_TYPE_CHANGED,
    payload: text
  };
};

export const propertyOwnerChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_OWNER_CHANGED,
    payload: text
  };
};

export const propertyAddressChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_ADDRESS_CHANGED,
    payload: text
  };
};

export const propertyDescChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_DESC_CHANGED,
    payload: text
  };
};

export const numberOfBedroomChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_BEDROOM_CHANGED,
    payload: text
  };
};
 
export const numberOfCarNoChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_CARNO_CHANGED,
    payload: text
  };
};
 
export const numberOfBathroomChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_BATHROOM_CHANGED,
    payload: text
  };
};
 
export const numberOfFloorAreaChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_FLOORAREA_CHANGED,
    payload: text
  };
};
 
export const numberOfLotAreaChanged = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_LOTAREA_CHANGED,
    payload: text
  };
};
 export const selectedPropertyOwnerId = (text) => {
  return {
    type: ACTION_TYPES.PROPERTY_OWNER_ID,
    payload: text
  };
};
 export const updateScene = (text) => {
  return {
    type: ACTION_TYPES.UPDATE_ADD_PROPERTY_SCENE,
    payload: text
  };
};


 
 
 