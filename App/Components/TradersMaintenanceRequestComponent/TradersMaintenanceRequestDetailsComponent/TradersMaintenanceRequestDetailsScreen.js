import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Image,
    StyleSheet,
    View,
    Text,
    Button,
    ImageBackground,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    TextInput,
    ScrollView,
    FlatList,
    AsyncStorage,
    Modal
} from 'react-native';

import Moment from 'moment';
import {

    getMaintenanceReqDetail,

} from "../../../Action/ActionCreators";
import {
    showLoading,
    resetState,
} from "./TradersMaintenanceRequestDetailsAction";
import { EventRegister } from 'react-native-event-listeners'
import DatePicker from 'react-native-datepicker'
import API from '../../../Constants/APIUrls';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import TradersMaintenanceRequestDetailsScreenStyle from './TradersMaintenanceRequestDetailsScreenStyle';
//import listData from  '../../../../data';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import ThreadScreen from './ThreadComponent/ThreadScreen';
import TrackerScreen from './TradersTrackerScreen';
import RequestDetailScreen from './TradersRequestDetailScreen';
import StarRating from 'react-native-star-rating';
let ref;
import SocketIOClient from 'socket.io-client';
import APICaller, { GETAPICaller } from '../../../Saga/APICaller';
import * as Progress from "react-native-progress";
import IMAGEPATH from '../../../Constants/ImagesPath';
import { Matrics } from '../../../CommonConfig';
import COLORS from '../../../Constants/Colors';
import AddAgreementScreenStyle from '../../AgreementsComponent/AddAgreementComponent/AddAgreementScreenStyle';
var UserID = '';
var lastCounterProposalCreatedBy = '';

class TradersMaintenanceRequestDetails extends Component {

