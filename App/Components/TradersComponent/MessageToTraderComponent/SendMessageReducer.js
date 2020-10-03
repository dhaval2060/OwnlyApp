import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	messageText: '',
	resSendMsg: '',
	isScreenLoading:false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.SEND_MESSAGE_LOADING:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.SEND_MESSAGE_RESET_DATA:
      		return INITIAL_STATE;
		
		case ACTION_TYPES.SEND_MESSAGE_TEXT_CHANGE:
			return { ...state, messageText: action.payload}

		case ACTION_TYPES.SEND_MESSAGE_RES:
			return { ...state, resSendMsg: action.payload,isScreenLoading:false }

		default:
			return state;
	}

};
