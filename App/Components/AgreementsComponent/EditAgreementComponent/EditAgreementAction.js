import ACTION_TYPES from '../../../Action/ActionsType';


export function showLoading() {
  return {
    type: ACTION_TYPES.ADD_AGREEMENT_SHOW_LOADING
  }
}

export function resetState() {
  return {
    type: ACTION_TYPES.RESET_DATA
  }
}

export function clearOwnerData() {
  return {
    type: ACTION_TYPES.CLEAR_OWNER_DATA
  }
}

export function clearAgencyData() {
  return {
    type: ACTION_TYPES.CLEAR_AGENCY_DATA
  }
}
export function clearUploadAgreementImageRes() {
  return {
    type: ACTION_TYPES.CLEAR_AGREEMENT_UPLOAD_IMAGE_RES
  }
}

export function clearTenantsData() {
  return {
    type: ACTION_TYPES.CLEAR_TENANTS_DATA
  }
}
export function clearUpdatedAgreementData() {
  return {
    type: ACTION_TYPES.CLEAR_UPDATED_AGREEMENT_DATA
  }
}

 export const propertyNameChanged = (text) => {
  return {
    type: ACTION_TYPES.AGREEMENT_PROPERTY_NAME_CHANGE,
    payload: text
  };
};

export const propertyOwnerChanged = (text) => {
  return {
    type: ACTION_TYPES.AGREEMENT_PROPERTY_OWNER_NAME_CHANGE,
    payload: text
  };
}; 

export const searchTenantsChanged = (text) => {
  return {
    type: ACTION_TYPES.AGREEMENT_PROPERTY_TENANTS_SEARCH_CHANGE,
    payload: text
  };
};

export const updateAgreementData = (text) => {
  return {
    type: ACTION_TYPES.UPDATE_AGREEMENT_DATA,
    payload: text
  };
};

 