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
    AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import NotificationSettingScreenStyle from './NotificationSettingScreenStyle';
import CheckBox from 'react-native-checkbox';
import * as Progress from 'react-native-progress';

import {
    changeNotificationSetting,
    getNotificationStatusAction
} from "../../../Action/ActionCreators";

import {
    showLoading,
    resetState,
    clearResponse,
} from "./NotificationSettingAction";

var postData = {};


class NotificationSettingScreen extends Component {
    constructor() {
        super();
        this.state = {
            isNotification: false,
            authToken: '',
            userId: '',
        };
    }

    componentDidUpdate() {
        this.onChangeNotificationSuccess();
        this.onNotificationStatusSuccess();
    }


    componentWillMount() {
        this.getUserDetails();
    }


    getUserDetails() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                this.setState({ isNotification: userData.data.flag });
                this.setState({ authToken: userData.token });
                this.setState({ userId: userData.data._id });
                postData = {
                    user_id: this.state.userId,
                }
                this.props.getNotificationStatusAction(this.state.authToken, postData)
            }
        }).done();
    }


    onCheckBoxClick() {

        if (this.state.isNotification) {

            this.setState({ isNotification: false });

        }
        else {

            this.setState({ isNotification: true });
        }

        postData = {
            user_id: this.state.userId,
            status: !this.state.isNotification

            // chat_notification: this.state.isNotification,
            // appointment_notification: this.state.isNotification,
            // email_notification: this.state.isNotification,
            // sms_notification: this.state.isNotification
        };
        this.props.showLoading();
        console.log(postData, "postDatapostData");

        this.props.changeNotificationSetting(this.state.authToken, postData);
    }
    onNotificationStatusSuccess() {

        if (this.props.notificationSettingReducer.notificationStatus) {
            if (this.props.notificationSettingReducer.notificationStatus != '') {
                if (this.props.notificationSettingReducer.notificationStatus.code == 200) {
                    console.log(this.props.notificationSettingReducer.notificationStatus.data, "this.props.notificationSettingReducer.notificationStatus.data")
                    this.setState({ isNotification: this.props.notificationSettingReducer.notificationStatus.data && this.props.notificationSettingReducer.notificationStatus.data.status })
                }
                else {
                    // alert(this.props.notificationSettingReducer.notificationRes.message);
                }
                this.props.resetState();
                this.props.clearResponse();
            }
        }
    }
    onChangeNotificationSuccess() {

        if (this.props.notificationSettingReducer.notificationRes != '') {

            if (this.props.notificationSettingReducer.notificationRes.code == 200) {

                //AsyncStorage.setItem("SyncittUserProfileInfo", JSON.stringify(this.props.notificationSettingReducer.notificationRes));

            }
            else {
                // alert(this.props.notificationSettingReducer.notificationRes.message);
            }
            this.props.resetState();
            this.props.clearResponse();
        }
    }


    render() {

        return (
            <View style={NotificationSettingScreenStyle.settingContainerStyle}>

                <CheckBox
                    label={Strings.NOTIFICATION_ALERT}
                    labelBefore={Strings.NOTIFICATION_ALERT}
                    labelStyle={NotificationSettingScreenStyle.textStyle}
                    checked={this.state.isNotification}
                    onChange={this.onCheckBoxClick.bind(this)}
                    checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                    uncheckedImage={ImagePath.UNCHECK}

                />

                {   //23 Nov
                    this.props.notificationSettingReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                        </View>
                        : null
                    //
                }
            </View>

        );
    }
}

function mapStateToProps(state) {

    return {
        notificationSettingReducer: state.notificationSettingReducer
    }
}

export default connect(
    mapStateToProps,
    {
        changeNotificationSetting,
        showLoading,
        getNotificationStatusAction,
        resetState,
        clearResponse,
    }

)(NotificationSettingScreen);
