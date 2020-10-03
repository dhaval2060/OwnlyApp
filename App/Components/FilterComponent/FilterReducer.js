import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {
	
	cityChangeText:'',
	stateChangeText:'',
	propertyType:'Select property type',
	filterRes:'',
	isScreenLoading: false,
	isFilterClear:''
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.FILTER_SHOW_LOADING:

			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:

			return INITIAL_STATE;

		case ACTION_TYPES.FILTER_PROPERTY_RES:

			return { ...state, filterRes: action.payload, isScreenLoading: false }		

		case ACTION_TYPES.FILTER_STATE_CHANGED:

			return { ...state, stateChangeText: action.payload }
		
		case ACTION_TYPES.FILTER_CITY_CHANGED:

			return { ...state, cityChangeText: action.payload }

		case ACTION_TYPES.FILTER_PROPERTY_TYPE_CHANGED:

			return { ...state, propertyType: action.payload }
		
		case ACTION_TYPES.CLEAR_FILTER_RES:

			return { ...state, filterRes:'' }
		
		case ACTION_TYPES.RESET_PROPERTY_LIST:

			return { ...state, isFilterClear:action.payload }

		default:
			return state;
	}

};
