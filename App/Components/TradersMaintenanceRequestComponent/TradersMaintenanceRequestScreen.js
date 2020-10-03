
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Image,
    ImageBackground,
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
    AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import TradersMaintenanceRequestScreenStyle from './TradersMaintenanceRequestScreenStyle';
//import listData from  '../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import { CardWithWhiteBG } from '../CommonComponent/CardWithWhiteBG';
import * as Progress from 'react-native-progress';
import Moment from 'moment';
import API from '../../Constants/APIUrls';
import FilterScreen from '../FilterComponent/FilterScreen';
import {
    acceptAndDeniedMaintenanceReq,
    getMaintenanceRequestList,
} from "../../Action/ActionCreators";
import { EventRegister } from 'react-native-event-listeners'

import {
    showLoading,
    resetState,
} from "./TradersMaintenanceAction";
import IMAGEPATH from '../../Constants/ImagesPath';
import COLORS from '../../Constants/Colors';
import APICaller from '../../Saga/APICaller';

let ref;
class TradersMaintenanceRequestScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: 1,
            maintenanceData: [],
            maintenanceDatabackUp: [],
            publicMaintenanceBackUp: [],
            tenantReqData: [],
            quotesList: [],
            newData: [],
            publicMaintenance: [],
            progressData: [],
            completedData: [],
            isFilter: false,
        };
    }

    componentDidUpdate() {
        this.onMaintenanceRquestSuccess();
        this.onAcceptAndRejectReqSuccess();
        //this.onMaintenanceRquestByTenantSuccess();
    }

    componentWillMount() {
        // AsyncStorage.getItem("SyncittUserInfo").then((value) => {
        //     if (value) {
        //         AsyncStorage.getItem("roleId").then((role) => {
        //             if (role) {
        //                 var userData = JSON.parse(value);
        //                 var authToken = userData.token;
        //                 var postData = {
        //                     request_by_role: role,
        //                     request_by_id: userData.data._id,
        //                     public_status: "yes",
        //                 }
        //                 APICaller('maintenanceList', 'POST', authToken, postData).then(data => {
        //                     if (data.code == 200) {
        //                         this.setState({ publicMaintenance: data.data })
        //                     }
        //                 })

        //             }
        //         }).done();

        //     }
        // }).done();
        this.callGetMaintenanceRequest();
        this.onPublicTabClick(true)
        this.getQuotesList();
    }
    componentDidMount() {
        this.listener = EventRegister.addEventListener('updateCounter', (data) => {

            setTimeout(() => {
                this.callGetMaintenanceRequest();
            }, 500);
        })
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
    }
    onNewTabClick() {

        this.setState({ isTabSelected: 2 });
    }
    onProgressTabClick() {

        this.setState({ isTabSelected: 3 });
        //this.callGetMaintenanceRequestByTenant();
    }
    onPublicTabClick(val) {
        if (!val) {
            this.setState({ isTabSelected: 5 });
        } else {

            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    AsyncStorage.getItem("roleId").then((role) => {
                        if (role) {
                            var userData = JSON.parse(value);
                            var authToken = userData.token;
                            var postData = {
                                request_by_role: role,
                                request_by_id: userData.data._id,
                                public_status: "yes",
                            }
                            APICaller('maintenanceList', 'POST', authToken, postData).then(data => {
                                if (data.code == 200) {
                                    let maintainList1 = data.data
                                    maintainList1.forEach(value => {
                                        if (value.mr_last_chat && value.mr_last_chat != null && value.mr_last_chat.from && value.mr_last_chat.from._id) {
                                            value.lastCounterProposalCreatedBy_listing = value.mr_last_chat.from._id;
                                        }
                                        var diff1 = Moment(value.due_date).format("YYYY MM DD");
                                        let date = new Date()
                                        value.difference = Moment(diff1, "YYYY MM DD").diff(Moment(date.toUTCString(), "YYYY MM DD"), 'days');
                                        if (value.images.length > 0 && value.images[0].path) {
                                            if ((value.images[0].path).includes(".xlsx") || (value.images[0].path).includes(".xlsx")) {
                                                value.images[0].document_type = "excel";
                                            }
                                            else if ((value.images[0].path).includes(".txt") || (value.images[0].path).includes(".doc")) {
                                                value.images[0].document_type = "doc";
                                            } else if ((value.images[0].path).includes(".pdf")) {
                                                value.images[0].document_type = "pdf";
                                            } else if ((value.images[0].path).includes(".ppt")) {
                                                value.images[0].document_type = "ppt";
                                            }
                                        }
                                    });

                                    let maintainList11 = maintainList1.filter(async item => {
                                        var apply_count = 0;
                                        await item.maintentenance_counter_proposals.map(item1 => {
                                            if (item1.proposal_type == 'apply') {
                                                apply_count += 1;
                                            }
                                        });
                                        if (apply_count > 0) {
                                            item.apply_count = apply_count;
                                            return item;
                                        } else {
                                            return item;
                                        }
                                    });
                                    this.setState({ publicMaintenance: maintainList11, publicMaintenanceBackUp: maintainList11 })
                                }
                            })

                        }
                    }).done();

                }
            }).done();
        }
    }
    getQuotesList() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                AsyncStorage.getItem("roleId").then((role) => {
                    if (role) {
                        var userData = JSON.parse(value);
                        var authToken = userData.token;
                        var postData = {
                            request_by_role: role,
                            request_by_id: userData.data._id,
                            public_status: "yes",
                        }
                        APICaller('maintenanceList', 'POST', authToken, postData).then(data => {
                            if (data.code == 200) {
                                let maintainList = data.data;
                                maintainList.forEach(value => {
                                    if (value.mr_last_chat && value.mr_last_chat != null && value.mr_last_chat.from && value.mr_last_chat.from._id) {
                                        value.lastCounterProposalCreatedBy_listing = value.mr_last_chat.from._id;
                                    }
                                    var diff1 = Moment(value.due_date).format("YYYY MM DD");
                                    let date = new Date()
                                    value.difference = Moment(diff1, "YYYY MM DD").diff(Moment(date.toUTCString(), "YYYY MM DD"), 'days');
                                    if (value.images.length > 0 && value.images[0].path) {
                                        if ((value.images[0].path).includes(".xlsx") || (value.images[0].path).includes(".xlsx")) {
                                            value.images[0].document_type = "excel";
                                        }
                                        else if ((value.images[0].path).includes(".txt") || (value.images[0].path).includes(".doc")) {
                                            value.images[0].document_type = "doc";
                                        } else if ((value.images[0].path).includes(".pdf")) {
                                            value.images[0].document_type = "pdf";
                                        } else if ((value.images[0].path).includes(".ppt")) {
                                            value.images[0].document_type = "ppt";
                                        }
                                    }
                                });
                                maintainList = maintainList.filter(item => {
                                    var create_by_logged_in_trader = false;
                                    var trader_price = '';
                                    var trader_date = '';
                                    item.maintentenance_counter_proposals.map(item1 => {
                                        if (item1.proposal_created_by == userData.data._id) {
                                            trader_price = item1.proposed_price;
                                            trader_date = item1.proposed_date;
                                        }
                                    });

                                    if (trader_price && trader_date) {
                                        item.trader_price = trader_price;
                                        item.trader_date = trader_date;
                                        return item;
                                    }
                                })
                                this.setState({ quotesList: maintainList, quotesListBackUp: maintainList })
                            }
                        })

                    }
                }).done();

            }
        }).done();
    }
    onQuotesTabClick() {
        // AsyncStorage.getItem("SyncittUserInfo").then((value) => {
        //     if (value) {
        //         AsyncStorage.getItem("roleId").then((role) => {
        //             if (role) {
        //                 var userData = JSON.parse(value);
        //                 var authToken = userData.token;
        //                 var postData = {
        //                     request_by_role: role,
        //                     request_by_id: userData.data._id,
        //                     public_status: "yes",
        //                 }
        //                 APICaller('maintenanceList', 'POST', authToken, postData).then(data => {
        //                     console.log(data, "datadata")
        //                     if (data.code == 200) {
        //                         this.setState({ publicMaintenance: data.data })

        //                         let maintainList = data.data;
        //                         maintainList.forEach(value => {
        //                             if (value.mr_last_chat && value.mr_last_chat != null && value.mr_last_chat.from && value.mr_last_chat.from._id) {
        //                                 value.lastCounterProposalCreatedBy_listing = value.mr_last_chat.from._id;
        //                             }
        //                             var diff1 = Moment(value.due_date).format("YYYY MM DD");
        //                             value.difference = Moment(diff1, "YYYY MM DD").diff(Moment(new Date(), "YYYY MM DD"), 'days');
        //                             if (value.images.length > 0 && value.images[0].path) {
        //                                 if ((value.images[0].path).includes(".xlsx") || (value.images[0].path).includes(".xlsx")) {
        //                                     value.images[0].document_type = "excel";
        //                                 }
        //                                 else if ((value.images[0].path).includes(".txt") || (value.images[0].path).includes(".doc")) {
        //                                     value.images[0].document_type = "doc";
        //                                 } else if ((value.images[0].path).includes(".pdf")) {
        //                                     value.images[0].document_type = "pdf";
        //                                 } else if ((value.images[0].path).includes(".ppt")) {
        //                                     value.images[0].document_type = "ppt";
        //                                 }
        //                             }
        //                         });
        //                         maintainList = maintainList.filter(item => {
        //                             var create_by_logged_in_trader = false;
        //                             var trader_price = '';
        //                             var trader_date = '';
        //                             item.maintentenance_counter_proposals.map(item1 => {
        //                                 if (item1.proposal_created_by == userData.data._id) {
        //                                     trader_price = item1.proposed_price;
        //                                     trader_date = item1.proposed_date;
        //                                 }
        //                             });

        //                             if (trader_price && trader_date) {
        //                                 item.trader_price = trader_price;
        //                                 item.trader_date = trader_date;
        //                                 return item;
        //                             }
        //                         })
        //                         this.setState({ quotesList: maintainList })
        //                     }
        //                 })

        //             }
        //         }).done();

        //     }
        // }).done();
        this.setState({ isTabSelected: 6 })
    }
    onCompletedTabClick() {
        this.setState({ isTabSelected: 4 });
    }




    // callGetMaintenanceRequest() {
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
    callForAcceptOrRejectMaintenanceReq(maintenanceId, isAccept) {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    is_status: true,
                    maintenance_id: maintenanceId,
                    req_status: isAccept,
                }
                this.props.showLoading();
                console.log(postData, "postDatapostData")
                this.props.acceptAndDeniedMaintenanceReq(authToken, postData);
            }
        }).done();
    }
    //  req_status:{type: Number,default:1}, // 1 for sent , 2 for accepted, 3 for booked, 4 for completed, 5 for closed, 6 for due, 7 denied  
    //new=1,onProgress=2and 3, completed=4



    onMaintenanceRquestSuccess() {

        if (this.props.tradersMaintenanceReducer.maintenanceListResponse != '') {

            if (this.props.tradersMaintenanceReducer.maintenanceListResponse.code == 200) {

                this.setState({
                    maintenanceData: this.props.tradersMaintenanceReducer.maintenanceListResponse.data,
                    maintenanceDatabackUp: this.props.tradersMaintenanceReducer.maintenanceListResponse.data,
                    newData: this.prepareNewData(this.props.tradersMaintenanceReducer.maintenanceListResponse.data),
                    progressData: this.prepareProgressData(this.props.tradersMaintenanceReducer.maintenanceListResponse.data),
                    completedData: this.prepareCompletesData(this.props.tradersMaintenanceReducer.maintenanceListResponse.data)
                });
                this.setState({ isTabSelected: 1 });
            }
            else {

                alert(this.props.tradersMaintenanceReducer.maintenanceListResponse.message);
            }
        }
        this.props.resetState();
    }

    onAcceptAndRejectReqSuccess() {

        if (this.props.tradersMaintenanceReducer.acceptRejectReqRes != '') {

            if (this.props.tradersMaintenanceReducer.acceptRejectReqRes.code == 200) {
                console.log(this.props.tradersMaintenanceReducer.acceptRejectReqRes, "this.props.tradersMaintenanceReducer.acceptRejectReqRes")
                this.callGetMaintenanceRequest();
            }
            else {

                alert(this.props.tradersMaintenanceReducer.acceptRejectReqRes.message);
            }
        }
        this.props.resetState();
    }



    prepareNewData(maintenancedata) {

        var tempArray = [];
        maintenancedata.map((data, index) => {

            if (maintenancedata[index].req_status == 1) {

                tempArray.push(maintenancedata[index]);
            }

        })
        return tempArray;
    }

    prepareProgressData(maintenancedata) {

        var tempArray = [];
        maintenancedata.map((data, index) => {

            if (maintenancedata[index].req_status == 2 || maintenancedata[index].req_status == 3) {

                tempArray.push(maintenancedata[index]);
            }

        })
        return tempArray;
    }

    prepareCompletesData(maintenancedata) {

        var tempArray = [];
        maintenancedata.map((data, index) => {

            if (maintenancedata[index].req_status == 4) {

                tempArray.push(maintenancedata[index]);
            }

        })
        return tempArray;
    }


    navBar() {
        return (
            <View>
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.MAINTENANCE_REQUEST}</Text>

            </View>
        );
    }

    renderStatusView(item) {
        // 1 for sent , 2 for accepted, 3 for booked, 4 for completed, 5 for closed, 6 for due, 7 denied

        switch (item.req_status) {

            case 1:
                return (
                    <View style={TradersMaintenanceRequestScreenStyle.statusSentViewStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.statusViewTextStyle}>SENT</Text>
                    </View>
                );
                break;
            case 2:
                return (
                    <View style={TradersMaintenanceRequestScreenStyle.statusAcceptedViewStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.statusViewTextStyle}>ACCEPTED</Text>
                    </View>
                );
                break;
            case 3:
                return (
                    <View style={TradersMaintenanceRequestScreenStyle.statusBookViewStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.statusViewTextStyle}>BOOKED</Text>
                    </View>
                );
                break;
            case 4:
                return (
                    <View style={TradersMaintenanceRequestScreenStyle.statusOverDueViewStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.statusViewTextStyle}>CLOSED</Text>
                    </View>
                );
                break;

            case 5:
                return (
                    <View style={TradersMaintenanceRequestScreenStyle.statusCompletedViewStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.statusViewTextStyle}>COMPLETED</Text>
                    </View>
                );
                break;

            case 6:
                return (
                    <View style={TradersMaintenanceRequestScreenStyle.statusOverDueViewStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.statusViewTextStyle}>OVER DUE</Text>
                    </View>
                );
                break;
            case 7:
                return (
                    <View style={TradersMaintenanceRequestScreenStyle.statusOverDueViewStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.statusViewTextStyle}>DENIED</Text>
                    </View>
                );
                break;
            default:

        }

    }

    onListItemClick(item) {

        Actions.TradersMaintenanceRequestDetailsScreen({ reqId: item._id, maintenanceData: item });
    }
    renderPublicItem = ({ item, index }) => {
        var userImage = item.created_by && item.created_by.image ? API.USER_IMAGE_PATH + item.created_by.image : '';
        var firstname = item.created_by && item.created_by.firstname ? item.created_by.firstname : '';
        var lastName = item.created_by && item.created_by.lastname ? item.created_by.lastname : '';
        let todayDate = new Date()
        let utcDate = todayDate.toUTCString()
        var bannerImg = item.images && item.images[0] ? item.images[0].path : "";
        if (item.due_date) {

            return (
                <View style={{ marginBottom: 5 }}>
                    <ImageBackground source={bannerImg != '' ? { uri: API.MAINTENANCE_IMAGE_PATH + bannerImg } : IMAGEPATH.BACKGROUND_IMAGE} style={{ height: 120, justifyContent: 'flex-end', backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, width: '100%' }} >
                        <View style={{ top: 10, alignItems: 'center', justifyContent: 'center', right: 0, position: 'absolute', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, height: 40, flexDirection: 'row', width: 170, backgroundColor: 'white' }}>
                            <Image resizeMode={'contain'} style={{ tintColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, height: 23, width: 25 }} source={IMAGEPATH.TAG_ACCEPTED_WHITE} /><Text style={{ fontSize: 15, marginLeft: 5, color: Colors.SKY_BLUE_BUTTON_BACKGROUND }}> {Moment(item.due_date).format("Do MMM YYYY")}</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', top: 50 }}>
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <View style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 17, color: COLORS.GRAY_COLOR }}><Image source={IMAGEPATH.MAP_MARKER} resizeMode={'contain'} style={{ height: 17 }} />  {item.suburb}-{item.postcode}</Text>
                        </View>
                        <View style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 17, color: COLORS.GRAY_COLOR }}><Text style={{ fontWeight: 'bold', fontSize: 20, color: '#aaa' }}>#</Text>   {item.categories_id && item.categories_id[0] && item.categories_id[0].name}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', margin: 15 }}>
                        {/* <View style={{ height: 40, flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.GRAY_COLOR }}>3 <Text style={{ fontWeight: '300', fontSize: 15 }}>Quotes</Text></Text>
                    </View> */}
                        <View style={{ height: 40, flex: 0.9 }}>
                            <TouchableOpacity onPress={() => Actions.TradersMaintenanceRequestDetailsScreen({ reqId: item._id, maintenanceData: item, isPublicJob: true })} style={{ height: 40, width: '100%', backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}>
                                <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.WHITE }}>VIEW DETAILS</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                        {Moment(Moment(item.due_date).format("YYYY MM DD"), "YYYY MM DD").diff(Moment(new Date(utcDate), "YYYY MM DD"), 'days') >= 0 ?
                            <Text style={{ fontSize: 12, color: Colors.GRAY_COLOR }}>DUE IN {Moment(Moment(item.due_date).format("YYYY MM DD"), "YYYY MM DD").diff(Moment(new Date(utcDate), "YYYY MM DD"), 'days')} DAYS</Text>
                            :
                            <Text style={{ fontSize: 12, color: Colors.GRAY_COLOR }}>DUE BEFORE {Math.abs(Moment(Moment(item.due_date).format("YYYY MM DD"), "YYYY MM DD").diff(Moment(new Date(utcDate), "YYYY MM DD"), 'days'))} DAYS</Text>
                        }
                    </View>
                </View>
            )
        }
    }
    renderQuotesItem = ({ item, index }) => {
        var userImage = item.created_by && item.created_by.image ? API.USER_IMAGE_PATH + item.created_by.image : '';
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

                <View style={{ padding: 10, paddingTop: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <Text numberOfLines={5} style={{ fontSize: 15, color: '#aaa' }}>{item.request_detail}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <View style={{ margin: 5, flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text numberOfLines={1} style={{ fontSize: 17, color: COLORS.GRAY_COLOR }}><Image source={IMAGEPATH.MAP_MARKER} resizeMode={'contain'} style={{ height: 17 }} />  {item.suburb}-{item.postcode}</Text>
                    </View>
                    <View style={{ margin: 5, flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text numberOfLines={1} style={{ fontSize: 17, color: COLORS.GRAY_COLOR }}><Text style={{ fontWeight: 'bold', fontSize: 20, color: '#aaa' }}>#</Text>   {item.categories_id && item.categories_id[0].name}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', margin: 15 }}>
                    <View style={{ height: 40, flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 21, fontWeight: 'bold', color: COLORS.GRAY_COLOR }}>${item.trader_price}</Text>
                    </View>
                    <View style={{ height: 40, flex: 0.6 }}>
                        <TouchableOpacity onPress={() => Actions.TradersMaintenanceRequestDetailsScreen({ reqId: item._id, maintenanceData: item, isPublicJob: false, isQuote: true })} style={{ height: 40, width: 200, backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}>
                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.WHITE }}>VIEW DETAILS</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    }
    renderItem = ({ item, index }) => {
        var userImage = item.created_by && item.created_by.image ? API.USER_IMAGE_PATH + item.created_by.image : '';
        var firstname = item.created_by && item.created_by.firstname ? item.created_by.firstname : '';
        var lastName = item.created_by && item.created_by.lastname ? item.created_by.lastname : '';
        if (item.due_date) {
            console.log(item, "oooooo======>")
            return (
                <View style={TradersMaintenanceRequestScreenStyle.listContainerStyle}>
                    <TouchableOpacity onPress={() => this.onListItemClick(item)}>
                        <View style={TradersMaintenanceRequestScreenStyle.listHeaderContainer}>
                            <View style={TradersMaintenanceRequestScreenStyle.statusContainerStyle}>
                                {ref.renderStatusView(item)}
                            </View>
                            {
                                userImage != '' ? <Image source={{ uri: userImage }} style={TradersMaintenanceRequestScreenStyle.userImageStyle} />
                                    :
                                    <View style={TradersMaintenanceRequestScreenStyle.emptyUserMessageListImageStyle}>
                                        <Text style={TradersMaintenanceRequestScreenStyle.initialTextStyle}>{firstname.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                    </View>
                            }

                            <View style={TradersMaintenanceRequestScreenStyle.statusContainerStyle}>
                                <Text style={TradersMaintenanceRequestScreenStyle.dollarTextStyle}>${item.budget}</Text>
                                <Text style={TradersMaintenanceRequestScreenStyle.daysTextStyle}>{Moment(item.due_date).fromNow()}</Text>
                            </View>
                        </View>
                        <View style={TradersMaintenanceRequestScreenStyle.detailContainerStyle}>
                            <View style={TradersMaintenanceRequestScreenStyle.detailTitleContainerStyle}>
                                <Text style={TradersMaintenanceRequestScreenStyle.detailTitleTextStyle}>{item.request_overview}</Text>
                                <Image source={ImagePath.RED_NOTIFICATION} style={TradersMaintenanceRequestScreenStyle.notificationImageStyle} />
                            </View>
                            <Text style={TradersMaintenanceRequestScreenStyle.detailTextStyle}>Request ID : {item.request_id}</Text>
                        </View>
                    </TouchableOpacity>


                </View>
            );
        }
    }


    renderNewItem = ({ item, index }) => {

        var userImage = item.created_by.image && item.created_by.image ? API.USER_IMAGE_PATH + item.created_by.image : '';
        var firstname = item.created_by.firstname && item.created_by.firstname ? item.created_by.firstname : '';
        var lastName = item.created_by.lastname && item.created_by.lastname ? item.created_by.lastname : '';
        if (item.due_date) {

            return (
                <View style={TradersMaintenanceRequestScreenStyle.listContainerStyle}>
                    <TouchableOpacity onPress={() => this.onListItemClick(item)}>
                        <View style={TradersMaintenanceRequestScreenStyle.listHeaderContainer}>
                            <View style={TradersMaintenanceRequestScreenStyle.statusContainerStyle}>

                            </View>
                            {userImage != '' ?
                                <Image source={{ uri: userImage }} style={TradersMaintenanceRequestScreenStyle.userImageStyle} />
                                :
                                <View style={TradersMaintenanceRequestScreenStyle.emptyUserMessageListImageStyle}>
                                    <Text style={TradersMaintenanceRequestScreenStyle.initialTextStyle}>{firstname.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                </View>
                            }
                            <View style={TradersMaintenanceRequestScreenStyle.statusContainerStyle}>
                                <Text style={TradersMaintenanceRequestScreenStyle.dollarTextStyle}>${item.budget}</Text>
                                <Text style={TradersMaintenanceRequestScreenStyle.daysTextStyle}>{Moment(item.due_date).fromNow()}</Text>
                            </View>
                        </View>
                        <View style={TradersMaintenanceRequestScreenStyle.detailContainerStyle}>
                            <View style={TradersMaintenanceRequestScreenStyle.detailTitleContainerStyle}>
                                <Text style={TradersMaintenanceRequestScreenStyle.detailTitleTextStyle}>{item.request_overview ? item.request_overview : ""}</Text>
                            </View>

                            <View style={TradersMaintenanceRequestScreenStyle.requestedContainerStyle}>
                                <Image source={ImagePath.PROPERTY_ID_ICON} style={TradersMaintenanceRequestScreenStyle.requestImageStyle} />
                                <Text style={TradersMaintenanceRequestScreenStyle.detailTextStyle}>Request ID : {item.request_id}</Text>
                            </View>

                            <View style={TradersMaintenanceRequestScreenStyle.requestedContainerStyle}>
                                <Image source={ImagePath.PROPERTY_ID_ICON} style={TradersMaintenanceRequestScreenStyle.requestImageStyle} />
                                <Text style={TradersMaintenanceRequestScreenStyle.detailTextStyle}>Requested {Moment(item.completed_date).fromNow()}</Text>
                            </View>
                            {
                                item.req_status == 1 ? <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={TradersMaintenanceRequestScreenStyle.rejectButtonViewStyle} onPress={ref.callForAcceptOrRejectMaintenanceReq.bind(ref, item._id, 7)}>
                                        <View >
                                            <Text style={TradersMaintenanceRequestScreenStyle.acceptTextStyle}>{Strings.DECLINE}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={TradersMaintenanceRequestScreenStyle.acceptButtonViewStyle} onPress={ref.callForAcceptOrRejectMaintenanceReq.bind(ref, item._id, 2)}>
                                        <View >
                                            <Text style={TradersMaintenanceRequestScreenStyle.acceptTextStyle}>{Strings.ACCEPT}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View> : null
                            }
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    }


    goForwardReqScreen(reqData) {
        Actions.ForwardMaintenanceRequestScreen({ maintenanceReqData: reqData });
    }


    onDrobDownChange(text) {
        this.setState({ dropdownValue: text })
        this.onSortList(text);
    }
    onSortList(text) {
        if (text == 'Request Overview') {
            this.setState({
                maintenanceData: this.state.maintenanceData.sort(this.sortBy('request_overview')),
                publicMaintenance: this.state.publicMaintenance.sort(this.sortBy('request_overview')),
                newData: this.state.newData.sort(this.sortBy('request_overview')),
                quotesList: this.state.quotesList.sort(this.sortBy('trader_price')),
                progressData: this.state.progressData.sort(this.sortBy('request_overview')),
                completedData: this.state.completedData.sort(this.sortBy('request_overview')),
            });
        }
        else if (text == 'Due date') {
            this.setState({
                publicMaintenance: this.state.publicMaintenance.sort(this.sortBy('due_date')),
                newData: this.state.newData.sort(this.sortBy('due_date')),
                quotesList: this.state.quotesList.sort(this.sortBy('due_date')),
                progressData: this.state.progressData.sort(this.sortBy('due_date')),
                completedData: this.state.completedData.sort(this.sortBy('due_date')),
            });
            setTimeout(() => {
                let arr = this.state.maintenanceDatabackUp.sort(function (a, b) {
                    return new Date(b.due_date) - new Date(a.due_date);
                });
                this.setState({ maintenanceData: arr })
            }, 200);
        }
        else if (text == 'Budget') {
            this.setState({
                maintenanceData: this.state.maintenanceData.sort(this.sortBy('budget')),
                publicMaintenance: this.state.publicMaintenance.sort(this.sortBy('budget')),
                newData: this.state.newData.sort(this.sortBy('budget')),
                quotesList: this.state.quotesList.sort(this.sortBy('trader_price')),
                progressData: this.state.progressData.sort(this.sortBy('budget')),
                completedData: this.state.completedData.sort(this.sortBy('budget')),
            });
        }
    }
    sortBy(key) {
        if (key == 'due_date') {
            return function (x, y) {

                return ((x[key] === y[key]) ? 0 : ((x[key] < y[key]) ? 1 : -1));

            };
        } else {
            return function (x, y) {

                return ((x[key] === y[key]) ? 0 : ((x[key] > y[key]) ? 1 : -1));

            }; ƒ
        }
    };
    requestedByTenantsRenderItem({ item, index }) {

        var userImage = item.created_by && item.created_by.image ? API.USER_IMAGE_PATH + item.created_by.image : null;
        var firstname = item.created_by && item.created_by.firstname ? item.created_by.firstname : '';
        var lastName = item.created_by && item.created_by.lastname ? item.created_by.lastname : '';
        return (
            <CardWithWhiteBG>

                <View style={TradersMaintenanceRequestScreenStyle.byTenantListContainerStyle}>

                    {

                        userImage != '' ? <View style={TradersMaintenanceRequestScreenStyle.imageContainerStyle}>
                            <Image source={{ uri: userImage }} style={TradersMaintenanceRequestScreenStyle.userImageStyle} />
                        </View>
                            :
                            <View style={TradersMaintenanceRequestScreenStyle.emptyUserMessageListImageStyle}>
                                <Text style={TradersMaintenanceRequestScreenStyle.initialTextStyle}>{firstname.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                            </View>

                    }


                    <View style={TradersMaintenanceRequestScreenStyle.messageViewContainerStyle}>
                        <Text style={TradersMaintenanceRequestScreenStyle.requestByTenantDetailTitleTextStyle}>{item.request_overview}</Text>
                        <Text numberOfLines={1} style={TradersMaintenanceRequestScreenStyle.requestByTenantDetailTextStyle}>Request ID : {item.request_id}</Text>
                        <Text numberOfLines={1} style={TradersMaintenanceRequestScreenStyle.maintenanceThreadpropertyIdTextStyle}>Category name</Text>


                        <TouchableOpacity onPress={ref.goForwardReqScreen.bind(ref, item)}>
                            <View style={TradersMaintenanceRequestScreenStyle.roundedBlueProceedButtonStyle}>
                                <Text style={TradersMaintenanceRequestScreenStyle.proceedButtonTextStyle}>
                                    {Strings.FORWARD}
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                </View>

            </CardWithWhiteBG>);
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

                <View>
                    {/* <View style={TradersMaintenanceRequestScreenStyle.refineResultContainerStyle}>
                                    <View>
                                        <Text style={TradersMaintenanceRequestScreenStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                                        <View style={TradersMaintenanceRequestScreenStyle.refineResultBottomBarStyle} />
                                    </View>

                                    <Image source={ImagePath.ARROW_DOWN} style={TradersMaintenanceRequestScreenStyle.refineResultArrowStyle} />
                                </View> */}

                    {<Dropdown
                        label=''
                        onChangeText={(text) => {
                            console.log(text, "texttext")
                        }}
                        labelHeight={5}
                        fontSize={14}
                        baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                        containerStyle={TradersMaintenanceRequestScreenStyle.dropDownViewStyle}
                        data={data}
                        onChangeText={this.onDrobDownChange.bind(this)}
                        value={this.state.dropdownValue ? this.state.dropdownValue : data[0].value}
                    // value={data[0].value}
                    />}
                </View>

                <View style={TradersMaintenanceRequestScreenStyle.tabContainerStyle}>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={{height:36}}>


                        <TouchableOpacity onPress={() => this.onAllTabClick()} >
                            <View >
                                <View style={TradersMaintenanceRequestScreenStyle.tabTextViewStyle}>
                                    <Text style={(this.state.isTabSelected == 1) ? TradersMaintenanceRequestScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{Strings.ALL}</Text>
                                </View>
                                {this.state.isTabSelected == 1 ? <View style={TradersMaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={TradersMaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                            </View>

                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.onNewTabClick()}>
                            <View >
                                <View style={TradersMaintenanceRequestScreenStyle.tabTextViewStyle}>
                                    <Text style={(this.state.isTabSelected == 2) ? TradersMaintenanceRequestScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{Strings.NEW}</Text>
                                </View>
                                {this.state.isTabSelected == 2 ? <View style={TradersMaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={TradersMaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onProgressTabClick()}>
                            <View>
                                <View style={TradersMaintenanceRequestScreenStyle.tabTextViewStyle}>
                                    <Text style={(this.state.isTabSelected == 3) ? TradersMaintenanceRequestScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{Strings.IN_PROGRESS}</Text>
                                </View>
                                {(this.state.isTabSelected == 3) ? <View style={TradersMaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={TradersMaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onPublicTabClick()}>
                            <View>
                                <View style={TradersMaintenanceRequestScreenStyle.tabTextViewStyle}>
                                    <Text style={(this.state.isTabSelected == 5) ? TradersMaintenanceRequestScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{'Public'}</Text>
                                </View>
                                {(this.state.isTabSelected == 5) ? <View style={TradersMaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={TradersMaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onQuotesTabClick()}>
                            <View>
                                <View style={TradersMaintenanceRequestScreenStyle.tabTextViewStyle}>
                                    <Text style={(this.state.isTabSelected == 6) ? TradersMaintenanceRequestScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{'Quotes'}</Text>
                                </View>
                                {(this.state.isTabSelected == 6) ? <View style={TradersMaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={TradersMaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onCompletedTabClick()}>
                            <View>
                                <View style={TradersMaintenanceRequestScreenStyle.tabTextViewStyle}>
                                    <Text style={(this.state.isTabSelected == 4) ? TradersMaintenanceRequestScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestScreenStyle.tabLabelDiselectTextStyle}>{Strings.COMPLETED}</Text>
                                </View>
                                {(this.state.isTabSelected == 4) ? <View style={TradersMaintenanceRequestScreenStyle.tabIndicatorStyle}></View> : <View style={TradersMaintenanceRequestScreenStyle.tabWhiteIndicatorStyle}></View>}
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                {(this.state.isTabSelected == 5) ?
                    <View style={{ height: 50, paddingLeft: 20, paddingRight: 20, backgroundColor: 'white', borderTopWidth: 1, borderBottomWidth: 0, borderColor: Colors.GRAY, justifyContent: 'center' }}>
                        <View style={{ borderRadius: 35, justifyContent: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.GRAY, height: 30 }}>
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
                {(this.state.isTabSelected == 6) ?
                    <View style={{ height: 50, paddingLeft: 20, justifyContent: 'center', paddingRight: 20, backgroundColor: 'white', borderTopWidth: 1, borderBottomWidth: 0, borderColor: Colors.GRAY, justifyContent: 'center' }}>
                        <View style={{ borderRadius: 35, justifyContent: 'flex-end', justifyContent: 'center', borderWidth: 1, borderColor: Colors.GRAY, height: 30 }}>
                            <TextInput
                                placeholder={'Search by keyword'}
                                style={{ justifyContent: 'center', padding: 0, paddingLeft: 15 }}
                                onChangeText={(val) => {
                                    let arr = this.state.quotesListBackUp.filter(item => {
                                        if ((item.request_overview.toLowerCase()).match(val.toLowerCase())) {
                                            return item;
                                        }
                                    })
                                    console.log(arr, "arrarrarr")
                                    this.setState({ searchQuoteValue: val, quotesList: arr })
                                }}
                                value={this.state.searchQuoteValue}
                            />
                        </View>
                    </View> : null}

                {/* <Dropdown
                    label=''
                    labelHeight={5}
                    fontSize={14}
                    baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                    containerStyle={TradersMaintenanceRequestScreenStyle.dropDownViewStyle}
                    data={data}
                    value={data[0].value}
                /> */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={CommonStyles.flatListStyle}>
                    {this.state.isFilter ?
                        <FilterScreen /> : null
                    }
                    {
                        this.state.maintenanceData ?
                            (this.state.isTabSelected == 1) ? <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.maintenanceData}
                                renderItem={this.renderItem}
                                extraData={this.state}
                            /> : null
                            :
                            <Text style={TradersMaintenanceRequestScreenStyle.requestPlaceHolerTextStyle}>
                                {Strings.MAINTENANCE_NOT_FOUND}
                            </Text>
                    }
                    {
                        this.state.newData ?
                            (this.state.isTabSelected == 2) ? <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.newData}
                                renderItem={this.renderNewItem}
                                extraData={this.state}
                            /> : null
                            :
                            <Text style={TradersMaintenanceRequestScreenStyle.requestPlaceHolerTextStyle}>
                                {Strings.MAINTENANCE_NOT_FOUND}
                            </Text>
                    }

                    {
                        this.state.progressData ?
                            (this.state.isTabSelected == 3) ? <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.progressData}
                                renderItem={this.renderItem}
                                extraData={this.state}
                            /> : null
                            :
                            <Text style={TradersMaintenanceRequestScreenStyle.requestPlaceHolerTextStyle}>
                                {Strings.MAINTENANCE_NOT_FOUND}
                            </Text>
                    }
                    {
                        this.state.completedData ?
                            (this.state.isTabSelected == 4) ? <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.completedData}
                                renderItem={this.renderItem}
                                extraData={this.state}
                            /> : null
                            :
                            <Text style={TradersMaintenanceRequestScreenStyle.requestPlaceHolerTextStyle}>
                                {Strings.MAINTENANCE_NOT_FOUND}
                            </Text>
                    }
                    {this.state.completedData ?
                        (this.state.isTabSelected == 5) ?
                            <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.publicMaintenance}
                                renderItem={this.renderPublicItem}
                                extraData={this.state}
                            />
                            : null
                        :
                        <Text style={TradersMaintenanceRequestScreenStyle.requestPlaceHolerTextStyle}>
                            {Strings.MAINTENANCE_NOT_FOUND}
                        </Text>
                    }
                    {this.state.completedData ?
                        (this.state.isTabSelected == 6) ? <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                            data={this.state.quotesList}
                            renderItem={this.renderQuotesItem}
                            extraData={this.state}
                        /> : null
                        :
                        <Text style={TradersMaintenanceRequestScreenStyle.requestPlaceHolerTextStyle}>
                            {Strings.MAINTENANCE_NOT_FOUND}
                        </Text>
                    }
                </ScrollView>
                {

                    this.props.tradersMaintenanceReducer.isScreenLoading ?
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
        tradersMaintenanceReducer: state.tradersMaintenanceReducer
    }
}

export default connect(
    mapStateToProps,
    {

        getMaintenanceRequestList,
        showLoading,
        resetState,
        acceptAndDeniedMaintenanceReq,

    }

)(TradersMaintenanceRequestScreen);



