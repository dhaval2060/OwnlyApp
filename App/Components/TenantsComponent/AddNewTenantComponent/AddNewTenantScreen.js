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
    getAgreementByPropertyId,
    getPropertyByAgent,
    addTanent
} from "../../../Action/ActionCreators";
import {
    agreementChanged,
    selectedAgreementId,
    clearAgreementByPropertyId,
    selectedPropertyId,
    showLoading,
    resetState,
    propertyChanged,
    tenantFirstNameChanged,
    tenantLastNameChanged,
    tenantEmailChanged,
    tenantPhoneChanged,
    clearAddTenantRes
} from "./AddTenantAction";

import{

    updateTenantList

} from "../TenantScreenAction";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import AddNewTenantScreenStyle from './AddNewTenantScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
import CheckBox from 'react-native-checkbox';
import Toast, {DURATION} from 'react-native-easy-toast';
import * as Progress from 'react-native-progress';
import { validateEmail } from '../../../Constants/CommonFunctions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
let propertyType = [{
    value: 'Sale',
}, {
    value: 'Rental',
}];

let ownerData = [{
    value: 'Sohil',
}, {
    value: 'Majid',
}];
var errorMsg=[];
class AddNewTenantScreen extends Component {
    constructor() {
        super();
        this.state = {
            isTenantCreatePassword: false,
            isTenantPraivacyPolicy: false,
            propertyAdd: '',
            propertyData:[],
            agreementListData:[],
           
        };
    }

    componentDidUpdate() {
        this.onGetPropertySuccess();
        this.onAddTenantSuccess();
        this.onGetAgreementByIdSuccess();
    }

    componentWillMount() {
        
        this.callGetPropertyList();
    }

    closeAddProperty() {
        Actions.popTo('Dashboard');
    }

    onTenantCreatePassword() {

        if (this.state.isTenantCreatePassword) {

            this.setState({ isTenantCreatePassword: false });
        }
        else {

            this.setState({ isTenantCreatePassword: true });
        }
    }

    onTenantPrivacyPolicy() {

        if (this.state.isTenantPraivacyPolicy) {

            this.setState({ isTenantPraivacyPolicy: false });
        }
        else {

            this.setState({ isTenantPraivacyPolicy: true });
        }
    }

