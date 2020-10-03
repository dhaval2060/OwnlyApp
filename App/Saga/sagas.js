import { put, call, takeEvery, takeLatest, select, cps } from 'redux-saga/effects';
import API from '../Constants/APIUrls';
import API_CONST from '../Constants/APIConstants';
import ACTION_TYPES from '../Action/ActionsType';

//Call for fetching data from api
const _apiCall = (url, data) => {
	return fetch(url, data)
		.then((res) => {
			return { res: res, res_json: res.json() };
		})
		.catch((e) => {
			throw e;
		});
};

//get response json
const _extJSON = (p) => {
	return p.then((res) => res);
};

const uploadImageCall = (xauthtoken, imageData) => {
	return fetch(
		'POST',
		API.UPLOAD_PROPERTY_IMAGE,
		{
			'Accept': 'application/json',
			'authorization': xauthtoken,
			'Content-Type': 'multipart/form-data',
		},
		[
			{
				name: 'file',
				filename: "download.png",
				type: 'image/jpeg',
				data: JSON.stringify(imageData)
			}
		]


	)
		.then((resp) => resp.json())
		.catch((e) => {
			//throw e;
			alert(JSON.stringify(e), "ee")
		});
};
const uploadImageCallById = (xauthtoken, data) => {
	return fetch(
		'POST',
		API.UPLOAD_PROPERTY_IMAGE_BY_ID,
		{
			'Accept': 'application/json',
			'authorization': xauthtoken,
			'Content-Type': 'multipart/form-data',
		},
		[
			{
				name: 'file',
				filename: "download.png",
				type: 'image/jpeg',
				data: JSON.stringify(data.image),
				id: data.id
			}
		]


	)
		.then((resp) => resp.json())
		.catch((e) => {
			//throw e;

		});
};
function* uploadImage(action) {

	var xauthtoken = action.token;
	var imageData = action.data;
	var uploadImageHeaderResponse = {};
	try {
		let resp = yield call(uploadImageCall, xauthtoken, imageData);

		var responseJSON = resp;
		yield put({

			type: ACTION_TYPES.UPLOAD_PROPERTY_IMAGE,
			payload: responseJSON
		});
	} catch (e) {
	}
}
function* uploadImageById(action) {

	var xauthtoken = action.token;
	var imageData = action.data;
	var uploadImageHeaderResponse = {};
	try {
		let resp = yield call(uploadImageCallById, xauthtoken, imageData);

		var responseJSON = resp;
		yield put({

			type: ACTION_TYPES.UPLOAD_PROPERTY_IMAGE_BY_ID,
			payload: responseJSON
		});
	} catch (e) {
	}
}


const uploadAgreementImageCall = (xauthtoken, imageData, docName, types) => {

	return fetch(
		'POST',
		API.UPLOAD_AGREEMENT_DOC,
		{
			'Accept': 'application/json',
			'authorization': xauthtoken,
			'Content-Type': 'multipart/form-data',
		},
		[
			{
				name: 'file',
				filename: docName,
				type: types,
				data: JSON.stringify(imageData)
			}
		]
	)
		.then((resp) => resp.json())
		.catch((e) => {
			//throw e;
		});
};

