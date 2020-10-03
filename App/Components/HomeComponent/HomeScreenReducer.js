import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {

	propertyListResponse: '',
	noticeBoardListResponse: '',
	likePropertyResponse: '',
	statisticRes: '',
	maintenanceListResponse: '',
	maintenanceThreadListResponse: '',
	generalThreadListResponse: '',
	unreadMsgListResponse: '',
	isHomeScreenLoading: false,
	onTabPressed: '',
	inspectionDataRes:''

}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.HOME_PROPERTY_LIST_FETCHING_DATA:
			return { ...state, isHomeScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.PROPERTY_LIST:
			return { ...state, propertyListResponse: action.payload, isHomeScreenLoading: false }

		case ACTION_TYPES.NOTICE_BOARD_LIST:
			return { ...state, noticeBoardListResponse: action.payload, isHomeScreenLoading: false }

		case ACTION_TYPES.LIKE_PROPERTY_RES:
			return { ...state, likePropertyResponse: action.payload, isHomeScreenLoading: false }

		case ACTION_TYPES.GET_STATISTICS_RES:
			return { ...state, statisticRes: action.payload, isHomeScreenLoading: false }

		case ACTION_TYPES.MAINTENANCE_REQUEST_LIST_RES:
			return { ...state, maintenanceListResponse: action.payload, isHomeScreenLoading: false }

		case ACTION_TYPES.MAINTENANCE_THREAD_LIST_RES:
			return { ...state, maintenanceThreadListResponse: action.payload, isHomeScreenLoading: false }

		case ACTION_TYPES.GENERAL_THREAD_LIST_RES:
			return { ...state, generalThreadListResponse: action.payload, isHomeScreenLoading: false }

		case ACTION_TYPES.GET_UNREAD_MESSAGE_RES:
			return { ...state, unreadMsgListResponse: action.payload, isHomeScreenLoading: false }

		case ACTION_TYPES.DASHBOARD_INSPECTION_RES:
			return { ...state, inspectionDataRes: action.payload, isHomeScreenLoading: false }


		default:
			return state;
	}

};
