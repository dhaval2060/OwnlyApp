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
    AsyncStorage,
    Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import MessagesScreenStyle from './MessagesScreenStyle';
//import listData from  '../../../data';
import * as Progress from 'react-native-progress';
import Moment from 'moment';
import API from '../../Constants/APIUrls';
import { Dropdown } from 'react-native-material-dropdown';
import {
    getMessageList,
    getUnreadMessageList
} from "../../Action/ActionCreators";
import {
    showLoading,
    resetState,
} from "./MessageAction";
import SocketIOClient from 'socket.io-client';
const window = Dimensions.get('window');
var UserID = '';
var messageTabListData = [];
var messageTabListDataBackUp = [];
let ref;
class MessagesScreen extends Component {
    constructor(props) {
        super(props);
        // this.socket = SocketIOClient(API.CHAT_CONNECTION_URL, { transports: ['websocket'] });
        //use your own local ip
        this.socket = SocketIOClient(API.CHAT_CONNECTION_URL, { transports: ['websocket'] });
        console.log(this.socket, "this.socket")
        ref = this;
        this.socket.open();
        this.state = {
            isTabSelected: 2,
            messageList: [],
            messageTabListData: [],
            messageData: [],
            showLoading: true,
            changes: true
        };

        this.socket.on('getAppliedUsersRes', (messages) => {
            this.setState({ users: messages })
        });



        this.socket.emit('channel1', 'Hi server'); // emits 'hi server' to your server

        // Listens to channel2 and display the data recieved
        this.socket.on('channel1', (data) => {

        });
    }


    componentDidUpdate() {
        this.onMessageListSuccess();
        this.onUnreadMessageSuccess();

    }

