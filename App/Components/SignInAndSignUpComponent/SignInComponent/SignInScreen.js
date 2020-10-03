import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Image,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
    Platform,
    TextInput,
    ScrollView,
    AsyncStorage,
    ImageEditor,
} from 'react-native';

import {
    userLogin,
} from "../../../Action/ActionCreators";

import {
    loginUserNameChanged,
    loginPasswordChanged,
    showLoading,
    resetState,
    clearResponse
} from "./SignInAction";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import SignInStyle from './SignInScreenStyle';
import { TextField } from 'react-native-material-textfield';
// import MaterialTextInput from 'react-native-material-textinput';
import CheckBox from 'react-native-checkbox';
import * as Progress from 'react-native-progress';
import { validateEmail } from '../../../Constants/CommonFunctions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DeviceInfo from 'react-native-device-info';
var postData = {};

class SignInScreen extends Component {

    constructor() {
        super();
        this.state = {
            isKeepSignedIn: false,
            isPasswordVisible: true,
            errorMsg: '',
            errorOnTextField: '',

        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onLoginSuccess();
    }

    componentWillUnmount() {

    }

    onCheckBoxClick() {

        if (this.state.isKeepSignedIn) {

            this.setState({ isKeepSignedIn: false });
        }
        else {

            this.setState({ isKeepSignedIn: true });
        }
    }

    onPasswordVisiblityClick() {

        if (this.state.isPasswordVisible) {

            this.setState({ isPasswordVisible: false });
        }
        else {

            this.setState({ isPasswordVisible: true });
        }
    }

    onForgotPasswordClick() {

        Actions.ResetPasswordScreen();
    }
    onUserNameChange(text) {

        this.props.loginUserNameChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onPasswordChange(text) {

        this.props.loginPasswordChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }
    onSingInClick() {

        if (this.props.signInReducer.userName.trim() == '') {

            this.setState({ errorMsg: Strings.ERROR_EMPTY_EMAIL });
            this.setState({ errorOnTextField: 0 });
        }
        else if (!validateEmail(this.props.signInReducer.userName)) {

            this.setState({ errorMsg: Strings.ERROR_INVALID_EMAIL });
            this.setState({ errorOnTextField: 0 });
        }
        else if (this.props.signInReducer.password.trim() == '') {

            this.setState({ errorMsg: Strings.ERROR_EMPTY_PASSWORD });
            this.setState({ errorOnTextField: 1 });
        }
        else {

            postData = {
                email: this.props.signInReducer.userName,
                password: this.props.signInReducer.password,
                device_token: "fddsfsdfsf",
                device_type: Platform.OS,
                uuid: DeviceInfo.getUniqueId(),
                platform: Platform.OS,
                model: DeviceInfo.getModel()

            };
            this.props.showLoading();
            this.props.userLogin(postData);
        }
    }
    onLoginSuccess() {

        if (this.props.signInReducer.loginRes != '') {
            if (this.props.signInReducer.loginRes.code == 200) {

                if (this.props.signInReducer.loginRes.token != '') {
                    console.log("User Response : ",this.props.signInReducer.loginRes)
                    AsyncStorage.setItem("SyncittUserInfo", JSON.stringify(this.props.signInReducer.loginRes));
                    AsyncStorage.setItem("roleId", this.props.signInReducer.loginRes.data.role_id);
                    AsyncStorage.setItem("KeepSignedIn", this.state.isKeepSignedIn + '');
                    console.log(this.props, "this.propsthis.props")
                    if (this.props.isBackToTrader) {
                        Actions.pop()
                    } else {
                        Actions.ProceedToDashboardScreen();
                    }
                    this.props.resetState();
                }
            }
            else {

                alert(this.props.signInReducer.loginRes.message);
                this.props.clearResponse();
            }
        }
    }

    render() {


        return (

            <View style={CommonStyles.container}>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={SignInStyle.scrollViewContainerStyle}>
                    <View>

                        <TextField
                            // label={Strings.EMAIL_ADDRESS}
                            // labelColor={Colors.WHITE}
                            // activeColor={Colors.WHITE}
                            // color={Colors.WHITE}
                            // fontSize={18}
                            // marginTop={60}
                            // style={{ backgroundColor: 'transparent' }}
                            // labelActiveTop={-30}
                            // underlineColor={Colors.WHITE}
                            // underlineActiveColor={Colors.WHITE}
                            // underlineHeight={0.5}
                            // underlineActiveHeight={0.5}
                            // autoCapitalize='none'
                            // keyboardType='email-address'
                            // autoCorrect={false}
                            // underlineColorAndroid='transparent'
                            // returnKeyType='next'
                            // onChangeText={this.onUserNameChange.bind(this)}
                            // value={this.props.signInReducer.userName}
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
                            returnKeyType='next'
                            onChangeText={this.onUserNameChange.bind(this)}
                            value={this.props.signInReducer.userName}
                        />
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 0 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                        <View>
                            {/* <TextField

                                // label={Strings.PASSWORD}
                                // labelColor={Colors.WHITE}
                                // activeColor={Colors.WHITE}
                                // color={Colors.WHITE}
                                // fontSize={18}
                                // marginTop={25}
                                // labelActiveTop={-30}
                                // underlineHeight={0.5}
                                // underlineActiveHeight={0.5}
                                // underlineColor={Colors.WHITE}
                                // underlineActiveColor={Colors.WHITE}
                                // autoCapitalize='none'
                                // autoCorrect={false}
                                // secureTextEntry={this.state.isPasswordVisible ? true : false}
                                // underlineColorAndroid='transparent'
                                // returnKeyType='done'
                                // onChangeText={this.onPasswordChange.bind(this)}
                                // value={this.props.signInReducer.password}


                                label={Strings.PASSWORD}
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
                                onChangeText={this.onPasswordChange.bind(this)}
                                value={this.props.signInReducer.password}
                                secureTextEntry={true}

                                // secureTextEntry={this.state.isPasswordVisible ? true : false}
                            /> */}
                            <TextField
                                ref='refPass'
                                label={Strings.PASSWORD}
                                textColor={Colors.WHITE}
                                baseColor={Colors.WHITE}
                                tintColor={Colors.WHITE}
                                fontSize={18}
                                labelFontSize={16}

                                underlineColorAndroid='transparent'
                                secureTextEntry={this.state.isPasswordVisible ? true : false}
                                returnKeyType='next'
                                autoCapitalize='none'
                                autoCorrect={false}
                                onChangeText={this.onPasswordChange.bind(this)}
                                value={this.props.signInReducer.password}
                                // onSubmitEditing={(event) => { this.refs.refConfPass.focus(); }}
                            />


                            {
                                this.props.signInReducer.password.length > 0
                                    ?
                                    <TouchableOpacity onPress={() => this.onPasswordVisiblityClick()} style={SignInStyle.passwordVisibiltyViewStyle}>
                                        <View>
                                            <Text style={SignInStyle.textStyle}>{this.state.isPasswordVisible ? Strings.PASSWORD_SHOW : Strings.PASSWORD_HIDE}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    null

                            }
                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }

                        </View>
                        <TouchableOpacity onPress={() => this.onForgotPasswordClick()}>
                            <Text style={SignInStyle.forgotTextStyle}>{Strings.FORGOT_PASSWORD}</Text>
                        </TouchableOpacity>
                        <View style={SignInStyle.signedInCheckBoxViewStyle}>
                            <CheckBox
                                label={Strings.KEEP_ME_SIGNED_IN}
                                labelStyle={SignInStyle.textStyle}
                                checked={this.state.isKeepSignedIn}
                                onChange={this.onCheckBoxClick.bind(this)}
                                checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                                uncheckedImage={ImagePath.CHECK_BOX_OFF}

                            />

                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <TouchableOpacity style={CommonStyles.skyBlueButtonStyle} onPress={() => this.onSingInClick()}>
                    <View>
                        <Text style={CommonStyles.buttonTextStyle}>{Strings.SIGNIN}</Text>
                    </View>
                </TouchableOpacity>
                {   //23 Nov
                    this.props.signInReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.PROGRESS1, Colors.PROGRESS2, Colors.PROGRESS3]} />
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
        signInReducer: state.signInReducer
    }
}

export default connect(
    mapStateToProps,
    {
        userLogin,
        loginUserNameChanged,
        loginPasswordChanged,
        showLoading,
        resetState,
        clearResponse
    }

)(SignInScreen)

