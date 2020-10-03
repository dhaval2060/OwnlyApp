
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
    ImageBackground,
    Platform,
    TextInput,
    ScrollView,
    FlatList,
    AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import MaintenanceRequestScreenStyle from './MaintenanceRequestScreenStyle';
//import listData from  '../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import { CardWithWhiteBG } from '../CommonComponent/CardWithWhiteBG';
import * as Progress from 'react-native-progress';
import Moment from 'moment';
import API from '../../Constants/APIUrls';
import { EventRegister } from 'react-native-event-listeners'
import {
    getMaintenanceReqByTenant,
    getMaintenanceRequestList,
    getUnreadMessageList

} from "../../Action/ActionCreators";
import {
    updateScene,
    showLoading,
    resetState,

} from "./MaintenanceAction";
import FilterScreen from '../FilterComponent/FilterScreen';
import APICaller from '../../Saga/APICaller';
import COLORS from '../../Constants/Colors';
import IMAGEPATH from '../../Constants/ImagesPath';
import TradersMaintenanceRequestScreenStyle from '../TradersMaintenanceRequestComponent/TradersMaintenanceRequestScreenStyle';

let ref;
class MaintenanceRequestScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: 1,
            maintenanceData: [],
            tenantReqData: [],
            activeReqData: [], publicMaintenance: [], publicMaintenanceBackUp: [],
            isFilter: false,
            roleName: ''
        };
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.maintenanceReducer.refreshScene != '' && nextProps.maintenanceReducer.refreshScene != '' && nextProps.maintenanceReducer.refreshScene != undefined) {
            this.props.updateScene('');
            if (this.state.isTabSelected == 1 || this.state.isTabSelected == 2) {
                this.callGetMaintenanceRequest();
            }
            else {
                this.callGetMaintenanceRequestByTenant();
            }
        }

    }

    componentDidUpdate() {


        this.onMaintenanceRquestSuccess();
        this.onMaintenanceRquestByTenantSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.callGetUnreadMessage();
        this.props.showLoading();
        this.onPublicTabClick(true)
        this.callGetMaintenanceRequest();
        this.getRoleName();
        this.listener = EventRegister.addEventListener('updateCounter', (data) => {

            setTimeout(() => {
                this.callGetMaintenanceRequest();
            }, 500);
        })
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

    onFilterClick() {

        if (this.state.isFilter) {

            this.setState({ isFilter: false });
        }
        else {

            this.setState({ isFilter: true });
        }
    }



    onAllTabClick() {

        this.setState({ isTabSelected: 1 });
        // this.callGetMaintenanceRequest();
    }

    onActiveTabClick() {

        this.setState({ isTabSelected: 2 });
        // this.callGetMaintenanceRequest();
    }

    onRequestedByTenentTabClick() {

        this.setState({ isTabSelected: 3 });
        // this.callGetMaintenanceRequestByTenant();
    }
    onPublicTabClick(val) {
        if (!val) {
            this.setState({ isTabSelected: 4 });
        } else {
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    AsyncStorage.getItem("roleId").then((role) => {
                        if (role) {
                            var userData = JSON.parse(value);
                            console.log(userData, "userData")
                            var authToken = userData.token;
                            var postData = {
                                request_by_role: role,
                                agency_id: userData.data.agency_id,
                                request_by_id: userData.data._id,
                                public_status: "yes",
                            }
                            console.log(postData, "postDatapostData")
                            APICaller('maintenanceList', 'POST', authToken, postData).then(data => {
                                console.log(data, "datadata")
                                if (data.code == 200) {
                                    this.setState({ publicMaintenance: data.data, publicMaintenanceBackUp: data.data })
                                }
                            })

                        }
                    }).done();

                }
            }).done();
        }


    }
    callAddPostScreen() {

        Actions.NewMaintenanceRequestScreen();

    }


    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {

            if (value) {
                this.setState({ roleName: value });

            }
        }).done();
    }


    // callGetMaintenanceRequest() {
    //     AsyncStorage.getItem("roleId").then((value) => {
    // 		if (value) {

    // 			this.setState({ roleId: value });
    // 		}
    // 	}).done();
    //     AsyncStorage.getItem("SyncittUserInfo").then((value) => {
    //         if (value) {

    //             var userData = JSON.parse(value);
    //             var authToken = userData.token;
    //             var postData = {
    //                 agency_id: userData.data.agency_id,
    //                 request_by_role: userData.data.role_id,
    //                 request_by_id: userData.data._id,
    //             }

    //             this.props.showLoading();
    //             this.props.getMaintenanceRequestList(authToken, postData);
    //         }
    //     }).done();
    // }
    callGetMaintenanceRequest() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                AsyncStorage.getItem("roleId").then((role) => {
                    if (role) {
                        var userData = JSON.parse(value);
                        var authToken = userData.token;
                        var postData = {
                            agency_id: userData.data.agency_id,
                            request_by_role: role,
                            request_by_id: userData.data._id,
                        }

                        this.props.showLoading();
                        this.props.getMaintenanceRequestList(authToken, postData);
                    }
                }).done();

            }
        }).done();
    }
    callGetMaintenanceRequestByTenant() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    request_by_role: userData.data.role_id,
                    request_by_id: userData.data._id,
                }
                this.props.showLoading();

                this.props.getMaintenanceReqByTenant(authToken, postData);
            }
        }).done();
    }

    onMaintenanceRquestSuccess() {

        if (this.props.maintenanceReducer.maintenanceListResponse != '') {
            if (this.props.maintenanceReducer.maintenanceListResponse.code == 200) {

                this.setState({ maintenanceDatabackUp: this.props.maintenanceReducer.maintenanceListResponse.data, maintenanceData: this.props.maintenanceReducer.maintenanceListResponse.data, activeReqData: this.prePareActiveReqData(this.props.maintenanceReducer.maintenanceListResponse.data) });
            }
            else {

                alert(this.props.maintenanceReducer.maintenanceListResponse.message);
            }
        }
        this.props.resetState();
    }

    prePareActiveReqData(maintenancedata) {

        var tempArray = [];
        maintenancedata.map((data, index) => {
            if (maintenancedata[index].req_status != 1 && maintenancedata[index].req_status != 4 && maintenancedata[index].req_status != 5 && maintenancedata[index].req_status != 7) {

                tempArray.push(maintenancedata[index]);
            }

        })
        return tempArray;
    }

    onMaintenanceRquestByTenantSuccess() {

        if (this.props.maintenanceReducer.maintenanceListReqByTenantResponse != '') {
            if (this.props.maintenanceReducer.maintenanceListReqByTenantResponse.code == 200) {
                this.setState({ tenantReqData: this.props.maintenanceReducer.maintenanceListReqByTenantResponse.data });
            }
            else {
                alert(this.props.maintenanceReducer.maintenanceListReqByTenantResponse.message);
            }
        }
        this.props.resetState();
    }


    navBar() {
        return (
            <View>
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.MAINTENANCE_REQUEST}</Text>
                {
                    this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER
                        || this.state.roleName == Strings.USER_ROLE_AGENT
                        || this.state.roleName == Strings.USER_ROLE_STRATA_STAFF
                        || this.state.roleName == Strings.USER_ROLE_OWNER
                        || this.state.roleName == Strings.USER_ROLE_TENANT ?
                        <TouchableOpacity onPress={() => this.callAddPostScreen()} style={CommonStyles.navPlusImageView} >
                            <View>
                                <Image source={ImagePath.PLUS_ICON} />
                            </View>
                        </TouchableOpacity> : null
                }
            </View>
        );
    }

    renderStatusView(item) {
        // 1 for sent , 2 for accepted, 3 for booked, 4 for completed, 5 for closed, 6 for due, 7 denied

        switch (item.req_status) {

            case 1:
                return (
                    <View style={MaintenanceRequestScreenStyle.statusSentViewStyle}>
                        <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>SENT</Text>
                    </View>
                );
                break;
            case 2:
                return (
                    <View style={MaintenanceRequestScreenStyle.statusAcceptedViewStyle}>
                        <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>ACCEPTED</Text>
                    </View>
                );
                break;
            case 3:
                return (
                    <View style={MaintenanceRequestScreenStyle.statusBookViewStyle}>
                        <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>BOOKED</Text>
                    </View>
                );
                break;

            case 4:
                return (
                    <View style={MaintenanceRequestScreenStyle.statusOverDueViewStyle}>
                        <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>CLOSED</Text>
                    </View>
                );
                break;

            case 5:
                return (
                    <View style={MaintenanceRequestScreenStyle.statusCompletedViewStyle}>
                        <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>COMPLETED</Text>
                    </View>
                );
                break;
            case 6:
                return (
                    <View style={MaintenanceRequestScreenStyle.statusOverDueViewStyle}>
                        <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>OVER DUE</Text>
                    </View>
                );
                break;
            case 7:
                return (
                    <View style={MaintenanceRequestScreenStyle.statusOverDueViewStyle}>
                        <Text style={MaintenanceRequestScreenStyle.statusViewTextStyle}>DENIED</Text>
                    </View>
                );
                break;
            default:

        }

    }
    onChangeRefresh() {

        // this.callGetMaintenanceRequest();        
    }
    onListItemClick(item) {

        Actions.MaintenanceRequestDetailsScreen({ reqId: item._id, onChange: () => this.onChangeRefresh(), maintenanceData: item });

    }

    renderItem = ({ item, index }) => {

        var userImage = item.created_by && item.created_by.image ? API.USER_IMAGE_PATH + item.created_by.image : '';
        var firstname = item.created_by && item.created_by.firstname ? item.created_by.firstname : '';
        var lastName = item.created_by && item.created_by.lastname ? item.created_by.lastname : '';
        if (item.due_date) {

            return (
                <View style={MaintenanceRequestScreenStyle.listContainerStyle}>
                    <TouchableOpacity onPress={() => this.onListItemClick(item)}>
                        <View style={MaintenanceRequestScreenStyle.listHeaderContainer}>
                            <View style={MaintenanceRequestScreenStyle.statusContainerStyle}>
                                {ref.renderStatusView(item)}
                            </View>
                            {

                                userImage != '' ? <Image source={{ uri: userImage }} style={MaintenanceRequestScreenStyle.userImageStyle} />
                                    :
                                    <View style={MaintenanceRequestScreenStyle.emptyUserMessageListImageStyle}>
                                        <Text style={MaintenanceRequestScreenStyle.initialTextStyle}>{firstname.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                    </View>

                            }

                            <View style={MaintenanceRequestScreenStyle.statusContainerStyle}>
                                <Text numberOfLines={1} style={MaintenanceRequestScreenStyle.dollarTextStyle}>${item.budget}</Text>
                                <Text numberOfLines={1} style={MaintenanceRequestScreenStyle.daysTextStyle}>{Moment(new Date(item.due_date)).fromNow()}</Text>
                            </View>
                        </View>
                        <View style={MaintenanceRequestScreenStyle.detailContainerStyle}>
                            <View style={MaintenanceRequestScreenStyle.detailTitleContainerStyle}>
                                <Text style={MaintenanceRequestScreenStyle.detailTitleTextStyle}>{item.request_overview}</Text>
                                <Image source={ImagePath.RED_NOTIFICATION} style={MaintenanceRequestScreenStyle.notificatioImageStyle} />
                            </View>
                            <Text style={MaintenanceRequestScreenStyle.detailTextStyle}>Request ID : {item.request_id}</Text>
                            {/* <Text style={MaintenanceRequestScreenStyle.detailTextStyle}>Category name</Text> */}
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    goForwardReqScreen(reqData) {

        Actions.ForwardMaintenanceRequestScreen({ maintenanceReqData: reqData });

    }
    renderPublicItem = ({ item, index }) => {
        var userImage = item.created_by && item.created_by.image ? API.USER_IMAGE_PATH + item.created_by.image : '';
        console.log(item,"item")
        var firstname = item.created_by && item.created_by.firstname ? item.created_by.firstname : '';
        var lastName = item.created_by && item.created_by.lastname ? item.created_by.lastname : '';
        var bannerImg = item.images && item.images[0] ? item.images[0].path : "";
        return (
            <View style={{ marginBottom: 5 }}>
                <ImageBackground source={bannerImg != '' ? { uri: API.MAINTENANCE_IMAGE_PATH + bannerImg } : IMAGEPATH.BACKGROUND_IMAGE} style={{ height: 120, justifyContent: 'flex-end', backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, width: '100%' }} >
                    <View style={{ justifyContent: 'center', alignItems: 'center', top: 50 }}>
                        {/* <Image source={IMAGEPATH.PROFILE_BG} style={{ height: 100, borderRadius: 50, width: 100, }} /> */}
                        {userImage != '' ? <Image source={{ uri: userImage }} style={{ height: 100, borderRadius: 50, width: 100 }} />
                            :
                            <View style={{
                                height: 100, justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: Colors.APPROVE_GRAY_TEXT_COLOR, borderRadius: 50, width: 100
                            }} >
                                <Text style={[TradersMaintenanceRequestScreenStyle.initialTextStyle, { fontSize: 20 }]}>{firstname.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                            </View>
                        }
                    </View>
                </ImageBackground>
                <View style={{ height: 50 }} />
                <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.GRAY_COLOR }}>{item.request_overview}</Text>
                </View>
                <View style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 17, color: COLORS.GRAY_COLOR }}>{item.address}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', margin: 15 }}>
                    <View style={{ height: 40, flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.GRAY_COLOR }}>{item.maintentenance_counter_proposals.length}<Text style={{ fontWeight: '300', fontSize: 15 }}> Quotes</Text></Text>
                    </View>
                    <View style={{ height: 40, flex: 0.6 }}>
                        <TouchableOpacity onPress={() => this.onListItemClick(item)} style={{ height: 40, width: 200, backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}>
                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.WHITE }}>VIEW DETAILS</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    }
    requestedByTenantsRenderItem = ({ item, index }) => {


        var userImage = item.created_by && item.created_by.image ? API.USER_IMAGE_PATH + item.created_by.image : '';
        var firstname = item.created_by && item.created_by.firstname ? item.created_by.firstname : '';
        var lastName = item.created_by && item.created_by.lastname ? item.created_by.lastname : '';
        return (
            <CardWithWhiteBG>

                <View style={MaintenanceRequestScreenStyle.byTenantListContainerStyle}>

                    <View style={MaintenanceRequestScreenStyle.imageContainerStyle}>
                        {

                            userImage != '' ? <Image source={{ uri: userImage }} style={MaintenanceRequestScreenStyle.userImageStyle} />
                                :
                                <View style={MaintenanceRequestScreenStyle.emptyUserMessageListImageStyle}>
                                    <Text style={MaintenanceRequestScreenStyle.initialTextStyle}>{firstname.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                </View>

                        }


                    </View>
                    <TouchableOpacity onPress={() => this.onListItemClick(item)}>
                        <View style={MaintenanceRequestScreenStyle.messageViewContainerStyle}>
                            <Text style={MaintenanceRequestScreenStyle.requestByTenantDetailTitleTextStyle}>{item.request_overview}</Text>
                            <Text numberOfLines={1} style={MaintenanceRequestScreenStyle.requestByTenantDetailTextStyle}>Request ID : {item.request_id}</Text>
                            {/* <Text numberOfLines={1} style={MaintenanceRequestScreenStyle.maintenanceThreadpropertyIdTextStyle}>Category name</Text> */}
                            {
                                item.is_forward ?
                                    <View style={MaintenanceRequestScreenStyle.roundedBlueProceedButtonStyle}>
                                        <Text style={MaintenanceRequestScreenStyle.proceedButtonTextStyle}>
                                            {Strings.FORWARDED}
                                        </Text>
                                    </View> :
                                    <TouchableOpacity onPress={ref.goForwardReqScreen.bind(ref, item)}>
                                        <View style={MaintenanceRequestScreenStyle.roundedBlueProceedButtonStyle}>
                                            <Text style={MaintenanceRequestScreenStyle.proceedButtonTextStyle}>
                                                {Strings.FORWARD}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                            }

                        </View>
                    </TouchableOpacity>
                </View>

            </CardWithWhiteBG>);
    }
    onDrobDownChange(text) {
        if (text != this.state.dropdownValue) {
            this.setState({ dropdownValue: text })
            this.onSortList(text);
        }
    }
    sortBy(key) {
        if (key == 'due_date') {
            return function (x, y) {
                return ((x[key] === y[key]) ? 0 : ((x[key] < y[key]) ? 1 : -1));
                // return sort((a, b) => b[key] - a[key])
            };
        } else {
            return function (x, y) {

                return ((x[key] === y[key]) ? 0 : ((x[key] > y[key]) ? 1 : -1));

            };
        }

    };


    onSortList(text) {

        if (text == 'Request Overview') {
            this.setState({ maintenanceData: this.state.maintenanceData.sort(this.sortBy('request_overview')), publicMaintenance: this.state.publicMaintenance.sort(this.sortBy('request_overview')), activeReqData: this.state.activeReqData.sort(this.sortBy('request_overview')) });
        }
        else if (text == 'Due date') {

            // this.setState({ maintenanceData: this.state.maintenanceData.sort((a, b) => b['due_date'] - a['due_date']), publicMaintenance: this.state.publicMaintenance.sort((a, b) => b['due_date'] - a['due_date']), activeReqData: this.state.activeReqData.sort((a, b) => b['due_date'] - a['due_date']) });
            // this.setState({ maintenanceData: this.state.maintenanceData.sort(this.sortBy('due_date')), publicMaintenance: this.state.publicMaintenance.sort(this.sortBy('due_date')), activeReqData: this.state.activeReqData.sort(this.sortBy('due_date')) });
            let arr = this.state.maintenanceDatabackUp.sort(function (a, b) {
                return new Date(b.due_date) - new Date(a.due_date);
            });
            this.setState({ maintenanceData: arr, activeReqData: this.state.activeReqData.sort(this.sortBy('due_date')) })
        }
        else if (text == 'Budget') {
            this.setState({ maintenanceData: this.state.maintenanceData.sort(this.sortBy('budget')), publicMaintenance: this.state.publicMaintenance.sort(this.sortBy('budget')), activeReqData: this.state.activeReqData.sort(this.sortBy('budget')) });
        }


    }



    render() {
        let data = [{
            value: 'Request Overview',
        },
        {
            value: 'Due date',
        },
        {
            value: 'Budget',
        }
        ];

        return (

            <View style={CommonStyles.listMainContainerStyle}>
                {this.navBar()}

                <View style={MaintenanceRequestScreenStyle.refineResultContainerStyle}>
                    {/* <View>
                            <Text style={MaintenanceRequestScreenStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                            <View style={MaintenanceRequestScreenStyle.refineResultBottomBarStyle} />
                        </View>
                        {this.state.isFilter ? <Image source={ImagePath.ARROW_DOWN} style={MaintenanceRequestScreenStyle.refineResultArrowUpStyle} />
                            : <Image source={ImagePath.ARROW_DOWN} style={MaintenanceRequestScreenStyle.refineResultArrowStyle} />
                        } */}
                    {<Dropdown
                        label=''
                        labelHeight={5}
                        fontSize={14}
                        baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                        containerStyle={MaintenanceRequestScreenStyle.dropDownViewStyle}
                        data={data}
                        onChangeText={this.onDrobDownChange.bind(this)}
                        value={this.state.dropdownValue ? this.state.dropdownValue : data[0].value}
                    />}
                </View>

                <View style={MaintenanceRequestScreenStyle.tabContainerStyle}>

                    <TouchableOpacity onPress={() => this.onAllTabClick()} >
                        <View >
                            <View style={MaintenanceRequestScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 1) ? MaintenanceRequestScreenStyle.tabLabelTextStyle : MaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{Strings.ALL}</Text>
                            </View>
                            {this.state.isTabSelected == 1 ? <View style={MaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={MaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onActiveTabClick()}>
                        <View>
                            <View style={MaintenanceRequestScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 2) ? MaintenanceRequestScreenStyle.tabLabelTextStyle : MaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{Strings.ACTIVE}</Text>
                            </View>
                            {(this.state.isTabSelected == 2) ? <View style={MaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={MaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPublicTabClick()}>
                        <View>
                            <View style={MaintenanceRequestScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 4) ? MaintenanceRequestScreenStyle.tabLabelTextStyle : MaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{'Public'}</Text>
                            </View>
                            {(this.state.isTabSelected == 4) ? <View style={MaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={MaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>
                    </TouchableOpacity>
                    {
                        this.state.roleName == Strings.USER_ROLE_AGENT ? <TouchableOpacity onPress={() => this.onRequestedByTenentTabClick()}>
                            <View>
                                <View style={MaintenanceRequestScreenStyle.tabTextViewStyle}>
                                    <Text style={(this.state.isTabSelected == 3) ? MaintenanceRequestScreenStyle.tabLabelTextStyle : MaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{Strings.REQUESTED_BY_TENENT}</Text>
                                </View>
                                {(this.state.isTabSelected == 3) ? <View style={MaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={MaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                            </View>
                        </TouchableOpacity> : null
                    }

                </View>
                {(this.state.isTabSelected == 4) ?
                    <View style={{ height: 50, paddingLeft: 20, paddingRight: 20, backgroundColor: 'white', borderTopWidth: 1, borderBottomWidth: 0, borderColor: Colors.GRAY, justifyContent: 'center' }}>
                        <View style={{ borderRadius: 35, justifyContent: 'center', borderWidth: 1, borderColor: Colors.GRAY, height: 30 }}>
                            <TextInput
                                placeholder={'Search by keyword'}
                                style={{ justifyContent: 'center', padding: 0, paddingLeft: 15 }}
                                onChangeText={(val) => {
                                    let arr = this.state.publicMaintenanceBackUp.filter(item => {
                                        if ((item.request_overview.toLowerCase()).match(val.toLowerCase())) {
                                            return item;
                                        }
                                    })
                                    console.log(arr, "arrarrarr")
                                    this.setState({ searchValue: val, publicMaintenance: arr })
                                }}
                                value={this.state.searchValue}
                            />
                        </View>
                    </View> : null}
                {
                    (this.state.isTabSelected == 1) ?
                        this.state.maintenanceData.length > 0
                            ?
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={CommonStyles.flatListStyle}>
                                {this.state.isFilter ?
                                    <FilterScreen /> : null
                                }
                                <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                    data={this.state.maintenanceData}
                                    renderItem={this.renderItem}
                                    extraData={this.state}
                                />
                            </ScrollView>
                            :
                            this.props.maintenanceReducer.isScreenLoading
                                ?
                                null
                                :
                                <View style={{ flex: 1, justifyContent: 'center', }}>
                                    <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.MAINTENANCE_NOT_FOUND}</Text>
                                </View>
                        :
                        null
                }
                {
                    (this.state.isTabSelected == 2) ?
                        this.state.activeReqData.length > 0
                            ?
                            <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.activeReqData}
                                renderItem={this.renderItem}
                                extraData={this.state}
                            />
                            :
                            this.props.maintenanceReducer.isScreenLoading
                                ?
                                null
                                :
                                <View style={{ flex: 1, justifyContent: 'center', }}>
                                    <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.MAINTENANCE_NOT_FOUND}</Text>
                                </View>
                        :
                        null
                }
                {

                    (this.state.isTabSelected == 3) ?
                        this.state.tenantReqData.length > 0
                            ?
                            <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.tenantReqData}
                                renderItem={this.requestedByTenantsRenderItem}
                                extraData={this.state}
                            />
                            :
                            this.props.maintenanceReducer.isScreenLoading
                                ?
                                null
                                :
                                <View style={{ flex: 1, justifyContent: 'center', }}>
                                    <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR }}>{Strings.MAINTENANCE_NOT_FOUND}</Text>
                                </View>
                        :
                        null


                }
                {

                    (this.state.isTabSelected == 4) ?
                        this.state.publicMaintenance.length > 0
                            ?
                            <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.publicMaintenance}
                                renderItem={this.renderPublicItem}
                                extraData={this.state}
                            />
                            :
                            this.props.maintenanceReducer.isScreenLoading
                                ?
                                null
                                :
                                <View style={{ flex: 1, justifyContent: 'center', }}>
                                    <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR }}>{Strings.MAINTENANCE_NOT_FOUND}</Text>
                                </View>
                        :
                        null


                }

                {


                    this.props.maintenanceReducer.isScreenLoading ?
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
        homeScreenReducer: state.homeScreenReducer,
        maintenanceReducer: state.maintenanceReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getMaintenanceReqByTenant,
        getMaintenanceRequestList,
        showLoading,
        resetState,
        getUnreadMessageList,
        updateScene
    }

)(MaintenanceRequestScreen);



