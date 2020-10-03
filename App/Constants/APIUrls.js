// export const GOOGLE_MAP_API_KEY = "AIzaSyCGWZqTcVNj2IeuAud3EsdL3ewktb0yCFo"
export const GOOGLE_MAP_API_KEY = "AIzaSyAcsffhmEtVjGpN2oZmpe0pIKtDsBWkkhU"


//devlopment
// export const BASE_URL = 'http://portal.syncitt.world:5095/api/';
// export const URL = 'http://portal.syncitt.world:5095';
// export const CHAT_CONNECTION_URL = 'http://portal.syncitt.world:5094';

// production
export const BASE_URL = 'https://portal.ownly.com.au:5095/api/';
export const URL = 'https://portal.ownly.com.au:5095';
export const CHAT_CONNECTION_URL = 'http://portal.ownly.com.au:5094';

const API = {

	USER_LOGIN: BASE_URL + 'userLogin',
	FORGOT_PASSWORD: BASE_URL + 'forgotPassword',
	USER_REGISTRATION: BASE_URL + 'userRegister',
	USER_LOGOUT: BASE_URL + 'userLogout',
	GET_PROPERTY_LIST: BASE_URL + 'allProperty',
	GET_ALL_PROPERTY_LIST: BASE_URL + 'getDatabaseProperty',
	GET_AMENITIES_LIST: BASE_URL + 'getAmenites',
	GET_USER_ROLES_LIST: BASE_URL + 'roles',

	CREATE_PRPERTY: BASE_URL + 'createProperty',
	UPLOAD_PROPERTY_IMAGE: BASE_URL + 'uploadMobilePropertyImage',
	UPLOAD_PROPERTY_IMAGE_BY_ID: BASE_URL + 'createPropertyImage',
	GET_PROPERTY_OWNER: BASE_URL + 'getPropertyOwner',
	GET_TENANT_LIST: BASE_URL + 'tenantsList',
	GET_TRADERS_LIST: BASE_URL + 'tradersList',
	SEND_MESSAGE: BASE_URL + 'sendMessage',
	READ_UNREAD_MESSAGE: BASE_URL + 'updateMessageAsRead',
	GET_PROPERTY_BY_AGENT: BASE_URL + 'getPropertyByAgentId',
	ADD_NEW_TANENT: BASE_URL + 'addNewTenant',
	GET_USER_PROFILE: BASE_URL + 'getUserDetails',
	ADD_PROPERTY_OWNER: BASE_URL + 'addPropertyOwner',
	GET_PROPERTY_DETAIL: BASE_URL + 'singleProperty',
	GET_USER_ROLES: BASE_URL + 'getUserRoles',
	UPLOAD_USER_IMAGE: BASE_URL + 'uploadAgentImages',
	LIKE_PROPERTY: BASE_URL + 'addToFavouritesProperty',
	GET_USER_PERMISSION: BASE_URL + 'getUserPermission',
	SAVE_PROPERTY_AS_DRAFT: BASE_URL + 'savePropertyAsDraft',

	// UPDATE_USER_IMAGE: BASE_URL + 'updateUserPic',
	UPDATE_USER_IMAGE: BASE_URL + 'updateAvatarPic',
	GET_USER_IMAGE: BASE_URL + 'getUserImage',
	GET_USER_DETAILS: BASE_URL + 'getUserDetails',
	CHANGE_PASSWORD: BASE_URL + 'changePassword',

	// UPDATE_NOTIFICATION_SETTING			: 	BASE_URL + 'updateUserNotificationSettings',

	UPDATE_NOTIFICATION_SETTING: BASE_URL + 'saveNotificationStatus',
	GET_NOTIFICATION_STATUS_API: BASE_URL + 'userNotificationStatus',

	UPDATE_USER_DETAILS: BASE_URL + 'updateUserProfile',
	GET_FAVIOURATE_PROPERTY: BASE_URL + 'getFaviouratePropertyList',
	GET_MAINTENANCE_REQUEST_LIST: BASE_URL + 'maintenanceList',
	GET_MAINTENANCE_THREAD_LIST: BASE_URL + 'generalThreadForMaintenance',
	GET_TRADERS_OPTION_LIST: BASE_URL + 'tradersOptionList',
	GET_AGENCY_PROPERTY: BASE_URL + 'getAcencyProperties',
	GET_WATCHER_LIST: BASE_URL + 'getWatchersList/',
	UPLOAD_MAINTENANCE_REQ_IMAGE: BASE_URL + 'uploadMobileMaintenanceImage',
	PROPERTY_LIST_FOR_MAINTENANCE_REQ: BASE_URL + 'propertyListForMaintenance',
	GET_MAINTENANCE_REQ_BY_TENANT: BASE_URL + 'maintenanceRequestByTenant',
	ADD_MAINTENANCE_REQ: BASE_URL + 'addMaintenance',
	SAVE_USER_MULTI_ROLE: BASE_URL + 'saveUserMultiRoles',
	GET_NOTICE_BOARD_LIST: BASE_URL + 'noticeboardList',
	GET_MAINTENANCE_DETAIL: BASE_URL + 'getMaintenanceDetail/',
	GET_NOTIFICATION_LIST: BASE_URL + 'notificationList',
	GET_UPLOADED_DOCUMENT: BASE_URL + 'getUploadedDocument',
	GET_FAV_UPLOADED_DOCUMENT: BASE_URL + 'getFavUploadedDocument',
	ADD_DOCUMENT_TO_FAV: BASE_URL + 'addDocumentToFav',
	GET_AGREEMENT_LIST: BASE_URL + 'agreementList',
	GET_PROPERTY_OWNER_LIST: BASE_URL + 'getOwnerListInProperty/',
	GET_PROPERTY_TENANT_LIST: BASE_URL + 'getTenantListInProperty/',
	ADD_AGREEMENT: BASE_URL + 'addAgreements',
	GET_AGREEMENT_DETAIL: BASE_URL + 'agreementDetail/',
	GET_STATISTICS: BASE_URL + 'getStatisticsData',
	UPLOAD_MYFILE_DOC: BASE_URL + 'uploadDocumentsFiles',
	UPLOAD_AGREEMENT_DOC: BASE_URL + 'uploadAgreementDocs',
	DELETE_AGREEMENT: BASE_URL + 'deleteAgreement/',
	FORWARD_MAINTENANCE_REQ: BASE_URL + 'forwardMaintenanceRequest',
	GET_PROPERTY_FOR_ADD_TENANT: BASE_URL + 'getPropertyForAddingTenant',
	GET_AGREEMENT_BY_PROPERTY: BASE_URL + 'getAgreementByProperty/',
	GET_USER_ACTIVE_ROLES: BASE_URL + 'getUserActiveRoles',
	GET_TENANCIES_HISTORY: BASE_URL + 'getTenanciesHistory/',
	GET_AGREEMENT_FOR_PROPERTY: BASE_URL + 'getAgreementForPropertyDetail/',
	GET_MAINTENANCE_HISTORY: BASE_URL + 'getMaintenanceByProperty/',
	GET_MESSAGE_LIST: BASE_URL + 'getChatUsers',
	GET_UNREAD_MESSAGE_LIST: BASE_URL + 'getUnreadChat/',
	GET_NOTICE_BOARD_DETAIL_LIST: BASE_URL + 'noticeBoardDetail/',
	ADD_REVIEW: BASE_URL + 'addReview',
	GET_USER_REVIEW: BASE_URL + 'getUserReview/',
	FILTER_PROPERTY: BASE_URL + 'getAllPropertyBySearch',
	CHAT_URL: URL,
	GET_MESSAGE_LIST: BASE_URL + 'getChatUsers',
	UPLOAD_DOCUMENT_FOR_CHAT: BASE_URL + 'uploadDocumentForChat',
	GET_ALL_USER_REVIEW: BASE_URL + 'getTraderAllReviews/',
	GET_USER_ROLE_REVIEW: BASE_URL + 'GetUserRolesReview',
	EDIT_PROPERTY: BASE_URL + 'updatePropertyById',
	GENERAL_THREAD_FOR_MAINTENANCE: BASE_URL + 'generalThreadForAll',

	GET_PROPERTY_LISTINGS: BASE_URL + 'getSalesProperty',
	GET_TENANTED_PROPERTY_LIST: BASE_URL + 'getTenantedPropertyList',
	GET_FAV_PROPERTY_LIST: BASE_URL + 'getFaviouratePropertyList',

	UPLOAD_BANNER_IMG: BASE_URL + 'updateBannerPic',
	UPDATE_AGREEMENT: BASE_URL + 'editRentalcases',
	CANCEL_MAINTENANCE_REQ: BASE_URL + 'cancelMaintenanceRequest/',

	AGENT_LIST_WITHIN_AGENCY: BASE_URL + 'agentsListWithInAgency',
	AGENT_LIST: BASE_URL + 'agentsList',
	GET_FAV_TENANTS: BASE_URL + 'getFavTenants',
	GET_DATABASE_TENANTS: BASE_URL + 'allTenentsFromDatabase',
	ADD_USER_AS_FAV: BASE_URL + 'addToFavouritesUser',
	GET_AGREEMENT_FOR_TENANT_PROFILE: BASE_URL + 'getTenantAgreementsForProfile/',
	TRADERS_JOB_HISTORY: BASE_URL + 'tradersJobHistory',
	GET_FAV_TRADERS: BASE_URL + 'getAllSavedTraders',
	GLOBAL_SEARCH: BASE_URL + 'gobalSearch',

	ADD_AGENT_BY_AGENCY: BASE_URL + 'addAgentsByPrinciple',
	FILTER_MY_FILE: BASE_URL + 'getYourFileBySearch',
	GET_AGENCIES: BASE_URL + 'getAgencies',
	AGENCIES_ASSOCIATION_REQUEST: BASE_URL + 'agencyAssociationRequest',
	ACCEPT_OR_DENIED_MAINTENANCE_REQ: BASE_URL + 'acceptorDeniedJob',
	COUNTER_PROPOSAL: BASE_URL + 'counterProposals',

	GET_AGENCY_PROFILE: BASE_URL + 'getAgencyProfile',

	ADD_NOTICEBOARD: BASE_URL + 'addNoticeboard',
	ADD_NOTICEBOARD_POST: BASE_URL + 'addNoticeboardPost',

	DELET_NOTICEBOARD_POST: BASE_URL + 'deleteNoticeboardPost/',

	GET_DISPUTES_LIST: BASE_URL + 'getDisputes',

	GET_DISPUTES_BY_ID: BASE_URL + 'getDisputesById',

	ACCEPT_DECLINE_PROPOSAL_REQUEST: BASE_URL + 'acceptDeclineProposalRequest',

	CONFIRM_DECLINE_COMPLETE_JOB: BASE_URL + 'confirmDeclineCompleteJob',

	COMPLETE_JOB: BASE_URL + 'completeJob',

	ADD_DISPUTES: BASE_URL + 'addDisputes',

	DASHBOARD_INSPECTION: BASE_URL + 'dashboardInspection',

	GET_STATUS_USER_ASSOCIATE_WITH_PROPERTY: BASE_URL + 'isUserAssociatedWithProperty',

	GET_PROPERTY_FOR_CREATE_NOTICE: BASE_URL + 'getPropertyListForstarta',

	EDIT_NOTICE_BOARD: BASE_URL + 'editNoticeboard',

	GET_NOTICE_BOARD_POST_DETAIL: BASE_URL + 'noticeboardPostDetail/',

	DELETE_NOTICE_BOARD: BASE_URL + 'deleteNoticeboard',

	DELETE_MY_FILE: BASE_URL + 'deleteDocument',

	UPDATE_DISPUTE_STATUS_BY_ID: BASE_URL + 'updateDisputeStatusById',

	GET_ADMIN_STATISTICS: BASE_URL + 'getAdminStatisticsData',

	GET_ROLE_BY_ID: BASE_URL + 'getRoleIdFromUserId',

	CHAT_CONNECTION_URL: CHAT_CONNECTION_URL,

	// Devlopment
	// PROPERTY_IMAGE_PATH: 'http://portal.syncitt.world:5095/property_image/',
	// MAINTENANCE_IMAGE_PATH: 'http://portal.syncitt.world:5095/maintenance/',
	// USER_IMAGE_PATH: 'http://portal.syncitt.world:5095/user_image/',
	// DOCUMENTS_PATH: 'http://portal.syncitt.world:5095/document/',
	// AGREEMENT_PATH: 'http://portal.syncitt.world:5095/agreement/',



	// Productions
	PROPERTY_IMAGE_PATH: 'https://portal.ownly.com.au:5095/property_image/',
	MAINTENANCE_IMAGE_PATH: 'https://portal.ownly.com.au:5095/maintenance/',
	USER_IMAGE_PATH: 'https://portal.ownly.com.au:5095/user_image/',
	DOCUMENTS_PATH: 'https://portal.ownly.com.au:5095/document/',
	AGREEMENT_PATH: 'https://portal.ownly.com.au:5095/agreement/',

	ADD_RESPONSE_RES: BASE_URL + 'addResponse/',
	BASEURL: BASE_URL

}

export default API

