import ACTION_TYPES from '../../Action/ActionsType';
const INITIAL_STATE = {
	switchUserProfileRes: '',
	userActiveRolesRes:'',
	userPermissionRes: '',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.SWITCH_USER_PROFILE_SHOW_LOADING:
			return { ...state, isScreenLoading: true }

		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.GET_USER_ROLES_RES:
			return { ...state, switchUserProfileRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_USER_ACTIVE_ROLES_RES:
			return { ...state, userActiveRolesRes: action.payload, isScreenLoading: false }

		case ACTION_TYPES.GET_USER_PERMISSSION_RES:
			return { ...state, userPermissionRes: action.payload, isScreenLoading: false }

		default:
			return state;
	}

};
