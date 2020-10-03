import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	uploadUserImageRes: '',
	userImageResponse: '',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.USER_IMAGE_LIST_FETCHING:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.UPLOAD_USER_IMAGE:
			return { ...state, uploadUserImageRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_USER_IMAGE:
			return { ...state, userImageResponse: action.payload, isScreenLoading: false }

		default:
			return state;
	}

};
