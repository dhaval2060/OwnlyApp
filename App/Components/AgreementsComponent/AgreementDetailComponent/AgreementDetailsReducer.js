import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {

	agreementDetailRes:'',
	deleteAgreement:'',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.SHOW_LOADING_AGREEMENT_DETAIL:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.GET_AGREEMENT_DETAIL_RES:
			return { ...state, agreementDetailRes: action.payload, isScreenLoading: false }
		
		case ACTION_TYPES.DELETE_AGREEMENT_RES:
			return { ...state, deleteAgreement: action.payload, isScreenLoading: false }


		default:
			return state;
	}

};
