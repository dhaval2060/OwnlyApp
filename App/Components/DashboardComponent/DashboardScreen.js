import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Image,
	StyleSheet,
	View,
	Text,
	Button,
	TouchableOpacity,
	Alert,
	Platform,
	ScrollView,
	TextInput,
	Modal,
	AsyncStorage,
	YellowBox
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import CommonStyles from '../../CommonStyle/CommonStyle';
import DashboardStyle from './DashboardScreenStyle';
import ImagePath from '../../Constants/ImagesPath';
import HomeScreen from '../HomeComponent/HomeScreen';
import PropertiesScreen from '../PropertiesComponent/PropertiesScreen';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import Drawer from 'react-native-drawer';

import TenantScreen from '../TenantsComponent/TenantScreen';
import API from '../../Constants/APIUrls';
import TradersScreen from '../TradersComponent/TradersScreen';
import MyFileScreen from '../MyFileComponent/MyFileScreen';
import DisputesScreen from '../DisputesComponent/DisputesScreen';
import AgreementsScreen from '../AgreementsComponent/AgreementsScreen';
import SettingsScreen from '../SettingComponent/SettingsScreen';
import MaintenanceRequestScreen from '../MaintenanceRequestComponent/MaintenanceRequestScreen';
import MessagesScreen from '../MessagesComponent/MessagesScreen';
import ProfileScreen from '../ProfileComponent/ProfileScreen';
import AgentsScreen from '../AgentsComponent/AgentsScreen';
import NoticeBoardScreen from '../NoticeBoardComponent/NoticeBoardScreen';
import TradersMaintenanceRequestScreen from '../TradersMaintenanceRequestComponent/TradersMaintenanceRequestScreen';
import { CardWithWhiteBG } from '../CommonComponent/CardWithWhiteBG';
import AgencyProfileScreen from '../AgencyProfileComponent/ProfileScreen';
import * as Progress from 'react-native-progress';

import ApplicantScreen from '../ApplicantsComponent/TradersScreen';
//
const drawerStyles = {
	drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
	main: { paddingLeft: 0 },
}

import {
	userLogout,
	getStatistics,
	getUnreadMessageList,
	getUserRoles
} from "../../Action/ActionCreators";

import {
	logout,
	showLoading,
	resetState,
} from "../LogoutComponent/LogoutAction";
import CommonStyle from '../../CommonStyle/CommonStyle';
import IMAGEPATH from '../../Constants/ImagesPath';
import APICaller from '../../Saga/APICaller';
import SyncittSearch from '../SyncittHome/SyncittSearch';

var logoutPostData = {};

class Dashboard extends Component {
	constructor() {
		super();
		this.state = {
			activeTab: 0,
			isClickOnModal: false,
			previousTab: 0,
			userInfo: {},
			isUserSubscribe: true,
			unReadCount: 0,
			selectedMenuItem: '',
			userPermission: [],
			roleName: '',
			statisticsData: {},
			isTenant: false,
		};
		global.unRead = 0
		this.handleTabChange = this.handleTabChange.bind(this);
	}
	componentWillUnmount() {
		this.getUserDetails()

	}
	componentWillMount() {
		console.disableYellowBox = true;
		console.log("selectedMenuItemselectedMenuItemselectedMenuItem", this.props.resetType)
		if (this.props.resetType == "SETTINGS") {
			this.setState({ selectedMenuItem: Strings.SETTINGS, isTenant: false });
		}
		AsyncStorage.getItem("SyncittUserInfo").then((value) => {
			if (value) {

				var userData = JSON.parse(value);
				console.log('userData.data.image',userData.data);
				global.userImage = userData.data ? (userData.data.image ? API.USER_IMAGE_PATH + userData.data.image : '') : ''
				this.setState({ userInfo: userData });
			}
		}).done();
		this.getUsePermission();
		this.getRoleName();
		this.callGetUserRole();
		this.getUserDetails()
		this.callGetUnreadMessage();
	}
	getUserDetails() {
		AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((rolename) => {
			if (rolename == 'Trader') {
				AsyncStorage.getItem("SyncittUserInfo").then((value) => {
					if (value) {
						var userData = JSON.parse(value);
						var authToken = userData.token;
						let UserID = userData.data._id;
						global.userId = userData.data._id
						AsyncStorage.getItem("roleId").then((value) => {
							if (value) {
								let roleid = value
								var userData = {
									"userId": UserID,
									"roleId": roleid
								}
								APICaller("getUserDetails", "POST", authToken, userData).then(data => {

									if (data.data.subscription_id) {
										global.isUserSubscribe = true
										this.setState({ isUserSubscribe: true })
									}
									else {
										global.isUserSubscribe = false
										this.setState({ isUserSubscribe: false })
									}
								})
							}
						}).done();

					}
				}).done();
			}
		}).done();
	}

