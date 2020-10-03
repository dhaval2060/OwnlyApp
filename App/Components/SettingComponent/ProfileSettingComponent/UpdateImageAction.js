import ACTION_TYPES from '../../../Action/ActionsType';

//call for show progress 
export function showLoading() {
  return {
    type: ACTION_TYPES.UPDATE_USER_IMAGE_LOADER
  }
}

//call for show progress 
export function showScreenLoading() {
  return {
    type: ACTION_TYPES.UPDATE_USER_DETAIL_LOADER
  }
}

//call for clear the reducer data
export function resetState() {
  return {
    type: ACTION_TYPES.RESET_UPDATE_USER_IMAGE_DATA
  }
}

// Phone number Change
export const phoneNumberChanged = (text) => {
  return {
    type: ACTION_TYPES.PHONE_NUMBER_CHANGED,
    payload: text
  }
};

// suburb postcode Change
export const suburbPostcodeChanged = (text) => {
  return {
    type: ACTION_TYPES.SUBURB_OR_POSTCODE_CHANGED,
    payload: text
  }
};

// business name Change
export const businessNameChanged = (text) => {
  return {
    type: ACTION_TYPES.BUSINESS_NAME_CHANGED,
    payload: text
  }
};

// abn number Change
export const abnNumberChanged = (text) => {
  return {
    type: ACTION_TYPES.ABN_NUMBER_CHANGED,
    payload: text
  }
};

// latitude Change
export const latitudeChanged = (text) => {
  return {
    type: ACTION_TYPES.LATITUDE_CHANGED,
    payload: text
  }
};


// longitude Change
export const longitudeChanged = (text) => {
  return {
    type: ACTION_TYPES.LONGITUDE_CHANGED,
    payload: text
  }
};

// About user Change
export const aboutUserChanged = (text) => {
  return {
    type: ACTION_TYPES.ABOUT_USER_CHANGED,
    payload: text
  }
};

// first name Change
export const firstNameChanged = (text) => {
  return {
    type: ACTION_TYPES.FIRST_NAME_CHANGED,
    payload: text
  }
};

// last name Change
export const lastNameChanged = (text) => {
  return {
    type: ACTION_TYPES.LAST_NAME_CHANGED,
    payload: text
  }
};

// city name Change
export const cityNameChanged = (text) => {
  return {
    type: ACTION_TYPES.CITY_NAME_CHANGED,
    payload: text
  }
};

// zip code Change
export const zipCodeChanged = (text) => {
  return {
    type: ACTION_TYPES.ZIP_CODE_CHANGED,
    payload: text
  }
};

// zip code Change
export const rateChanged = (text) => {
  return {
    type: ACTION_TYPES.RATE_CHANGED,
    payload: text
  }
};

export const stateChanged = (text) => {
  return {
    type: ACTION_TYPES.STATE_CHANGED,
    payload: text
  }
};

// clear user response
export const clearUserInfo = () => {
  return {
    type: ACTION_TYPES.CLEAR_USER_DETAILS_RES,
  }
};

// clear image update response
export const clearUserImageInfo = () => {
  return {
    type: ACTION_TYPES.CLEAR_USER_IMAGE_RES,
  }
};

export const agencyChanged = (text) => {
  return {
    type: ACTION_TYPES.AGENCY_CHANGED,
    payload: text
  }
};


export const clearAgencyList = (text) => {
  return {
    type: ACTION_TYPES.CLEAR_AGENCY_LIST,
    payload: text
  }
};

export const clearAssociateAgency = (text) => {
  return {
    type: ACTION_TYPES.CLEAR_ASSOCIATE_WITH_AGENCY,
    payload: text
  }
};




