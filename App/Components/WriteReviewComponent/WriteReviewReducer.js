import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {
	reviewText: '',
	writeReviewRes: '',
	isScreenLoading:false,
	isRatingUpdate:''
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.WRITE_REVIEW_LOADING:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.WRITE_REVIEW_RESET_DATA:
			return { ...state, writeReviewRes: '' }
		
		case ACTION_TYPES.WRITE_REVIEW_TEXT_CHANGE:
			return { ...state, reviewText: action.payload}

		case ACTION_TYPES.WRITE_REVIEW_RES:
			return { ...state, writeReviewRes: action.payload,isScreenLoading:false }

		case ACTION_TYPES.UPDATE_RATINGS:
			return { ...state, isRatingUpdate: action.payload }
		default:
			return state;
	}

};