	componentWillReceiveProps(nextProps) {
		// if (this.props.logoutReducer.onTabPressed.tab == Strings.TENANTS) {
		// 	this.setState({ activeTab: 4, previousTab: 0, selectedMenuItem: Strings.TENANTS });
		// } else if (this.props.logoutReducer.onTabPressed.F == Strings.PROPERTIES) {
		// 	this.setState({ activeTab: 1, previousTab: 0 });
		// } else if (this.props.logoutReducer.onTabPressed.tab == Strings.REQUESTS) {
		// 	this.setState({ activeTab: 3, previousTab: 0 });
		// }

	}


	componentDidUpdate() {
		this.onLogoutSuccess();
		this.onGetStatisticsSuccess();
		this.onUnreadMessageSuccess();
		if (this.props.switchProfileReducer.switchUserProfileRes != '') {
			this.props.switchProfileReducer.switchUserProfileRes.data.finalArr.forEach(element => {
				if (this.state.roleId == element._id) {

					global.selectedRole = element.description
					// this.setState({ selectedRole: element })
				}
			});
			// this.prepareUserRoleData(this.props.switchProfileReducer.switchUserProfileRes)
		}
	}
	callGetUserRole() {
		AsyncStorage.getItem("SyncittUserInfo").then((value) => {
			if (value) {


				var userData = JSON.parse(value);

				this.setState({ logedinUserData: userData });
				var authToken = userData.token;
				var postData = {
					user_id: userData.data._id,
				}
				this.props.showLoading();
				this.props.getUserRoles(authToken, postData);
			}
		}).done();
	}
	
	callGetUnreadMessage() {
		AsyncStorage.getItem("SyncittUserInfo").then((value) => {
			if (value) {
				var userData = JSON.parse(value);
				var authToken = userData.token;
				this.props.showLoading();
				this.props.getUnreadMessageList(authToken, userData.data._id);
			}
		}).done();
	}
	onUnreadMessageSuccess() {
		if (this.props.homeScreenReducer.unreadMsgListResponse != '') {
			if (this.props.homeScreenReducer.unreadMsgListResponse.code == 200) {
				this.setState({ unReadCount: this.props.homeScreenReducer.unreadMsgListResponse.data.length });
				global.unRead = this.props.homeScreenReducer.unreadMsgListResponse.data.length
			}
			else {
				// alert(this.props.homeScreenReducer.unreadMsgListResponse.message);
			}
			this.props.resetState();

		}
	}
	getRoleId() {

		AsyncStorage.getItem("roleId").then((value) => {
			if (value) {

				this.setState({ roleId: value });
			}
		}).done();
	}

	componentDidMount() {
		this.getRoleId();

	}