function* uploadAgreementImage(action) {
	var xauthtoken = action.token;
	var imageData = action.data;
	var docType = action.docType;
	var docName = action.docName;
	try {
		let resp = yield call(uploadImageCall, xauthtoken, imageData, docName, docType);
		var responseJSON = resp;
		yield put({
			type: ACTION_TYPES.UPLOAD_AGREEMENT_IMAGE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

const uploadMaintenaceImageCall = (xauthtoken, imageData) => {
	return fetch(
		'POST',
		API.UPLOAD_MAINTENANCE_REQ_IMAGE,
		{
			'Accept': 'application/json',
			'authorization': xauthtoken,
			'Content-Type': 'multipart/form-data',
		},
		[
			{
				name: 'file',
				filename: "download.png",
				type: 'image/jpeg',
				data: JSON.stringify(imageData)
			},

		]


	)
		.then((resp) => resp.json())
		.catch((e) => {
			//throw e;

		});
};

function* uploadMaintenaceImage(action) {

	var xauthtoken = action.token;
	var imageData = action.data;
	var uploadImageHeaderResponse = {};
	try {
		let resp = yield call(uploadMaintenaceImageCall, xauthtoken, imageData);

		var responseJSON = resp;
		yield put({

			type: ACTION_TYPES.UPLOAD_MAINTENANCE_IMAGE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


const uploadMyFileCall = (xauthtoken, postData, id, types, docName) => {
	return fetch(
		'POST',
		API.UPLOAD_MYFILE_DOC,
		{
			'Accept': 'application/json',
			'authorization': xauthtoken,
			'Content-Type': 'multipart/form-data',
		},
		[
			{
				name: 'file',
				filename: docName,
				type: types,
				data: JSON.stringify(postData)
			},
			{
				name: 'created_by',
				data: id
			}

		]

	)
		.then((resp) => resp.json())
		.catch((e) => {
			//throw e;

		});
};

function* uploadMyFileDoc(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	var id = action.id;
	var docType = action.docType;
	var docName = action.docName;
	var uploadImageHeaderResponse = {};
	try {
		let resp = yield call(uploadMyFileCall, xauthtoken, postData, id, docType, docName);

		var responseJSON = resp;
		yield put({

			type: ACTION_TYPES.UPLOAD_MYFILE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//LoginScreen
function* userLogin(action) {

	var postData = action.data;
	try {
		let response = yield call(_apiCall, API.USER_LOGIN, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.LOGIN_USER_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//ForgotPasswordScreen
function* forgotPassword(action) {

	var postData = action.data;
	try {
		let response = yield call(_apiCall, API.FORGOT_PASSWORD, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.FORGOT_PASS_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//ResendPasswordScreen
function* resendPassword(action) {

	var postData = action.data;
	try {
		let response = yield call(_apiCall, API.FORGOT_PASSWORD, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.RESEND_PASS_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//User registration
function* userRegistration(action) {

	var postData = action.data;
	try {
		let response = yield call(_apiCall, API.USER_REGISTRATION, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.SIGNUP_USER_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//LoginScreen
function* userLogout(action) {

	var postData = action.data;
	try {
		let response = yield call(_apiCall, API.USER_LOGOUT, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.LOGOUT_USER_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//Home Screen get property list
function* getUserRolesList() {

	try {
		let response = yield call(_apiCall, API.GET_USER_ROLES_LIST, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',

			}
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.USER_ROLE_LIST,
			payload: responseJSON
		});
	} catch (e) {

		var connectionError = {

			code: 999,
			message: 'Please check your network connection.'
		};

		yield put({
			type: ACTION_TYPES.USER_ROLE_LIST,
			payload: connectionError
		});
	}
}


//Home Screen get property list
function* getPropertyList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {
		let response = yield call(_apiCall, API.GET_PROPERTY_LIST, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.PROPERTY_LIST,
			payload: responseJSON
		});
	} catch (e) {

		var connectionError = {

			code: 999,
			message: 'Please check your network connection.'
		};

		yield put({
			type: ACTION_TYPES.PROPERTY_LIST,
			payload: connectionError
		});
	}
}

//Get Amenities in add property step three
function* getAmenitiesList(action) {

	var xauthtoken = action.token;

	try {
		let response = yield call(_apiCall, API.GET_AMENITIES_LIST, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			}
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.AMENITIES_LIST,
			payload: responseJSON
		});
	} catch (e) {

		var connectionError = {

			code: 999,
			message: 'Please check your network connection.'
		};

		yield put({
			type: ACTION_TYPES.AMENITIES_LIST,
			payload: connectionError
		});
	}
}

//create property 
function* addProperty(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {
		let response = yield call(_apiCall, API.CREATE_PRPERTY, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.ADD_PRPERTY_RES,
			payload: responseJSON
		});
	} catch (e) {

		var connectionError = {

			code: 999,
			message: 'Please check your network connection.'
		};

		yield put({
			type: ACTION_TYPES.ADD_PRPERTY_RES,
			payload: connectionError
		});
	}
}

//Get Amenities in add property step three
function* getPropertyOwnerList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {
		let response = yield call(_apiCall, API.GET_PROPERTY_OWNER, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.PROPERTY_OWNER_LIST,
			payload: responseJSON
		});
	} catch (e) {

		var connectionError = {

			code: 999,
			message: 'Please check your network connection.'
		};

		yield put({
			type: ACTION_TYPES.PROPERTY_OWNER_LIST,
			payload: connectionError
		});
	}
}

//Tenant data list
function* getTenantList(action) {
	var xauthtoken = action.token;
	var postData = action.data;
	var APIS = action.APIS;
	try {
		let response = yield call(_apiCall, APIS, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.TENANT_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//Tenant data list
function* getTradersList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_TRADERS_LIST, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.TRADERS_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//Send Message
function* sendMessage(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.SEND_MESSAGE, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.SEND_MESSAGE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get property agents
function* getPropertyByAgent(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_PROPERTY_FOR_ADD_TENANT, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_PROPERTY_BY_AGENT_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//add tanent
function* addTanent(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.ADD_NEW_TANENT, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.ADD_TANENT_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get tenant profile
function* getTenantProfile(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_USER_PROFILE, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.TENANT_PROFILE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get tenant profile
function* getTradersProfile(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_USER_PROFILE, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.TRADERS_PROFILE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//add tanent
function* addPropertyOwner(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.ADD_PROPERTY_OWNER, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.ADD_PROPERTY_OWNER_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get property detail
function* getPropertyDetail(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_PROPERTY_DETAIL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.PROPERTY_DETAIL_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get user roles
function* getUserRoles(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_USER_ROLES, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_USER_ROLES_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//Upload user images

const uploadUserImageCall = (xauthtoken, imageData, _id) => {
	return fetch(
		'POST',
		API.UPLOAD_USER_IMAGE,
		{
			'Accept': 'application/json',
			'authorization': xauthtoken,
			'Content-Type': 'multipart/form-data',
		},
		[
			{
				name: 'file',
				filename: "user_portfolio.png",
				type: 'image/jpeg',
				data: imageData
			},
			{
				name: '_id',
				data: _id
			}
		]


	)
		.then((resp) => {
			console.log(resp)
		})
		.catch((e) => {
			//throw e;
			console.log(e, "eeeeee", imageData, _id)
		});
};

function* uploadUserImage(action) {

	var xauthtoken = action.token;
	var imageData = action.data;
	var _id = action._id;


	var uploadImageHeaderResponse = {};
	try {
		let resp = yield call(uploadUserImageCall, xauthtoken, imageData, _id);

		var responseJSON = resp;
		yield put({

			type: ACTION_TYPES.UPLOAD_USER_IMAGE,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//get user roles
function* likeProperty(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.LIKE_PROPERTY, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.LIKE_PROPERTY_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get user permission
function* getUserPermission(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_USER_PERMISSION, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_USER_PERMISSSION_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get tenant profile
function* getLoggedInUserProfile(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_USER_PROFILE, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.USER_PROFILE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//save property as draft
function* savePropertyAsDraft(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {
		let response = yield call(_apiCall, API.SAVE_PROPERTY_AS_DRAFT, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.SAVE_PROPERTY_AS_DRAFT_RES,
			payload: responseJSON
		});
	} catch (e) {

		var connectionError = {

			code: 999,
			message: 'Please check your network connection.'
		};

		yield put({
			type: ACTION_TYPES.SAVE_PROPERTY_AS_DRAFT_RES,
			payload: connectionError
		});
	}
}

//update user profile images

const updateUserImageCall = (xauthtoken, imageData, id) => {
	return fetch(
		'POST',
		API.UPDATE_USER_IMAGE,
		{
			'Accept': 'application/json',
			'authorization': xauthtoken,
			'Content-Type': 'multipart/form-data',
		},
		[
			{
				name: 'file',
				filename: "user_portfolio.png",
				type: 'image/jpeg',
				data: JSON.stringify(imageData)
			},
			{
				name: '_id',
				data: id
			}
		]


	)
		.then((resp) => resp.json())
		.catch((e) => {
			//throw e;

		});
};


function* updateUserImage(action) {

	var xauthtoken = action.token;
	var postData = {
		file: action.data,
		_id: action._id
	};
	// var imageData = action.data;
	var _id = action._id;
	console.log(action, "action==")
	var uploadImageHeaderResponse = {};
	try {
		let response = yield call(_apiCall, API.UPDATE_USER_IMAGE, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		console.log(responseJSON,"responseJSONresponseJSON");
		yield put({

			type: ACTION_TYPES.UPDATE_USER_IMAGE_RES,
			payload: responseJSON
		});
		// let resp = yield call(updateUserImageCall, xauthtoken, imageData, _id);

		// var responseJSON = resp;
		// yield put({

		// 	type: ACTION_TYPES.UPDATE_USER_IMAGE_RES,
		// 	payload: responseJSON
		// });
	} catch (e) {
	}
}

//get user images
function* getUserImages(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_USER_IMAGE, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_USER_IMAGE,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//get user images
function* getUserDetails(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_USER_DETAILS, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.USER_DETAILS_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//For change password
function* changePassword(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.CHANGE_PASSWORD, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.CHANGE_PASSWORD_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//For change notification setting
function* updateNotificationSetting(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.UPDATE_NOTIFICATION_SETTING, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.NOTIFICATION_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}



//update user
function* updateUserDetails(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.UPDATE_USER_DETAILS, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.UPDATE_USER_DETAILS_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}
//get property detail
function* getPropertyDetailForUpdate(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_PROPERTY_DETAIL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.PROPERTY_DETAIL_FOR_UPDATE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//get traders options list
function* getTradersOptionList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_TRADERS_OPTION_LIST, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_TRADERS_OPTION_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get traders options list
function* getMaintenancePropertyList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.PROPERTY_LIST_FOR_MAINTENANCE_REQ, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_AGENCY_PROPERTY_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}
//call for add maintenance req 
function* addMaintenanceReq(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.ADD_MAINTENANCE_REQ, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.ADD_MAINTENANCE_REQ_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//call for forward maintenance req 
function* forwardMaintenanceReq(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.FORWARD_MAINTENANCE_REQ, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.FORWARD_MAINTENANCE_REQ_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//Home Screen get property list
function* getAllPropertyList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	var APIS = action.APIS;
	try {
		let response = yield call(_apiCall, APIS, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.ALL_PROPERTY_LIST,
			payload: responseJSON
		});
	} catch (e) {

		var connectionError = {

			code: 999,
			message: 'Please check your network connection.'
		};

		yield put({
			type: ACTION_TYPES.ALL_PROPERTY_LIST,
			payload: connectionError
		});
	}
}




//get watcher list
function* getWatherList(action) {

	var xauthtoken = action.token;
	var agencyId = action.agencyId;
	try {

		let response = yield call(_apiCall, API.GET_WATCHER_LIST + agencyId, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_WATCHER_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get maintenance list by tenants req
function* getMaintenanceReqByTenant(action) {


	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_MAINTENANCE_REQ_BY_TENANT, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_MAINTENANCE_REQ_BY_TENANT_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//update user multiple roles
function* saveUserMultipleRoles(action) {


	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.SAVE_USER_MULTI_ROLE, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.SAVE_USER_MULTI_ROLE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//Home Screen get notice board list
function* getNoticeBoardList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_NOTICE_BOARD_LIST, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.NOTICE_BOARD_LIST,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//get maintenance req detail
function* getMaintenanceReqDetail(action) {

	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.GET_MAINTENANCE_DETAIL + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_MAINTENANCE_DETAIL_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get notice board detail
function* getNoticeBoardDetail(action) {

	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.GET_NOTICE_BOARD_DETAIL_LIST + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_NOTICE_BOARD_DETAIL_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get notification list
function* getNotifiactionList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_NOTIFICATION_LIST, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.NOTIFICATION_LIST,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get uploaded documents
function* getUploadedDocument(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_UPLOADED_DOCUMENT, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.UPLOADED_DOCUMENT_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}
//get Fav uploaded documents
function* getFavUploadedDocument(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_FAV_UPLOADED_DOCUMENT, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.FAV_UPLOADED_DOCUMENT_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}
//add document to fav
function* addDocumentToFav(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.ADD_DOCUMENT_TO_FAV, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.ADD_DOCUMENT_TO_FAV_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}
//add user as fav
function* addUserToFav(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.ADD_USER_AS_FAV, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.ADD_USER_AS_FAV_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}
//get agreements
function* getAgreementList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_AGREEMENT_LIST, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_AGREEMENT_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get traders options list
function* getAgreementPropertyList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.PROPERTY_LIST_FOR_MAINTENANCE_REQ, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_AGREEMENT_PROPERTY_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get agreement property owner list
function* getAgreementPropertyOwnerList(action) {

	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.GET_PROPERTY_OWNER_LIST + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_AGREEMENT_PROPERTY_WONER_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get property owner list
function* deleteAgreement(action) {

	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.DELETE_AGREEMENT + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.DELETE_AGREEMENT_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}
//get property tenants list
function* getAgreementPropertyTenantsList(action) {

	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.GET_PROPERTY_TENANT_LIST + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_PROPERTY_TENANT_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//add agreements
function* addAgreement(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.ADD_AGREEMENT, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.ADD_AGREEMENT_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get statistics
function* getStatistics(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_STATISTICS, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_STATISTICS_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get agreement detail
function* getAgreementDetail(action) {
	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.GET_AGREEMENT_DETAIL + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_AGREEMENT_DETAIL_RES,
			payload: responseJSON
		});
	} catch (e) {
		console.log('Agreement Details',e);
	}
}

//get agreement detail
function* getAgreementByPropertyId(action) {

	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.GET_AGREEMENT_BY_PROPERTY + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_AGREEMENT_BY_PROPERTY_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get user roles
function* getUserActiveRoles(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_USER_ACTIVE_ROLES, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_USER_ACTIVE_ROLES_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get agreement detail
function* getTenanciesHistory(action) {

	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.GET_TENANCIES_HISTORY + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_TENANCIES_HISTORY_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get agreement of property
function* getAgreementOfProperty(action) {

	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.GET_AGREEMENT_FOR_PROPERTY + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_AGREEMENT_FOR_PROPERTY_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get maintenace history
function* getMaintenaceHistory(action) {

	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.GET_MAINTENANCE_HISTORY + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_MAINTENANCE_HISTORY_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//get message list
// function* getMessageList(action) {

// 	var xauthtoken = action.token;
// 	var postData = action.data;
// 	try {

// 		let response = yield call(_apiCall, API.GET_MESSAGE_LIST, {
// 			method: 'POST',
// 			headers: {
// 				Accept: 'application/json',
// 				'Content-Type': 'application/json',
// 				'authorization': xauthtoken
// 			},
// 			body: JSON.stringify(postData)
// 		});
// 		var responseJSON = yield call(_extJSON, response.res_json);
// 		yield put({

// 			type: ACTION_TYPES.MESSAGE_LIST_RES,
// 			payload: responseJSON
// 		});
// 	} catch (e) {
// 	}
// }

//get unread messages
function* getUnreadMessageList(action) {

	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.GET_UNREAD_MESSAGE_LIST + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_UNREAD_MESSAGE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}
//get unread messages
function* getUserReviewsList(action) {

	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.GET_USER_REVIEW + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_USER_REVIEW_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get add review
function* addReviewAPI(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.ADD_REVIEW, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.WRITE_REVIEW_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get filter property
function* filterProperty(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.FILTER_PROPERTY, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.FILTER_PROPERTY_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//get message list
function* getMessageList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_MESSAGE_LIST, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.MESSAGE_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//SharecImage For Chat

const shareImageForChatCall = (xauthtoken, imageData, postData) => {
	return fetch(
		'POST',
		API.UPLOAD_DOCUMENT_FOR_CHAT,
		{
			'Accept': 'application/json',
			'authorization': xauthtoken,
			'Content-Type': 'multipart/form-data',
		},
		postData


	)
		.then((c) => resp.json())
		.catch((e) => {
			console.log(e, "errrrr")
			//throw e;

		});
};



function* shareImageForChat(action) {

	var xauthtoken = action.token;
	var imageData = action.data;
	var postData = action.postData;
	console.log(imageData, postData, "imageData, postDataimageData, postData")
	var uploadImageHeaderResponse = {};
	try {
		let resp = yield call(shareImageForChatCall, xauthtoken, imageData, postData);

		var responseJSON = resp;
		yield put({

			type: ACTION_TYPES.SHARE_IMAGE_FOR_CHAT_RESPONSE,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//get all user review list on user profile
function* getAllUserReviewsList(action) {

	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.GET_ALL_USER_REVIEW + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_ALL_USER_REVIEW_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


function* editProperty(action) {

	var xauthtoken = action.token;
	var postData = action.data;


	try {
		let response = yield call(_apiCall, API.EDIT_PROPERTY, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.EDIT_ADD_PRPERTY_RES,
			payload: responseJSON
		});
	} catch (e) {

		var connectionError = {

			code: 999,
			message: 'Please check your network connection.'
		};

		yield put({
			type: ACTION_TYPES.EDIT_ADD_PRPERTY_RES,
			payload: connectionError
		});
	}
}



function* getUserRoleReviewsList(action) {

	var xauthtoken = action.token;
	var postData = action.data;


	try {
		let response = yield call(_apiCall, API.GET_USER_ROLE_REVIEW, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.GET_USER_ROLE_REVIEW_RES,
			payload: responseJSON
		});
	} catch (e) {

		var connectionError = {

			code: 999,
			message: 'Please check your network connection.'
		};

		yield put({
			type: ACTION_TYPES.GET_USER_ROLE_REVIEW_RES,
			payload: connectionError
		});
	}
}


//get maintenance request list
function* getMaintenanceRequestList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_MAINTENANCE_REQUEST_LIST, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.MAINTENANCE_REQUEST_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//Home Screen get maintenance thread list
function* maintenanceThreadList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_MAINTENANCE_THREAD_LIST, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.MAINTENANCE_THREAD_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//Home Screen get general thread list
function* generalThreadList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GENERAL_THREAD_FOR_MAINTENANCE, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GENERAL_THREAD_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


const updateBannerImageCall = (xauthtoken, imageData, id) => {
	return fetch(
		'POST',
		API.UPLOAD_BANNER_IMG,
		{
			'Accept': 'application/json',
			'authorization': xauthtoken,
			'Content-Type': 'multipart/form-data',
		},
		[
			{
				name: 'file',
				filename: "user_banner.png",
				type: 'image/jpeg',
				data: JSON.stringify(imageData)
			},
			{
				name: '_id',
				data: id
			}
		]


	)
		.then((resp) => resp.text())
		.catch((e) => {
			//throw e;

		});
};


function* updateBannerImage(action) {

	var xauthtoken = action.token;
	var imageData = action.data;
	var _id = action._id;

	var uploadImageHeaderResponse = {};
	try {
		let resp = yield call(updateBannerImageCall, xauthtoken, imageData, _id);
		console.log(resp, imageData, _id, "_id_id_id")
		var responseJSON = resp;
		yield put({

			type: ACTION_TYPES.UPLOAD_BANNER_IMG_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//update agreements
function* updateAgreement(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.UPDATE_AGREEMENT, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.UPDATE_AGREEMENT_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}



//for cancel maintenance req
function* cancelMaintenanceReq(action) {

	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.CANCEL_MAINTENANCE_REQ + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.CANCEL_MAINTENANCE_REQ_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//get all agent list
function* getAllAgentList(action) {

	var xauthtoken = action.token;

	try {

		let response = yield call(_apiCall, API.AGENT_LIST, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.ALL_AGENT_LIST,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//get all agent list within agency
function* getAllAgentListWithiInAgency(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.AGENT_LIST_WITHIN_AGENCY, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.AGENT_LIST_WITH_IN_AGENCY,
			payload: responseJSON
		});
	} catch (e) {
	}
}

function* getAgentProfileData(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.AGENT_PROFILE, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.AGENT_PROFILE_DATA,
			payload: responseJSON
		});
	} catch (e) {
	}
}
//get delete agent
function* getDeleteAgent(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.DELETE_AGENT_API, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.DELETE_AGENT,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//get fav traders list
function* getFavTradersList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_FAV_TRADERS, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_FAV_TRADERS_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//get trader job history
function* getTraderJobHistory(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.TRADERS_JOB_HISTORY, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.TRADERS_JOB_HISTORY_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}



//get agreement for tenant profile
function* getAgreementForTenantProfile(action) {

	var xauthtoken = action.token;
	var id = action.id;
	try {

		let response = yield call(_apiCall, API.GET_AGREEMENT_FOR_TENANT_PROFILE + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_AGREEMENT_FOR_TENANT_PROFILE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//global search
function* globalSearch(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GLOBAL_SEARCH, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GLOBAL_SEARCH_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//Add agent by agency
function* addAgentByAgency(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.ADD_AGENT_BY_AGENCY, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.ADD_AGENT_BY_AGENCY_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get filter my file
function* filterMyFile(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.FILTER_MY_FILE, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.FILTER_FILE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get filter my file
function* getAgencyProperty(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_AGENCY_PROPERTY, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_AGENCY_PROPERTY_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get all agent list
function* getAllAgencyList(action) {

	var xauthtoken = action.token;

	try {

		let response = yield call(_apiCall, API.GET_AGENCIES, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.AGENCY_LIST,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//get associate with agency
function* getAssociateWithAgency(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.AGENCIES_ASSOCIATION_REQUEST, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.ASSOCIATE_WITH_AGENCY,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get associate with agency
function* counterProposalReq(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.COUNTER_PROPOSAL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.COUNTER_PROPOSAL_REQ_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get associate with agency
function* acceptAndDeniedMaintenanceReq(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.ACCEPT_OR_DENIED_MAINTENANCE_REQ, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.MAINTENANCE_ACCEPT_AND_DENIED_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//Home Screen get property list
function* deleteNoticeBoardPost(action) {
	var xauthtoken = action.token;
	var id = action.id;
	try {
		let response = yield call(_apiCall, API.DELET_NOTICEBOARD_POST + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			}
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.DELETE_NOTICEBOARD_POST_RES,
			payload: responseJSON
		});
	} catch (e) {

		var connectionError = {

			code: 999,
			message: 'Please check your network connection.'
		};

		yield put({
			type: ACTION_TYPES.DELETE_NOTICEBOARD_POST_RES,
			payload: connectionError
		});
	}
}


//add notice board
function* addNoticeBoard(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.ADD_NOTICEBOARD, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.ADD_NOTICE_BOARD,
			payload: responseJSON
		});
	} catch (e) {
	}
}



//add notice board post
function* addNoticeBoardPost(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.ADD_NOTICEBOARD_POST, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.ADD_POST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//get disputes list
function* getDisputesList(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_DISPUTES_LIST, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.DISPUTES_LIST_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}



//get disputes details
function* getDisputeDetails(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_DISPUTES_BY_ID, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.DISPUTES_DETAILS_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//get tenant profile
function* getAgencyProfile(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_AGENCY_PROFILE, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.AGENCY_PROFILE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//accept Decline Proposal Request
function* acceptDeclineProposalRequest(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.ACCEPT_DECLINE_PROPOSAL_REQUEST, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.ACCEPT_DECLINE_PROPOSAL_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


//confirm Decline Complete Job
function* confirmDeclineCompleteJob(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.CONFIRM_DECLINE_COMPLETE_JOB, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.CONFIRM_DECLINE_COMPLETE_JOB_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

// Complete Job
function* completeJob(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.COMPLETE_JOB, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.MARK_AS_COMPLETE_REQ_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}


// add disputes 
function* addDisputes(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.ADD_DISPUTES, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.ADD_DISPUTES_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

// add disputes 
function* dashboardInspectionData(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.DASHBOARD_INSPECTION, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.DASHBOARD_INSPECTION_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

// get associate status 
function* getUserAssociateStatus(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_STATUS_USER_ASSOCIATE_WITH_PROPERTY, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_STATUS_USER_ASSOCIATE_WITH_PROPERTY_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}
// edit notice
function* editNotice(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {
		let response = yield call(_apiCall, API.EDIT_NOTICE_BOARD, {

			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.EDIT_NOTICE_BOARD_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

// delete uploaded file
function* deleteMyFile(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.DELETE_MY_FILE, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.DELETE_MY_FILE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}



//get all agent list
function* getPropertyListForCreateNotice(action) {

	var xauthtoken = action.token;

	try {

		let response = yield call(_apiCall, API.GET_PROPERTY_FOR_CREATE_NOTICE, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_PROPERTY_FOR_CREATE_NOTICE_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//delete Noticeboard
function* deleteNoticeboard(action) {

	var xauthtoken = action.token;

	var serviceURL = API.DELETE_NOTICE_BOARD + '/' + action.data;

	try {

		let response = yield call(_apiCall, serviceURL, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.DELETE_NOTICE_BOARD_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//get notice post details
function* getNoticePostDetails(action) {

	var xauthtoken = action.token;
	var id = action.postId;
	try {

		let response = yield call(_apiCall, API.GET_NOTICE_BOARD_POST_DETAIL + id, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},

		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_NOTICE_BOARD_POST_DETAIL_RES,
			payload: responseJSON
		});
	} catch (e) {
	}
}

//add response
function* addResponse(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {
		let response = yield call(_apiCall, API.ADD_RESPONSE_RES, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.ADD_RESPONSE_RES,
			payload: responseJSON
		});
	} catch (e) {

		var connectionError = {

			code: 999,
			message: 'Please check your network connection.'
		};

		yield put({
			type: ACTION_TYPES.ADD_RESPONSE_RES,
			payload: connectionError
		});
	}
}
//add response
function* readUnreadMessage(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {
		let response = yield call(_apiCall, API.READ_UNREAD_MESSAGE, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({
			type: ACTION_TYPES.READ_UNREAD_MESSAGE,
			payload: responseJSON
		});
	} catch (e) {

		var connectionError = {

			code: 999,
			message: 'Please check your network connection.'
		};

		yield put({
			type: ACTION_TYPES.READ_UNREAD_MESSAGE,
			payload: connectionError
		});
	}
}

//Get notification status
function* getNotificationStatus(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_NOTIFICATION_STATUS_API, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_NOTIFICATION_STATUS,
			payload: responseJSON
		});
	} catch (e) {
	}
	// add disputes 

}
function* updateDisputeStatusById(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {
		let response = yield call(_apiCall, API.UPDATE_DISPUTE_STATUS_BY_ID, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.UPDATE_DISPUTE_STATUS_BYID,
			payload: responseJSON
		});
	} catch (e) {
	}
}

function* getAdminStatistics(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_ADMIN_STATISTICS, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			// body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_ADMIN_STATASTICS,
			payload: responseJSON
		});
	} catch (e) {
	}
}

function* getRoleById(action) {

	var xauthtoken = action.token;
	var postData = action.data;
	try {

		let response = yield call(_apiCall, API.GET_ROLE_BY_ID, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'authorization': xauthtoken
			},
			// body: JSON.stringify(postData)
		});
		var responseJSON = yield call(_extJSON, response.res_json);
		yield put({

			type: ACTION_TYPES.GET_USER_ROLE_BY_ID,
			payload: responseJSON
		});
	} catch (e) {
	}
}


function* rootSaga() {

	//Login
	yield takeLatest(API_CONST.N_USER_LOGIN, userLogin);

	//Forgot Password
	yield takeLatest(API_CONST.N_USER_FORGOT_PASSWORD, forgotPassword);

	//User registration 
	yield takeLatest(API_CONST.N_USER_REGISTRATION, userRegistration);

	//User logout 
	yield takeLatest(API_CONST.N_USER_LOGOUT, userLogout);

	//Get property list
	yield takeLatest(API_CONST.N_GET_PROPERTY, getPropertyList);

	//Get Amenities list
	yield takeLatest(API_CONST.N_GET_AMENITIES, getAmenitiesList);

	//Get User rolse list
	yield takeLatest(API_CONST.N_GET_USER_ROLES, getUserRolesList);

	//Resend Password
	yield takeLatest(API_CONST.N_USER_RESEND_PASSWORD, resendPassword);

	//Add property
	yield takeLatest(API_CONST.N_ADD_PROPERTY, addProperty);

	//Upload Image
	yield takeLatest(API_CONST.N_UPLOAD_PROPERTY_IMAGE, uploadImage);

	//Upload Image
	yield takeLatest(API_CONST.N_UPLOAD_PROPERTY_IMAGE, uploadImageById);

	//Upload Image
	yield takeLatest(API_CONST.N_PROPERTY_OWNER_LIST, getPropertyOwnerList);

	//Get tenant list
	yield takeLatest(API_CONST.N_GET_TENANT_LIST, getTenantList);

	//Get traders list
	yield takeLatest(API_CONST.N_GET_TRADERS_LIST, getTradersList);

	//Send message
	yield takeLatest(API_CONST.N_SEND_MESSAGE, sendMessage);

	//get property agents
	yield takeLatest(API_CONST.N_GET_PROPERTY_BY_AGENT, getPropertyByAgent);

	//add tanents
	yield takeLatest(API_CONST.N_ADD_TENANT, addTanent);

	//get tenants profile
	yield takeLatest(API_CONST.N_GET_TENANT_PROFILE, getTenantProfile);

	//get traders profile
	yield takeLatest(API_CONST.N_GET_TRADERS_PROFILE, getTradersProfile);

	//get add property owner 
	yield takeLatest(API_CONST.N_ADD_PROPERTY_OWNER, addPropertyOwner);

	//get property detail
	yield takeLatest(API_CONST.N_GET_PROPERTY_DETAIL, getPropertyDetail);

	//get user roles
	yield takeLatest(API_CONST.N_GET_USER_ROLES_SWITCH_PROFILE, getUserRoles);

	//Upload Image
	yield takeLatest(API_CONST.N_UPLOAD_USER_IMAGE, uploadUserImage);

	//like property
	yield takeLatest(API_CONST.N_LIKE_PROPERTY, likeProperty);

	//get user permission
	yield takeLatest(API_CONST.N_GET_USER_PERMISSION, getUserPermission);

	//get user permission
	yield takeLatest(API_CONST.N_GET_USER_PROFILE, getLoggedInUserProfile);

	//save property as draft
	yield takeLatest(API_CONST.N_SAVE_PROPERTY_AS_DRAFT, savePropertyAsDraft);

	//Update user Image
	yield takeLatest(API_CONST.N_UPDATE_USER_IMAGE, updateUserImage);

	//get user Images
	yield takeLatest(API_CONST.N_GET_USER_IMAGE, getUserImages);

	//get user details
	yield takeLatest(API_CONST.N_GET_USER_DETAILS, getUserDetails);

	//change password
	yield takeLatest(API_CONST.N_CHANGE_PASSWORD, changePassword);

	//update notifiaction setting
	yield takeLatest(API_CONST.N_CHANGE_NOTIFICATION, updateNotificationSetting);

	//update user details
	yield takeLatest(API_CONST.N_UPDATE_USER_DETAILS, updateUserDetails);

	//get property detail
	yield takeLatest(API_CONST.N_GET_PROPERTY_DETAIL_FOR_UPDATE, getPropertyDetailForUpdate);

	//get traders option list
	yield takeLatest(API_CONST.N_GET_TRADERS_OPTION_LIST, getTradersOptionList);

	//get traders option list
	yield takeLatest(API_CONST.N_GET_AGENCY_PROPERTY_LIST, getMaintenancePropertyList);

	//get watcher list
	yield takeLatest(API_CONST.N_GET_WATCHER_LIST, getWatherList);

	//get maintenance req by tenant list
	yield takeLatest(API_CONST.N_GET_MAINTENANCE_REQ_BY_TENANT, getMaintenanceReqByTenant);

	//get upload maintenance image
	yield takeLatest(API_CONST.N_UPLOAD_MAINTENANCE_IMAGE, uploadMaintenaceImage);

	//get add maintenance req
	yield takeLatest(API_CONST.N_ADD_MAINTENANCE_REQ, addMaintenanceReq);

	//update user multiple roles
	yield takeLatest(API_CONST.N_SAVE_USER_MULTI_ROLE, saveUserMultipleRoles);

	//Get notice board list
	yield takeLatest(API_CONST.N_GET_NOTICE_BOARD_LIST, getNoticeBoardList);

	//Get maintenance req detail 
	yield takeLatest(API_CONST.N_GET_MAINTENANCE_DETAIL, getMaintenanceReqDetail);

	//Get notice board list
	yield takeLatest(API_CONST.N_GET_NOTIFICATION_LIST, getNotifiactionList);

	//Get uploaded document 
	yield takeLatest(API_CONST.N_GET_UPLOADED_DOCUMENTS, getUploadedDocument);

	//Get fav uploaded documents
	yield takeLatest(API_CONST.N_GET_FAV_UPLOADED_DOCUMENTS, getFavUploadedDocument);

	//add document to fav
	yield takeLatest(API_CONST.N_ADD_DOCUMENT_TO_FAV, addDocumentToFav);

	//get agreements list
	yield takeLatest(API_CONST.N_GET_AGREEMENT_LIST, getAgreementList);

	//get agreements property list
	yield takeLatest(API_CONST.N_GET_AGREEMENT_PROPERTY_LIST, getAgreementPropertyList);

	//get property owner list
	yield takeLatest(API_CONST.N_GET_AGREEMENT_PROPERTY_OWNER_LIST, getAgreementPropertyOwnerList);

	//get property tenant list
	yield takeLatest(API_CONST.N_GET_PROPERTY_TENANT_LIST, getAgreementPropertyTenantsList);

	//add new property
	yield takeLatest(API_CONST.N_ADD_AGREEMENT, addAgreement);

	//get statistics
	yield takeLatest(API_CONST.N_GET_STATISTICS, getStatistics);

	//get agreement detail
	yield takeLatest(API_CONST.N_GET_AGREEMENT_DETAIL, getAgreementDetail);

	//upload my files
	yield takeLatest(API_CONST.N_UPLOAD_MYFILE_DOC, uploadMyFileDoc);

	//upload my files
	yield takeLatest(API_CONST.N_UPLOAD_AGREEMENT_DOC, uploadAgreementImage);

	//delete agreement
	yield takeLatest(API_CONST.N_DELETE_AGREEMENT, deleteAgreement);

	//delete agreement
	yield takeLatest(API_CONST.N_FORWARD_MAINTENANCE_REQ, forwardMaintenanceReq);

	//delete agreement
	yield takeLatest(API_CONST.N_GET_AGREEMENT_BY_PROPERTY, getAgreementByPropertyId);

	//getUserActiveRoles
	yield takeLatest(API_CONST.N_GET_USER_ACTIVE_ROLES, getUserActiveRoles);

	//get tenancies history
	yield takeLatest(API_CONST.N_GET_TENANCIES_HISTORY, getTenanciesHistory);

	//for get property agreement in property detail screen
	yield takeLatest(API_CONST.N_GET_AGREEMENT_FOR_PROPERTY, getAgreementOfProperty);

	//for get maintenance history in property detail screen
	yield takeLatest(API_CONST.N_GET_MAINTENANCE_HISTORY_RES, getMaintenaceHistory);

	// //get message list
	// yield takeLatest(API_CONST.N_GET_MESSAGE_LIST, getMessageList);

	//get unread message list
	yield takeLatest(API_CONST.N_GET_UNREAD_MESSAGE_LIST, getUnreadMessageList);

	//get notice board list
	yield takeLatest(API_CONST.N_GET_NOTICE_BOARD_DETAIL_LIST_RES, getNoticeBoardDetail);

	//get add review
	yield takeLatest(API_CONST.N_ADD_REVIEW, addReviewAPI);

	//get user review list
	yield takeLatest(API_CONST.N_GET_USER_REVIEW, getUserReviewsList);

	//get user review list
	yield takeLatest(API_CONST.N_FILTER_PROPERTY, filterProperty);

	//get message list
	yield takeLatest(API_CONST.N_GET_MESSAGE_LIST, getMessageList);

	//Share image for chat
	yield takeLatest(API_CONST.N_SHARE_IMAGE_FOR_CHAT, shareImageForChat);

	//Get property list
	yield takeLatest(API_CONST.N_GET_ALL_PROPERTY, getAllPropertyList);

	//Get all user review list for user profile
	yield takeLatest(API_CONST.N_GET_ALL_USER_REVIEW, getAllUserReviewsList);

	yield takeLatest(API_CONST.N_ADD_EDIT_PROPERTY, editProperty);

	//Get all user review list for user profile
	yield takeLatest(API_CONST.N_GET_USER_ROLE_REVIEW, getUserRoleReviewsList);


	//get maintenance list
	yield takeLatest(API_CONST.N_GET_MAINTENANCE_REQUEST_LIST, getMaintenanceRequestList);

	//get maintenance thread list
	yield takeLatest(API_CONST.N_GET_MAINTENANCE_THREAD_LIST, maintenanceThreadList);

	//get general thread list
	yield takeLatest(API_CONST.N_GET_GENERAL_THREAD_LIST, generalThreadList);

	//upload banner image
	yield takeLatest(API_CONST.N_UPLOAD_BANNER_IMG, updateBannerImage);

	//update agreement
	yield takeLatest(API_CONST.N_UPDATE_AGREEMENT, updateAgreement);

	//cancel maintenace
	yield takeLatest(API_CONST.N_CANCEL_MAINTENANCE_REQ, cancelMaintenanceReq);

	//get all agent list
	yield takeLatest(API_CONST.N_ALL_AGENT_LIST, getAllAgentList);

	//get all agent list
	yield takeLatest(API_CONST.N_ALL_AGENT_LIST_WITHI_IN_AGENCY, getAllAgentListWithiInAgency);

	//get all agent list
	yield takeLatest(API_CONST.N_AGENT_PROFILE_DATA, getAgentProfileData);

	//get all agent list
	yield takeLatest(API_CONST.N_DELETE_AGENT, getDeleteAgent);

	//get all agent list
	yield takeLatest(API_CONST.N_ADD_USER_AS_FAV, addUserToFav);

	//get agreement for tenant profile
	yield takeLatest(API_CONST.N_GET_AGREEMENT_FOR_TENANT_PROFILE, getAgreementForTenantProfile);


	//get trader job history
	yield takeLatest(API_CONST.N_TRADERS_JOB_HISTORY, getTraderJobHistory);


	//get fav traders list
	yield takeLatest(API_CONST.N_GET_FAV_TRADERS, getFavTradersList);


	//get fav traders list
	yield takeLatest(API_CONST.N_GLOBAL_SEARCH, globalSearch);


	//get fav traders list
	yield takeLatest(API_CONST.N_ADD_AGENT_BY_AGENCY, addAgentByAgency);

	//filter my file list
	yield takeLatest(API_CONST.N_FILTER_MY_FILE, filterMyFile);

	//filter my file list
	yield takeLatest(API_CONST.N_GET_AGENCY_PROPERTY, getAgencyProperty);

	//get all agency list
	yield takeLatest(API_CONST.N_ALL_AGENCY_LIST, getAllAgencyList);

	//get associate with agency
	yield takeLatest(API_CONST.N_ASSOCIATE_WITH_AGENCY, getAssociateWithAgency);

	//for 
	yield takeLatest(API_CONST.N_ACCEPT_OR_DENIED_MAINTENANCE_REQ, acceptAndDeniedMaintenanceReq);

	//for 
	yield takeLatest(API_CONST.N_COUNTER_PROPOSAL, counterProposalReq);

	//delete notice post
	yield takeLatest(API_CONST.N_DELETE_NOTICEBOARD_POST, deleteNoticeBoardPost);

	//add notice board
	yield takeLatest(API_CONST.N_CREATE_NOTICE, addNoticeBoard);

	//add post on notice board
	yield takeLatest(API_CONST.N_ADD_POST_SUBMIT_REQUEST, addNoticeBoardPost);

	//get disputes list
	yield takeLatest(API_CONST.N_GET_DISPUTES_LIST, getDisputesList);

	//get disputes details
	yield takeLatest(API_CONST.N_GET_DISPUTES_DETAILS, getDisputeDetails);

	//get agency profile details
	yield takeLatest(API_CONST.N_GET_AGENCY_PROFILE, getAgencyProfile);

	//accept Decline Proposal Request 
	yield takeLatest(API_CONST.N_ACCEPT_DECLINE_PROPOSAL, acceptDeclineProposalRequest);

	//confirm Decline Complete Job
	yield takeLatest(API_CONST.N_CONFIRM_DECLINE_COMPLETE_JOB, confirmDeclineCompleteJob);

	//complete Job
	yield takeLatest(API_CONST.N_COMPLETE_JOB, completeJob);

	//add Disputes
	yield takeLatest(API_CONST.N_ADD_DISPUTES, addDisputes);

	//dashboard inspection
	yield takeLatest(API_CONST.N_DASHBOARD_INSPECTION, dashboardInspectionData);

	//get associate user status
	yield takeLatest(API_CONST.N_GET_STATUS_USER_ASSOCIATE_WITH_PROPERTY, getUserAssociateStatus);

	//get property list
	yield takeLatest(API_CONST.N_GET_PROPERTY_FOR_CREATE_NOTICE, getPropertyListForCreateNotice);


	yield takeLatest(API_CONST.N_EDIT_NOTICE_BOARD, editNotice);


	yield takeLatest(API_CONST.N_GET_NOTICE_BOARD_POST_DETAIL, getNoticePostDetails);

	//delete deleteNoticeboard
	yield takeLatest(API_CONST.N_DELETE_NOTICE_BOARD, deleteNoticeboard);

	//delete my file
	yield takeLatest(API_CONST.N_DELETE_MY_FILE, deleteMyFile);

	//add response
	yield takeLatest(API_CONST.N_ADD_RESPONCE, addResponse);

	//get notification status
	yield takeLatest(API_CONST.N_GET_NOTIFICATION_STATUS, getNotificationStatus)

	//read unread message
	yield takeLatest(API_CONST.N_READ_UNREAD_MESSAGE, readUnreadMessage)

	//update dispute Status
	yield takeLatest(API_CONST.N_UPDATE_DISPUTE_STATUS_BY_ID, updateDisputeStatusById)

	yield takeLatest(API_CONST.N_GET_ADMIN_STATASITCS, getAdminStatistics)

	yield takeLatest(API_CONST.N_GET_USER_ROLE_BY_ID, getRoleById)
}
export default rootSaga;
