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
    AsyncStorage
} from 'react-native';

import {

    getDisputesDetails,

} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,

} from "./DisputesDetailsAction";

import API from '../../../Constants/APIUrls';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import DisputesDetailsScreenStyle from './DisputesDetailsScreenStyle';

import CommonStyles from '../../../CommonStyle/CommonStyle';
import DisputeOverviewScreen from './DisputeOverviewScreen';
import GeneralCommunicationScreen from './GeneralCommunicationComponent/GeneralCommunicationScreen';
import PrivateCommunicationScreen from './PrivateCommunicationComponent/GeneralCommunicationScreen';
import SocketIOClient from 'socket.io-client';
import StarRating from 'react-native-star-rating';
let ref;

class DisputesDetailsScreen extends Component {

    constructor() {
        super();
        this.socket = SocketIOClient(API.CHAT_CONNECTION_URL, { transports: ['websocket'] });
        ref = this;
        this.state = {
            isTabSelected: 0,
            starCount: 3.5,
            agreementData: {},
            id: '',
            ownerId: ''
        };
        this.socket.on('getAppliedUsersRes', (messages) => {
            
            this.setState({ users: messages })
        });

        // var _goChat = ref._goChat.bind(ref);
        // _goChat(receiver, emitter, ref.socket, userName, userPic) {
        //     //this.props.navigator.push({ ident: "Chat", receiver, emitter, socket })
        //     Actions.Chat({ receiver, emitter, socket, userName, userPic });
        // }

        this.socket.emit('channel1', 'Hi server'); // emits 'hi server' to your server

        // Listens to channel2 and display the data recieved
        this.socket.on('channel2', (data) => {
            
        });
    }

    componentDidUpdate() {
        this.onDisputeDetailSuccess();
    }

    componentWillMount() {
        this.callDisputDetail(this.props.reqId);
    }

    closeNotifications() {
        Actions.popTo('Dashboard');
    }

    onAllTabClick() {

        this.setState({ isTabSelected: 1 });
    }
    onActiveTabClick() {

        this.setState({ isTabSelected: 2 });
    }
    onClickPrivateTab() {

        this.setState({ isTabSelected: 3 });

    }

    callDisputDetail(id) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                
                this.setState({ id: userData.data._id })
                var authToken = userData.token;
                var postData = {
                    disputeId: id,
                }