	getRoleName() {

		AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
			if (value) {

				this.setState({ roleName: value });
				(value == Strings.USER_ROLE_AGENT || value == Strings.USER_ROLE_AGENCY_OWNER) ? this.callGetStatistics() : null;
			}
		}).done();
	}

	// getUsePermission() {

	// 	AsyncStorage.getItem("userPermission").then((value) => {
	// 		if (value) {

	// 			var permission = JSON.parse(value);

	// 			this.setState({ userPermission: permission.data });

	// 		}
	// 	}).done();
	// }
	getUsePermission() {
		AsyncStorage.getItem("userPermission").then((value) => {
			if (value) {
				var permission = JSON.parse(value);
				console.log('Permission',permission.data);
				this.setState({ userPermission: permission.data });
			}
		}).done();
	}

	drawerCheck() {

		if (this._drawer.open()) {
			this._drawer.close();
		} else {
			this._drawer.close();
		}
	}

	onLogout() {


		if (this.state.userInfo.data) {

			logoutPostData = {
				user_id: this.state.userInfo.data.user_id
			};
			this.props.showLoading();
			this.props.userLogout(logoutPostData);

		}
	}
	confirmUserLogout() {
		Alert.alert(
			Strings.APP_NAME,
			Strings.LOGOUT_CONFIRMATION_MSG,
			[
				{ text: Strings.YES, onPress: () => this.onLogout() },
				{ text: Strings.NO, onPress: () => { } },

			],
			{ cancelable: false }
		)
	}


	onLogoutSuccess() {

		if (this.props.logoutReducer.logoutResponse != '') {

			if (this.props.logoutReducer.logoutResponse.code == 200) {
				Actions.WelcomeScreen({ type: "reset" });
				global.userId = ''
				AsyncStorage.clear();
			}
			else {
				//alert(this.props.logoutReducer.logoutResponse.message);

			}
			this.props.resetState();
		}
	}


	closeControlPanel = () => {
		this._drawer.close()
	};

	openControlPanel = () => {
		this._drawer.open()

	};

	onSetting() {
		this.setState({ selectedMenuItem: Strings.SETTINGS, isTenant: false });
		this.closeControlPanel();
	}

	onAgreements() {
		this.setState({ selectedMenuItem: Strings.AGREEMENTS, isTenant: false });
		this.closeControlPanel();
	}

	onNoticeBoard() {
		this.setState({ selectedMenuItem: Strings.NOTICE_BOARD, isTenant: false });
		this.closeControlPanel();
	}

	onDisputes() {
		this.setState({ selectedMenuItem: Strings.DISPUTES, isTenant: false });
		this.closeControlPanel();
	}

	onMyFile() {
		this.setState({ selectedMenuItem: Strings.MYFILE, isTenant: false });
		this.closeControlPanel();
	}

	onAgents() {
		this.setState({ selectedMenuItem: Strings.AGENTS, isTenant: false });
		this.closeControlPanel();
	}

	onTrader() {
		this.setState({ selectedMenuItem: Strings.TRADERS, isTenant: false });
		this.closeControlPanel();
	}
	onSearchTrader() {
		this.setState({ selectedMenuItem: Strings.SEARCH_TRADERS, isTenant: false });
		this.closeControlPanel();
	}

	onApplicant() {
		this.setState({ selectedMenuItem: Strings.APPLICANT, isTenant: false });
		this.closeControlPanel();
	}

	onNoticeClick(id) {
		Actions.NoticeBoardDetailScreen({ noticeBoardId: id });
	}

	onTenant() {
		this.setState({ selectedMenuItem: Strings.TENANTS, isTenant: false });
		this.closeControlPanel();
	}

	onTenantClick() {
		if (this.state.statisticsData.tenantCnt > 0) {
			this.setState({ selectedMenuItem: Strings.TENANTS, isTenant: true });
		}
	}

	onProperties() {
		if (this.state.statisticsData.propertyCnt > 0) {
			this.setState({ activeTab: 1, previousTab: 0, isTenant: false });
		}
	}

	onRequest() {
		if (this.state.statisticsData.requestCnt > 0) {
			this.setState({ activeTab: 3, previousTab: 0, isTenant: false });
		}
	}

	handleTabChange(newTabIndex, oldTabIndex) {
		console.log(newTabIndex, oldTabIndex, "newTabIndex, oldTabIndex")
		if (newTabIndex != 4) {
			this.getUserDetails()
		}
		if (newTabIndex == 4 && !this.state.isClickOnModal) {
			this._drawer.open();
		}
		// if (this.state.activeTab == 4) {
		// 	this._drawer.open();
		// }
		this.setState({ activeTab: newTabIndex, previousTab: oldTabIndex, isTenant: false });

	}
	callSwitchAccountScreen() {
		this._drawer.close()
		Actions.SwitchProfileScreen();
	}
	callNotificationScreen() {
		this._drawer.close()
		Actions.NotificationsScreen();
	}
	callSearchScreen() {
		this._drawer.close()
		Actions.SearchScreen();
	}

	callProfileScreen() {

		this.setState({ selectedMenuItem: Strings.PROFILE, isTenant: false });
		this.closeControlPanel();
	}

	callGetStatistics() {

		AsyncStorage.getItem("SyncittUserInfo").then((value) => {
			if (value) {
				var userData = JSON.parse(value);
				var authToken = userData.token;

				var postData = {
					agency_id: userData.data.agency_id,
					request_by_role: userData.data.role_id,
					user_id: userData.data._id,
				}
				this.props.showLoading();
				this.props.getStatistics(authToken, postData);
			}
		}).done();
	}

	onGetStatisticsSuccess() {
		if (this.props.logoutReducer.statisticRes != '') {
			if (this.props.logoutReducer.statisticRes.code == 200) {

				this.setState({ statisticsData: this.props.logoutReducer.statisticRes.data });
			}
			else {
				//	alert(this.props.logoutReducer.statisticRes.message);
			}
			this.props.resetState();
		}
	}


	_showSelectedScreen(newTabIndex) {
		switch (newTabIndex) {
			case 0:
				return (
					<View style={DashboardStyle.scrollViewStyle}>
						{this.navBar()}
						{this.staticView()}
					</View>
				);
				break;
			case 1:
				return (
					<PropertiesScreen />
				);
				break;
			case 2:
				return (
					<MessagesScreen />
				);

				break;
			case 3:
				return (

					this.state.roleName == Strings.USER_ROLE_TRADER ? <TradersMaintenanceRequestScreen /> : <MaintenanceRequestScreen />
				);

				break;
			case 4:

				// this._drawer.open();

				if (this.state.selectedMenuItem == '') {
					return (
						<View style={DashboardStyle.scrollViewStyle}>
							{this.navBar()}
							{this.staticView()}
						</View>
					);
				}
				switch (this.state.selectedMenuItem) {
					case Strings.SEARCH_TRADERS:
						return (
							<SyncittSearch />
						);
						break;

					case Strings.TENANTS:
						return (

							<TenantScreen />

						);
						break;
					case Strings.TRADERS:
						return (

							<TradersScreen />
						);
						break;

					case Strings.APPLICANT:
						return (

							<ApplicantScreen />
						);
						break;
					case Strings.MY_AGENCY:
						return (

							<AgencyProfileScreen />
						);
						break;
					case Strings.AGENTS:
						return (

							<AgentsScreen />
						);
						break;

					case Strings.MYFILE:
						return (

							<MyFileScreen />
						);
						break;

					case Strings.DISPUTES:
						return (

							<DisputesScreen />
						);
						break;
					case Strings.AGREEMENTS:
						return (

							<AgreementsScreen />
						);
						break;

					case Strings.NOTICE_BOARD:
						return (

							<NoticeBoardScreen />
						);
						break;
					case Strings.PROFILE:
						return (

							<ProfileScreen />
						);
						break;
					case Strings.SETTINGS:
						return (

							<SettingsScreen isOpenSettingTab={this.state.isClickOnModal} />
						);
						break;
					default:

				}
				break;
			default:

		}

	}

	callAgencyProfileScreen() {

		this.setState({ selectedMenuItem: Strings.MY_AGENCY });
		this.closeControlPanel();
	}
	drawerContentView() {
		{
			var firstName = this.state.userInfo.data && this.state.userInfo.data.firstname ? this.state.userInfo.data.firstname : '';
			var lastName = this.state.userInfo.data && this.state.userInfo.data.lastname ? this.state.userInfo.data.lastname : '';
			var userEmail = this.state.userInfo.data ? this.state.userInfo.data.email : '';
			// var userImage = this.state.userInfo.data ? (this.state.userInfo.data.image ? API.USER_IMAGE_PATH + this.state.userInfo.data.image : '') : '';
			var userImage = global.userImage

			return (

				<View style={DashboardStyle.drawerContentView} >
					<View style={DashboardStyle.headerViewStyle}>
						<TouchableOpacity onPress={() => this.callNotificationScreen()}>
							<View>
								<Image source={ImagePath.DRAWER_NOTIFICATION_ICON} />
							</View>
						</TouchableOpacity>
						<View style={DashboardStyle.searchViewStyle}>
							<TouchableOpacity onPress={() => this.callSearchScreen()}>
								<Image source={ImagePath.DRAWER_SEARCH_NAV} style={DashboardStyle.searchImageStyle} />
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.closeControlPanel()}>
								<Image source={ImagePath.DRAWER_CROSS_ICON} />
							</TouchableOpacity>
						</View>
					</View>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={DashboardStyle.userImageViewStyle}>

							<TouchableOpacity onPress={() => this.callProfileScreen()} style={DashboardStyle.userImageViewStyle}>
								{console.log('userImage',userImage)}
								{
									userImage != '' ? <Image source={{ uri: userImage }} style={DashboardStyle.userImageStyle} />
										:
										<View style={CommonStyles.emptyUserImageStyle}>
											{<Text style={CommonStyles.initialTextStyle}>{firstName ? firstName.charAt(0).toUpperCase() : "" + ' ' + lastName && lastName != '' ? lastName.charAt(0).toUpperCase() : ""}</Text>}
										</View>
								}

								<Text style={DashboardStyle.userNameTextStyle}>{firstName + ' ' + lastName}</Text>
								<Text style={DashboardStyle.userEmailTextStyle}>{userEmail}</Text>
								<Text style={DashboardStyle.userRoleTextStyle}>{global.selectedRole}</Text>

							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.callSwitchAccountScreen()}>
								<View style={DashboardStyle.roundedBlueSwitchButtonStyle}>
									<Text style={DashboardStyle.swithButtonTextStyle}>{Strings.SWITCH_ACCOUNT}</Text>
								</View>
							</TouchableOpacity>
						</View>

						<View style={DashboardStyle.drawerItemViewContainer}>

							{
								this.state.userPermission.includes('trader_listing')
									?
									<TouchableOpacity onPress={() => this.onSearchTrader()} style={this.state.selectedMenuItem == Strings.SEARCH_TRADERS ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image  source={ImagePath.DRAWER_TRADER_SEARCH} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.SEARCH_TRADERS}</Text>
											</View>
										</View>
									</TouchableOpacity> : null
							}

							{
								this.state.userPermission.includes('tenants_listing')
									?
									<TouchableOpacity onPress={() => this.onTenant()} style={this.state.selectedMenuItem == Strings.TENANTS ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.DRAWER_TENANTS} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.TENANTS}</Text>
											</View>
										</View>
									</TouchableOpacity> : null
							}

							{
								this.state.userPermission.includes('trader_listing')
									?
									<TouchableOpacity onPress={() => this.onTrader()} style={this.state.selectedMenuItem == Strings.TRADERS ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.DRAWER_TRADERS} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.TRADERS}</Text>
											</View>
										</View>
									</TouchableOpacity> : null
							}
							{
								this.state.userPermission.includes('agreement')
									?
									<TouchableOpacity onPress={() => this.onAgreements()} style={this.state.selectedMenuItem == Strings.AGREEMENTS ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.DRAWER_AGREEMENT} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{'Tenancies'}</Text>
												{/* Strings.AGREEMENTS */}
											</View>
										</View>
									</TouchableOpacity> : null
							}
							{/* <TouchableOpacity onPress={() => this.onApplicant()} style={this.state.selectedMenuItem == Strings.APPLICANT ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.DRAWER_TRADERS} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.APPLICANT}</Text>
											</View>
										</View>
									</TouchableOpacity> */}

							{this.state.roleName == Strings.USER_ROLE_AGENT ?
								<TouchableOpacity onPress={() => this.callAgencyProfileScreen()} style={this.state.selectedMenuItem == Strings.MY_AGENCY ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
									<View style={DashboardStyle.drawerMenuItemViewStyle}>
										<Image source={ImagePath.DRAWER_AGENCY_NAV} />
										<View style={DashboardStyle.drawerItemTextViewStyle}>
											<Text style={DashboardStyle.drawerItemText}>{Strings.MY_AGENCY}</Text>
										</View>
									</View>
								</TouchableOpacity> : null
							}
							{/* {
							this.state.userPermission.includes('agents_listing')
									? */}
							<TouchableOpacity onPress={() => this.onAgents()} style={this.state.selectedMenuItem == Strings.AGENTS ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
								<View style={DashboardStyle.drawerMenuItemViewStyle}>
									<Image source={ImagePath.DRAWER_AGENT_NAV} />
									<View style={DashboardStyle.drawerItemTextViewStyle}>
										<Text style={DashboardStyle.drawerItemText}>{Strings.AGENTS}</Text>
									</View>
								</View>
							</TouchableOpacity>
							{/* } */}

							{
								this.state.userPermission.includes('myFile')
									?
									<TouchableOpacity onPress={() => this.onMyFile()} style={this.state.selectedMenuItem == Strings.MYFILE ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.DRAWER_MY_FILES} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.MYFILE}</Text>
											</View>
										</View>
									</TouchableOpacity> : null
							}

							{
								this.state.userPermission.includes('disputes')
									?
									<TouchableOpacity onPress={() => this.onDisputes()} style={this.state.selectedMenuItem == Strings.DISPUTES ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.DRAWER_DISPUTES} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.DISPUTES}</Text>
											</View>
										</View>
									</TouchableOpacity> : null
							}

							

							{
								this.state.userPermission.includes('noticeboard') ?
									<TouchableOpacity onPress={() => this.onNoticeBoard()} style={this.state.selectedMenuItem == Strings.NOTICE_BOARD ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.NOTICE} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.NOTICE_BOARD}</Text>
											</View>
										</View>
									</TouchableOpacity> : null
							}

							{
								this.state.userPermission.includes('setting')
									?
									<TouchableOpacity onPress={() => this.onSetting()} style={this.state.selectedMenuItem == Strings.SETTINGS ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
										<View style={DashboardStyle.drawerMenuItemViewStyle}>
											<Image source={ImagePath.DRAWER_SETTINGS} />
											<View style={DashboardStyle.drawerItemTextViewStyle}>
												<Text style={DashboardStyle.drawerItemText}>{Strings.PROFILE1}</Text>
											</View>
										</View>
									</TouchableOpacity> : null
							}


							<TouchableOpacity onPress={() => this.confirmUserLogout()} style={this.state.selectedMenuItem == Strings.SIGNOUT ? DashboardStyle.selectedMenuItemBackgroundStyle : DashboardStyle.menuItemBackgroundStyle}>
								<View style={DashboardStyle.drawerMenuItemViewStyle}>
									<Image source={ImagePath.DRAWER_SIGNOUT} />
									<View style={DashboardStyle.drawerItemTextViewStyle}>
										<Text style={DashboardStyle.drawerItemText}>{Strings.SIGNOUT}</Text>
									</View>
								</View>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>

			);
		}

	}

	callSearchScreen() {

		Actions.SearchScreen();
	}


	tenantView() {
		return (

			<TenantScreen />

		);
	}

	navBar() {

		return (
			<View >
				<Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
				<Text style={CommonStyles.navBarTitleTextView}>{Strings.NAV_HOME_TITLE}</Text>

				<TouchableOpacity onPress={() => this.callSearchScreen()} style={CommonStyles.navRightImageView}>
					<View>
						<Image source={ImagePath.DRAWER_SEARCH_ICON} />
					</View>
				</TouchableOpacity>
			</View>
		);
	}
	staticView() {
		return (
			<ScrollView >
				<HomeScreen />
				{/* {(this.state.roleName == Strings.USER_ROLE_AGENT || this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER) ?
					<View style={DashboardStyle.noticeBoardContainerViewStyle}>
						<Text style={DashboardStyle.managePropertyTextStyle}>
							{Strings.STATISTICS}
						</Text>

						<CardWithWhiteBG>
							<TouchableOpacity onPress={() => this.onTenantClick()}>

								<View style={DashboardStyle.statisticsViewContainer}>
									<Text style={DashboardStyle.statisticsLabelTextStyle}>{Strings.TENANTS}</Text>
									<Text style={DashboardStyle.statisticsTextStyle}>{this.state.statisticsData.tenantCnt ? this.state.statisticsData.tenantCnt : 0}</Text>
								</View>
							</TouchableOpacity>
						</CardWithWhiteBG>

						<CardWithWhiteBG>
							<TouchableOpacity onPress={() => this.onProperties()}>

								<View style={DashboardStyle.statisticsViewContainer}>
									<Text style={DashboardStyle.statisticsLabelTextStyle}>{Strings.PROPERTIES}</Text>
									<Text style={DashboardStyle.statisticsTextStyle}>{this.state.statisticsData.propertyCnt ? this.state.statisticsData.propertyCnt : 0}</Text>
								</View>
							</TouchableOpacity>
						</CardWithWhiteBG>

						<CardWithWhiteBG>
							<TouchableOpacity onPress={() => this.onRequest()}>

								<View style={DashboardStyle.statisticsViewContainer}>
									<Text style={DashboardStyle.statisticsLabelTextStyle}>{Strings.REQUESTS}</Text>
									<Text style={DashboardStyle.statisticsTextStyle}>{this.state.statisticsData.requestCnt ? this.state.statisticsData.requestCnt : 0}</Text>
								</View>
							</TouchableOpacity>
						</CardWithWhiteBG>
					</View>
					: null
				} */}
			</ScrollView>
		);
	}


	render() {

		return (

			<View style={{ flex: 1 }}>
				<Drawer
					ref={(ref) => this._drawer = ref}
					type="overlay"
					side="right"
					content={this.drawerContentView()}
					tapToClose={true}
					openDrawerOffset={0.2} // 20% gap on the right side of drawer
					panCloseMask={0.2}
					closedDrawerOffset={-3}
					styles={drawerStyles}
					tweenHandler={(ratio) => ({
						main: { opacity: (2 - ratio) / 2 }
					})}>

					{this.state.isTenant ? this.tenantView() : this._showSelectedScreen(this.state.activeTab)}

					<BottomNavigation
						activeTab={this.state.activeTab}
						labelColor="white"
						rippleColor="white"
						style={{ flex: 1, height: 64, elevation: 8, position: 'absolute', left: 0, bottom: 0, right: 0 }}
						innerStyle={{ paddingTop: 10 }}
						onTabChange={this.handleTabChange}
						shifting={false}>

						<Tab
							barBackgroundColor="#FFFFFF"
							icon={<Image source={ImagePath.DASHBOARD_HOME_ACTIVE} resizeMode={'contain'} style={[CommonStyles.bottomTabIcons1, { tintColor: 'gray' }]} />}
							activeIcon={<Image source={ImagePath.DASHBOARD_HOME_ACTIVE} resizeMode={'contain'} style={CommonStyles.bottomTabIcons1} />}
						/>
						<Tab
							barBackgroundColor="#FFFFFF"
							icon={<Image source={ImagePath.DASHBOARD_PROPERTY_ACTIVE} resizeMode={'contain'} style={[CommonStyles.bottomTabIcons1, { tintColor: 'gray' }]} />}
							activeIcon={<Image source={ImagePath.DASHBOARD_PROPERTY_ACTIVE} resizeMode={'contain'} style={CommonStyles.bottomTabIcons1} />}
						/>
						<Tab
							barBackgroundColor="#FFFFFF"
							icon={
								<View style={{ flex: 1 }}>
									{global.unRead != 0 &&
										<View style={{
											shadowOpacity: 0.5,
											shadowRadius: 3,
											shadowOffset: { height: 0, width: 0 },
											justifyContent: 'center',
											shadowColor: 'grey', zIndex: 9, left: 20, height: 16, top: -5, width: 16, borderRadius: 8, backgroundColor: 'white'
										}}>
											<Text style={{ fontSize: 8, color: 'red', backgroundColor: 'transparent', textAlign: 'center' }}>{global.unRead}</Text>
										</View>
									}
									<Image source={ImagePath.DASHBOARD_MESSAGE_ACTIVE} resizeMode={'contain'} style={[{ flex: 1, tintColor: 'gray', position: "absolute", top: 0, zIndex: 0 }, CommonStyles.bottomTabIcons1]} />
								</View>
							}
							activeIcon={
								<View style={{ flex: 1 }}>
									{global.unRead != 0 &&
										<View style={{
											shadowOpacity: 0.5,
											justifyContent: 'center',
											shadowRadius: 3,
											shadowOffset: { height: 0, width: 0 },
											shadowColor: 'grey', zIndex: 9, left: 20, height: 16, top: -5, width: 16, borderRadius: 8, backgroundColor: 'white'
										}}>
											<Text style={{ fontSize: 8, color: 'red', backgroundColor: 'transparent', textAlign: 'center' }}>{global.unRead}</Text>
										</View>
									}
									<Image source={ImagePath.DASHBOARD_MESSAGE_ACTIVE} resizeMode={'contain'} style={[{ flex: 1, position: "absolute", top: 0, zIndex: 0 }, CommonStyles.bottomTabIcons1]} />
								</View>
							}
						/>
						<Tab
							barBackgroundColor="#FFFFFF"
							icon={<Image source={ImagePath.DASHBOARD_REQUEST_ACTIVE} resizeMode={'contain'} style={[CommonStyles.bottomTabIcons1, { tintColor: 'gray' }]} />}
							activeIcon={<Image source={ImagePath.DASHBOARD_REQUEST_ACTIVE} resizeMode={'contain'} style={CommonStyles.bottomTabIcons1} />}
						/>
						<Tab
							barBackgroundColor="#FFFFFF"
							icon={<Image source={ImagePath.DASHBOARD_MENU_ACTIVE} resizeMode={'contain'} style={[CommonStyles.bottomTabIcons, { tintColor: 'gray' }]} />}
							activeIcon={<Image source={ImagePath.DASHBOARD_MENU_ACTIVE} resizeMode={'contain'} style={CommonStyles.bottomTabIcons} />}
						/>

					</BottomNavigation>

				</Drawer>

				{
					this.props.logoutReducer.isScreenLoading ?
						<View style={CommonStyles.circles}>
							<Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
						</View>
						: null
				}
			</View>
		);
	}

}


function mapStateToProps(state) {
	return {
		logoutReducer: state.logoutReducer,
		homeScreenReducer: state.homeScreenReducer,
		switchProfileReducer: state.switchProfileReducer
	}
}

export default connect(
	mapStateToProps,
	{
		userLogout,
		getStatistics,
		showLoading,
		resetState,
		getUnreadMessageList,
		getUserRoles
	}

)(Dashboard)
