import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {

	userProfileRes: '',
	userReviewRes: '',
	userAllReviewRes: '',
	userRoleReviewRes: '',
	updateBannerImgRes: '',
	agencyPropertyRes: '',
	isScreenLoading: false,
	agencyProfileRes: '',
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.USER_PROFILE_SHOW_LOADING:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.USER_PROFILE_RES:
			return { ...state, userProfileRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_USER_REVIEW_RES:
			return { ...state, userReviewRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_ALL_USER_REVIEW_RES:
			return { ...state, userAllReviewRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_USER_ROLE_REVIEW_RES:
			return { ...state, userRoleReviewRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.UPLOAD_BANNER_IMG_RES:
			return { ...state, updateBannerImgRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_AGENCY_PROPERTY_RES:
			return { ...state, agencyPropertyRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.AGENCY_PROFILE_RES:
			return { ...state, agencyProfileRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.ADD_RESPONSE_RES:
			return { ...state, addResponse: action.payload, isScreenLoading: false }


		default:
			return state;
	}

};
