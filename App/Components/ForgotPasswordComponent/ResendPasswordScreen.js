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
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import ResetPasswordStyle from './ResetPasswordScreenStyle';
import * as Progress from 'react-native-progress';

import {
    resendPassword,

} from "../../Action/ActionCreators";
import {
    showLoading,
    resetState
} from "./ResendPasswordAction";
var postData = {};
var Email_ID;

class ResendPasswordScreen extends Component {
    constructor() {
        super();
        this.state = {

        };
    }

    componentWillMount() {
        AsyncStorage.getItem("Email_ID").then((value) => {
            if (value) {
                Email_ID = value;
                
            }
        }).done();
    }

    navigateRegistrationScreen(type) {
        Actions.RegistrationScreen({ registrationType: type });
    }


    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onForgotPassSuccess();
    }

    componentWillUnmount() {

    }

    callForgotPassRequest() {
        
        postData = {
            email: Email_ID,
        };
        this.props.showLoading();
        this.props.resendPassword(postData);

    }

    onForgotPassSuccess() {
        if (this.props.resendPasswordReducer.resData != '') {

            if (this.props.resendPasswordReducer.resData.code == 200) {
                //alert(this.props.resendPasswordReducer.resData.message);
                Alert.alert(
                    Strings.APP_NAME,
                    this.props.resendPasswordReducer.resData.message,
                    [
                        { text: Strings.OK, onPress: () => this.navigateRegistrationScreen('login') },
                    ],
                    { cancelable: false }
                )
               
                // Actions.ResendPasswordScreen();
                this.props.resetState();
            }
            else {
                alert(this.props.resendPasswordReducer.resData.message);
                this.props.resetState();
            }
        }
    }
    onBackButtonClick() {
        Actions.pop();
    }

    onBackToSignInClick(type) {
        Actions.RegistrationScreen({ registrationType: type });
    }

    render() {

        return (
            <View style={CommonStyles.mainContainer}>
                <Image source={ImagePath.CREATE_ACCOUNT_BG} style={CommonStyles.mainContainer} />
                <View style={CommonStyles.container}>
                    <View style={ResetPasswordStyle.forgotPasswordViewStyle}>
                        <TouchableOpacity style={CommonStyles.backButtonStyle} onPress={() => this.onBackButtonClick()}>
                            <Image source={ImagePath.BACK_ICON} />
                        </TouchableOpacity>
                    </View>
                    <Text style={CommonStyles.resetPasswordTitleStyle}>{Strings.PASSWORD_RESET_TITLE}</Text>
                    <Text style={CommonStyles.resetPasswordMessageStyle}>{Strings.PASSWORD_RESET_MESSAGE}</Text>

                    <TouchableOpacity style={CommonStyles.roundedTransparentButtonStyle} onPress={() => this.callForgotPassRequest()}>

                        <Text style={CommonStyles.buttonTextStyle}>{Strings.RESEND}</Text>

                    </TouchableOpacity>

                    <TouchableOpacity style={CommonStyles.skyBlueButtonStyle} onPress={() => this.onBackToSignInClick('login')}>

                        <Text style={CommonStyles.buttonTextStyle}>{Strings.BACK_TO_SIGNIN}</Text>

                    </TouchableOpacity>
                    {this.props.resendPasswordReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={['#FFFFFF', '#FFFFFF', '#FFFFFF']} />
                        </View>
                        : null
                    }
                </View>

            </View>
        );
    }
}

function mapStateToProps(state) {
    
    return {
        resendPasswordReducer: state.resendPasswordReducer
    }
}
export default connect(
    mapStateToProps,
    {
        resendPassword,
        showLoading,
        resetState
    }

)(ResendPasswordScreen)
