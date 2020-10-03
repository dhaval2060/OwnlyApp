import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {
	globalSearchRes: '',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.GLOBAL_SEARCH_LOADING_DATA:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.GLOBAL_SEARCH_RES:
			return { ...state, globalSearchRes: action.payload, isScreenLoading: false }

		default:
			return state;
	}

};
