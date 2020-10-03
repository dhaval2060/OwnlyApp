import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {

	disputeDetailsRes:'',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.SHOW_LOADING_DISPUTE_DETAIL:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.DISPUTES_DETAILS_RES:
			return { ...state, disputeDetailsRes: action.payload, isScreenLoading: false }

			case ACTION_TYPES.UPDATE_DISPUTE_STATUS_BYID:
			return { ...state, updateDisputeStatus: action.payload, isScreenLoading: false }

		default:
			return state;
	}

};
