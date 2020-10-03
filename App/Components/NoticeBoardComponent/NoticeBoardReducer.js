import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {

	noticeBoardListResponse: '',
	noticeBoardDetailListResponse: '',
	isScreenLoading: false,
	userRoleData: '',
	propertyListData: '',
	noticeNameChanged: '',
	noticeDescriptionChanged: '',
	addNoticeboardRes: '',
	noticeBoardUpdateRes: '',
	noticeBardPostDetailRes: '',
	noticePostDeleteRes: '',
	deleteNoticeboardRes: '',
	adminStatistics:''
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.NOTICE_BOARD_LIST_FETCHING_DATA:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.NOTICE_BOARD_LIST:
			return { ...state, noticeBoardListResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_NOTICE_BOARD_DETAIL_LIST_RES:
			return { ...state, noticeBoardDetailListResponse: action.payload, isScreenLoading: false }

		case ACTION_TYPES.USER_ROLE_LIST:
			return { ...state, userRoleData: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_PROPERTY_FOR_CREATE_NOTICE_RES:
			return { ...state, propertyListData: action.payload, isScreenLoading: false }

		case ACTION_TYPES.NOTICE_NAME_CHANGED:
			return { ...state, noticeNameChanged: action.payload }

		case ACTION_TYPES.NOTICE_DESCRIPTION_CHANGED:
			return { ...state, noticeDescriptionChanged: action.payload }

		case ACTION_TYPES.ADD_NOTICE_BOARD:
			return { ...state, addNoticeboardRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.EDIT_NOTICE_BOARD_RES:
			return { ...state, noticeBoardUpdateRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_NOTICE_BOARD_POST_DETAIL_RES:
			return { ...state, noticeBardPostDetailRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.DELETE_NOTICEBOARD_POST_RES:
			return { ...state, noticePostDeleteRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.DELETE_NOTICE_BOARD_RES:
			return { ...state, deleteNoticeboardRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_ADMIN_STATASTICS:
			return { ...state, adminStatistics: action.payload, isScreenLoading: false }

		default:
			return state;
	}

};
