import { combineReducers } from 'redux';
import SignInReducer from '../Components/SignInAndSignUpComponent/SignInComponent/SignInReducer';
import ForgotPasswordReducer from '../Components/ForgotPasswordComponent/ForgotPasswordReducer';
import SignUpReducer from '../Components/SignInAndSignUpComponent/CreateAccountComponent/SignUpReducer';
import LogoutReducer from '../Components/LogoutComponent/LogoutReducer';
import HomeScreenReducer from '../Components/HomeComponent/HomeScreenReducer';
import AddPropertyReducer from '../Components/PropertiesComponent/AddPropertyComponent/AddPropertyReducer';
import ResendPasswordReducer from '../Components/ForgotPasswordComponent/ResendPasswordReducer';
import TenantScreenReducer from '../Components/TenantsComponent/TenantScreenReducer';
import AddTenantReducer from '../Components/TenantsComponent/AddNewTenantComponent/AddTenantReducer';
import TradersReducer from '../Components/TradersComponent/TradersReducer';
import SendMessageReducer from '../Components/TradersComponent/MessageToTraderComponent/SendMessageReducer';
import AddPropertyOwnerReducer from '../Components/PropertiesComponent/AddOwnerComponent/AddOwnerReducer';
import PropertyDetailReducer from '../Components/PropertiesComponent/PropertiesDetailsComponent/PropertyDetailReducer';
import SwitchProfileReducer from '../Components/SwitchProfileComponent/SwitchProfileReducer';
import UserImageReducer from '../Components/SettingComponent/UserImagesComponent/UserImageReducer';
import ProfileReducer from '../Components/ProfileComponent/ProfileReducer';
import UpdateUserImageReducer from '../Components/SettingComponent/ProfileSettingComponent/UpdateImageReducer';
import AccountSecurityReducer from '../Components/SettingComponent/AccountSecurityComponent/AccountSecurityReducer';
import NotificationSettingReducer from '../Components/SettingComponent/NotificationSettingComponent/NotificationSettingReducer';
import EditPropertyReducer from '../Components/PropertiesComponent/EditPropertyComponent/EditPropertyReducer';
import MaintenanceReducer from '../Components/MaintenanceRequestComponent/MaintenanceReducer';
import NewMaintenanceRequestReducer from '../Components/MaintenanceRequestComponent/NewMaintenanceRequest/NewMaintenanceRequestReducer';
import ForwardMaintenanceReqReducer from '../Components/MaintenanceRequestComponent/ForwardMaintenanceRequest/ForwardMaintenanceReqReducer';
import MaintenanceRequestDetailsReducer from '../Components/MaintenanceRequestComponent/MaintenanceRequestDetailsComponent/MaintenanceRequestDetailsReducer';
import SettingUserRoleReducer from '../Components/SettingComponent/UserRoleComponent/SettingUserRoleReducer';
import NotificationScreenReducer from '../Components/NotificationsComponent/NotificationScreenReducer';
import MyFileReducer from '../Components/MyFileComponent/MyFileReducer';
import AgreementsReducer from '../Components/AgreementsComponent/AgreementsReducer';
import AddAgreementReducer from '../Components/AgreementsComponent/AddAgreementComponent/AddAgreementReducer';
import EditAgreementReducer from '../Components/AgreementsComponent/EditAgreementComponent/EditAgreementReducer';
import AgreementDetailsReducer from '../Components/AgreementsComponent/AgreementDetailComponent/AgreementDetailsReducer';
import TradersMaintenanceReducer from '../Components/TradersMaintenanceRequestComponent/TradersMaintenanceReducer';

import TradersMaintenanceDetailsReducer from '../Components/TradersMaintenanceRequestComponent/TradersMaintenanceRequestDetailsComponent/TradersMaintenanceRequestDetailsReducer';
import MessageReducer from '../Components/MessagesComponent/MessageReducer';
import NoticeBoardReducer from '../Components/NoticeBoardComponent/NoticeBoardReducer';
import WriteReviewReducer from '../Components/WriteReviewComponent/WriteReviewReducer';
import FilterReducer from '../Components/FilterComponent/FilterReducer';