    constructor(props) {
        super(props);
        ref = this;
        this.state = {
            isTabSelected: 1,
            applyJobModal: false,
            showJobApplyLoader: false,
            reqPrice: "",
            reqDate: "",
            reqMessage: "",
            starCount: 3.5,
            hideApplyButton: false,
            maintenanceReqData: {},
            isShowPopup: false,
            lastCounterProposalCreatedBy: props.navigation.state.params.maintenanceData && props.navigation.state.params.maintenanceData.mr_last_chat && props.navigation.state.params.maintenanceData.mr_last_chat.from._id,
            maintenanceParams: props.navigation.state.params.maintenanceData
        };
        this.socket = SocketIOClient(API.CHAT_CONNECTION_URL, { transports: ['websocket'] });
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                UserID = userData.data._id;
                this.setState({ UserID: UserID })
                var authToken = userData.token;

                GETAPICaller("getMaintenanceDetail" + "/" + this.props.reqId, "POST", authToken, "").then(res => {
                    console.log(res, "resres")
                    let flag = false
                    if (res.code == 200) {
                        res.data.maintentenance_counter_proposals.forEach(element => {
                            if (element.proposal_created_by == userData.data._id) {
                                flag = true
                                return
                            }
                        });
                        this.setState({ hideApplyButton: flag })
                    }
                })


            }
        }).done();
        if (this.state.maintenanceParams && this.state.maintenanceParams.mr_last_chat != null) {
            lastCounterProposalCreatedBy = this.state.maintenanceParams.mr_last_chat.from._id
            this.setState({ lastCounterProposalCreatedBy: lastCounterProposalCreatedBy })
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    var userData = JSON.parse(value);
                    UserID = userData.data._id;
                    this.setState({ UserID: UserID })
                    if (UserID == lastCounterProposalCreatedBy) {
                    }
                }
            }).done();
        }
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onGetMaintenanceDetailSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.callGetMaintenanceDetail(this.props.reqId);
        console.log(this.state.maintenanceParams, "this.state.maintenanceReqData")
    }
    applyForJob() {
        console.log(this.state, "this.state")
        if (this.state.reqPrice == '') {
            alert("Please enter price")
        } else if (this.state.reqDate == '') {
            alert("Please enter date")
        } else if (this.state.reqMessage == '') {
            alert("Please enter message")
        } else {
            this.setState({ showJobApplyLoader: true })
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    var userData = JSON.parse(value);
                    console.log(userData)
                    var authToken = userData.token;
                    AsyncStorage.getItem("roleId").then((role) => {
                        if (role) {
                            let reqParams = {
                                "maintenance_id": this.state.maintenanceReqData._id,
                                "proposed_price": Number(this.state.reqPrice),
                                "proposed_date": this.state.reqDate,
                                "message": this.state.reqMessage,
                                "proposal_created_by": userData.data._id,
                                "proposal_created_role": role,
                                "business_name": userData.data.business_name,
                                "firstname": userData.data.firstname,
                                "lastname": userData.data.lastname
                            }
                            console.log(reqParams, "reqParamsreqParams")
                            APICaller("applyForQuote", 'POST', authToken, reqParams).then(data => {
                                if (data.code == 200) {
                                    this.setState({ applyJobModal: false, showJobApplyLoader: false })
                                    var objMessage = {
                                        from: userData.data._id,
                                        to: this.state.maintenanceReqData._id,
                                        textMsg: "Quote Sent",
                                        time: new Date(),
                                        is_status: true,
                                        maintenanceId: this.state.maintenanceReqData._id,
                                        proposal_id: data.proposal_data._id,
                                        group_id: this.state.maintenanceReqData._id
                                    }
                                    console.log('private message sent', objMessage);
                                    this.socket.emit('maintenanceGroupMessageSent', objMessage)
                                    alert("Success")
                                    GETAPICaller("getMaintenanceDetail" + "/" + this.props.reqId, "POST", authToken, "").then(res => {
                                        console.log(res, "resres")
                                        let flag = false
                                        if (res.code == 200) {
                                            res.data.maintentenance_counter_proposals.forEach(element => {
                                                if (element.proposal_created_by == userData.data._id) {
                                                    flag = true
                                                    return
                                                }
                                            });
                                            this.setState({ hideApplyButton: flag })
                                        }
                                    })
                                } else {
                                    // alert("Something went wrong")
                                    this.setState({ showJobApplyLoader: false })
                                }
                            })
                        }
                    }).done();
                }
            }).done();
        }
    }

    closeNotifications() {
        Actions.pop();
    }

    onAllTabClick() {
        this.setState({ isTabSelected: 1 });
    }

    onActiveTabClick() {
        this.setState({ isTabSelected: 2 });
    }

    onRequestedByTenentTabClick() {
        global.maintenanceReqData = this.state.maintenanceReqData
        this.setState({ isTabSelected: 3 });
    }


    // req_status:{type: Number,default:1}, // 1 for sent , 2 for accepted, 3 for booked, 4 for completed, 5 for closed, 6 for due, 7 denied  
    callGetMaintenanceDetail(id) {
        this.setState({ showLoading: true })
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                UserID = userData.data._id;
                var authToken = userData.token;
                this.props.showLoading();
                this.props.getMaintenanceReqDetail(authToken, id);
            }
        }).done();
    }

    onGetMaintenanceDetailSuccess() {

        if (this.props.tradersMaintenanceDetailsReducer.maintenanceReqDetailRes != '') {

            if (this.props.tradersMaintenanceDetailsReducer.maintenanceReqDetailRes.code == 200) {

                this.setState({ maintenanceReqData: this.props.tradersMaintenanceDetailsReducer.maintenanceReqDetailRes.data, showLoading: false });
            }
            else {
                this.setState({ showLoading: false });
                alert(this.props.tradersMaintenanceDetailsReducer.maintenanceReqDetailRes.message);
            }
            this.props.resetState();
        }
    }

    showPopup() {
        if (this.state.isShowPopup == false) {
            this.setState({ isShowPopup: true });
        }
        else {
            this.setState({ isShowPopup: false });
        }
    }

    callCounterProposalScreen() {
        global.maintenanceReqData = this.state.maintenanceReqData
        this.setState({ isShowPopup: false, isTabSelected: 3 });
        Actions.CounterProposalScreen({ maintenanceId: this.state.maintenanceReqData._id, onChange: () => (console.log(this.props)) });
    }

    bookmr() {
        AsyncStorage.getItem("SyncittUserInfo")
            .then(value => {
                if (value) {
                    var userData = JSON.parse(value);
                    var authToken = userData.token;
                    this.socket.emit('addMaintenanceUsers', {
                        id: userData.data._id,
                        maintenanceId: this.state.maintenanceReqData._id,
                        firstName: userData.data.firstname,
                        lastName: userData.data.lastname
                    });
                    APICaller('acceptorDeniedJob', 'post', authToken, { maintenance_id: this.state.maintenanceReqData._id, req_status: 3 }).then(data => {
                        var objMessage = {
                            from: userData.data._id,
                            to: this.state.maintenanceReqData._id,
                            textMsg: 'Booked',
                            time: new Date(),
                            is_status: true,
                            maintenanceId: this.state.maintenanceReqData._id
                        }

                        this.socket.emit('maintenanceGroupMessageSent', objMessage)
                        this.callGetMaintenanceDetail(this.props.reqId)
                        EventRegister.emit('updateCounter')
                    }, err => {
                        alert("Something went wrong. Please try again")
                    })
                }
            })
    }
    callMarkAsComplete() {
        this.setState({ isShowPopup: false });

        Actions.MarkAsCompleteScreen({ maintenanceId: this.state.maintenanceReqData._id, proposalId: "" });
    }

    navBar() {
        console.log("this.props.isPublicJob", this.props)
        let isIDUserMatch = this.state.UserID != undefined && this.state.UserID != null ? this.state.UserID : false
        let isCounterIDMatch = this.state.lastCounterProposalCreatedBy != undefined && this.state.lastCounterProposalCreatedBy != null ? this.state.lastCounterProposalCreatedBy : false
        let matchFlag = isIDUserMatch == isCounterIDMatch ? true : false
        return (
            <View style={TradersMaintenanceRequestDetailsScreenStyle.profileHeaderContainer}>
                <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginLeft: 20, marginTop: 10 }}>
                    <Image source={ImagePath.HEADER_BACK} />
                </TouchableOpacity>


                {this.state.maintenanceReqData.is_job_completed == false && !this.props.isQuote &&
                    ((this.state.maintenanceReqData.req_status !== 1) ? true : !matchFlag ?
                        !matchFlag && (this.state.maintenanceReqData.req_status == 1) : false) ?
                    //&& this.state.maintenanceReqData.req_status != 1 ?
                    <TouchableOpacity onPress={this.showPopup.bind(this)} style={{ marginRight: 20, marginTop: 10 }}>
                        <View style={[TradersMaintenanceRequestDetailsScreenStyle.optionViewStyle, { backgroundColor: 'transparent' }]} >
                            <Image source={ImagePath.HEADER_DOTS_MENU} />
                        </View>
                    </TouchableOpacity> : null
                }
                {
                    (this.state.isShowPopup) ?
                        <Modal transparent onRequestClose={() => { this.setState({ isShowPopup: false }) }}>
                            <TouchableOpacity onPress={this.showPopup.bind(this)} style={TradersMaintenanceRequestDetailsScreenStyle.modalContainer}>
                                <View style={{
                                    flex: 1, justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={TradersMaintenanceRequestDetailsScreenStyle.modalContainerStyles}>


                                        {(!this.props.isPublicJob || this.state.hideApplyButton) ?
                                            (this.state.maintenanceReqData.req_status !== 1 && this.state.maintenanceReqData.req_status !== 5) ?
                                                <TouchableOpacity style={{ marginTop: 10, marginBottom: 20 }} onPress={this.callMarkAsComplete.bind(this)}>

                                                    <View style={TradersMaintenanceRequestDetailsScreenStyle.roundedYellowButtonStyle}>
                                                        <Text style={TradersMaintenanceRequestDetailsScreenStyle.yellowButtonTextStyle}>
                                                            {Strings.MARK_AS_COMPLETE}
                                                        </Text>
                                                    </View>

                                                </TouchableOpacity> :
                                                <View>

                                                    {(!matchFlag ?
                                                        !matchFlag && (this.state.maintenanceReqData.req_status == 1) : !isIDUserMatch && !isCounterIDMatch ? false : true) &&
                                                        <>
                                                            <TouchableOpacity style={{ marginTop: 10, marginBottom: 10 }} onPress={this.callCounterProposalScreen.bind(this)}>
                                                                <View style={TradersMaintenanceRequestDetailsScreenStyle.roundedYellowButtonStyle}>
                                                                    <Text style={TradersMaintenanceRequestDetailsScreenStyle.yellowButtonTextStyle}>
                                                                        {Strings.COUNTER_PROPOSAL}
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity style={{ marginTop: 10, marginBottom: 20 }} onPress={() => {
                                                                console.log(this.props, this.state)
                                                                this.setState({ isShowPopup: false })
                                                                this.setState({ applyJobModal: true })
                                                            }}>
                                                                <View style={TradersMaintenanceRequestDetailsScreenStyle.roundedYellowButtonStyle}>
                                                                    <Text style={TradersMaintenanceRequestDetailsScreenStyle.yellowButtonTextStyle}>
                                                                        Apply
                                                                    </Text>
                                                                </View>

                                                            </TouchableOpacity>

                                                        </>


                                                    }
                                                </View>
                                            :
                                            <View>
                                                {
                                                    this.state.maintenanceReqData.maintentenance_counter_proposals.length < 2 && this.state.maintenanceReqData.req_status == 1 ?

                                                        <TouchableOpacity style={{ marginTop: 10, marginBottom: 20 }} onPress={() => {
                                                            console.log(this.props, this.state)
                                                            this.setState({ isShowPopup: false })
                                                            this.setState({ applyJobModal: true })
                                                        }}>
                                                            <View style={TradersMaintenanceRequestDetailsScreenStyle.roundedYellowButtonStyle}>
                                                                <Text style={TradersMaintenanceRequestDetailsScreenStyle.yellowButtonTextStyle}>
                                                                    Apply
                                                    </Text>
                                                            </View>

                                                        </TouchableOpacity>
                                                        : null
                                                }
                                            </View>
                                        }

                                        {this.state.maintenanceReqData.request_type == 0 && this.state.maintenanceReqData.req_status == 2 &&

                                            <TouchableOpacity style={{ marginTop: 0, marginBottom: 20 }} onPress={this.bookmr.bind(this)}>

                                                <View style={TradersMaintenanceRequestDetailsScreenStyle.roundedYellowButtonStyle}>
                                                    <Text style={TradersMaintenanceRequestDetailsScreenStyle.yellowButtonTextStyle}>
                                                        BOOK
                                                </Text>
                                                </View>

                                            </TouchableOpacity>
                                        }
                                        {/* <TouchableOpacity  style={{marginTop:10}}>
                    
                                            <View style={TradersMaintenanceRequestDetailsScreenStyle.roundedGrayButtonStyle}>
                                                <Text style={TradersMaintenanceRequestDetailsScreenStyle.grayButtonTextStyle}>
                                                    {Strings.APPROVE_REQUEST}
                                                </Text>
                                            </View>

                                        </TouchableOpacity>


                                        <TouchableOpacity style={{marginBottom:20}} >

                                            <View style={TradersMaintenanceRequestDetailsScreenStyle.roundedTransparentButtonStyle}>
                                                <Text style={TradersMaintenanceRequestDetailsScreenStyle.redTextStyle}>
                                                        {Strings.BOOKED}
                                                </Text>
                                            </View>

                                        </TouchableOpacity> */}

                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Modal> : null
                }


            </View>
        );
    }
    renderApplyJobModal() {
        return (
            <Modal onRequestClose={() => this.setState({ applyJobModal: false })} animationType={'slide'} visible={this.state.applyJobModal}>
                <ImageBackground source={IMAGEPATH.BACKGROUND_IMAGE} style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: 'transparent' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, marginVertical: 70, borderRadius: 5, width: '90%', alignSelf: 'center' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={style.searchResultTextStyle}>APPLY TO THIS JOB</Text>
                                    <Text style={style.serviceRequestTextStyle}>{this.props.maintenanceData && this.props.maintenanceData.suburb}</Text>
                                </View>
                                <TouchableOpacity onPress={() => this.setState({ applyJobModal: false })}>
                                    <Image source={IMAGEPATH.DRAWER_CROSS_ICON} style={{ height: 20, width: 20, tintColor: Colors.BLACK }} resizeMode={'contain'} />
                                </TouchableOpacity>
                            </View>
                            {/* ======= Budget ======= */}
                            <View style={style.textInputConatiner2}>
                                <Text style={style.textInputContainer2Text}>Price<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                                <View style={style.inputBoxContainer2}>
                                    <TextInput
                                        style={style.input2Style}
                                        value={String(this.state.reqPrice)}
                                        keyboardType={'number-pad'}
                                        placeholderTextColor={'gray'}
                                        onChangeText={(text) => this.setState({ reqPrice: text.trimLeft() })}
                                        placeholder={'Enter Price'}
                                    />
                                </View>
                            </View>

                            {/* ======= When ======= */}
                            <View style={style.textInputConatiner2}>
                                <Text style={style.textInputContainer2Text}>Available Date<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                                <View style={style.inputBoxContainer2}>
                                    <DatePicker
                                        style={AddAgreementScreenStyle.datePickerStyle}
                                        date={this.state.reqDate}
                                        iconComponent={() => {
                                            return (
                                                <View></View>
                                            )
                                        }}
                                        mode="date"
                                        placeholder="Select Date"
                                        format='MM-DD-YYYY'
                                        minDate={new Date()}
                                        placeholderTextColor={'gray'}
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                right: 0,
                                                top: Matrics.ScaleValue(4),
                                                marginLeft: 0
                                            },
                                            dateInput: {
                                                marginLeft: 0,
                                                position: 'absolute',
                                                left: Matrics.ScaleValue(5),
                                                borderBottomWidth: 0,
                                                borderLeftWidth: 0,
                                                borderTopWidth: 0,
                                                borderRightWidth: 0,
                                            }
                                            // ... You can check the source to find the other keys. 
                                        }}
                                        onDateChange={(date) => {
                                            this.setState({ reqDate: date })
                                        }}
                                    />
                                    <View style={style.calenderIconStyle}>
                                        <Image source={IMAGEPATH.CALENDAR_ICON} />
                                    </View>
                                </View>
                            </View>
                            {/* ======= Description ======= */}
                            <View style={style.textInputConatiner2}>
                                <Text style={style.textInputContainer2Text}>Message<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                                <View style={[style.inputBoxContainer2, { height: Matrics.ScaleValue(200), padding: Matrics.ScaleValue(15) }]}>
                                    <TextInput
                                        placeholder={'Enter Message'}
                                        onChangeText={(text) => this.setState({ reqMessage: text.trimLeft() })}
                                        value={this.state.reqMessage}
                                        placeholderTextColor={'gray'}
                                        style={[style.input2Style, { height: Matrics.ScaleValue(200) }]}
                                        multiline={true}
                                    />
                                </View>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                {this.state.showJobApplyLoader ?
                                    <TouchableOpacity style={{ height: 45, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 100, backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND }}>
                                        <ActivityIndicator size='small' color={Colors.WHITE} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => this.applyForJob()} style={{ height: 45, borderRadius: 30, justifyContent: 'center', alignItems: 'center', width: 100, backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND }}>
                                        <Text style={{ color: 'white', fontWeight: '600' }}>Apply</Text>
                                    </TouchableOpacity>
                                }
                            </View>

                        </View>
                    </ScrollView>
                </ImageBackground>
            </Modal>
        )
    }
    render() {
        return (

            <View style={TradersMaintenanceRequestDetailsScreenStyle.profileContainer}>
                <View >
                    <Image source={ImagePath.HEADER_BG} style={TradersMaintenanceRequestDetailsScreenStyle.topCoverImageContainer} />

                    <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: Colors.TRANSPARENT }}>
                        <Text numberOfLines={2} style={{ color: Colors.WHITE, fontSize: 24, fontWeight: '600' }}>{this.state.maintenanceReqData.request_overview}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Image source={ImagePath.PROPERTY_ID_ICON} style={{ margin: 3 }} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 7 }}>PID : </Text>
                                <Text style={{ color: Colors.WHITE, fontSize: 14 }}> {this.state.maintenanceReqData.request_id}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Image source={ImagePath.DRAWER_TRADERS} style={{ height: 15, width: 15, justifyContent: 'center' }} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 5 }}>{this.state.maintenanceReqData.trader_id ? this.state.maintenanceReqData.trader_id.firstname + ' ' + this.state.maintenanceReqData.trader_id.lastname : ''}</Text>
                            </View>
                        </View>
                    </View>
                    {this.navBar()}

                </View>
                <View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={TradersMaintenanceRequestDetailsScreenStyle.tabContainerScrollViewStyle}>
                        <View style={TradersMaintenanceRequestDetailsScreenStyle.tabContainerStyle}>

                            <TouchableOpacity onPress={() => this.onAllTabClick()} >
                                <View >
                                    <View style={TradersMaintenanceRequestDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 1) ? TradersMaintenanceRequestDetailsScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.TRACKER}</Text>
                                    </View>
                                    {this.state.isTabSelected == 1 ? <View style={TradersMaintenanceRequestDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={TradersMaintenanceRequestDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onActiveTabClick()}>
                                <View>
                                    <View style={TradersMaintenanceRequestDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 2) ? TradersMaintenanceRequestDetailsScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.REQUEST_DETAILS}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 2) ? <View style={TradersMaintenanceRequestDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={TradersMaintenanceRequestDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onRequestedByTenentTabClick()}>
                                <View>
                                    <View style={TradersMaintenanceRequestDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 3) ? TradersMaintenanceRequestDetailsScreenStyle.tabLabelTextStyle : TradersMaintenanceRequestDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.THREAD}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 3) ? <View style={TradersMaintenanceRequestDetailsScreenStyle.tabIndicatorStyle}></View> :
                                        <View style={TradersMaintenanceRequestDetailsScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                {(this.state.isTabSelected == 1) ?
                    <TrackerScreen reqDetailData={this.state.maintenanceReqData} />
                    : null}
                {(this.state.isTabSelected == 2) ?
                    <RequestDetailScreen reqDetailData={this.state.maintenanceReqData} />
                    : null}
                {(this.state.isTabSelected == 3) ?
                    <ThreadScreen reqDetailData={this.state.maintenanceReqData} isCounterProposal={this.props.threadReducer.refreshScene} />
                    : null}
                {//23 Nov
                    this.state.showLoading ? (
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail
                                color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]}
                            />
                        </View>
                    ) : null
                    //
                }
                {this.renderApplyJobModal()}
            </View>

        );
    }
}

