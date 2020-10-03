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

import {
    forgotPassword,

} from "../../Action/ActionCreators";
import {
    forgotEmailChanged,
    showLoading,
    resetState
} from "./ForgotPasswordAction";
import { TextField } from 'react-native-material-textfield';

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import MaterialTextInput from 'react-native-material-textinput';
import ResetPasswordStyle from './ResetPasswordScreenStyle';
import * as Progress from 'react-native-progress';
import { validateEmail } from '../../Constants/CommonFunctions';
var postData = {};

class ResetPasswordScreen extends Component {
    constructor() {
        super();
        this.state = {
            errorMsg: '',
            errorOnTextField: '',
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onForgotPassSuccess();
    }

    componentWillUnmount() {

    }

    onEmailChange(text) {

        this.props.forgotEmailChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    callForgotPassRequest() {

        if (this.props.forgotPasswordReducer.email.trim() == '') {

            this.setState({ errorMsg: Strings.ERROR_EMPTY_EMAIL });
            this.setState({ errorOnTextField: 0 });
        }
        else if (!validateEmail(this.props.forgotPasswordReducer.email)) {

            this.setState({ errorMsg: Strings.ERROR_INVALID_EMAIL });
            this.setState({ errorOnTextField: 0 });
        }
        else {

            postData = {
                email: this.props.forgotPasswordReducer.email,
            };
            this.props.showLoading();
            AsyncStorage.setItem("Email_ID", this.props.forgotPasswordReducer.email);
            this.props.forgotPassword(postData);
        }
    }

    onForgotPassSuccess() {
        if (this.props.forgotPasswordReducer.resData != '') {

            if (this.props.forgotPasswordReducer.resData.code == 200) {
                //alert(this.props.forgotPasswordReducer.resData.message);
                Actions.ResendPasswordScreen();
                this.props.resetState();
            }
            else {
                alert(this.props.forgotPasswordReducer.resData.message);
                this.props.resetState();
            }
        }
    }

    onBackButtonClick() {
        Actions.pop();
    }


    render() {

        return (
            <View style={CommonStyles.mainContainer}>
                <Image source={ImagePath.CREATE_ACCOUNT_BG} style={CommonStyles.mainContainer} />
                <View style={CommonStyles.container}>
                    <View style={ResetPasswordStyle.forgotPasswordViewStyle}>
                        <TouchableOpacity style={ResetPasswordStyle.backButtonStyle} onPress={() => this.onBackButtonClick()}>

                            <Image source={ImagePath.BACK_ICON} />

                        </TouchableOpacity>
                        <Text style={CommonStyles.resetPasswordTitleStyle}>{Strings.PASSWORD_RESET}</Text>
                        <Text style={CommonStyles.resetPasswordMessageStyle}>{Strings.PASSWORD_RESET_INSTRUCTION_MESSAGE}</Text>
                        {/* <MaterialTextInput
                            label={Strings.EMAIL_ADDRESS}
                            labelColor={Colors.WHITE}
                            activeColor={Colors.WHITE}
                            color={Colors.WHITE}
                            fontSize={18}
                            marginTop={40}
                            labelActiveTop={-30}
                            underlineColor={Colors.WHITE}
                            underlineActiveColor={Colors.WHITE}
                            autoCapitalize='none'
                            keyboardType='email-address'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            returnKeyType='done'
                            onChangeText={this.onEmailChange.bind(this)}
                            value={this.props.forgotPasswordReducer.email}
                        /> */}
                        <TextField

                            label={Strings.EMAIL_ADDRESS}
                            textColor={Colors.WHITE}
                            baseColor={Colors.WHITE}
                            tintColor={Colors.WHITE}
                            fontSize={18}
                            labelFontSize={16}
                            autoCorrect={false}
                            autoCapitalize='none'
                            keyboardType='email-address'
                            underlineColorAndroid='transparent'
                            returnKeyType='done'
                            onChangeText={this.onEmailChange.bind(this)}
                            value={this.props.forgotPasswordReducer.email}
                        />
                    </View>
                    {
                        this.state.errorMsg != '' && this.state.errorOnTextField == 0 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                    }
                    <TouchableOpacity style={CommonStyles.skyBlueButtonStyle} onPress={() => this.callForgotPassRequest()}>
                        <View >
                            <Text style={CommonStyles.buttonTextStyle}>{Strings.SEND}</Text>
                        </View>
                    </TouchableOpacity>
                    {this.props.forgotPasswordReducer.isScreenLoading ?
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
        forgotPasswordReducer: state.forgotPasswordReducer
    }
}

export default connect(
    mapStateToProps,
    {
        forgotPassword,
        forgotEmailChanged,
        showLoading,
        resetState
    }

)(ResetPasswordScreen)

