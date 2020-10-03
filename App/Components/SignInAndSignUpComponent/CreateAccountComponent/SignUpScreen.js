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

    ScrollView,
    AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import SignUpStyle from './SignupScreenStyle';
import MaterialTextInput from 'react-native-material-textinput';
import { TextField } from 'react-native-material-textfield';

import CheckBox from 'react-native-checkbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CreateAccountComponent from './CreateAccountScreen';
import { validateEmail } from '../../../Constants/CommonFunctions';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';
import {
    userRegistration,
} from "../../../Action/ActionCreators";

import {
    firstNameChanged,
    lastNameChanged,
    emailChanged,
    phoneNumberChanged,
    signUpPasswordChanged,
    confirmPasswordChanged,
    showLoading,
    resetState,
    userType,
    clearResponse
} from "./SignUpAction";

var signUpPostData = {};

class SignUpScreen extends Component {
    constructor() {
        super();
        this.state = {
            firstName: '',
            isAgree: false,
            userType: '',
            errorMsg: '',
            errorOnTextField: '',
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onSignUpSuccess();
    }

    componentWillUnmount() {

    }

    onCheckBoxClick() {

        if (this.state.isAgree) {

            this.setState({ isAgree: false });
        }
        else {

            this.setState({ isAgree: true });
        }
    }


    onFirstNameChange(text) {

        this.props.firstNameChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onLastNameChange(text) {

        this.props.lastNameChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onEmailChange(text) {

        this.props.emailChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onPhoneNumberChange(text) {

        this.props.phoneNumberChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });


    }

    onPasswordChange(text) {

        this.props.signUpPasswordChanged(text);
        if (text == '') {
            this.setState({ errorMsg: '' });
            this.setState({ errorOnTextField: '' });
        }
        else if (text.length < 6) {
            this.setState({ errorMsg: Strings.ERROR_PASSWORD_LESS_THAN });
            this.setState({ errorOnTextField: 4 });
        }
        else if (text.search(/[0-9]/) < 0) {
            this.setState({ errorMsg: Strings.ERROR_PASSWORD_DIGIT });
            this.setState({ errorOnTextField: 4 });

        }
        else if (text.search(/[A-Z]/) < 0) {

            this.setState({ errorMsg: Strings.ERROR_PASSWORD_UPPERCASE });
            this.setState({ errorOnTextField: 4 });
        }
        else if (text.search(/[a-z]/) < 0) {

            this.setState({ errorMsg: Strings.ERROR_PASSWORD_LOWECASE });
            this.setState({ errorOnTextField: 4 });
        }
        else if (text.search(/[!@#\$%\^&\*.,]/) < 0) {
            this.setState({ errorMsg: Strings.ERROR_PASSWORD_SPECIAL_CHAR });
            this.setState({ errorOnTextField: 4 });
        }
        else {
            this.setState({ errorMsg: '' });
            this.setState({ errorOnTextField: '' });
        }
    }

    onConfirmPasswordChange(text) {

        this.props.confirmPasswordChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }


    onSingUpClick() {

        if (this.props.signUpReducer.firstName.trim() == '') {

            this.setState({ errorMsg: Strings.ERROR_EMPTY_FIRST_NAME });
            this.setState({ errorOnTextField: 0 });
        } else if (this.props.signUpReducer.lastName.trim() == '') {

            this.setState({ errorMsg: Strings.ERROR_EMPTY_LAST_NAME });
            this.setState({ errorOnTextField: 1 });
        }
        else if (!validateEmail(this.props.signUpReducer.email)) {

            this.setState({ errorMsg: Strings.ERROR_INVALID_EMAIL });
            this.setState({ errorOnTextField: 2 });
        }

        else if (this.props.signUpReducer.phoneNumber.trim() == '') {

            this.setState({ errorMsg: Strings.ERROR_EMPTY_PHONE_NUMBER });
            this.setState({ errorOnTextField: 3 });
        }

        else if (this.props.signUpReducer.phoneNumber.length != 10) {

            this.setState({ errorMsg: Strings.ERROR_INVALID_PHONE_NUMBER });
            this.setState({ errorOnTextField: 3 });
        }
        else if (this.props.signUpReducer.password.trim() == '') {

            this.setState({ errorMsg: Strings.ERROR_EMPTY_PASSWORD });
            this.setState({ errorOnTextField: 4 });
        }

        else if (this.props.signUpReducer.password.trim() != this.props.signUpReducer.confirmPassword.trim()) {

            this.setState({ errorMsg: Strings.ERROR_MISMATCH_PASSWORD });
            this.setState({ errorOnTextField: 5 });
            this.props.signUpPasswordChanged('');
            this.props.confirmPasswordChanged('');
        }

        else if (this.state.isAgree == false) {
            alert(Strings.ERROR_AGREEMENT);
        }


        else {

            signUpPostData = {

                email: this.props.signUpReducer.email,
                password: this.props.signUpReducer.password,
                firstname: this.props.signUpReducer.firstName,
                lastname: this.props.signUpReducer.lastName,
                mobile_no: this.props.signUpReducer.phoneNumber,
                role_id: this.props.signUpReducer.userTypeVal,
                device_token: 'asdgfgfgfg',
                uuid: DeviceInfo.getUniqueId(),
                platform: Platform.OS,
                model: DeviceInfo.getModel()

            };
            
            this.props.showLoading();
            this.props.userRegistration(signUpPostData);
        }

    }
    onAlertConfirm() {
        Actions.RegistrationScreen({ type: 'reset' });
        this.props.resetState();
    }
    onSignUpSuccess() {
        if (this.props.signUpReducer.signUpResponse != '') {

            if (this.props.signUpReducer.signUpResponse.code == 200) {
                if (this.props.signUpReducer.signUpResponse.message == 'Email already exist.') {
                    alert(this.props.signUpReducer.signUpResponse.message);
                }
                else {
                    AsyncStorage.setItem("SyncittUserInfo", JSON.stringify(this.props.signUpReducer.signUpResponse));
                    Alert.alert(
                        Strings.APP_NAME,
                        Strings.ACTIVE_ACCOUNT_ALERT,
                        [
                            { text: Strings.OK, onPress: () => this.onAlertConfirm() }

                        ],
                        { cancelable: true }
                    )

                }

            }
            else {
                alert(this.props.signUpReducer.signUpResponse.message);
                this.props.clearResponse();
            }


        }
    }



    render() {
        // let { firstName } = this.state

        return (
            <View style={{ flex: 1 }}>
                {
                    (this.props.signUpReducer.userTypeVal == '')
                        ?
                        <CreateAccountComponent />
                        :
                        <View>
                            <View style={{ backgroundColor: 'transparent', marginLeft: 25, marginRight: 25, marginBottom: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>{Strings.YOU_ARE_ALOMOST_DONE}</Text>
                            </View>
                            <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} contentContainerStyle={SignUpStyle.scrollViewContainerStyle}>
                                <View style={{ marginLeft: 25, marginRight: 25 }}>

                                    <TextField
                                        label={Strings.FIRST_NAME}
                                        textColor={Colors.WHITE}
                                        baseColor={Colors.WHITE}
                                        tintColor={Colors.WHITE}
                                        fontSize={18}
                                        labelFontSize={16}
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        returnKeyType='next'
                                        onChangeText={this.onFirstNameChange.bind(this)}
                                        value={this.props.signUpReducer.firstName}
                                        onSubmitEditing={(event) => { this.refs.refLastName.focus(); }}
                                    />

                                    {
                                        this.state.errorMsg != '' && this.state.errorOnTextField == 0 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                                    }

                                    <TextField
                                        ref='refLastName'
                                        label={Strings.LAST_NAME}
                                        textColor={Colors.WHITE}
                                        baseColor={Colors.WHITE}
                                        tintColor={Colors.WHITE}
                                        fontSize={18}
                                        labelFontSize={16}
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        returnKeyType='next'
                                        onChangeText={this.onLastNameChange.bind(this)}
                                        value={this.props.signUpReducer.lastName}
                                        onSubmitEditing={(event) => { this.refs.refPhone.focus(); }}
                                    />
                                    {
                                        this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                                    }


                                    <TextField
                                        ref='refPhone'
                                        label={Strings.PHONE_NUMBER}
                                        textColor={Colors.WHITE}
                                        baseColor={Colors.WHITE}
                                        tintColor={Colors.WHITE}
                                        fontSize={18}
                                        labelFontSize={16}
                                        maxLength={10}
                                        underlineColorAndroid='transparent'
                                        keyboardType='number-pad'
                                        returnKeyType='done'
                                        onChangeText={this.onPhoneNumberChange.bind(this)}
                                        value={this.props.signUpReducer.phoneNumber}
                                        onSubmitEditing={(event) => { this.refs.refEmail.focus(); }}
                                    />

                                    {
                                        this.state.errorMsg != '' && this.state.errorOnTextField == 3 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                                    }

                                    <TextField
                                        ref='refEmail'
                                        label={Strings.EMAIL_ADDRESS}
                                        textColor={Colors.WHITE}
                                        baseColor={Colors.WHITE}
                                        tintColor={Colors.WHITE}
                                        fontSize={18}
                                        labelFontSize={16}
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        keyboardType='email-address'
                                        autoCapitalize='none'
                                        returnKeyType='next'
                                        onChangeText={this.onEmailChange.bind(this)}
                                        value={this.props.signUpReducer.email}
                                        onSubmitEditing={(event) => { this.refs.refPass.focus(); }}
                                    />

                                    {
                                        this.state.errorMsg != '' && this.state.errorOnTextField == 2 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                                    }


                                    <TextField
                                        ref='refPass'
                                        label={Strings.PASSWORD}
                                        textColor={Colors.WHITE}
                                        baseColor={Colors.WHITE}
                                        tintColor={Colors.WHITE}
                                        fontSize={18}
                                        labelFontSize={16}

                                        underlineColorAndroid='transparent'
                                        secureTextEntry={true}
                                        returnKeyType='next'
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        onChangeText={this.onPasswordChange.bind(this)}
                                        value={this.props.signUpReducer.password}
                                        onSubmitEditing={(event) => { this.refs.refConfPass.focus(); }}
                                    />


                                    {
                                        this.state.errorMsg != '' && this.state.errorOnTextField == 4 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                                    }

                                    <TextField
                                        ref='refConfPass'
                                        label={Strings.CONFIRM_PASSWORD}
                                        textColor={Colors.WHITE}
                                        baseColor={Colors.WHITE}
                                        tintColor={Colors.WHITE}
                                        fontSize={18}
                                        labelFontSize={16}

                                        underlineColorAndroid='transparent'
                                        secureTextEntry={true}
                                        returnKeyType='done'
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        onChangeText={this.onConfirmPasswordChange.bind(this)}
                                        value={this.props.signUpReducer.confirmPassword}

                                    />
                                    {
                                        this.state.errorMsg != '' && this.state.errorOnTextField == 5 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                                    }
                                    <View style={SignUpStyle.signUpUserAgreementViewStyle}>
                                        {/* <CheckBox
                                            label=''
                                            checked={this.state.isAgree}
                                            onChange={this.onCheckBoxClick.bind(this)}
                                            checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                                            unCheckedImage={ImagePath.CHECK_BOX_OFF}
                                        /> */}
                                        <CheckBox
                                            label={''}
                                            // labelStyle={SignInStyle.textStyle}
                                            checked={this.state.isKeepSignedIn}
                                            onChange={this.onCheckBoxClick.bind(this)}
                                            checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                                            uncheckedImage={ImagePath.CHECK_BOX_OFF}

                                        />
                                        <Text style={SignUpStyle.agreementTextStyle}>{Strings.SIGN_UP_USER_AGREEMENT}</Text>
                                    </View>
                                </View>


                            </KeyboardAwareScrollView>
                        </View>
                }

                {
                    (this.props.signUpReducer.userTypeVal != '')
                        ?
                        <TouchableOpacity style={CommonStyles.skyBlueButtonStyle} onPress={() => this.onSingUpClick()}>
                            <View>
                                <Text style={CommonStyles.buttonTextStyle}>{Strings.CREATE_ACCOUNT}</Text>
                            </View>
                        </TouchableOpacity> :
                        null
                }
                {

                    this.props.signUpReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.PROGRESS1, Colors.PROGRESS2, Colors.PROGRESS3]} />
                        </View>
                        : null

                }

            </View>



        );
    }
}

function mapStateToProps(state) {
    
    return {
        signUpReducer: state.signUpReducer
    }
}

export default connect(
    mapStateToProps,
    {
        userRegistration,
        firstNameChanged,
        lastNameChanged,
        emailChanged,
        phoneNumberChanged,
        signUpPasswordChanged,
        confirmPasswordChanged,
        showLoading,
        resetState,
        userType,
        clearResponse
    }

)(SignUpScreen)