import ChatReducer from '../Components/ChatComponent/ChatReducer';
import PropertiesScreenReducer from '../Components/PropertiesComponent/PropertiesScreenReducer';
import AgentsScreenReducer from '../Components/AgentsComponent/AgentsScreenReducer';
import SearchScreenReducer from '../Components/SearchComponent/SearchScreenReducer';
import ThreadReducer from '../Components/MaintenanceRequestComponent/MaintenanceRequestDetailsComponent/ThreadComponent/ThreadReducer';
import AddAgentReducer from '../Components/AgentsComponent/AddAgentComponent/AddAgentReducer';
import MyFileFilterReducer from '../Components/MyFileFilterComponent/MyFileFilterReducer';
import CounterProposalReducer from '../Components/TradersMaintenanceRequestComponent/TraderCounterProposalComponent/CounterProposalReducer';
import DisputesScreenReducer from '../Components/DisputesComponent/DisputesScreenReducer';
import DisputesDetailsReducer from '../Components/DisputesComponent/DisputesDetailsComponent/DisputesDetailsReducer'
import MarkAsCompleteReducer from '../Components/TradersMaintenanceRequestComponent/MarkAsCompleteComponent/MarkAsCompleteReducer';
import NoticeBoardAddPostReducer from '../Components/NoticeBoardAddPostComponent/NoticeBoardAddPostReducer';
export default combineReducers({

	signInReducer: SignInReducer,
	forgotPasswordReducer: ForgotPasswordReducer,
	signUpReducer: SignUpReducer,
	logoutReducer: LogoutReducer,
	homeScreenReducer: HomeScreenReducer,
	addPropertyReducer: AddPropertyReducer,
	resendPasswordReducer: ResendPasswordReducer,
	tenantScreenReducer: TenantScreenReducer,
	tradersReducer: TradersReducer,
	sendMessageReducer: SendMessageReducer,
	addTenantReducer: AddTenantReducer,
	addPropertyOwnerReducer: AddPropertyOwnerReducer,
	propertyDetailReducer: PropertyDetailReducer,
	switchProfileReducer: SwitchProfileReducer,
	userImageReducer: UserImageReducer,
	profileReducer: ProfileReducer,
	updateUserImageReducer: UpdateUserImageReducer,
	accountSecurityReducer: AccountSecurityReducer,
	notificationSettingReducer: NotificationSettingReducer,
	editPropertyReducer: EditPropertyReducer,
	maintenanceReducer: MaintenanceReducer,
	newMaintenanceRequestReducer: NewMaintenanceRequestReducer,
	settingUserRoleReducer: SettingUserRoleReducer,
	maintenanceRequestDetailsReducer: MaintenanceRequestDetailsReducer,
	notificationScreenReducer: NotificationScreenReducer,
	myFileReducer:MyFileReducer,
	agreementsReducer:AgreementsReducer,
	addAgreementReducer:AddAgreementReducer,
	editAgreementReducer:EditAgreementReducer,
	agreementDetailsReducer:AgreementDetailsReducer,
	forwardMaintenanceReqReducer:ForwardMaintenanceReqReducer,
    tradersMaintenanceReducer:TradersMaintenanceReducer,

	tradersMaintenanceDetailsReducer: TradersMaintenanceDetailsReducer,
	messageReducer:MessageReducer,
	noticeBoardReducer:NoticeBoardReducer,
	writeReviewReducer:WriteReviewReducer,
	filterReducer:FilterReducer,

	chatReducer: ChatReducer,
	propertiesScreenReducer:PropertiesScreenReducer,
	agentsScreenReducer:AgentsScreenReducer,

	searchScreenReducer:SearchScreenReducer,
	threadReducer:ThreadReducer,

	addAgentReducer:AddAgentReducer,
	myFileFilterReducer:MyFileFilterReducer,

	counterProposalReducer:CounterProposalReducer,

	disputesScreenReducer: DisputesScreenReducer,
	markAsCompleteReducer:MarkAsCompleteReducer,
	disputesDetailsReducer:DisputesDetailsReducer,
	noticeBoardAddPostReducer:NoticeBoardAddPostReducer,


});