function mapStateToProps(state) {

    return {
        tradersMaintenanceDetailsReducer: state.tradersMaintenanceDetailsReducer,
        threadReducer: state.threadReducer,
    }
}

export default connect(
    mapStateToProps,
    {
        getMaintenanceReqDetail,
        showLoading,
        resetState,
    }

)(TradersMaintenanceRequestDetails);


const style = {
    searchResultTextStyle: {
        color: COLORS.SKY_BLUE_BUTTON_BACKGROUND, height: Matrics.ScaleValue(16), fontSize: Matrics.ScaleValue(12)
    },
    serviceRequestTextStyle: {
        color: COLORS.GRAY_COLOR, fontSize: Matrics.ScaleValue(23), fontWeight: '600'
    },
    textInputConatiner2: {
        marginTop: Matrics.ScaleValue(10)
    },
    textInputContainer2Text: {
        color: COLORS.GRAY_COLOR, fontSize: Matrics.ScaleValue(14)
    },
    inputBoxContainer2: {
        height: Matrics.ScaleValue(40),
        borderWidth: 1,
        flexDirection: 'row',
        borderColor: COLORS.GRAY,
        borderRadius: Matrics.ScaleValue(5),
        justifyContent: 'space-between',
        paddingLeft: Matrics.ScaleValue(20),
        alignSelf: 'center',
        width: '100%',
        backgroundColor: 'white',
        margin: Matrics.ScaleValue(10)
    },
    input2Style: {
        height: Matrics.ScaleValue(40), flex: 1, color: Colors.BLACK
    },
    calenderIconStyle: {
        justifyContent: 'center', paddingRight: Matrics.ScaleValue(10)
    }
}