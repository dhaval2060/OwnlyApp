import ACTION_TYPES from '../../../../Action/ActionsType';
const INITIAL_STATE = {

	shareImageForChatResponse: '',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.SHARE_IMAGE_FOR_CHAT_SHOW_LOADING:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.SHARE_IMAGE_FOR_CHAT_RESPONSE:
			return { ...state, shareImageForChatResponse: action.payload, isScreenLoading: false }


		default:
			return state;
	}

};
