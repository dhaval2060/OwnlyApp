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
    TextInput,
    ScrollView,
    FlatList,
    Dimensions,
    AsyncStorage,
    Modal
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import HomeScreenStyle from './HomeScreenStyle';
//import listData from  '../../../data';
import { CardWithWhiteBG } from '../CommonComponent/CardWithWhiteBG';
import * as Progress from 'react-native-progress';
import API from '../../Constants/APIUrls';

import Moment from 'moment';
import SocketIOClient from 'socket.io-client';
import {
    getUnreadMessageList,
    getMaintenanceRequestList,
    getMaintenanceThreadList,
    getGeneralThreadList,
    getStatistics,
    likeProperty,
    getNoticeBoardList,
    getPropertyList,
    getDisputesList,
    dashboardInspectionData
} from "../../Action/ActionCreators";
import {
    onTabPressed,
    showLoading,
    resetState,
} from "./HomeScreenAction";
import {
    updateScene
} from "../PropertiesComponent/PropertiesScreenAction";
let ref;
const window = Dimensions.get('window');
var UserID = '';
var inspectionPropertyAdd = '';

var inspectionDate = '';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import APICaller from '../../Saga/APICaller';
import IMAGEPATH from '../../Constants/ImagesPath';
//import SlidingCalendarView from 'react-native-sliding-calendar-view';

class HomeScreen extends Component {
    constructor() {
        super();
        this.state = {
            maintenanceListData: [],
            roleId: '',
            maintenanceThreadListData: [],
            propertyListData: [],
            noticeBoardListData: [],
            unreadMsgListData: [],
            userPermission: [],
            isTabSelected: 1,
            isScreenLoading: true,
            roleName: '',
            inspectionData: [],
            markedDatesObj: {},
            inspectionDetailObj: {},
            isShowPopup: false,

        };
        ref = this;
        this.socket = SocketIOClient(API.CHAT_CONNECTION_URL, { transports: ['websocket'] });

        this.socket.on('getAppliedUsersRes', (messages) => {
            this.setState({ users: messages })
        });
        AsyncStorage.getItem("roleId").then((value) => {
            if (value) {

                this.setState({ roleId: value });
            }
        }).done();
        this.onAllTabClick()
        this.callGetMaintenanceThreadRequest()
        setTimeout(() => {
            this.onGeneralTabClick()
        }, 2000);
    }

    componentWillReceiveProps(nextProps) {


        if (nextProps.propertiesScreenReducer.refreshScene == 'updateProperty' && nextProps.propertiesScreenReducer.refreshScene != '' && nextProps.propertiesScreenReducer.refreshScene != undefined) {
            this.props.updateScene('');
            this.callGetProperty();
        }


    }

    componentDidUpdate() {

        this.onPropertyListSuccess();
        this.onNoticeBoardListSuccess();
        this.onMaintenanceRquestSuccess();
        this.onGetUnreadMessageSuccess();
        this.onMaintenanceThreadSuccess();
        this.onGeneralThreadSuccess();
        this.onLikePropertySuccess();
        this.onGetStatisticsSuccess();
        this.onGetInspectionSuccess();
        this.onGetDisputeSuccess();
    }

    componentWillUnmount() {
        this.setState({ markedDatesObj: {}, inspectionDetailObj: {} });
    }
    onGetDisputeSuccess() {

        if (this.props.disputesScreenReducer.disputesListResponse) {
            if (this.props.disputesScreenReducer.disputesListResponse.code == 200) {
                this.setState({ disputeList: this.props.disputesScreenReducer.disputesListResponse.data })

            }

        }
    }

