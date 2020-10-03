import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	

	counterProposalRes: '',
	imageUploadRes:'',
    isScreenLoading: false,

}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.COUNTER_PROPOSAL_SHOW_LOADING:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;
	
		case ACTION_TYPES.UPLOAD_COUNTER_PROPOSAL_IMAGE_RES:

			return { ...state, imageUploadRes: action.payload, isScreenLoading: false }
		
		case ACTION_TYPES.COUNTER_PROPOSAL_REQ_RES:

			return { ...state, counterProposalRes: action.payload, isScreenLoading: false }		

		case ACTION_TYPES.CLEAR_COUNTER_PROPOSAL_UPLOAD_IMG_RES:

			return { ...state, imageUploadRes: '' }
		
		case ACTION_TYPES.CLEAR_COUNTER_PROPOSAL_RES:
            return { ...state, counterProposalRes: action.payload}
        
		default:
			return state;
	}

};
