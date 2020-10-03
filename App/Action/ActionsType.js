const ACTION_TYPES = {

	//user login action keys 
	USER_NAME_CHANGED: 'USER_NAME',
	PASSWORD_CHANGED: 'PASSWORD_CHANGED',
	LOGIN_USER_RES: 'LOGIN_USER_RES',
	FETCHING_DATA: 'FETCHING_DATA',
	RESET_DATA: 'RESET_DATA',

	//user forgot password action keys 
	FORGOT_PASS_FETCHING_DATA: 'FORGOT_PASS_FETCHING_DATA',
	FORGOT_PASS_RESET_DATA: 'FORGOT_PASS_RESET_DATA',
	FORGOT_PASS_RES: 'FORGOT_PASS_RES',
	FORGOT_PASS_EMAIL_CHANGED: 'FORGOT_PASS_EMAIL_CHANGED',

	//user registration action keys
	FIRST_NAME_CHANGED: 'FIRST_NAME_CHANGED',
	LAST_NAME_CHANGED: 'LAST_NAME_CHANGED',
	EMAIL_CHANGED: 'EMAIL_CHANGED',
	PHONE_NUMBER_CHANGED: 'PHONE_NUMBER_CHANGED',
	SUBURB_OR_POSTCODE_CHANGED : 'SUBURB_OR_POSTCODE_CHANGED',
	BUSINESS_NAME_CHANGED : 'BUSINESS_NAME_CHANGED',
	ABN_NUMBER_CHANGED : 'ABN_NUMBER_CHANGED',
	LATITUDE_CHANGED : 'LATITUDE_CHANGED',
	LONGITUDE_CHANGED : 'LONGITUDE_CHANGED',
	SIGNUP_PASSWORD_CHANGED: 'SIGNUP_PASSWORD_CHANGED',
	CONFIRM_PASSWORD_CHANGED: 'CONFIRM_PASSWORD_CHANGED',
	SIGNUP_USER_RES: 'SIGNUP_USER_RES',
	USER_TYPE: 'USER_TYPE',
	SIGNUP_FETCHING_DATA: 'SIGNUP_FETCHING_DATA',

	//27 Nov
	USER_ROLE_LIST: 'USER_ROLE_LIST',

	//Logout action keys
	LOGOUT_FETCHING_DATA: 'LOGOUT_FETCHING_DATA',
	USER_LOGOUT: 'USER_LOGOUT',
	LOGOUT_USER_RES: 'LOGOUT_USER_RES',


	//Property screen 
	ALL_PROPERTY_LIST: 'ALL_PROPERTY_LIST',
	PROPERTY_LIST_FETCHING_DATA: 'PROPERTY_LIST_FETCHING_DATA',

	//Home screen 
	PROPERTY_LIST: 'PROPERTY_LIST',
	HOME_PROPERTY_LIST_FETCHING_DATA: 'HOME_PROPERTY_LIST_FETCHING_DATA',

	//Add property
	AMENITIES_LIST: 'AMENITIES_LIST',
	ADD_PRPERTY_RES: 'ADD_PRPERTY_RES',
	CLEAR_AMENITIES_RES: 'CLEAR_AMENITIES_RES',
	AMENITIES_LIST_FETCHING_DATA: 'AMENITIES_LIST_FETCHING_DATA',
	PROPERTY_NAME_CHANGED: 'PROPERTY_NAME_CHANGED',
	PROPERTY_COUNTRY_CHANGED: 'PROPERTY_COUNTRY_CHANGED',
	PROPERTY_TYPE_CHANGED: 'PROPERTY_TYPE_CHANGED',
	PROPERTY_OWNER_CHANGED: 'PROPERTY_OWNER_CHANGED',
	PROPERTY_ADDRESS_CHANGED: 'PROPERTY_ADDRESS_CHANGED',
	PROPERTY_DESC_CHANGED: 'PROPERTY_DESC_CHANGED',
	PROPERTY_BEDROOM_CHANGED: 'PROPERTY_BEDROOM_CHANGED',
	PROPERTY_CARNO_CHANGED: 'PROPERTY_CARNO_CHANGED',
	PROPERTY_BATHROOM_CHANGED: 'PROPERTY_BATHROOM_CHANGED',
	PROPERTY_FLOORAREA_CHANGED: 'PROPERTY_FLOORAREA_CHANGED',
	PROPERTY_LOTAREA_CHANGED: 'PROPERTY_LOTAREA_CHANGED',
	PROPERTY_DESC2_CHANGED: 'PROPERTY_DESC2_CHANGED',
	UPLOAD_PROPERTY_IMAGE: 'UPLOAD_PROPERTY_IMAGE',
	UPLOAD_PROPERTY_IMAGE_BY_ID: 'UPLOAD_PROPERTY_IMAGE_BY_ID',
	PROPERTY_OWNER_LIST: 'PROPERTY_OWNER_LIST',
	CLEAR_PROPERTY_OWNER_RES: 'CLEAR_PROPERTY_OWNER_RES',
	PROPERTY_OWNER_ID: 'PROPERTY_OWNER_ID',
	CLEAR_UPLOAD_PROPERTY_RES: 'CLEAR_UPLOAD_PROPERTY_RES',

	//Resend password action keys
	RESEND_PASS_FETCHING_DATA: 'RESEND_PASS_FETCHING_DATA',
	RESEND_PASS_RESET_DATA: 'RESEND_PASS_RESET_DATA',
	RESEND_PASS_RES: 'RESEND_PASS_RES',

	//GET TENANT LIST
	TENANT_LIST_RES: 'TENANT_LIST_RES',
	TENANT_LIST_FETCHING_DATA: 'TENANT_LIST_FETCHING_DATA',
	GET_PROPERTY_BY_AGENT_RES: 'GET_PROPERTY_BY_AGENT_RES',
	SHOW_ADD_TANENT_LOADING: 'SHOW_ADD_TANENT_LOADING',
	TENANT_PROPERTY_ID: 'TENANT_PROPERTY_ID',
	TENANT_PROPERTY_CHANGED: 'TENANT_PROPERTY_CHANGED',
	TENANT_FIRST_NAME_CHANGED: 'TENANT_FIRST_NAME_CHANGED',
	TENANT_LAST_NAME_CHANGED: 'TENANT_LAST_NAME_CHANGED',
	TENANT_EMAIL_CHANGED: 'TENANT_EMAIL_CHANGED',
	TENANT_PHONE_CHANGED: 'TENANT_PHONE_CHANGED',
	ADD_TANENT_RES: 'ADD_TANENT_RES',
	TENANT_PROFILE_RES: 'TENANT_PROFILE_RES',

	//TRADERS LIST
	TRADERS_LIST_FETCHING_DATA: 'TRADERS_LIST_FETCHING_DATA',
	TRADERS_LIST_RES: 'TRADERS_LIST_RES',


	//Send message
	SEND_MESSAGE_RES: 'SEND_MESSAGE_RES',
	SEND_MESSAGE_LOADING: 'SEND_MESSAGE_LOADING',
	SEND_MESSAGE_RESET_DATA: 'SEND_MESSAGE_RESET_DATA',
	SEND_MESSAGE_TEXT_CHANGE: 'SEND_MESSAGE_TEXT_CHANGE',


	TRADERS_PROFILE_RES: 'TRADERS_PROFILE_RES',
	ADD_PROPERTY_OWNER_RES: 'ADD_PROPERTY_OWNER_RES',

	ADD_PROPERTY_OWNER_LOADING: 'ADD_PROPERTY_OWNER_LOADING',
	PROPERTY_OWNER_FIRSTNAME_CHANGED: 'PROPERTY_OWNER_FIRSTNAME_CHANGED',
	PROPERTY_OWNER_LASTNAME_CHANGED: 'PROPERTY_OWNER_LASTNAME_CHANGED',
	PROPERTY_OWNER_EMAIL_CHANGED: 'PROPERTY_OWNER_EMAIL_CHANGED',
	PROPERTY_OWNER_MOBILE_CHANGED: 'PROPERTY_OWNER_MOBILE_CHANGED',

	PROPERTY_DETAIL_SHOW_LOADING: 'PROPERTY_DETAIL_SHOW_LOADING',
	PROPERTY_DETAIL_RES: 'PROPERTY_DETAIL_RES',

	CLEAR_SIGN_UP_RESPONSE: 'CLEAR_SIGN_UP_RESPONSE',
	LOGIN_USER_RES_CLEAR: 'LOGIN_USER_RES_CLEAR',

	GET_USER_ROLES_RES: 'GET_USER_ROLES_RES',
	GET_USER_ACTIVE_ROLES_RES: 'GET_USER_ACTIVE_ROLES_RES',
	SWITCH_USER_PROFILE_SHOW_LOADING: 'SWITCH_USER_PROFILE_SHOW_LOADING',

	USER_IMAGE_LIST_FETCHING: 'USER_IMAGE_LIST_FETCHING',
	UPLOAD_USER_IMAGE: 'UPLOAD_USER_IMAGE',

	LIKE_PROPERTY_RES: 'LIKE_PROPERTY_RES',
	GET_USER_PERMISSSION_RES: 'GET_USER_PERMISSSION_RES',

	USER_PROFILE_RES: 'USER_PROFILE_RES',
	USER_PROFILE_SHOW_LOADING: 'USER_PROFILE_SHOW_LOADING',

	SAVE_PROPERTY_AS_DRAFT_RES: 'SAVE_PROPERTY_AS_DRAFT_RES',

	GET_USER_IMAGE: 'GET_USER_IMAGE',


	UPDATE_USER_IMAGE_LOADER: 'UPDATE_USER_IMAGE_LOADER',
	UPDATE_USER_DETAIL_LOADER: 'UPDATE_USER_DETAIL_LOADER',
	UPDATE_USER_IMAGE_RES: 'UPDATE_USER_IMAGE_RES',
	CLEAR_USER_IMAGE_RES: 'CLEAR_USER_IMAGE_RES',
	RESET_UPDATE_USER_IMAGE_DATA: 'RESET_UPDATE_USER_IMAGE_DATA',

	USER_DETAILS_RES: 'USER_DETAILS_RES',
	UPDATE_USER_DETAILS_RES: 'UPDATE_USER_DETAILS_RES',
	CLEAR_USER_DETAILS_RES: 'CLEAR_USER_DETAILS_RES',

	PHONE_NUMBER_CHANGED: 'PHONE_NUMBER_CHANGED',
	ABOUT_USER_CHANGED: 'ABOUT_USER_CHANGED',

	CHANGE_PASSWORD_LOADER: 'CHANGE_PASSWORD_LOADER',
	CHANGE_CURRENT_PASSWORD: 'CHANGE_CURRENT_PASSWORD',
	CHANGE_NEW_PASSWORD: 'CHANGE_NEW_PASSWORD',
	RESET_CHANGE_PASSWORD_DATA: 'RESET_CHANGE_PASSWORD_DATA',
	CHANGE_PASSWORD_RES: 'CHANGE_PASSWORD_RES',
	CHANGE_PASSWORD_CLEAR_RES: 'CHANGE_PASSWORD_CLEAR_RES',


	NOTIFICATION_LOADER: 'NOTIFICATION_LOADER',
	RESET_NOTIFICATION_DATA: 'RESET_NOTIFICATION_DATA',
	NOTIFICATION_RES: 'NOTIFICATION_RES',
	NOTIFICATION_CLEAR_RES: 'NOTIFICATION_CLEAR_RES',

	//update property
	EDIT_RESET_DATA: 'EDIT_RESET_DATA',
	EDIT_AMENITIES_LIST: 'EDIT_AMENITIES_LIST',
	EDIT_ADD_PRPERTY_RES: 'EDIT_ADD_PRPERTY_RES',
	EDIT_CLEAR_AMENITIES_RES: 'EDIT_CLEAR_AMENITIES_RES',
	EDIT_AMENITIES_LIST_FETCHING_DATA: 'EDIT_AMENITIES_LIST_FETCHING_DATA',
	EDIT_PROPERTY_NAME_CHANGED: 'EDIT_PROPERTY_NAME_CHANGED',
	EDIT_PROPERTY_COUNTRY_CHANGED: 'EDIT_PROPERTY_COUNTRY_CHANGED',
	EDIT_PROPERTY_TYPE_CHANGED: 'EDIT_PROPERTY_TYPE_CHANGED',
	EDIT_PROPERTY_OWNER_CHANGED: 'EDIT_PROPERTY_OWNER_CHANGED',
	EDIT_PROPERTY_ADDRESS_CHANGED: 'EDIT_PROPERTY_ADDRESS_CHANGED',
	EDIT_PROPERTY_DESC_CHANGED: 'EDIT_PROPERTY_DESC_CHANGED',
	EDIT_PROPERTY_BEDROOM_CHANGED: 'EDIT_PROPERTY_BEDROOM_CHANGED',
	EDIT_PROPERTY_CARNO_CHANGED: 'EDIT_PROPERTY_CARNO_CHANGED',
	EDIT_PROPERTY_BATHROOM_CHANGED: 'EDIT_PROPERTY_BATHROOM_CHANGED',
	EDIT_PROPERTY_FLOORAREA_CHANGED: 'EDIT_PROPERTY_FLOORAREA_CHANGED',
	EDIT_PROPERTY_LOTAREA_CHANGED: 'EDIT_PROPERTY_LOTAREA_CHANGED',
	EDIT_PROPERTY_DESC2_CHANGED: 'EDIT_PROPERTY_DESC2_CHANGED',
	EDIT_UPLOAD_PROPERTY_IMAGE: 'EDIT_UPLOAD_PROPERTY_IMAGE',
	EDIT_PROPERTY_OWNER_LIST: 'EDIT_PROPERTY_OWNER_LIST',
	EDIT_CLEAR_PROPERTY_OWNER_RES: 'EDIT_CLEAR_PROPERTY_OWNER_RES',
	EDIT_PROPERTY_OWNER_ID: 'EDIT_PROPERTY_OWNER_ID',
	EDIT_CLEAR_UPLOAD_PROPERTY_RES: 'EDIT_CLEAR_UPLOAD_PROPERTY_RES',
	PROPERTY_DETAIL_FOR_UPDATE_RES: 'PROPERTY_DETAIL_FOR_UPDATE_RES',
	EDIT_CLEAR_PROPERTY_DETAIL_RES: 'EDIT_CLEAR_PROPERTY_DETAIL_RES',

	PHONE_NUMBER_CHANGED: 'PHONE_NUMBER_CHANGED',
	ABOUT_USER_CHANGED: 'ABOUT_USER_CHANGED',
	CITY_NAME_CHANGED: 'CITY_NAME_CHANGED',
	ZIP_CODE_CHANGED: 'ZIP_CODE_CHANGED',

	MAINTENANCE_REQUEST_LIST_RES: 'MAINTENANCE_REQUEST_LIST_RES',
	MAINTENANCE_LIST_FETCHING_DATA: 'MAINTENANCE_LIST_FETCHING_DATA',

	GET_TRADERS_OPTION_LIST_RES: 'GET_TRADERS_OPTION_LIST_RES',
	GET_AGENCY_PROPERTY_LIST_RES: 'GET_AGENCY_PROPERTY_LIST_RES',
	NEW_MAINTENANCE_LIST_FETCHING_DATA: 'NEW_MAINTENANCE_LIST_FETCHING_DATA',
	MAINTENANCE_TRADERS_CHANGED: 'MAINTENANCE_TRADERS_CHANGED',

	GET_WATCHER_LIST_RES: 'GET_WATCHER_LIST_RES',
	SEARCH_WATCHER_NAME_CHANGE: 'SEARCH_WATCHER_NAME_CHANGE',

	GET_MAINTENANCE_REQ_BY_TENANT_RES: 'GET_MAINTENANCE_REQ_BY_TENANT_RES',

	UPLOAD_MAINTENANCE_IMAGE_RES: 'UPLOAD_MAINTENANCE_IMAGE_RES',

	ADD_MAINTENANCE_REQ_RES: 'ADD_MAINTENANCE_REQ_RES',

	SHOW_USER_ROLE_LOADING: 'SHOW_USER_ROLE_LOADING',
	SAVE_USER_MULTI_ROLE_RES: 'SAVE_USER_MULTI_ROLE_RES',

	MAINTENANCE_PROPERTY_NAME_CHANGE: 'MAINTENANCE_PROPERTY_NAME_CHANGE',
	MAINTENANCE_BUDGET_CHANGE: 'MAINTENANCE_BUDGET_CHANGE',
	MAINTENANCE_REQ_NAME_CHANGE: 'MAINTENANCE_REQ_NAME_CHANGE',
	MAINTENANCE_REQ_DETAIL_CHANGE: 'MAINTENANCE_REQ_DETAIL_CHANGE',
	CLEAR_MAINTENANCE_UPLOAD_IMG_RES: 'CLEAR_MAINTENANCE_UPLOAD_IMG_RES',

	NOTICE_BOARD_LIST: 'NOTICE_BOARD_LIST',
	GET_MAINTENANCE_DETAIL_RES: 'GET_MAINTENANCE_DETAIL_RES',
	SHOW_LOADING_MAINTENANCE_DETAIL: 'SHOW_LOADING_MAINTENANCE_DETAIL',

	//notifiaction screen
	NOTIFICATION_LIST_FETCHING_DATA: 'NOTIFICATION_LIST_FETCHING_DATA',
	NOTIFICATION_LIST: 'NOTIFICATION_LIST',

	UPLOADED_DOCUMENT_RES: 'UPLOADED_DOCUMENT_RES',

	MY_FILE_SHOW_LOADING: 'MY_FILE_SHOW_LOADING',
	FAV_UPLOADED_DOCUMENT_RES: 'FAV_UPLOADED_DOCUMENT_RES',
	ADD_DOCUMENT_TO_FAV_RES: 'ADD_DOCUMENT_TO_FAV_RES',


	GET_AGREEMENT_LIST_RES: 'GET_AGREEMENT_LIST_RES',
	AGREEMENTS_SHOW_LOADING: 'AGREEMENTS_SHOW_LOADING',
	GET_AGREEMENT_PROPERTY_LIST_RES: 'GET_AGREEMENT_PROPERTY_LIST_RES',
	AGREEMENT_PROPERTY_NAME_CHANGE: 'AGREEMENT_PROPERTY_NAME_CHANGE',
	ADD_AGREEMENT_SHOW_LOADING: 'ADD_AGREEMENT_SHOW_LOADING',
	GET_PROPERTY_WONER_LIST_RES: 'GET_PROPERTY_WONER_LIST_RES',
	AGREEMENT_PROPERTY_OWNER_NAME_CHANGE: 'AGREEMENT_PROPERTY_OWNER_NAME_CHANGE',
	CLEAR_OWNER_DATA: 'CLEAR_OWNER_DATA',
	GET_PROPERTY_TENANT_LIST_RES: 'GET_PROPERTY_TENANT_LIST_RES',
	CLEAR_TENANTS_DATA: 'CLEAR_TENANTS_DATA',
	AGREEMENT_PROPERTY_TENANTS_SEARCH_CHANGE: 'AGREEMENT_PROPERTY_TENANTS_SEARCH_CHANGE',
	ADD_AGREEMENT_RES: 'ADD_AGREEMENT_RES',
	GET_STATISTICS_RES: 'GET_STATISTICS_RES',
	GET_AGREEMENT_DETAIL_RES: 'GET_AGREEMENT_DETAIL_RES',
	SHOW_LOADING_AGREEMENT_DETAIL: 'SHOW_LOADING_AGREEMENT_DETAIL',
	UPLOAD_MYFILE_RES: 'UPLOAD_MYFILE_RES',
	UPLOAD_AGREEMENT_IMAGE_RES: 'UPLOAD_AGREEMENT_IMAGE_RES',
	CLEAR_AGREEMENT_UPLOAD_IMAGE_RES: 'CLEAR_AGREEMENT_UPLOAD_IMAGE_RES',

	CLEAR_AGENCY_DATA: 'CLEAR_AGENCY_DATA',
	DELETE_AGREEMENT_RES: 'DELETE_AGREEMENT_RES',


	FORWARD_MAINTENANCE_LIST_FETCHING_DATA: 'FORWARD_MAINTENANCE_LIST_FETCHING_DATA',
	GET_FORWARD_TRADERS_OPTION_LIST_RES: 'GET_FORWARD_TRADERS_OPTION_LIST_RES',
	GET_FORWARD_AGENCY_PROPERTY_LIST_RES: 'GET_FORWARD_AGENCY_PROPERTY_LIST_RES',
	GET_FORWARD_WATCHER_LIST_RES: 'GET_FORWARD_WATCHER_LIST_RES',
	FORWARD_MAINTENANCE_REQ_RES: 'FORWARD_MAINTENANCE_REQ_RES',
	FORWARD_MAINTENANCE_TRADERS_CHANGED: 'FORWARD_MAINTENANCE_TRADERS_CHANGED',
	FORWARD_SEARCH_WATCHER_NAME_CHANGE: 'FORWARD_SEARCH_WATCHER_NAME_CHANGE',
	FORWARD_MAINTENANCE_PROPERTY_NAME_CHANGE: 'FORWARD_MAINTENANCE_PROPERTY_NAME_CHANGE',
	FORWARD_MAINTENANCE_BUDGET_CHANGE: 'FORWARD_MAINTENANCE_BUDGET_CHANGE',
	FORWARD_MAINTENANCE_REQ_NAME_CHANGE: 'FORWARD_MAINTENANCE_REQ_NAME_CHANGE',
	FORWARD_MAINTENANCE_REQ_DETAIL_CHANGE: 'FORWARD_MAINTENANCE_REQ_DETAIL_CHANGE',

	CLEAR_ADD_OWNER_RES: 'CLEAR_ADD_OWNER_RES',
	GET_AGREEMENT_BY_PROPERTY_RES: 'GET_AGREEMENT_BY_PROPERTY_RES',
	CLEAR_AGREEMENT_BY_PROPERTY_ID_RES: 'CLEAR_AGREEMENT_BY_PROPERTY_ID_RES',
	TENANT_AGREEMENT_SELECTED_ID: 'TENANT_AGREEMENT_SELECTED_ID',
	TENANT_AGREEMENT_CHANGED: 'TENANT_AGREEMENT_CHANGED',
	UPDATE_ADD_PROPERTY_SCENE: 'UPDATE_ADD_PROPERTY_SCENE',
	GET_TENANCIES_HISTORY_RES: 'GET_TENANCIES_HISTORY',
	GET_AGREEMENT_PROPERTY_WONER_LIST_RES: 'GET_AGREEMENT_PROPERTY_WONER_LIST_RES',
	GET_AGREEMENT_FOR_PROPERTY_RES: 'GET_AGREEMENT_FOR_PROPERTY_RES',
	GET_MAINTENANCE_HISTORY_RES: 'GET_MAINTENANCE_HISTORY_RES',
	NOTICE_BOARD_LIST_FETCHING_DATA: 'GET_MAINTENANCE_HISTORY_RES',
	MESSAGE_SHOW_LOADING: 'MESSAGE_SHOW_LOADING',
	MESSAGE_LIST_RES: 'MESSAGE_LIST_RES',
	GET_UNREAD_MESSAGE_RES: 'GET_UNREAD_MESSAGE_RES',
	GET_NOTICE_BOARD_DETAIL_LIST_RES: 'GET_NOTICE_BOARD_DETAIL_LIST_RES',

	WRITE_REVIEW_LOADING: 'WRITE_REVIEW_LOADING',
	WRITE_REVIEW_RESET_DATA: 'WRITE_REVIEW_RESET_DATA',
	WRITE_REVIEW_TEXT_CHANGE: 'WRITE_REVIEW_TEXT_CHANGE',
	WRITE_REVIEW_RES: 'WRITE_REVIEW_RES',
	GET_USER_REVIEW_RES: 'GET_USER_REVIEW_RES',
	FILTER_PROPERTY_RES: 'FILTER_PROPERTY_RES',

	FILTER_CITY_CHANGED: 'FILTER_CITY_CHANGED',
	FILTER_STATE_CHANGED: 'FILTER_STATE_CHANGED',
	FILTER_SHOW_LOADING: 'FILTER_SHOW_LOADING',
	FILTER_PROPERTY_TYPE_CHANGED: 'FILTER_PROPERTY_TYPE_CHANGED',


	//Chat module
	SHARE_IMAGE_FOR_CHAT_SHOW_LOADING: 'SHARE_IMAGE_FOR_CHAT_SHOW_LOADING',
	SHARE_IMAGE_FOR_CHAT_RESPONSE: 'SHARE_IMAGE_FOR_CHAT_RESPONSE',

	//tab press event
	TAB_PRESS: 'TAB_PRESS',

	STATE_CHANGED: 'STATE_CHANGED',

	GET_ALL_USER_REVIEW_RES: 'GET_ALL_USER_REVIEW_RES',
	GET_USER_ROLE_REVIEW_RES: 'GET_USER_ROLE_REVIEW_RES',

	GET_ALL_MAINTENANCE_LIST_THREAD_RES: 'GET_ALL_MAINTENANCE_LIST_THREAD_RES',

	MAINTENANCE_THREAD_LIST_RES: 'MAINTENANCE_THREAD_LIST_RES',
	GENERAL_THREAD_LIST_RES: 'GENERAL_THREAD_LIST_RES',

	UPLOAD_BANNER_IMG_RES: 'UPLOAD_BANNER_IMG_RES',
	UPDATE_AGREEMENT_RES: 'UPDATE_AGREEMENT_RES',
	CANCEL_MAINTENANCE_REQ_RES: 'CANCEL_MAINTENANCE_REQ_RES',

	AGENT_LIST_FETCHING_DATA: 'AGENT_LIST_FETCHING_DATA',
	ALL_AGENT_LIST: 'ALL_AGENT_LIST',
	CLEAR_AGENT_DATA: 'CLEAR_AGENT_DATA',
	AGENT_LIST_WITH_IN_AGENCY: 'AGENT_LIST_WITH_IN_AGENCY',
	AGENT_PROFILE_DATA: 'AGENT_PROFILE_DATA',
	DELETE_AGENT: 'DELETE_AGENT',

	ADD_USER_AS_FAV_RES: 'ADD_USER_AS_FAV_RES',

	GET_AGREEMENT_FOR_TENANT_PROFILE_RES: 'GET_AGREEMENT_FOR_TENANT_PROFILE_RES',

	TRADERS_JOB_HISTORY_RES: 'TRADERS_JOB_HISTORY_RES',
	GET_FAV_TRADERS_RES: 'GET_FAV_TRADERS_RES',

	GLOBAL_SEARCH_RES: 'GLOBAL_SEARCH_RES',
	GLOBAL_SEARCH_LOADING_DATA: 'GLOBAL_SEARCH_LOADING_DATA',
	ADD_AGENT_BY_AGENCY_RES: 'ADD_AGENT_BY_AGENCY_RES',

	ADD_AGENCY_AGENT_LOADING: 'ADD_AGENCY_AGENT_LOADING',
	AGENCY_AGENT_FIRSTNAME_CHANGED: 'AGENCY_AGENT_FIRSTNAME_CHANGED',
	AGENCY_AGENT_LASTNAME_CHANGED: 'AGENCY_AGENT_LASTNAME_CHANGED',
	AGENCY_AGENT_EMAIL_CHANGED: 'AGENCY_AGENT_EMAIL_CHANGED',
	AGENCY_AGENT_MOBILE_CHANGED: 'AGENCY_AGENT_MOBILE_CHANGED',
	CLEAR_ADD_AGENCY_AGENT_RES: 'CLEAR_ADD_AGENCY_AGENT_RES',
	AGENCY_AGENT_PASSWORD_CHANGED: 'AGENCY_AGENT_PASSWORD_CHANGED',
	UPDATE_AGENT_LIST: 'UPDATE_AGENT_LIST',

	// tenant filter constant
	FILTER_NAME_CHANGED: 'FILTER_NAME_CHANGED',
	FILTER_CITY_CHANGED: 'FILTER_CITY_CHANGED',
	FILTER_STATE_CHANGED: 'FILTER_STATE_CHANGED',
	FILTER_POSTAL_CODE_CHANGED: 'FILTER_POSTAL_CODE_CHANGED',

	FILTER_FILE_NAME_CHANGED: 'FILTER_FILE_NAME_CHANGED',
	FILTER_FILE_SHOW_LOADING: 'FILTER_FILE_SHOW_LOADING',
	FILTER_FILE_RES: 'FILTER_FILE_RES',
	GET_AGENCY_PROPERTY_RES: 'GET_AGENCY_PROPERTY_RES',

	// traders filter constant
	TRADER_FILTER_NAME_CHANGED: 'TRADER_FILTER_NAME_CHANGED',
	TRADER_FILTER_CITY_CHANGED: 'TRADER_FILTER_CITY_CHANGED',
	TRADER_FILTER_STATE_CHANGED: 'TRADER_FILTER_STATE_CHANGED',
	TRADER_FILTER_POSTAL_CODE_CHANGED: 'TRADER_FILTER_POSTAL_CODE_CHANGED',

	AGENCY_CHANGED: 'AGENCY_CHANGED',
	AGENCY_LIST: 'AGENCY_LIST',
	ASSOCIATE_WITH_AGENCY: 'ASSOCIATE_WITH_AGENCY',

	PROPERTY_CATEGORY_CHANGED: 'PROPERTY_CATEGORY_CHANGED',
	EDIT_PROPERTY_CATEGORY_CHANGED: 'EDIT_PROPERTY_CATEGORY_CHANGED',

	CLEAR_FILTER_RES: 'CLEAR_FILTER_RES',
	RESET_PROPERTY_LIST: 'RESET_PROPERTY_LIST',
	CLEAR_TENANT_LIST_RES: 'CLEAR_TENANT_LIST_RES',
	CALL_TENANT_LIST_API_ON_CLEAR_FILTER: 'CALL_TENANT_LIST_API_ON_CLEAR_FILTER',
	CLEAR_TRADER_LIST_RES: 'CLEAR_TRADER_LIST_RES',
	CALL_TRADER_LIST_API_ON_CLEAR_FILTER: 'CALL_TRADER_LIST_API_ON_CLEAR_FILTER',
	MAINTENANCE_ACCEPT_AND_DENIED_RES: 'MAINTENANCE_ACCEPT_AND_DENIED_RES',
	CLEAR_AGENCY_LIST: 'CLEAR_AGENCY_LIST',
	CLEAR_ASSOCIATE_WITH_AGENCY: 'CLEAR_ASSOCIATE_WITH_AGENCY',
	UPDATE_PROPERTY_HOME: 'UPDATE_PROPERTY_HOME',
	UPDATE_MAINTENANCE_SCREEN: 'UPDATE_MAINTENANCE_SCREEN',


	COUNTER_PROPOSAL_SHOW_LOADING: 'COUNTER_PROPOSAL_SHOW_LOADING',
	UPLOAD_COUNTER_PROPOSAL_IMAGE_RES: 'UPLOAD_COUNTER_PROPOSAL_IMAGE_RES',
	COUNTER_PROPOSAL_REQ_RES: 'COUNTER_PROPOSAL_REQ_RES',
	CLEAR_COUNTER_PROPOSAL_UPLOAD_IMG_RES: 'CLEAR_COUNTER_PROPOSAL_UPLOAD_IMG_RES',

	GET_COUNTER_PROPOSAL_DATA: 'GET_COUNTER_PROPOSAL_DATA',

	POST_TITLE_CHANGED: 'POST_TITLE_CHANGED',
	POST_AGENDA_CHANGED: 'POST_AGENDA_CHANGED',
	POST_DESCRIPTION_CHANGED: 'POST_DESCRIPTION_CHANGED',
	LOADING_ADD_POST: 'LOADING_ADD_POST',
	ADD_POST_RES: 'ADD_POST_RES',

	DELETE_NOTICEBOARD_POST_RES: 'DELETE_NOTICEBOARD_POST_RES',

	ADD_NOTICE_BOARD: 'ADD_NOTICE_BOARD',

	NOTICE_NAME_CHANGED: 'NOTICE_NAME_CHANGED',
	NOTICE_DESCRIPTION_CHANGED: 'NOTICE_DESCRIPTION_CHANGED',
	POST_NAME_CHANGED: 'POST_NAME_CHANGED',

	DISPUTES_LIST_FETCHING_DATA: 'DISPUTES_LIST_FETCHING_DATA',
	DISPUTES_LIST_RES: 'DISPUTES_LIST_RES',
	DISPUTES_DETAILS_RES: 'DISPUTES_DETAILS_RES',

	SHOW_LOADING_DISPUTE_DETAIL: 'SHOW_LOADING_DISPUTE_DETAIL',

	UPDATE_PROPERTY_HOME: 'UPDATE_PROPERTY_HOME',

	AGENCY_PROFILE_RES: 'AGENCY_PROFILE_RES',

	UPDATE_AGREEMENT_LIST: 'UPDATE_AGREEMENT_LIST',

	ACCEPT_DECLINE_PROPOSAL_RES: 'ACCEPT_DECLINE_PROPOSAL_RES',

	CONFIRM_DECLINE_COMPLETE_JOB_RES: 'CONFIRM_DECLINE_COMPLETE_JOB_RES',

	COMPLETE_JOB_RES: 'COMPLETE_JOB_RES',

	ADD_DISPUTES_RES: 'ADD_DISPUTES_RES',

	//Add dispute
	UPDATE_DISPUTE_STATUS_BYID: 'UPDATE_DISPUTE_STATUS_BYID',
	DISPUTE_PROPERTY_NAME_CHANGED: 'DISPUTE_PROPERTY_NAME_CHANGED',
	DISPUTE_AGENT_NAME_CHANGED: 'DISPUTE_AGENT_NAME_CHANGED',
	DISPUTE_TENANT_NAME_CHANGED: 'DISPUTE_TENANT_NAME_CHANGED',
	DISPUTE_OWNER_NAME_CHANGED: 'DISPUTE_OWNER_NAME_CHANGED',
	DISPUTE_SUBJECT_NAME_CHANGED: 'DISPUTE_SUBJECT_NAME_CHANGED',
	DISPUTE_MESSAGE_NAME_CHANGED: 'DISPUTE_MESSAGE_NAME_CHANGED',
	CLEAR_DISPUTE_TENANT_DATA: 'CLEAR_DISPUTE_TENANT_DATA',

	SEND_DATA_TO_THREAD_SCREEN: 'SEND_DATA_TO_THREAD_SCREEN',

	CLEAR_ADD_AGREEMENT_RES: 'CLEAR_ADD_AGREEMENT_RES',
	UPDATE_TENANT_LIST: 'UPDATE_TENANT_LIST',
	CLEAR_ADD_TENANT_RES: 'CLEAR_ADD_TENANT_RES',
	CLEAR_ADD_DISPUTES_RES: 'CLEAR_ADD_DISPUTES_RES',
	UPDATE_DISPUTES_LIST: 'UPDATE_DISPUTES_LIST',

	CLEAR_ADD_MAINTENANCE_RES: 'CLEAR_ADD_MAINTENANCE_RES',

	MARK_AS_COMPLETE_SHOW_LOADING: 'MARK_AS_COMPLETE_SHOW_LOADING',
	MARK_AS_COMPLETE_REQ_RES: 'MARK_AS_COMPLETE_REQ_RES',
	CLEAR_COUNTER_PROPOSAL_RES: 'CLEAR_COUNTER_PROPOSAL_RES',

	UPDATE_THREAD_SCREEN: 'UPDATE_THREAD_SCREEN',
	CLEAR_SHARE_IMAGE_FOR_CHAT_RESPONSE: 'CLEAR_SHARE_IMAGE_FOR_CHAT_RESPONSE',

	DASHBOARD_INSPECTION_RES: 'DASHBOARD_INSPECTION_RES',
	GET_STATUS_USER_ASSOCIATE_WITH_PROPERTY_RES: 'GET_STATUS_USER_ASSOCIATE_WITH_PROPERTY_RES',
	GET_PROPERTY_FOR_CREATE_NOTICE_RES: 'GET_PROPERTY_FOR_CREATE_NOTICE_RES',

	EDIT_NOTICE_BOARD_RES: 'EDIT_NOTICE_BOARD_RES',
	GET_NOTICE_BOARD_POST_DETAIL_RES: 'GET_NOTICE_BOARD_POST_DETAIL_RES',
	DELETE_NOTICE_BOARD_RES: 'DELETE_NOTICE_BOARD_RES',

	CLEAR_FILE_FILTER: 'CLEAR_FILE_FILTER',
	DELETE_MY_FILE_RES: 'DELETE_MY_FILE_RES',

	UPDATE_AGREEMENT_DATA: 'UPDATE_AGREEMENT_DATA',
	CLEAR_UPDATED_AGREEMENT_DATA: 'CLEAR_UPDATED_AGREEMENT_DATA',

	UPDATE_RATINGS: 'UPDATE_RATINGS',

	ADD_RESPONSE_RES: 'ADD_RESPONSE_RES',

	GET_NOTIFICATION_STATUS: 'GET_NOTIFICATION_STATUS',

	READ_UNREAD_MESSAGE: 'READ_UNREAD_MESSAGE',

	GET_ADMIN_STATASTICS: 'GET_ADMIN_STATASTICS',

	GET_USER_ROLE_BY_ID:'GET_USER_ROLE_BY_ID'
}

export default ACTION_TYPES
