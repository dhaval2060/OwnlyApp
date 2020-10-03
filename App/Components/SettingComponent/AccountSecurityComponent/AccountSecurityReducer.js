import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	currentPassword: '',
	newPassword: '',
	changePasswordRes: '',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.CHANGE_PASSWORD_LOADER:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_CHANGE_PASSWORD_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.CHANGE_PASSWORD_RES:
			return { ...state, changePasswordRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.CHANGE_CURRENT_PASSWORD:
			return { ...state, currentPassword: action.payload }

		case ACTION_TYPES.CHANGE_NEW_PASSWORD:
			return { ...state, newPassword: action.payload }

		case ACTION_TYPES.CHANGE_PASSWORD_CLEAR_RES:
			return { ...state, changePasswordRes: '' }

		default:
			return state;
	}

};