    componentWillUnmount() {
        messageTabListData = [];
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
    SearchFilterFunction(text) {

        // const newData = this.state.messageList.filter(function (item) {

        //     const itemData = item.full_name.toUpperCase()
        //     const textData = text.toUpperCase()

        //     return itemData.indexOf(textData) > -1
        // })

        // // this.setState({
        // //     messageTabListData: newData,
        // //     messageData: newData,
        // // })
        // this.setState({
        //     messageTabListData: newData,
        //     changes: false
        // })
        const newData = this.state.messageTabListDataBackUp.filter(function (item) {
            const itemData = item.full_name.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        messageTabListData = newData
        this.setState({ messageTabListData: newData })
    }

    componentWillMount() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                UserID = userData.data._id;

                this.socket.emit('addUser', { id: UserID });
                this.socket.emit("getAppliedUsers", UserID);
            }
        }).done();
        this.getMessageListRequest();
        this.callGetUnreadMessage();

    }

    componentDidMount() {

    }

    _goChat(receiver, emitter, socket, userName, userPic) {
        Actions.Chat({ receiver, emitter, socket, userName, userPic, onSend: this.getMessageListRequest.bind(this) });
    }

    getMessageListRequest() {

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
                this.props.getMessageList(authToken, postData);
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
    onMessageListSuccess() {
        if (this.props.messageReducer.messageListRes != '') {
            if (this.props.messageReducer.messageListRes.code == 200) {

                this.setState({
                    messageList: this.props.messageReducer.messageListRes.data,
                    messageData: this.props.messageReducer.messageListRes.data
                });

                if (this.state.changes) {
                    this.prepareDataForMessageTab()
                }
            }
            else {
                alert(this.props.messageReducer.messageListRes.message);
            }
        }
        this.props.resetState();
    }
    onAllTabClick() {

        this.setState({ isTabSelected: 1 });
    }
    onMessagesTabClick() {
        this.prepareDataForMessageTab();
        this.setState({ isTabSelected: 2 });

    }
    onThreadsTabClick() {

        this.setState({ isTabSelected: 3 });
    }
    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.MESSAGES}</Text>
                {/* <TouchableOpacity style={CommonStyles.navPlusImageView} >
                    <View>
                        <Image source={ImagePath.PLUS_ICON} />
                    </View>
                </TouchableOpacity> */}

            </View>
        );
    }

    renderImageItem(item, index) {
        return (
            <Image source={{ uri: item.url }} style={MessagesScreenStyle.userListImageStyle} />
        );
    }
    async prepareDataForMessageTab() {
        messageTabListData = [];
        await this.state.messageList.map(async (data, index) => {
            if (this.state.messageList[index].chat_message != '') {
                await messageTabListData.push(this.state.messageList[index]);
                await messageTabListDataBackUp.push(this.state.messageList[index]);
            }
        })
        this.setState({ messageTabListData: this.state.messageList, messageTabListDataBackUp: this.state.messageList, showLoading: false })
    }
    renderItem({ item, index }) {

        var userImage = API.USER_IMAGE_PATH + item.image;
        var imagePath = item.image ? item.iamge : '';
        var id = item._id ? item._id : '';
        var _goChat = ref._goChat.bind(ref);
        var userName = item.firstname ? item.firstname + ' ' + item.lastname : '';
        var chat_message = item.chat_message ? item.chat_message : '';
        var chat_time = item.chat_time ? item.chat_time : '';

        return (
            <TouchableOpacity activeOpacity={0} underlayColor="#FFFFFF" style={MessagesScreenStyle.listContainerStyle} onPress={() => _goChat(id, UserID, ref.socket, userName, userImage)}>

                <View style={MessagesScreenStyle.listContainerStyle} >

                    <View style={MessagesScreenStyle.imageContainerStyle}>
                        {
                            imagePath != '' ? <Image source={{ uri: userImage }} style={MessagesScreenStyle.userImageStyle} />
                                :
                                <View style={MessagesScreenStyle.emptyUserListImageStyle}>
                                    <Text style={MessagesScreenStyle.initialTextStyle}>{(item.firstname && item.firstname.charAt(0).toUpperCase()) + ' ' + (item.lastname && item.lastname.charAt(0).toUpperCase())}</Text>
                                </View>
                        }
                        {item.is_online ?
                            <View style={MessagesScreenStyle.onLineStatusViewStyle} />
                            :
                            <View style={MessagesScreenStyle.statusViewStyle} />
                        }

                    </View>

                    <View>
                        <View style={MessagesScreenStyle.detailTitleContainerStyle}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text numberOfLines={1} style={MessagesScreenStyle.detailTitleTextStyle}>{item.firstname + ' ' + item.lastname}</Text>
                                {/* <Text numberOfLines={1} style={MessagesScreenStyle.messageTimeTextStyle}>{chat_time == '' ? '' : chat_time}</Text> */}
                                <Text numberOfLines={1} style={MessagesScreenStyle.messageTimeTextStyle}>{Moment(item.created).fromNow()}</Text>
                            </View>
                        </View>
                        <Text numberOfLines={2} style={MessagesScreenStyle.detailTextStyle}>{chat_message}</Text>
                        {/* <Text style={MessagesScreenStyle.categoryTextStyle}>Request ID : 100923824</Text> */}
                    </View>

                </View>

            </TouchableOpacity>
        );
    }


    render() {

        return (
            <View style={CommonStyles.listMainContainerStyle}>
                {this.navBar()}

                <View style={MessagesScreenStyle.searchViewStyle}>
                    <Image source={ImagePath.SEARCH_ICON} style={MessagesScreenStyle.searchImageStyle} />
                    <TextInput
                        placeholder={Strings.SEARCH_MESSAGES}
                        autoCorrect={false}
                        underlineColorAndroid={Colors.TRANSPARENT}
                        style={MessagesScreenStyle.searchTextInputStyle}
                        onChangeText={this.SearchFilterFunction.bind(this)}

                    />
                </View>
                {/* <View style={MessagesScreenStyle.tabContainerStyle}>

                    <TouchableOpacity onPress={() => this.onAllTabClick()} >


                        <View>
                            <View style={MessagesScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 1) ? MessagesScreenStyle.tabLabelTextStyle : MessagesScreenStyle.tabLabelDiselectTextStyle}>{Strings.ALL}</Text>
                            </View>
                            {(this.state.isTabSelected == 1) ? <View style={MessagesScreenStyle.tabIndicatorStyle}></View> : <View style={MessagesScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>


                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onMessagesTabClick()}>
                        <View>
                            <View style={MessagesScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 2) ? MessagesScreenStyle.tabLabelTextStyle : MessagesScreenStyle.tabLabelDiselectTextStyle}>{Strings.MESSAGES}</Text>
                            </View>
                            {(this.state.isTabSelected == 2) ? <View style={MessagesScreenStyle.tabIndicatorStyle}></View> : <View style={MessagesScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>
                    </TouchableOpacity> */}

                {/* <TouchableOpacity onPress={() => this.onThreadsTabClick()}>
                        <View>
                            <View style={MessagesScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 3) ? MessagesScreenStyle.tabLabelTextStyle : MessagesScreenStyle.tabLabelDiselectTextStyle}>{Strings.THREADS}</Text>
                            </View>
                            {(this.state.isTabSelected == 3) ? <View style={MessagesScreenStyle.tabIndicatorStyle}></View> : <View style={MessagesScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>
                    </TouchableOpacity> */}
                {/* </View> */}



                {/* {
                    this.state.messageData.length > 0 && this.state.isTabSelected == 1 ?

                        <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                            data={this.state.messageData}
                            renderItem={this.renderItem}
                            extraData={this.state} />
                        :
                        null

                } */}

                {
                    this.state.messageTabListData.length > 0 && this.state.isTabSelected == 2 ?

                        <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                            data={this.state.messageTabListData}
                            renderItem={this.renderItem}
                            extraData={this.state} />
                        :
                        <View style={{ flex: 1, justifyContent: 'center', marginTop: window.height * 0.02 }}>
                            <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.NO_MESSAGE_FOUND}</Text>
                        </View>

                }

                {
                    this.state.showLoading ?
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
        messageReducer: state.messageReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getMessageList,
        showLoading,
        getUnreadMessageList,
        resetState,
    }

)(MessagesScreen);
