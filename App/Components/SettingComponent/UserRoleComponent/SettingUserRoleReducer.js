import ACTION_TYPES from '../../../Action/ActionsType';
const INITIAL_STATE = {
	userRoleData: '',
	userActiveRoleData:'',
	saveUserRolesRes:'',
	isScreenLoading: false
}

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {

		case ACTION_TYPES.SHOW_USER_ROLE_LOADING:
			return { ...state, isScreenLoading: true }
	
		case ACTION_TYPES.RESET_DATA:
			return INITIAL_STATE;

		case ACTION_TYPES.USER_ROLE_LIST:
			return { ...state, userRoleData: action.payload, isScreenLoading: false }


		case ACTION_TYPES.GET_USER_ROLES_RES:
			return { ...state, userActiveRoleData: action.payload, isScreenLoading: false }		

		case ACTION_TYPES.SAVE_USER_MULTI_ROLE_RES:
			return { ...state, saveUserRolesRes: action.payload, isScreenLoading: false }


		default:
			return state;
	}

};
