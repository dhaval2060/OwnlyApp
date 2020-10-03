import ACTION_TYPES from '../../../../Action/ActionsType';
const INITIAL_STATE = {

	shareImageForChatResponse: '',
	isScreenLoading: false,
	acceptDeclineProposalRes: '',
	confirmDeclineRes: '',
	refreshScene:''
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.SHARE_IMAGE_FOR_CHAT_SHOW_LOADING:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.SHARE_IMAGE_FOR_CHAT_RESPONSE:
			return { ...state, shareImageForChatResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.ACCEPT_DECLINE_PROPOSAL_RES:
			return { ...state, acceptDeclineProposalRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.CONFIRM_DECLINE_COMPLETE_JOB_RES:
			return { ...state, confirmDeclineRes: action.payload, isScreenLoading: false }
		

		case ACTION_TYPES.UPDATE_THREAD_SCREEN:
			
				return { ...state, refreshScene: action.payload}
		
		case ACTION_TYPES.CLEAR_SHARE_IMAGE_FOR_CHAT_RESPONSE:
		
				return { ...state, shareImageForChatResponse: action.payload }
		default:
			return state;
	}

};
