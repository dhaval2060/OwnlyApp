import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {
	
	notificationListResponse: '',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.NOTIFICATION_LIST_FETCHING_DATA:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.NOTIFICATION_LIST:
			return { ...state, notificationListResponse: action.payload, isScreenLoading: false }

		default:
			return state;
	}

};
