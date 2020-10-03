import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	notificationRes: '',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {

		case ACTION_TYPES.NOTIFICATION_LOADER:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_NOTIFICATION_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.NOTIFICATION_RES:
			return { ...state, notificationRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.NOTIFICATION_CLEAR_RES:
			return { ...state, notificationRes: '' }

		case ACTION_TYPES.GET_NOTIFICATION_STATUS:
			return { ...state, notificationStatus: action.payload, isScreenLoading: false }

		default:
			return state;
	}

};