                this.props.showLoading();
                this.props.getDisputesDetails(authToken, postData);
            }
        }).done();
    }

    onDisputeDetailSuccess() {

        if (this.props.disputesDetailsReducer.disputeDetailsRes != '') {

            if (this.props.disputesDetailsReducer.disputeDetailsRes.code == 200) {

                

                this.setState({ agreementData: this.props.disputesDetailsReducer.disputeDetailsRes.data, ownerId: this.props.disputesDetailsReducer.disputeDetailsRes.data.owner_id._id });
                this.setState({ isTabSelected: 1 });
            }
            else {

                alert(this.props.disputesDetailsReducer.disputeDetailsRes.message);
            }
            this.props.resetState();
        }
    }



    navBar() {
        return (
            <View style={DisputesDetailsScreenStyle.profileHeaderContainer}>

                <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginLeft: 10, marginTop: 10 }}>
                    <View style={{ padding: 20, paddingLeft: 20 }}>
                        <Image source={ImagePath.BACK_WHITE} />
                    </View>
                </TouchableOpacity>

                {/* <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginRight: 20, marginTop: 10 }}>
                    <View style={DisputesDetailsScreenStyle.optionViewStyle} >
                        <Image source={ImagePath.THREE_DOTS_ICON} />
                    </View>
                </TouchableOpacity> */}

            </View>
        );
    }

    render() {
        var dispute_id = this.state.agreementData.dispute_id ? this.state.agreementData.dispute_id : '';
        var subject = this.state.agreementData.subject ? this.state.agreementData.subject : '';
        var message = this.state.agreementData.message ? this.state.agreementData.message : '';
        return (

            <View style={DisputesDetailsScreenStyle.profileContainer}>
                <View>

                    <Image source={ImagePath.HEADER_BG} style={DisputesDetailsScreenStyle.topCoverImageContainer} />

                    <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: Colors.TRANSPARENT }}>
                        <Text numberOfLines={2} style={{ color: Colors.WHITE, fontSize: 20, fontWeight: '600' }}>{'Subject : ' + subject}</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Image source={ImagePath.PROPERTY_ID_ICON} style={{ margin: 3 }} />
                                <Text style={{ color: Colors.WHITE, fontSize: 14, marginLeft: 7 }}>{'PID :' + dispute_id}</Text>
                                {/* <Text style={{ color: Colors.WHITE, fontSize: 14 }}> {this.state.agreementData.request_id}</Text> */}
                            </View>
                        </View>
                    </View>
                    {this.navBar()}

                </View>
                <View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={DisputesDetailsScreenStyle.tabContainerScrollViewStyle}>
                        <View style={DisputesDetailsScreenStyle.tabContainerStyle}>

                            <TouchableOpacity onPress={() => this.onAllTabClick()} >
                                <View style={DisputesDetailsScreenStyle.tabTextViewContainerStyle}>
                                    <View style={DisputesDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 1) ? DisputesDetailsScreenStyle.tabLabelTextStyle : DisputesDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.OVERVIEW}</Text>
                                    </View>
                                    {this.state.isTabSelected == 1 ? <View style={DisputesDetailsScreenStyle.tabIndicatorStyle}></View> : null}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onActiveTabClick()}>
                                <View>
                                    <View style={DisputesDetailsScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 2) ? DisputesDetailsScreenStyle.tabLabelTextStyle : DisputesDetailsScreenStyle.tabLabelDiselectTextStyle}>{'Group Chat'}</Text>
                                        {/* <Text style={(this.state.isTabSelected == 2) ? DisputesDetailsScreenStyle.tabLabelTextStyle : DisputesDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.GENERAL_COMMUNICATION}</Text> */}
                                    </View> 
                                    {(this.state.isTabSelected == 2) ? <View style={DisputesDetailsScreenStyle.tabIndicatorStyle}></View> : null}
                                </View>
                            </TouchableOpacity>
                            {(this.state.ownerId != this.state.id) &&
                                <TouchableOpacity onPress={() => this.onClickPrivateTab()}>
                                    <View>
                                        <View style={DisputesDetailsScreenStyle.tabTextViewStyle}>
                                            <Text style={(this.state.isTabSelected == 3) ? DisputesDetailsScreenStyle.tabLabelTextStyle : DisputesDetailsScreenStyle.tabLabelDiselectTextStyle}>{'Private Chat'}</Text>
                                            {/* <Text style={(this.state.isTabSelected == 2) ? DisputesDetailsScreenStyle.tabLabelTextStyle : DisputesDetailsScreenStyle.tabLabelDiselectTextStyle}>{Strings.GENERAL_COMMUNICATION}</Text> */}
                                        </View>
                                        {(this.state.isTabSelected == 3) ? <View style={DisputesDetailsScreenStyle.tabIndicatorStyle}></View> : null}
                                    </View>
                                </TouchableOpacity>
                            }

                        </View>

                        {/* Resolved And Not Resolved Buttons */}
                    </ScrollView>
                       
                </View>

                {
                    (this.state.isTabSelected == 1) ?
                        <DisputeOverviewScreen agreementDetail={this.state.agreementData} />
                        : null
                }
                {
                    (this.state.isTabSelected == 2) ?
                        <GeneralCommunicationScreen agreementDetail={this.state.agreementData} />
                        : null
                }
                {
                    (this.state.isTabSelected == 3) ?
                        <PrivateCommunicationScreen socket={this.socket} receiver={this.state.ownerId} emitter={this.state.id} agreementDetail={this.state.agreementData} />
                        : null
                }

            </View>

        );
    }
}

function mapStateToProps(state) {
    
    return {
        disputesDetailsReducer: state.disputesDetailsReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getDisputesDetails,
        showLoading,
        resetState,
    }

)(DisputesDetailsScreen);


