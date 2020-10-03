import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {

	propertyListResponse: '',
	likePropertyResponse: '',
	isScreenLoading: false,
	refreshScene:''

}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.PROPERTY_LIST_FETCHING_DATA:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.ALL_PROPERTY_LIST:
			return { ...state, propertyListResponse: action.payload, isScreenLoading: false }


		case ACTION_TYPES.LIKE_PROPERTY_RES:
			return { ...state, likePropertyResponse: action.payload, isScreenLoading: false }
		
		case ACTION_TYPES.UPDATE_PROPERTY_HOME:
			return { ...state, refreshScene: action.payload }

		default:
			return state;
	}

};
