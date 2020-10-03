import ACTION_TYPES from '../../../Action/ActionsType';

//call for show progress 
export function showLoading() {
  return {
    type: ACTION_TYPES.EDIT_AMENITIES_LIST_FETCHING_DATA
  }
}

//call for clear the reducer data
export function resetState() {
  return {
    type: ACTION_TYPES.EDIT_RESET_DATA
  }
}
export function clearAmenitiesRes() {
  return {
    type: ACTION_TYPES.EDIT_CLEAR_AMENITIES_RES
  }
}
export function clearUploadPropertyImageRes() {
  return {
    type: ACTION_TYPES.EDIT_CLEAR_UPLOAD_PROPERTY_RES
  }
}
export function clearPropertiesRes() {
  return {
    type: ACTION_TYPES.EDIT_CLEAR_PROPERTY_OWNER_RES
  }
}
export function clearPropertiesDetailRes() {
  return {
    type: ACTION_TYPES.EDIT_CLEAR_PROPERTY_DETAIL_RES
  }
}
export const propertyNameChanged = (text) => {
  return {
    type: ACTION_TYPES.EDIT_PROPERTY_NAME_CHANGED,
    payload: text
  };
};
export const propertyCountryChanged = (text) => {
  return {
    type: ACTION_TYPES.EDIT_PROPERTY_COUNTRY_CHANGED,
    payload: text
  };
};

export const propertyCategoryChanged = (text) => {
  return {
    type: ACTION_TYPES.EDIT_PROPERTY_CATEGORY_CHANGED,
    payload: text
  };
};

export const propertyTypeChanged = (text) => {
  return {
    type: ACTION_TYPES.EDIT_PROPERTY_TYPE_CHANGED,
    payload: text
  };
};

export const propertyOwnerChanged = (text) => {
  return {
    type: ACTION_TYPES.EDIT_PROPERTY_OWNER_CHANGED,
    payload: text
  };
};

export const propertyAddressChanged = (text) => {
  return {
    type: ACTION_TYPES.EDIT_PROPERTY_ADDRESS_CHANGED,
    payload: text
  };
};

export const propertyDescChanged = (text) => {
  return {
    type: ACTION_TYPES.EDIT_PROPERTY_DESC_CHANGED,
    payload: text
  };
};

export const numberOfBedroomChanged = (text) => {
  return {
    type: ACTION_TYPES.EDIT_PROPERTY_BEDROOM_CHANGED,
    payload: text
  };
};

export const numberOfCarNoChanged = (text) => {
  return {
    type: ACTION_TYPES.EDIT_PROPERTY_CARNO_CHANGED,
    payload: text
  };
};

export const numberOfBathroomChanged = (text) => {
  return {
    type: ACTION_TYPES.EDIT_PROPERTY_BATHROOM_CHANGED,
    payload: text
  };
};

export const numberOfFloorAreaChanged = (text) => {
  return {
    type: ACTION_TYPES.EDIT_PROPERTY_FLOORAREA_CHANGED,
    payload: text
  };
};

export const numberOfLotAreaChanged = (text) => {
  return {
    type: ACTION_TYPES.EDIT_PROPERTY_LOTAREA_CHANGED,
    payload: text
  };
};
export const selectedPropertyOwnerId = (text) => {
  return {
    type: ACTION_TYPES.EDIT_PROPERTY_OWNER_ID,
    payload: text
  };
};