    callGetPropertyList() {
        
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
                
                this.props.getPropertyByAgent(authToken, postData);
            }
        }).done();
    }

    onGetPropertySuccess(){
        if(this.props.addTenantReducer.propertyByAgentRes!=''){
            if(this.props.addTenantReducer.propertyByAgentRes.code==200){
                if(this.props.addTenantReducer.propertyByAgentRes.data.length==0){
                    alert("You can't add new tenant because of you are not associate with any property.");
                    Actions.pop();
                }
                else{
                    this.setState({propertyData:this.preparePropertyDropdownData(this.props.addTenantReducer.propertyByAgentRes.data)});
                }
                
            }
            else{
                alert(this.props.addTenantReducer.propertyByAgentRes.message);
            }
            this.props.resetState();
        }   
    }

    callGetAgreementById() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
              
                this.props.showLoading();
                
                this.props.getAgreementByPropertyId(authToken, this.props.addTenantReducer.tenantPropertyId);
            }
        }).done();
    }

    onGetAgreementByIdSuccess(){

        if(this.props.addTenantReducer.agreementListRes!=''){
            if(this.props.addTenantReducer.agreementListRes.code==200){
             
               this.setState({agreementListData:this.prepareAgreementDropdownData(this.props.addTenantReducer.agreementListRes.data)});  
            }
            else{
                alert(this.props.addTenantReducer.agreementListRes.message);
            }
            this.props.clearAgreementByPropertyId();
        }   
    }

    prepareAgreementDropdownData(agreementData){
        
        var tempArray = agreementData;
        tempArray.map((data, index) => {

           tempArray[index].value = '#'+tempArray[index].agreement_id;
           tempArray[index].id = tempArray[index]._id;
        })
        
        return tempArray;      
    }


    onAddTenantSuccess(){
        if(this.props.addTenantReducer.addTenantRes!=''){
            if(this.props.addTenantReducer.addTenantRes.code==200){
                this.refs.toast.show(this.props.addTenantReducer.addTenantRes.message,DURATION.LENGTH_LONG);
                this.props.updateTenantList('updateTenantList');
                this.confirmationMessage();
               
                // setTimeout(() => {
                //     Actions.pop();
                // }, 200);
                
            }
            else{
                alert(this.props.addTenantReducer.addTenantRes.message);
            }
            this.props.clearAddTenantRes();
        }   
    }

    confirmationMessage() {
        Alert.alert(
            Strings.APP_NAME,
            Strings.SUCCESS_TENANT_MESSAGE,
            [
                { text: Strings.OK_TITLE, onPress: () =>  Actions.pop()}
                
            ],
            { cancelable: false }
           
        )
    }


    preparePropertyDropdownData(propertyData){
        var tempArray = propertyData;
        tempArray.map((data, index) => {

           tempArray[index].value = tempArray[index].address;
           tempArray[index].id = tempArray[index]._id;
        })
        
        return tempArray;      
    }

    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.ADD_NEW_TENANT_TITLE}</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView}>
                    <Image source={ImagePath.DRAWER_CROSS_ICON}  />
                </TouchableOpacity>

            </View>
        );
    }
    onPropertyChange(text){

         this.props.propertyChanged(text);
         this.props.selectedPropertyId(this.state.propertyData[this.refs.propertyDrop.selectedIndex()].id);
         this.callGetAgreementById(this.state.propertyData[this.refs.propertyDrop.selectedIndex()].id);
    } 
    onAgreementChange(text){

         this.props.agreementChanged(text);
         this.props.selectedAgreementId(this.state.agreementListData[this.refs.agreementDrop.selectedIndex()].id);
        
    }
    onFirstNameChanged(text){
         this.props.tenantFirstNameChanged(text);
    }
    onLastNameChanged(text){
        this.props.tenantLastNameChanged(text);
    }
    onEmailChanged(text){
        this.props.tenantEmailChanged(text);

    }
    onPhoneNumberChanged(text){
        this.props.tenantPhoneChanged(text);
    }
    callAddTenantAPI() { 
        if (this.props.addTenantReducer.propertyValue == 'Select property') {
            errorMsg.push(Strings.SELECT_TENANT_PROPERTY);
            alert(Strings.SELECT_TENANT_PROPERTY);
        } else if (this.props.addTenantReducer.tenantFirstName.trim() == '') {
            errorMsg.push(Strings.ENTER_TENANT_FIRST_NAME);
            alert(Strings.ENTER_TENANT_FIRST_NAME);
        } else if (this.props.addTenantReducer.tenantLastName.trim() == '') {
            errorMsg.push(Strings.ENTER_TENANT_LAST_NAME);
            alert(Strings.ENTER_TENANT_LAST_NAME);
        } else if (!validateEmail(this.props.addTenantReducer.tenantEmailChange)) {
            errorMsg.push(Strings.ERROR_INVALID_EMAIL);
            alert(Strings.ERROR_INVALID_EMAIL);
        } else if (this.props.addTenantReducer.tenantPhoneChange.trim() == '') {
            errorMsg.push(Strings.ENTER_TENANT_PHONE);
            alert(Strings.ENTER_TENANT_PHONE);
        } else if (this.state.isTenantPraivacyPolicy == false) {
            alert(Strings.ERROR_ACCEPT_TERMS);
        } else if (this.props.addTenantReducer.propertyValue != 'Select property' && this.props.addTenantReducer.tenantFirstName != ''
            && this.props.addTenantReducer.tenantLastName != '' && this.props.addTenantReducer.tenantEmailChange != '' &&
            this.props.addTenantReducer.tenantPhoneChange != '' && this.state.isTenantPraivacyPolicy == true) {

            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {

                    var userData = JSON.parse(value);
                    var authToken = userData.token;
                    var postData = {
                        property_id: this.props.addTenantReducer.tenantPropertyId,
                        firstname: this.props.addTenantReducer.tenantFirstName,
                        lastname: this.props.addTenantReducer.tenantLastName,
                        email: this.props.addTenantReducer.tenantEmailChange,
                        mobile_no: parseInt(this.props.addTenantReducer.tenantPhoneChange),
                        passwordStatus: this.state.isTenantCreatePassword,
                        invited_by: userData.data._id,
                        agency_id: userData.data.agency_id,
                        agreement_id: this.props.addTenantReducer.agreementSelectedId,
                    }
                    
                    this.props.showLoading();
                    this.props.addTanent(authToken, postData);
                }
            }).done();
        }
    }
   
    render() {


        return (
            <View style={{ flex: 1 }}>
                {this.navBar()}

                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={AddNewTenantScreenStyle.scrollViewContainerStyle}>


                    <View style={AddNewTenantScreenStyle.addPropertyInputContainer}>


                        <Text style={AddNewTenantScreenStyle.labelStyle}>
                            {Strings.SELECT_PROPERTY}
                        </Text>
                        <Dropdown
                            ref='propertyDrop'
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            containerStyle={AddNewTenantScreenStyle.dropDownViewStyle}
                            data={this.state.propertyData}
                            onChangeText={this.onPropertyChange.bind(this)}
                            value={this.props.addTenantReducer.propertyValue}

                        />

                        {/* <Text style={AddNewTenantScreenStyle.labelStyle}>
                            {Strings.TENANT_AGREEMENT_DETAIL}
                            </Text>
                            <Dropdown
                                ref='agreementDrop'
                                label=''
                                labelHeight={5}
                                fontSize={14}
                                baseColor={Colors.WHITE}
                                containerStyle={AddNewTenantScreenStyle.dropDownViewStyle}
                                data={this.state.agreementListData}
                                onChangeText={this.onAgreementChange.bind(this)}
                                value={this.props.addTenantReducer.agreementValue}
                            />
                        */}

                        <Text style={AddNewTenantScreenStyle.labelStyle}>
                            {Strings.FIRST_NAME}
                        </Text>
                        <TextInput
                            ref='refFirstName'
                            style={AddNewTenantScreenStyle.inputTextStyle}
                            autoCapitalize='words'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            returnKeyType='next'
                            onChangeText={this.onFirstNameChanged.bind(this)}
                            value={this.props.addTenantReducer.tenantFirstName}
                            onSubmitEditing={(event)=>{this.refs.refLastName.focus();}}

                        />


                        <Text style={AddNewTenantScreenStyle.labelStyle}>
                            {Strings.LAST_NAME}
                        </Text>
                        <TextInput 
                            ref='refLastName'
                            style={AddNewTenantScreenStyle.inputTextStyle}
                            autoCapitalize='words'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            returnKeyType='next'
                             onChangeText={this.onLastNameChanged.bind(this)}
                            value={this.props.addTenantReducer.tenantLastName}
                            onSubmitEditing={(event)=>{this.refs.refEmail.focus();}}
                        />


                        <Text style={AddNewTenantScreenStyle.labelStyle}>
                            {Strings.EMAIL_ADDRESS}
                        </Text>
                        <TextInput 
                             ref='refEmail'
                            style={AddNewTenantScreenStyle.inputTextStyle}
                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            returnKeyType='next'
                            onChangeText={this.onEmailChanged.bind(this)}
                            value={this.props.addTenantReducer.tenantEmailChange}
                            onSubmitEditing={(event)=>{this.refs.refPhone.focus();}}
                        />

                        <Text style={AddNewTenantScreenStyle.labelStyle}>
                            {Strings.PHONE_NUMBER}
                        </Text>
                        
                        <TextInput
                           ref='refPhone'
                           style={AddNewTenantScreenStyle.inputTextStyle}
                            autoCapitalize='none'
                            autoCorrect={false}
                            underlineColorAndroid='transparent'
                            returnKeyType='done'
                            maxLength={10}
                            onChangeText={this.onPhoneNumberChanged.bind(this)}
                            value={this.props.addTenantReducer.tenantPhoneChange}
                        />
                        <CheckBox
                            label={Strings.ADD_TENANT_LET_CREATE_PASSWORD}
                            labelStyle={AddNewTenantScreenStyle.checkBoxlabelStyle}
                            checked={this.state.isTenantCreatePassword}
                            onChange={this.onTenantCreatePassword.bind(this)}
                            checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                            uncheckedImage={ImagePath.UNCHECK}
                            labelLines={3}
                        />
                        <CheckBox
                            label={Strings.ADD_TENANT_USER_AGREEMENT}
                            labelStyle={AddNewTenantScreenStyle.checkBoxlabelStyle}
                            checked={this.state.isKeepSignedIn}
                            onChange={this.onTenantPrivacyPolicy.bind(this)}
                            checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                            uncheckedImage={ImagePath.UNCHECK}
                            labelLines={3}
                        />
                    </View>
                </KeyboardAwareScrollView>
                <View style={AddNewTenantScreenStyle.buttonContainerStyle}>
                    <TouchableOpacity onPress={() => this.callAddTenantAPI()}>
                        <View style={AddNewTenantScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={AddNewTenantScreenStyle.proceedButtonTextStyle}>
                                {Strings.INVITE_TITLE}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {   
                          
                    this.props.addTenantReducer.isScreenLoading ?
                    <View style={CommonStyles.circles}>
                        <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                    </View>
                    : null
                  
                }
                <Toast ref="toast"
                       position='bottom'
                />
            </View>
        );
    }
}
function mapStateToProps(state) {
    
    return {
        addTenantReducer: state.addTenantReducer
    }
}

export default connect(
    mapStateToProps,
    {
        agreementChanged,
        selectedPropertyId,
        getPropertyByAgent,
        showLoading,
        resetState,
        propertyChanged,
        tenantFirstNameChanged,
        tenantLastNameChanged,
        tenantEmailChanged,
        tenantPhoneChanged,
        addTanent,
        getAgreementByPropertyId,
        clearAgreementByPropertyId,
        selectedAgreementId,
        clearAddTenantRes,
        updateTenantList

    }

)(AddNewTenantScreen);



