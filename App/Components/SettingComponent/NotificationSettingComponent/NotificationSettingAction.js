import ACTION_TYPES from '../../../Action/ActionsType';

//call for show progress 
export function showLoading() {
  return {
    type: ACTION_TYPES.NOTIFICATION_LOADER
  }
}

//call for clear the reducer data
export function resetState() {
  return {
    type: ACTION_TYPES.RESET_NOTIFICATION_DATA
  }
}

export function clearResponse() {
  return {
    type: ACTION_TYPES.NOTIFICATION_CLEAR_RES
  }
}

export function getNotification() {
  return {
    type: ACTION_TYPES.NOTIFICATION_CLEAR_RES
  }
}

export function getNotificationStatus() {
  return {
    type: ACTION_TYPES.GET_NOTIFICATION_STATUS
  }
}


