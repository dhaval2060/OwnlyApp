import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {

	messageListRes: '',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.MESSAGE_SHOW_LOADING:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.MESSAGE_LIST_RES:
			return { ...state, messageListRes: action.payload, isScreenLoading: false }

		default:
			return state;
	}

};