    componentWillMount() {

        this.getRoleName();

    }
    componentDidMount() {

        this.callGetProperty();
        this.getUsePermission();
        this.getInspectionData();
        this.callGetGeneralThreadRequest();
        this.callDisputesList();

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                UserID = userData.data._id;
                global.userId = userData.data._id

                this.socket.emit('addUser', { id: UserID });
                this.socket.emit("getAppliedUsers", UserID);
            }
        }).done();
    }

    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                this.setState({ roleName: value });
            }
        }).done();
    }

    getUsePermission() {

        AsyncStorage.getItem("userPermission").then((value) => {
            if (value) {

                var permission = JSON.parse(value);

                this.setState({ userPermission: permission.data });

            }
        }).done();
    }

    showPopup(day) {

        if (this.state.markedDatesObj.hasOwnProperty(day.dateString)) {
            inspectionDate = day.dateString;
            inspectionPropertyAdd = this.state.inspectionDetailObj[day.dateString]
            if (this.state.isShowPopup == false) {

                this.setState({ isShowPopup: true });
            }
            else {

                this.setState({ isShowPopup: false });
            }
        }
        else {
            this.setState({ isShowPopup: false });

        }

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

    onGetUnreadMessageSuccess() {

        if (this.props.homeScreenReducer.unreadMsgListResponse != '') {
            if (this.props.homeScreenReducer.unreadMsgListResponse.code == 200) {

                this.setState({ unreadMsgListData: this.props.homeScreenReducer.unreadMsgListResponse.data });
                (this.state.roleName == Strings.USER_ROLE_AGENT || this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER) ? this.callGetStatistics() : null;
                this.callGetGeneralThreadRequest();
            }
            else {
                // alert(this.props.homeScreenReducer.unreadMsgListResponse.message);
            }
            this.props.resetState();

        }
    }


    callGetStatistics() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;

                var postData = {
                    agency_id: userData.data.agency_id,
                    request_by_role: this.state.roleId,
                    user_id: userData.data._id,
                }
                this.props.showLoading();
                this.props.getStatistics(authToken, postData);
            }
        }).done();
    }

    getInspectionData() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    request_by_role: this.state.roleId,
                    request_by_id: userData.data._id,
                }
                this.props.showLoading();
                this.props.dashboardInspectionData(authToken, postData);
            }
        }).done();
    }
    onGetInspectionSuccess() {

        if (this.props.homeScreenReducer.inspectionDataRes != '') {
            if (this.props.homeScreenReducer.inspectionDataRes.code == 200) {

                this.setState({ inspectionData: this.props.homeScreenReducer.inspectionDataRes.data });

                var resData = this.props.homeScreenReducer.inspectionDataRes.data;

                this.prepareMarkedDate(resData);
            }
            else {

                // alert(this.props.homeScreenReducer.inspectionDataRes.message);
            }
            this.props.resetState();
        }
    }

    onGetStatisticsSuccess() {

        if (this.props.homeScreenReducer.statisticRes != '') {
            if (this.props.homeScreenReducer.statisticRes.code == 200) {
                // this.setState({ statisticsData: this.props.homeScreenReducer.statisticRes.data });
            }
            else {
                // alert(this.props.homeScreenReducer.statisticRes.message);
            }
            this.props.resetState();
        }
    }


    callGetProperty() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;

                var postData = {
                    agency_id: userData.data.agency_id,
                    request_by_role: this.state.roleId,
                    user_id: userData.data._id,
                }
                this.props.showLoading();
                this.props.getPropertyList(authToken, postData);
            }
        }).done();
    }


    callGetNoticeBoardList() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var postdata = {};
                var authToken = userData.token;

                AsyncStorage.getItem("roleId").then((role) => {
                    if (role) {
                        postdata = {
                            agency_id: userData.data.agency_id,
                            user_id: userData.data._id,
                            role_id: role
                        };
                        this.props.showLoading();
                        this.props.getNoticeBoardList(authToken, postdata);
                    }
                }).done();
            }
        }).done();
    }
    onNoticeBoardListSuccess() {
        if (this.props.homeScreenReducer.noticeBoardListResponse != '') {
            if (this.props.homeScreenReducer.noticeBoardListResponse.code == 200) {
                this.setState({ noticeBoardListData: this.props.homeScreenReducer.noticeBoardListResponse.data });
                this.callGetMaintenanceRequest();
            }
            else {

                // alert(this.props.homeScreenReducer.propertyListResponse.message);
            }
            this.props.resetState();

        }
    }

    onMaintenanceRquestSuccess() {

        if (this.props.homeScreenReducer.maintenanceListResponse != '') {
            if (this.props.homeScreenReducer.maintenanceListResponse.code == 200) {

                this.setState({ maintenanceListData: this.props.homeScreenReducer.maintenanceListResponse.data });
                this.callGetUnreadMessage();
            }
            else {
                // alert(this.props.homeScreenReducer.maintenanceListResponse.message);
            }
        }

        this.props.resetState();
    }

    onMaintenanceThreadSuccess() {
        if (this.props.homeScreenReducer.maintenanceThreadListResponse != '') {

            if (this.props.homeScreenReducer.maintenanceThreadListResponse.code == 200) {
                this.setState({ maintenanceThreadListData: this.props.homeScreenReducer.maintenanceThreadListResponse.result });
            }
            else {
                // alert(this.props.homeScreenReducer.maintenanceThreadListResponse.message);
            }
        }

        this.props.resetState();
    }

    onGeneralThreadSuccess() {

        if (this.props.homeScreenReducer.generalThreadListResponse != '') {

            if (this.props.homeScreenReducer.generalThreadListResponse.code == 200) {
                // this.setState({: this.props.homeScreenReducer.generalThreadListResponse.maintenences });
            }
            else {
                // alert(this.props.homeScreenReducer.generalThreadListResponse.message);
            }
        }

        this.props.resetState();
    }

    callSearchScreen() {

        Actions.SearchScreen();
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

    onPropertyListSuccess() {

        if (this.props.homeScreenReducer.propertyListResponse != '') {
            if (this.props.homeScreenReducer.propertyListResponse.code == 200) {

                this.setState({ isScreenLoading: false, propertyListData: this.props.homeScreenReducer.propertyListResponse.data });


                this.state.roleName != Strings.USER_ROLE_TRADER ? this.callGetNoticeBoardList() : this.callGetMaintenanceRequest();
            }
            else {

                // alert(this.props.homeScreenReducer.propertyListResponse.message);
            }
            this.props.resetState();


        }
    }

    callPropertyDetailsScreen(id) {

        Actions.PropertiesDetailsScreen({ propertyId: id });
    }

    onAllTabClick(val) {
        this.callGetGeneralThreadRequest();
        if (val) {
            this.setState({ isTabSelected: 1, disputeList: [] });
        }
    }
    async onGeneralTabClick(val) {
        this.setState({ isScreenLoading: true })
        if (this.state.roleName != Strings.USER_ROLE_TRADER) {

            await AsyncStorage.getItem("SyncittUserInfo").then(value => {
                if (value) {
                    var userData = JSON.parse(value);
                    var authToken = userData.token;

                    AsyncStorage.getItem("roleId").then((role) => {
                        if (role) {
                            var postBody = {
                                created_by: userData.data._id,
                                agency_id: userData.data.agency_id,
                                request_by_role: role
                            };
        
                            setTimeout(() => {
        
                                APICaller(
                                    "agreementList",
                                    "POST",
                                    authToken,
                                    postBody
                                ).then(data => {
                                    if (data.code == 200) {
        
                                        this.setState({ isScreenLoading: false, generalThreadListData: data.data })
                                    }
                                },
                                    err => {
        
                                    }
                                );
                            }, 500);
                        }
                    }).done();
                    

                }
            });
        }
        if (val) {
            this.setState({ isTabSelected: 2, isScreenLoading: false });
        }

    }

    onMaintenanceTabClick() {

        this.setState({ isTabSelected: 3 });
        this.callGetMaintenanceThreadRequest();
    }

    onDisputesTabClick() {
        this.setState({ isTabSelected: 4 });
        this.callDisputesList();
    }

    onInspectionsTabClick() {

        this.setState({ disputeList: [], isTabSelected: 5 });
    }

    onStaticTabClick(tabName) {

        this.props.onTabPressed({ tab: tabName });
    }

    // onListItemClick() {

    //     Actions.MaintenanceRequestDetailsScreen();
    // }
    callAddPropertyScreen() {
        Actions.NewMaintenanceRequestScreen();
        // Actions.AddPropertyScreenStepOne();
    }

    callGetMaintenanceThreadRequest() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    created_by: userData.data._id,
                    request_by_role: this.state.roleId,
                }
                this.props.showLoading();
                this.props.getMaintenanceThreadList(authToken, postData);
            }
        }).done();
    }

    callGetGeneralThreadRequest() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    created_by: userData.data._id,
                    request_by_role: this.state.roleId,
                }
                this.props.showLoading();
                this.props.getGeneralThreadList(authToken, postData);


            }
        }).done();
    }

    callGetMaintenanceRequest() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    request_by_role: this.state.roleId,
                    request_by_id: userData.data._id,
                }
                this.props.showLoading();
                this.props.getMaintenanceRequestList(authToken, postData);
            }
        }).done();
    }

    likePropertyRequest(item, index) {

        var tempArray = this.state.propertyListData;
        var currentItem = tempArray[index];
        currentItem.is_fav = (item.is_fav == 2) ? 1 : 2;
        tempArray[index] = currentItem;
        this.setState({ propertyListData: tempArray });


        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    fav_by: userData.data._id,
                    fav_to_property: item._id,
                    fav_status: (item.is_fav == 2) ? 2 : 1,
                }
                this.props.showLoading();

                this.props.likeProperty(authToken, postData);
            }
        }).done();
    }

    onLikePropertySuccess() {

        if (this.props.homeScreenReducer.likePropertyResponse != '') {
            if (this.props.homeScreenReducer.likePropertyResponse.code == 200) {

                //this.setState({ noticeBoardListData: this.props.homeScreenReducer.likePropertyResponse.data });
            }
            else {
                // alert(this.props.homeScreenReducer.likePropertyResponse.message);
            }
            this.props.resetState();
        }
    }
    renderThreadStatusView(item) {
        // 1 for sent , 2 for accepted, 3 for booked, 4 for completed, 5 for closed, 6 for due, 7 denied

        switch (item.req_status) {

            case 1:
                return (
                    <View style={HomeScreenStyle.statusSentViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>IN PROGRESS</Text>
                    </View>
                );
                break;
            case 2:
                return (
                    <View style={HomeScreenStyle.statusAcceptedViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>COMPLETED</Text>
                    </View>
                );
                break;
            case 3:
                return (
                    <View style={HomeScreenStyle.statusBookViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>CLOSED</Text>
                    </View>
                );
                break;

            default:

        }
    }
    renderStatusView(item) {
        // 1 for sent , 2 for accepted, 3 for booked, 4 for completed, 5 for closed, 6 for due, 7 denied

        switch (item.req_status) {

            case 1:
                return (
                    <View style={HomeScreenStyle.statusSentViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>SENT</Text>
                    </View>
                );
                break;
            case 2:
                return (
                    <View style={HomeScreenStyle.statusAcceptedViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>ACCEPTED</Text>
                    </View>
                );
                break;
            case 3:
                return (
                    <View style={HomeScreenStyle.statusBookViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>BOOKED</Text>
                    </View>
                );
                break;

            case 4:
                return (
                    <View style={HomeScreenStyle.statusCompletedViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>COMPLETED</Text>
                    </View>
                );
                break;
            case 5:
                return (
                    <View style={HomeScreenStyle.statusOverDueViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>CLOSED</Text>
                    </View>
                );
                break;
            case 6:
                return (
                    <View style={HomeScreenStyle.statusOverDueViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>OVER DUE</Text>
                    </View>
                );
                break;
            case 7:
                return (
                    <View style={HomeScreenStyle.statusOverDueViewStyle}>
                        <Text style={HomeScreenStyle.statusViewTextStyle}>DENIED</Text>
                    </View>
                );
                break;
            default:

        }

    }

    onListItemClick(id) {
        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {

                if (value == Strings.USER_ROLE_TRADER) {
                    Actions.TradersMaintenanceRequestDetailsScreen({ reqId: id });
                }
                else {
                    Actions.MaintenanceRequestDetailsScreen({ reqId: id });
                }
            }
        }).done();
        // Actions.MaintenanceRequestDetailsScreen({ reqId: id });
    }
    callDisputesList(dispute_status) {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.setState({ userInfo: userData });
                var postData = {
                    agency_id: userData.data.agency_id,
                    user_id: userData.data._id,
                    request_by_role: this.state.roleId,
                    // dispute_status: dispute_status
                }
                this.props.showLoading();

                this.props.getDisputesList(authToken, postData);
            }
        }).done();
    }

    maintenanceRequestRenderItem({ item, index }) {
        var userImage = item.created_by && item.created_by.image ? API.USER_IMAGE_PATH + item.created_by.image : '';
        var firstname = item.created_by && item.created_by.firstname ? item.created_by.firstname : '';
        var lastName = item.created_by && item.created_by.lastname ? item.created_by.lastname : '';
        return (
            <CardWithWhiteBG>
                <TouchableOpacity onPress={ref.onListItemClick.bind(ref, item._id)}>
                    <View style={HomeScreenStyle.maintenanceListHeaderContainer}>
                        <View style={HomeScreenStyle.statusContainerStyle}>
                            {ref.renderStatusView(item)}
                        </View>
                        {
                            userImage != '' ? <Image source={{ uri: userImage }} style={HomeScreenStyle.maintenaceUserImageStyle} />
                                :
                                <View style={HomeScreenStyle.emptyMaintenaceUserImageStyle}>
                                    <Text style={HomeScreenStyle.initialTextStyle}>{firstname.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                </View>
                        }
                        <View style={HomeScreenStyle.statusContainerStyle}>
                            <Text numberOfLines={1} style={HomeScreenStyle.dollarTextStyle}>${item.budget ? item.budget : 0}</Text>
                            <Text numberOfLines={1} style={HomeScreenStyle.daysTextStyle}>{Moment(item.due_date).fromNow()}</Text>
                        </View>
                    </View>
                    <View style={HomeScreenStyle.detailContainerStyle}>
                        <View style={HomeScreenStyle.detailTitleContainerStyle}>
                            <Text numberOfLines={1} style={HomeScreenStyle.maintenanceDetailTitleTextStyle}>{item.request_overview}</Text>
                            <Image source={ImagePath.RED_NOTIFICATION} style={HomeScreenStyle.notificatioImageStyle} />
                        </View>
                        <Text numberOfLines={1} style={HomeScreenStyle.maintenanceDetailTextStyle}>{"Request ID : " + item.request_id}</Text>
                        {/* <Text style={HomeScreenStyle.maintenanceDetailTextStyle}>Category name</Text> */}
                    </View>
                </TouchableOpacity>
            </CardWithWhiteBG>
        );

    }




    renderItem({ item, index }) {
        var propertyImagePath = ''
        item.image.map((data, index) => {
            if (data.isFeatured) {
                propertyImagePath = API.PROPERTY_IMAGE_PATH + data.path
            }
        });
        var userImage = item.owned_by ? (item.owned_by.image ? API.USER_IMAGE_PATH + item.owned_by.image : '') : '';

        return (
            <CardWithWhiteBG>
                <TouchableOpacity onPress={ref.callPropertyDetailsScreen.bind(ref, item._id)} >
                    <View style={HomeScreenStyle.propertyImageViewStyle}>
                        {
                            propertyImagePath != '' ?
                                <Image source={{ uri: propertyImagePath }} style={HomeScreenStyle.propertyImageStyle} />
                                : <View style={HomeScreenStyle.topCoverImageContainer} />
                        }
                        <TouchableOpacity style={HomeScreenStyle.likeImageViewStyle} onPress={ref.likePropertyRequest.bind(ref, item, index)} >
                            <Image source={(item.is_fav == 2) ? ImagePath.HEART : ImagePath.BLUE_HEART} />
                        </TouchableOpacity>
                        {item.save_as_draft ?
                            <View style={HomeScreenStyle.draftStatusContainerStyle}>
                                {ref.renderDraftStatusView(item)}
                            </View>
                            : null
                        }
                    </View>
                </TouchableOpacity>
                <View style={HomeScreenStyle.propertyTitleViewStyle}>
                    <Text numberOfLines={2} style={HomeScreenStyle.propertyTitleTextStyle}>{item.address}</Text>
                </View>
                <View style={HomeScreenStyle.propetySubTitleViewStyle}>
                    <Text numberOfLines={2} style={HomeScreenStyle.propertySubTitleTextStyle}>{item.description}</Text>
                </View>
                <View style={HomeScreenStyle.propertyInfoContainerViewStyle}>
                    <View style={HomeScreenStyle.propertyInfoSubViewContainer}>
                        <View style={HomeScreenStyle.propertyBedroomViewContainer}>
                            <Image source={ImagePath.BEDROOM_ICON} />
                            <Text style={HomeScreenStyle.propertyValueTextStyle}>{item.number_bedroom ? item.number_bedroom : '0'}</Text>
                        </View>
                        <View style={HomeScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.BATHROOM_ICON} />
                            <Text style={HomeScreenStyle.propertyValueTextStyle}>{item.number_of_bathroom ? item.number_of_bathroom : '0'}</Text>
                        </View>
                        <View style={HomeScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.GARAGE_ICON} />
                            <Text style={HomeScreenStyle.propertyValueTextStyle}>{item.number_of_parking ? item.number_of_parking : '0'}</Text>
                        </View>
                    </View>
                    <View>
                        {userImage != '' ?
                            <Image source={{ uri: userImage }} style={HomeScreenStyle.userImageStyle} />
                            :
                            <Image source={ImagePath.USER_DEFAULT} style={HomeScreenStyle.userImageStyle} />
                        }
                    </View>
                </View>
            </CardWithWhiteBG>
        );
    }

    callNoticeDetail(id) {

        Actions.NoticeBoardDetailScreen({ noticeBoardId: id });
    }

    renderDraftStatusView() {

        return (
            <View style={HomeScreenStyle.statusSentViewStyle}>
                <Text style={HomeScreenStyle.draftStatusViewTextStyle}>Draft</Text>
            </View>
        );
    }

    noticeBoardRenderItem({ item, index }) {


        // var title = item.title ? item.title : '';
        // var description = item.description ? item.description : '';
        // var createdDate = item.createdAt ? item.createdAt : '';
        // return (

        //     <CardWithWhiteBG>
        //         <TouchableOpacity style={HomeScreenStyle.listMainContainerStyle} onPress={ref.callNoticeDetail.bind(ref, item._id)}>
        //             <View style={{ padding: 10 }}>

        //                 <Text style={HomeScreenStyle.noticeBoardTitleTextStyle}>
        //                     {'Title : ' + title}
        //                 </Text>

        //                 <Text style={HomeScreenStyle.propertySubTitleTextStyle}>
        //                     {Moment(createdDate).format('MMM dd, YYYY')}
        //                 </Text>

        //                 <Text style={HomeScreenStyle.propertySubTitleTextStyle}>
        //                     {description}
        //                 </Text>

        //             </View>
        //         </TouchableOpacity>
        //     </CardWithWhiteBG>);

        if (item.property_id_arr[0].image[0]) {

            var propertyImagePath = item.property_id_arr[0].image ? API.PROPERTY_IMAGE_PATH + item.property_id_arr[0].image[0].path : '';

        }
        else {
            var propertyImagePath = ''
        }
        var address = item.property_id_arr[0].address ? item.property_id_arr[0].address : '';
        // var title = item.title ? item.title : '';
        // var description = item.description ? item.description : '';
        var createdDate = item.createdAt ? item.createdAt : '';
        var noticeboard_id = item.noticeboard_id ? item.noticeboard_id : '';
        var noticePostCnt = item.noticePostCnt ? item.noticePostCnt : 0;
        return (

            <CardWithWhiteBG>
                <TouchableOpacity style={HomeScreenStyle.listMainContainerStyle} onPress={ref.callNoticeDetail.bind(ref, item._id)}>


                    {/* <Text style={NoticeBoardScreenStyle.noticeBoardTitleTextStyle}>
                            {'Title : ' + title}
                        </Text>

                        <Text style={NoticeBoardScreenStyle.propertySubTitleTextStyle}>
                            {Moment(createdDate).format('MMM dd, YYYY')}
                        </Text>

                        <Text style={NoticeBoardScreenStyle.propertySubTitleTextStyle}>
                            {'Plan ID : ' + noticeboard_id}
                        </Text>

                        <Text style={NoticeBoardScreenStyle.propertySubTitleTextStyle}>
                            {description}
                        </Text> */}

                    <View style={HomeScreenStyle.noticePropertyImageViewStyle}>
                        {
                            propertyImagePath != '' ?
                                <Image source={{ uri: propertyImagePath }} style={HomeScreenStyle.noticePropertyImageStyle} />
                                :
                                <View style={HomeScreenStyle.topCoverImageContainer} />
                        }
                        <TouchableOpacity style={HomeScreenStyle.likeImageViewStyle}  >

                            <Image source={(item.is_fav == 2) ? ImagePath.HEART : ImagePath.BLUE_HEART} />

                        </TouchableOpacity>
                    </View>
                    <View style={HomeScreenStyle.propertyTitleViewStyle}>
                        <Text numberOfLines={2} style={HomeScreenStyle.propertyTitleTextStyle}>{address}</Text>
                    </View>
                    {/* <View style={NoticeBoardScreenStyle.propetySubTitleViewStyle}>
                            <Text numberOfLines={2} style={NoticeBoardScreenStyle.propertySubTitleTextStyle}>{item.description}</Text>
                        </View> */}

                    <View style={HomeScreenStyle.noticeBoardPostCountContainer}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Image source={ImagePath.TENANTS_ICON} />
                            <Text style={HomeScreenStyle.postCountTextStyle}>
                                {'20' + 'Members'}
                            </Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Image source={ImagePath.FLAG_ICON} />
                            <Text style={HomeScreenStyle.postCountTextStyle}>
                                {noticePostCnt + ' Posts'}
                            </Text>
                        </View>
                    </View>

                </TouchableOpacity>
            </CardWithWhiteBG>)
    }
    disputeThreadRenderItem = ({ item, index }) => {
        var userImage = item.property_id.image[0].path ? API.PROPERTY_IMAGE_PATH + item.property_id.image[0].path : '';
        var subject = item.subject ? item.subject : '';
        var status = item.dispute_status ? item.dispute_status : '';

        return (

            <CardWithWhiteBG>

                <TouchableOpacity onPress={() => {
                    Actions.DisputesDetailsScreen({ reqId: item._id });

                }} style={HomeScreenStyle.listContainerStyle}>

                    <View style={HomeScreenStyle.maintenanceThreadImageViewContainerStyle}>
                        <View style={HomeScreenStyle.imageContainerStyle}>
                            {
                                userImage != '' ? <Image source={{ uri: userImage }} style={HomeScreenStyle.userImageStyle} />
                                    :
                                    <View style={HomeScreenStyle.emptyUserMessageListImageStyle}>
                                        <Text style={HomeScreenStyle.initialTextStyle}>{subject}</Text>
                                    </View>
                            }

                        </View>
                    </View>


                    <View style={HomeScreenStyle.messageViewContainerStyle}>
                        <Text numberOfLines={1} style={HomeScreenStyle.messageTimeTextStyle}>{Moment(item.createdAt).fromNow()}</Text>
                        <Text numberOfLines={1} style={HomeScreenStyle.threadDetailTitleTextStyle}>{item.subject}</Text>
                        <Text numberOfLines={1} style={HomeScreenStyle.detailTextStyle}>{"PID : " + item.dispute_id}</Text>
                        {/* <Text numberOfLines={1} style={{ justifyContent: 'flex-end', }}>{"PID : " + item.dispute_id}</Text> */}
                        <View style={[HomeScreenStyle.messageTimeTextStyle]}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}></View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ justifyContent: 'flex-end' }}>
                                        {this.renderThreadStatusView(data = { req_status: item.dispute_status })}
                                        {/* <Text style={{ backgroundColor: 'orange', color: 'white', borderRadius: 10, padding: 3, alignSelf: 'flex-end' }} numberOfLines={1} >InProgress</Text> */}
                                    </View>
                                </View>
                            </View>
                        </View>

                    </View>

                </TouchableOpacity>

            </CardWithWhiteBG>
        );
    }
    maintenanceThreadRenderItem = ({ item, index }) => {
        var userImage = item.created_by && item.created_by.image ? API.USER_IMAGE_PATH + item.created_by.image : '';
        var firstName = item.created_by && item.created_by.firstname ? item.created_by.firstname : '';
        var lastName = item.created_by && item.created_by.lastname ? item.created_by.lastname : '';
        return (

            <CardWithWhiteBG>

                <TouchableOpacity onPress={() => {
                    AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
                        if (value) {

                            if (value == Strings.USER_ROLE_TRADER) {
                                Actions.TradersMaintenanceRequestDetailsScreen({ reqId: item._id });
                            }
                            else {
                                Actions.MaintenanceRequestDetailsScreen({ reqId: item._id });
                            }
                        }
                    }).done();

                }} style={HomeScreenStyle.listContainerStyle}>

                    <View style={HomeScreenStyle.maintenanceThreadImageViewContainerStyle}>
                        <View style={HomeScreenStyle.imageContainerStyle}>
                            {
                                userImage != '' ? <Image source={{ uri: userImage }} style={HomeScreenStyle.userImageStyle} />
                                    :
                                    <View style={HomeScreenStyle.emptyUserMessageListImageStyle}>
                                        <Text style={HomeScreenStyle.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                    </View>
                            }

                        </View>
                    </View>


                    <View style={HomeScreenStyle.messageViewContainerStyle}>
                        <Text numberOfLines={1} style={HomeScreenStyle.messageTimeTextStyle}>{Moment(item.due_date).fromNow()}</Text>
                        <Text numberOfLines={1} style={HomeScreenStyle.threadDetailTitleTextStyle}>{item.request_overview}</Text>
                        {/* <Text numberOfLines={1} style={HomeScreenStyle.detailTextStyle}>You : Good to hear we are now fixing all these damages</Text> */}
                        <Text numberOfLines={1} style={HomeScreenStyle.maintenanceThreadpropertyIdTextStyle}>{"Request ID : " + item.request_id}</Text>
                    </View>

                </TouchableOpacity>

            </CardWithWhiteBG>
        );
    }
    generaThreadRenderItem = ({ item, index }) => {
        var userImage = item.created_by.image ? API.USER_IMAGE_PATH + item.created_by.image : '';
        var firstName = item.created_by.firstname ? item.created_by.firstname : '';
        var lastName = item.created_by.lastname ? item.created_by.lastname : '';
        return (

            <CardWithWhiteBG>

                <TouchableOpacity onPress={() => {
                    Actions.AgreementDetailsScreen({ agreementId: item._id });
                    // AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
                    //     if (value) {

                    //         if (value == Strings.USER_ROLE_TRADER) {
                    //             Actions.TradersMaintenanceRequestDetailsScreen({ reqId: item._id });
                    //         }
                    //         else {
                    //             Actions.MaintenanceRequestDetailsScreen({ reqId: item._id });
                    //         }
                    //     }
                    // }).done();

                }} style={HomeScreenStyle.listContainerStyle}>

                    <View style={HomeScreenStyle.maintenanceThreadImageViewContainerStyle}>
                        <View style={HomeScreenStyle.imageContainerStyle}>
                            {
                                userImage != '' ? <Image source={{ uri: userImage }} style={HomeScreenStyle.userImageStyle} />
                                    :
                                    <View style={HomeScreenStyle.emptyUserMessageListImageStyle}>
                                        <Text style={HomeScreenStyle.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                    </View>
                            }

                        </View>
                    </View>


                    <View style={HomeScreenStyle.messageViewContainerStyle}>
                        <Text numberOfLines={1} style={HomeScreenStyle.messageTimeTextStyle}>{Moment(item.createdAt).fromNow()}</Text>
                        <Text numberOfLines={1} style={HomeScreenStyle.threadDetailTitleTextStyle}>{item.address_service_notice1}</Text>
                        {/* <Text numberOfLines={1} style={HomeScreenStyle.detailTextStyle}>You : Good to hear we are now fixing all these damages</Text> */}
                        <Text numberOfLines={1} style={HomeScreenStyle.maintenanceThreadpropertyIdTextStyle}>{"Request ID : " + item.request_id}</Text>
                    </View>

                </TouchableOpacity>

            </CardWithWhiteBG>
        );
    }
    _goChat(receiver, emitter, socket, userName, userPic) {
        //this.props.navigator.push({ ident: "Chat", receiver, emitter, socket })
        Actions.Chat({ receiver, emitter, socket, userName, userPic, onSendHomeScreen: this.callGetUnreadMessage.bind(this) });
    }

    prepareMarkedDate(inspectionDates) {

        var obj = {};
        var inspectionInfo = {};

        if (inspectionDates != null) {
            inspectionDates.map((data, index) => {

                if (inspectionDates[index].inspection_date != null) {
                    inspectionDates[index].inspection_date.map((inspectiondata, inspectionindex) => {

                        var key = inspectiondata;
                        obj[key] = { selected: true, marked: true }
                        inspectionInfo[key] = inspectionDates[index].property_id.address;
                        //var abc = obj
                        this.setState({ markedDatesObj: obj, inspectionDetailObj: inspectionInfo })


                    });
                }
            });
        }


    }

    unreadMessageRenderItem({ item, index }) {

        var from = item.from !== null ? item.from : {};
        var imagePath = from.image ? API.USER_IMAGE_PATH + from.image : '';
        var id = item._id ? item._id : '';
        var _goChat = ref._goChat.bind(ref);
        var userName = from.firstname ? from.firstname + ' ' + from.lastname : '';
        var firstName = from.firstname ? from.firstname : '';
        var lastName = from.lastname ? from.lastname : '';

        return (

            <CardWithWhiteBG>
                <TouchableOpacity onPress={() => _goChat(id, UserID, ref.socket, userName, imagePath)}>
                    <Text style={HomeScreenStyle.unreadMsgTimeTextStyle}>{Moment(item.time).fromNow()}</Text>
                    <View style={HomeScreenStyle.msgListContainerStyle}>

                        <View style={HomeScreenStyle.unreadMsgimageContainerStyle}>

                            {
                                imagePath != '' ? <Image source={{ uri: imagePath }} style={HomeScreenStyle.userImageStyle} />
                                    :
                                    <View style={HomeScreenStyle.emptyUserMessageListImageStyle}>
                                        <Text style={HomeScreenStyle.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                    </View>
                            }

                            {from.is_online ?
                                <View style={HomeScreenStyle.onLineStatusViewStyle} />
                                :
                                <View style={HomeScreenStyle.statusViewStyle} />
                            }

                        </View>

                        <View style={HomeScreenStyle.messageViewContainerStyle}>

                            <Text style={HomeScreenStyle.detailTitleTextStyle}>{firstName + ' ' + lastName}</Text>
                            <Text numberOfLines={1} style={HomeScreenStyle.detailTextStyle}>{item.msg}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            </CardWithWhiteBG>);
    }

    render() {

        return (

            <View style={HomeScreenStyle.listMainContainerStyle}>
                <ScrollView contentContainerStyle={HomeScreenStyle.scrollViewStyle}>
                    {this.state.roleName != 'Trader' ? <View style={HomeScreenStyle.managePropertyViewStyle}>
                        <Text style={HomeScreenStyle.managePropertyTextStyle}>
                            {Strings.NEW_MAINTAENANCE_REQUEST}
                        </Text>
                        {
                            this.state.userPermission.includes('create_property') ?
                                <TouchableOpacity
                                    // onPress={()=>alert('hey')}
                                    onPress={this.callAddPropertyScreen.bind(this)}
                                >
                                    <Image source={ImagePath.PLUS_ICON} />
                                </TouchableOpacity> : null
                        }

                    </View>
                        : null}
                    {this.state.roleName != 'Trader' ?
                        <View style={HomeScreenStyle.propertyListViewContainerStyle}>

                            {
                                this.state.propertyListData.length > 0 ?
                                    <FlatList
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        data={this.state.propertyListData}
                                        renderItem={this.renderItem}
                                        extraData={this.state}
                                    />
                                    :
                                    <Text style={HomeScreenStyle.PropertyPlaceHolerTextStyle}>
                                        {Strings.PROPERTY_NOT_FOUND}
                                    </Text>
                            }

                        </View>
                        : null}
                    {
                        this.state.roleName != Strings.USER_ROLE_TRADER ?
                            <View style={HomeScreenStyle.noticeBoardContainerViewStyle}>
                                <Text style={HomeScreenStyle.managePropertyTextStyle}>
                                    {Strings.NOTICE_BOARD}
                                </Text>
                                <View style={HomeScreenStyle.noticeBoardListViewContainer}>

                                    {
                                        this.state.noticeBoardListData.length > 0 ? <FlatList
                                            data={this.state.noticeBoardListData}
                                            renderItem={this.noticeBoardRenderItem}
                                        />

                                            :
                                            <Text style={HomeScreenStyle.PropertyPlaceHolerTextStyle}>
                                                {Strings.NOTICE_NOT_FOUND}
                                            </Text>
                                    }
                                </View>

                            </View> : null
                    }


                    <View style={[HomeScreenStyle.noticeBoardContainerViewStyle, { marginTop: this.state.roleName == Strings.USER_ROLE_TRADER ? 0 : 30 }]}>
                        {this.state.roleName != Strings.USER_ROLE_TRADER ? <Text style={HomeScreenStyle.managePropertyTextStyle}>
                            {Strings.UPCOMING_INSPECTION}
                        </Text> : null}

                        <Calendar
                            style={{
                                borderTopWidth: this.state.roleName == Strings.USER_ROLE_TRADER ? 0 : 1,
                                paddingTop: 5,
                                borderBottomWidth: 1,
                                borderColor: '#eee',
                                height: 350,
                                marginTop: this.state.roleName == Strings.USER_ROLE_TRADER ? 0 : 20
                            }}
                            theme={{
                                dotColor: 'pink',
                            }}
                            current={Moment().format('YYYY-MM-DD')}
                            minDate={Moment().format('YYYY-MM-DD')}
                            onDayPress={(day) => this.showPopup(day)}
                            firstDay={1}
                            markedDates={this.state.markedDatesObj}
                            // disabledByDefault={true}
                            hideArrows={false}
                        />


                    </View>

                    <View style={HomeScreenStyle.noticeBoardContainerViewStyle}>
                        <Text style={HomeScreenStyle.managePropertyTextStyle}>
                            {Strings.ACTIVE_THREAD}
                        </Text>

                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={HomeScreenStyle.tabContainerScrollViewStyle}>
                            <View style={HomeScreenStyle.tabContainerStyle}>

                                <TouchableOpacity onPress={() => this.onAllTabClick(true)} >

                                    <Text style={(this.state.isTabSelected == 1) ? HomeScreenStyle.tabLabelTextStyle : HomeScreenStyle.tabLabelDiselectTextStyle}>{Strings.ALL}</Text>

                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.onGeneralTabClick(true)}>

                                    <Text style={(this.state.isTabSelected == 2) ? HomeScreenStyle.tabLabelTextStyle : HomeScreenStyle.tabLabelDiselectTextStyle}>{Strings.GENERAL}</Text>

                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.onMaintenanceTabClick(true)}>

                                    <Text style={(this.state.isTabSelected == 3) ? HomeScreenStyle.tabLabelTextStyle : HomeScreenStyle.tabLabelDiselectTextStyle}>{Strings.MAINTENANCE}</Text>

                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.onDisputesTabClick(true)}>

                                    <Text style={(this.state.isTabSelected == 4) ? HomeScreenStyle.tabLabelTextStyle : HomeScreenStyle.tabLabelDiselectTextStyle}>{Strings.DISPUTES}</Text>

                                </TouchableOpacity>

                                {/* <TouchableOpacity onPress={() => this.onInspectionsTabClick()}>

                                    <Text style={(this.state.isTabSelected == 5) ? HomeScreenStyle.tabLabelTextStyle : HomeScreenStyle.tabLabelDiselectTextStyle}>{Strings.INSPECTIONS}</Text>

                                </TouchableOpacity> */}
                            </View>
                        </ScrollView>

                        <View>
                            {/* {this.state.isTabSelected == 1 && this.state.maintenanceThreadListData ? (this.state.maintenanceThreadListData.length > 0) : [] ? */}
                            {this.state.isTabSelected == 1 &&
                                (this.state.maintenanceThreadListData != [] || this.state.maintenanceThreadListData != undefined) ?


                                <FlatList
                                    data={this.state.maintenanceThreadListData}
                                    renderItem={this.maintenanceThreadRenderItem}
                                    ListEmptyComponent={() => {
                                        return (
                                            <View style={{ justifyContent: 'center', alignItems: 'center', height: 70 }}>
                                                <Text>No threads to display</Text>
                                            </View>
                                        )
                                    }}
                                />
                                //23 Nov

                                :
                                null
                            }
                            {/* <Text style={HomeScreenStyle.PropertyPlaceHolerTextStyle}>
                                    {Strings.NO_DATA_FOUND}
                                </Text> */}
                            {/* <View style={CommonStyles.circles}>
                                    <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                                </View> */}
                            {this.state.isTabSelected == 2 &&
                                (this.state.maintenanceThreadListData != [] || this.state.maintenanceThreadListData != undefined) ?
                                <FlatList
                                    data={this.state.generalThreadListData}
                                    renderItem={this.generaThreadRenderItem}
                                    ListEmptyComponent={() => {
                                        return (
                                            <View style={{ justifyContent: 'center', alignItems: 'center', height: 70 }}>
                                                <Text>No general threads to display</Text>
                                            </View>
                                        )
                                    }}
                                /> :
                                null

                            }
                            {this.state.isTabSelected == 3 &&
                                (this.state.maintenanceThreadListData != [] || this.state.maintenanceThreadListData != undefined) ?
                                <FlatList
                                    data={this.state.maintenanceThreadListData}
                                    renderItem={this.maintenanceThreadRenderItem}
                                    ListEmptyComponent={() => {
                                        return (
                                            <View style={{ justifyContent: 'center', alignItems: 'center', height: 70 }}>
                                                <Text>No maintenance threads to display</Text>
                                            </View>
                                        )
                                    }}
                                /> :
                                null

                            }

                            {this.state.isTabSelected == 4 &&
                                (this.state.disputeList != [] || this.state.disputeList != undefined) ?
                                <FlatList
                                    data={this.state.disputeList}
                                    renderItem={this.disputeThreadRenderItem}
                                    ListEmptyComponent={() => {
                                        return (
                                            <View style={{ justifyContent: 'center', alignItems: 'center', height: 70 }}>
                                                <Text>No disputes to display</Text>
                                            </View>
                                        )
                                    }}
                                /> :
                                null
                                // <View>
                                //     <Text>Hello</Text>
                                // </View>
                            }
                        </View>

                    </View>

                    <View style={HomeScreenStyle.noticeBoardContainerViewStyle}>
                        <Text style={HomeScreenStyle.managePropertyTextStyle}>
                            {Strings.MAINTENANCE_REQUEST}
                        </Text>
                        <View style={HomeScreenStyle.noticeBoardListViewContainer}>

                            {
                                this.state.maintenanceListData.length > 0 ? <FlatList
                                    data={this.state.maintenanceListData}
                                    renderItem={this.maintenanceRequestRenderItem}
                                /> :
                                    <Text style={HomeScreenStyle.PropertyPlaceHolerTextStyle}>
                                        {Strings.MAINTENANCE_NOT_FOUND}
                                    </Text>
                            }

                        </View>
                    </View>

                    <View style={HomeScreenStyle.noticeBoardContainerViewStyle}>
                        <Text style={HomeScreenStyle.managePropertyTextStyle}>
                            {Strings.UNREAD_MESSAGE}
                        </Text>

                        <View style={HomeScreenStyle.noticeBoardListViewContainer}>
                            {
                                this.state.unreadMsgListData.length > 0 ?
                                    <FlatList
                                        data={this.state.unreadMsgListData}
                                        renderItem={this.unreadMessageRenderItem}
                                    />
                                    :
                                    <Text style={HomeScreenStyle.PropertyPlaceHolerTextStyle}>
                                        {Strings.MESSAGE_NOT_FOUND}
                                    </Text>
                            }
                        </View>
                    </View>

                    {/* {this.state.roleName == Strings.USER_ROLE_TRADER ?
                        null
                        : <View style={HomeScreenStyle.noticeBoardContainerViewStyle}>
                            <Text style={HomeScreenStyle.managePropertyTextStyle}>
                                {Strings.STATISTICS}
                            </Text>

                            <CardWithWhiteBG>
                                <TouchableOpacity onPress={() => this.onStaticTabClick(Strings.TENANTS)}>

                                    <View style={HomeScreenStyle.statisticsViewContainer}>
                                        <Text style={HomeScreenStyle.statisticsLabelTextStyle}>{Strings.TENANTS}</Text>
                                        <Text style={HomeScreenStyle.statisticsTextStyle}>{this.state.statisticsData.tenantCnt}</Text>
                                    </View>
                                </TouchableOpacity>
                            </CardWithWhiteBG>

                            <CardWithWhiteBG>
                                <TouchableOpacity onPress={() => this.onStaticTabClick(Strings.PROPERTIES)}>

                                    <View style={HomeScreenStyle.statisticsViewContainer}>
                                        <Text style={HomeScreenStyle.statisticsLabelTextStyle}>{Strings.PROPERTIES}</Text>
                                        <Text style={HomeScreenStyle.statisticsTextStyle}>{this.state.statisticsData.propertyCnt}</Text>
                                    </View>
                                </TouchableOpacity>
                            </CardWithWhiteBG>

                            <CardWithWhiteBG>
                                <TouchableOpacity onPress={() => this.onStaticTabClick(Strings.REQUESTS)}>

                                    <View style={HomeScreenStyle.statisticsViewContainer}>
                                        <Text style={HomeScreenStyle.statisticsLabelTextStyle}>{Strings.REQUESTS}</Text>
                                        <Text style={HomeScreenStyle.statisticsTextStyle}>{this.state.statisticsData.requestCnt}</Text>
                                    </View>
                                </TouchableOpacity>
                            </CardWithWhiteBG>
                        </View>
                    } */}

                </ScrollView>
                {
                    (this.state.isShowPopup) ?

                        <Modal transparent isVisible={this.state.showPopup}>
                            <TouchableOpacity onPress={this.showPopup.bind(this)} style={HomeScreenStyle.modalContainer}>
                                <View style={{
                                    flex: 1, justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <View style={HomeScreenStyle.modalContainerStyles}>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}>Inspection</Text>
                                            <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 15 }}>Property Name: {inspectionPropertyAdd}</Text>
                                            <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 10 }}>Date: {inspectionDate}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Modal> : null
                }




            </View>

        );
    }
}

function mapStateToProps(state) {

    return {
        homeScreenReducer: state.homeScreenReducer,
        propertiesScreenReducer: state.propertiesScreenReducer,
        disputesScreenReducer: state.disputesScreenReducer,

    }
}

export default connect(
    mapStateToProps,
    {
        getMaintenanceRequestList,
        getMaintenanceThreadList,
        getGeneralThreadList,
        getStatistics,
        likeProperty,
        getNoticeBoardList,
        getPropertyList,
        showLoading,
        resetState,
        getUnreadMessageList,
        onTabPressed,
        getDisputesList,
        updateScene,
        dashboardInspectionData
    }

)(HomeScreen);
