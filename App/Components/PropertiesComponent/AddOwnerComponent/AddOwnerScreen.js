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
import AddOwnerScreenStyle from './AddOwnerScreenStyle';
import { validateEmail } from '../../../Constants/CommonFunctions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    addPropertyOwner,
} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,
    clearAddOwnerRes,
    propertyOwnerFirstNameChanged,
    propertyOwnerLastNameChanged,
    propertyOwnerEmailChanged,
    propertyOwnerMobileChanged,
   
} from "./AddOwnerAction";

import {

    updateScene,

} from "../AddPropertyComponent/AddPropertyAction";

import * as Progress from 'react-native-progress';
var errorMsg = [];

class AddOwnerScreen extends Component {
    constructor() {
        super();
        this.state = {

            propertyAdd: '',
            errorMsg: '',
            errorOnTextField: '',
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onAddOwnerSuccess();
    }

    componentWillUnmount() {

    }
    componentWillMount() {

    }

    closeAddProperty() {

        Actions.pop();
    }

    onFirstNameChanged(text) {

        this.props.propertyOwnerFirstNameChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }
    onLastNameChanged(text) {

        this.props.propertyOwnerLastNameChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }
    onEmailChanged(text) {

        this.props.propertyOwnerEmailChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });

    }
    onPhoneNumberChanged(text) {

        this.props.propertyOwnerMobileChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    callAddOwnerAPI() {

        if (this.props.addPropertyOwnerReducer.propertyOwnerFirstName.trim() == '') {
            errorMsg.push(Strings.ENTER_TENANT_FIRST_NAME);
            this.setState({ errorMsg: Strings.ERROR_EMPTY_FIRST_NAME });
            this.setState({ errorOnTextField: 0 });
        } else
            if (this.props.addPropertyOwnerReducer.propertyOwnerLastName.trim() == '') {
                errorMsg.push(Strings.ENTER_TENANT_LAST_NAME);
                this.setState({ errorMsg: Strings.ERROR_EMPTY_LAST_NAME });
                this.setState({ errorOnTextField: 1 });
            }
            else if (!validateEmail(this.props.addPropertyOwnerReducer.propertyOwnerEmail)) {
                errorMsg.push(Strings.ERROR_INVALID_EMAIL);
                this.setState({ errorMsg: Strings.ERROR_INVALID_EMAIL });
                this.setState({ errorOnTextField: 2 });
            } else

                if (this.props.addPropertyOwnerReducer.propertyOwnerMobile.trim() == '') {
                    errorMsg.push(Strings.ENTER_TENANT_PHONE);
                    this.setState({ errorMsg: Strings.ERROR_EMPTY_PHONE_NUMBER });
                    this.setState({ errorOnTextField: 3 });
                } else {

                    AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                        if (value) {

                            var userData = JSON.parse(value);
                            var authToken = userData.token;
                            var postData = {
                                agency_id : userData.data.agency_id,
                                created_by: userData.data._id,
                                firstname: this.props.addPropertyOwnerReducer.propertyOwnerFirstName,
                                lastname: this.props.addPropertyOwnerReducer.propertyOwnerLastName,
                                email: this.props.addPropertyOwnerReducer.propertyOwnerEmail,
                                mobile_no: this.props.addPropertyOwnerReducer.propertyOwnerMobile,

                            }
                            
                            this.props.showLoading();
                            this.props.addPropertyOwner(authToken, postData);
                        }
                    }).done();
                }
    }

    onAddOwnerSuccess() {
        if (this.props.addPropertyOwnerReducer.addOwnerRes != '') {
            if (this.props.addPropertyOwnerReducer.addOwnerRes.code == 200) {

                Actions.pop();
                this.props.updateScene('updateOwner')
                // Actions.refresh();

            }
            else {

                alert(this.props.addPropertyOwnerReducer.addOwnerRes.message);
            }
            this.props.clearAddOwnerRes();
        }
    }


    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.ADD_NEW_OWNER_TITLE}</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView} >
                    <View>
                        <Image source={ImagePath.DRAWER_CROSS_ICON} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {


        return (
            <View style={{ flex: 1, backgroundColor: Colors.SETTING_SCREEN_BG_COLOR }}>
                {this.navBar()}

                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={AddOwnerScreenStyle.scrollViewContainerStyle}>


                    <View style={AddOwnerScreenStyle.addPropertyInputContainer}>



                        <Text style={AddOwnerScreenStyle.labelStyle}>
                            {Strings.FIRST_NAME}
                        </Text>
                        <TextInput style={AddOwnerScreenStyle.inputTextStyle}
                            autoCapitalize='words'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            returnKeyType='next'
                            onChangeText={this.onFirstNameChanged.bind(this)}
                            value={this.props.addPropertyOwnerReducer.propertyOwnerFirstName}
                            onSubmitEditing={(event)=>{this.refs.refLastName.focus();}}
                        />
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 0 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }

                        <Text style={AddOwnerScreenStyle.labelStyle}>
                            {Strings.LAST_NAME}
                        </Text>
                        <TextInput 
                            ref='refLastName'
                            style={AddOwnerScreenStyle.inputTextStyle}
                            autoCapitalize='words'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            returnKeyType='next'
                            onChangeText={this.onLastNameChanged.bind(this)}
                            value={this.props.addPropertyOwnerReducer.propertyOwnerLastName}
                            onSubmitEditing={(event)=>{this.refs.refPhone.focus();}}
                        />
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }


                        <Text style={AddOwnerScreenStyle.labelStyle}>
                            {Strings.PHONE_NUMBER}
                        </Text>

                        <TextInput
                            ref='refPhone'
                            style={AddOwnerScreenStyle.inputTextStyle}
                            autoCapitalize='none'
                            keyboardType='number-pad'
                            autoCorrect={false}
                            maxLength={10}
                            underlineColorAndroid='transparent'
                            returnKeyType='done'
                            onChangeText={this.onPhoneNumberChanged.bind(this)}
                            value={this.props.addPropertyOwnerReducer.propertyOwnerMobile}
                            onSubmitEditing={(event)=>{this.refs.refEmail.focus();}}
                        />
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 2 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }

                        <Text style={AddOwnerScreenStyle.labelStyle}>
                            {Strings.EMAIL_ADDRESS}
                        </Text>
                        <TextInput 
                            ref='refEmail'
                            style={AddOwnerScreenStyle.inputTextStyle}
                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            returnKeyType='done'
                            keyboardType='email-address'
                            onChangeText={this.onEmailChanged.bind(this)}
                            value={this.props.addPropertyOwnerReducer.propertyOwnerEmail}
                        />

                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 3 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }

                    </View>
                </KeyboardAwareScrollView>
                <View style={AddOwnerScreenStyle.buttonContainerStyle}>
                    <TouchableOpacity onPress={() => this.callAddOwnerAPI()}>
                        <View style={AddOwnerScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={AddOwnerScreenStyle.proceedButtonTextStyle}>
                                {Strings.ADD_NEW_OWNER_TITLE}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {

                    this.props.addPropertyOwnerReducer.isScreenLoading ?
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
        addPropertyOwnerReducer: state.addPropertyOwnerReducer,
        addPropertyReducer:state.addPropertyReducer
    }
}

export default connect(
    mapStateToProps,
    {
        updateScene,
        showLoading,
        resetState,
        clearAddOwnerRes,
        addPropertyOwner,
        propertyOwnerFirstNameChanged,
        propertyOwnerLastNameChanged,
        propertyOwnerEmailChanged,
        propertyOwnerMobileChanged
    }

)(AddOwnerScreen);



