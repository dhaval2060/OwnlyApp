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
    AsyncStorage,
    KeyboardAvoidingView

} from 'react-native';

import {
    resetState,
    showLoading,
    propertyNameChanged,
    propertyCountryChanged,
    propertyTypeChanged,
    propertyOwnerChanged,
    propertyAddressChanged,
    propertyDescChanged,
    clearPropertiesRes,
    selectedPropertyOwnerId,
    updateScene,
    propertyCategoryChanged
} from "./AddPropertyAction";

import {
    savePropertyAsDraft,
    getPropertyOwnerList,

} from "../../../Action/ActionCreators";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import AddPropertyScreenStyle from './AddPropertyScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Progress from 'react-native-progress';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

let propertyType = [

    { value: 'House' }, { value: 'Town house' }, { value: 'Unit' },
    { value: 'Apartment' }, { value: 'Vila' }, { value: 'Land' }
];

let propertyCategory = [

    { value: 'Sale' }, { value: 'Rental' }
];

class AddPropertyScreenStepOne extends Component {
    constructor() {
        super();
        this.state = {
            propertyAdd: '',
            ownerData: [],
            errorMsg: '',
            errorOnTextField: '',
            isTypeAdreesManual: false,
            roleName: ''
        };
        
    }

    componentWillReceiveProps(nextProps) {

        
        if (nextProps.addPropertyReducer.refreshScene == 'updateOwner' && nextProps.addPropertyReducer.refreshScene != '' && nextProps.addPropertyReducer.refreshScene != undefined) {
            this.props.updateScene('');
            this.callGetPropertyOwner();
        }
    }

    componentDidUpdate() {

        this.onGetPropertyOwnerSuccess();
        this.onSavePropertySuccess();

        
    }

    componentWillUnmount() {
        
        this.props.resetState();
    }

    componentWillMount() {

        this.callGetPropertyOwner();
        this.getRoleName();
        
    }

    closeAddProperty() {
        Actions.popTo('Dashboard');
    }

    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                
                this.setState({ roleName: value });

            }
        }).done();
    }
    callProceedToStepTwo() {


        // if(this.props.addPropertyReducer.propertyName==''){

        //         this.setState({ errorMsg: Strings.EMPTY_PROPERTY_NAME_ERROR });
        //         this.setState({ errorOnTextField: 0 });
        // }
        // else if(this.props.addPropertyReducer.propertyCountry==''){

        //         this.setState({ errorMsg: Strings.EMPTY_COUNTRY_NAME_ERROR });
        //         this.setState({ errorOnTextField: 1 });
        // }    
        // else 
        if (Strings.USER_ROLE_OWNER == this.state.roleName) {
            if (this.props.addPropertyReducer.propertyCategory == 'Select Category') {

                this.setState({ errorMsg: Strings.EMPTY_PROPERTY_CATEGORY_ERROR });
                this.setState({ errorOnTextField: 1 });
            }
            else if (this.props.addPropertyReducer.propertyType == 'Select property type') {

                this.setState({ errorMsg: Strings.EMPTY_PROPERTY_TYPE_ERROR });
                this.setState({ errorOnTextField: 2 });
            }
            else if (this.props.addPropertyReducer.propertyAddress == '') {

                this.setState({ errorMsg: Strings.EMPTY_ADDRESS_ERROR });
                this.setState({ errorOnTextField: 4 });
            }
            else if (this.props.addPropertyReducer.propertyDes == '') {

                this.setState({ errorMsg: Strings.EMPTY_PROPERTY_DES_ERROR });
                this.setState({ errorOnTextField: 5 });
            }
            else {
                Actions.AddPropertyScreenStepTwo();
            }
        }
        else {

            if (this.props.addPropertyReducer.propertyCategory == 'Select Category') {

                this.setState({ errorMsg: Strings.EMPTY_PROPERTY_CATEGORY_ERROR });
                this.setState({ errorOnTextField: 1 });
            }
            else if (this.props.addPropertyReducer.propertyType == 'Select property type') {

                this.setState({ errorMsg: Strings.EMPTY_PROPERTY_TYPE_ERROR });
                this.setState({ errorOnTextField: 2 });
            }
            else if (this.props.addPropertyReducer.propertyOwnerId == '') {

                this.setState({ errorMsg: Strings.EMPTY_OWNER_ERROR });
                this.setState({ errorOnTextField: 3 });
            }
            else if (this.props.addPropertyReducer.propertyAddress == '') {

                this.setState({ errorMsg: Strings.EMPTY_ADDRESS_ERROR });
                this.setState({ errorOnTextField: 4 });
            }
            else if (this.props.addPropertyReducer.propertyDes == '') {

                this.setState({ errorMsg: Strings.EMPTY_PROPERTY_DES_ERROR });
                this.setState({ errorOnTextField: 5 });
            }
            else {
                Actions.AddPropertyScreenStepTwo();
            }
        }

    }

    onPropertyNameChange(text) {

        this.props.propertyNameChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onPropertyCountryChange(text) {

        this.props.propertyCountryChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onPropertyTypeChange(text) {

        this.props.propertyTypeChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onPropertyCategoryChange(text) {

        this.props.propertyCategoryChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onPropertyOwnerChange(text) {

        this.props.propertyOwnerChanged(text);
        this.props.selectedPropertyOwnerId(this.state.ownerData[this.refs.ownerDrop.selectedIndex()].id);
        
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onPropertyAddressChange(text) {

        this.props.propertyAddressChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }

    onPropertyDescChange(text) {

        this.props.propertyDescChanged(text);
        this.setState({ errorMsg: '' });
        this.setState({ errorOnTextField: '' });
    }
    callGetPropertyOwner() {
        roleId = ''
        AsyncStorage.getItem("roleId").then((role) => {
            if (role) {
                
                roleId = role
                AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                    if (value) {
                        var userData = JSON.parse(value);
                        var authToken = userData.token;
                        var postData = {
                            agency_id: userData.data.agency_id,
                            request_by_role: roleId,
                            user_id: userData.data._id,
                        }
                        
                        this.props.showLoading();
                        this.props.getPropertyOwnerList(authToken, postData);
                    }
                }).done();
            }
        }).done();
    }

    onGetPropertyOwnerSuccess() {

        if (this.props.addPropertyReducer.getPropertyOwnerResponse != '') {
            
            if (this.props.addPropertyReducer.getPropertyOwnerResponse.code == 200) {
                
                this.setState({ ownerData: this.preparePropertyOwnerDropdownData(this.props.addPropertyReducer.getPropertyOwnerResponse.data) });
            }
            else {
                //alert('');
            }
            this.props.refreshScreen = '';
            this.props.clearPropertiesRes();
        }
    }

    preparePropertyOwnerDropdownData(ownerData) {

        var tempArray = ownerData;
        tempArray.map((data, index) => {

            tempArray[index].value = tempArray[index].firstname + ' ' + tempArray[index].lastname;
            tempArray[index].id = tempArray[index]._id;
        })
        
        return tempArray;
    }


    callAddOwnerScreen() {
        Actions.AddOwnerScreen();
    }

    callSavePropertyApi() {


        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                
                addPropertyData = {

                    // property_name:this.props.addPropertyReducer.propertyName,
                    // country:this.props.addPropertyReducer.propertyCountry,
                    property_category: this.props.addPropertyReducer.propertyCategory.toLowerCase(),
                    property_type: this.props.addPropertyReducer.propertyType,
                    created_by: userData.data._id,
                    created_by_agency_id: userData.data.agency_id,
                    address: this.props.addPropertyReducer.propertyAddress,
                    description: this.props.addPropertyReducer.propertyDes,

                };
                if (Strings.USER_ROLE_OWNER != this.state.roleName) {
                    addPropertyData.owned_by = this.props.addPropertyReducer.propertyOwnerId;
                }
                else {
                    addPropertyData.owned_by = userData.data._id;
                }
                this.props.showLoading();
                this.props.savePropertyAsDraft(authToken, addPropertyData);
            }
        }).done();

    }

    onSavePropertySuccess() {
        if (this.props.addPropertyReducer.savePropertyResponse != '') {
            if (this.props.addPropertyReducer.savePropertyResponse.code == 200) {
                Actions.popTo('Dashboard');
            }
            else {
                alert(this.props.addPropertyReducer.savePropertyResponse.message);
            }
            this.props.resetState();
        }
    }
    navBar() {
        return (
            <View>
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NAV_ADD_NEW_PROPERTY_TITLE}</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView}>
                    <View >
                        <Image source={ImagePath.DRAWER_CROSS_ICON} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    callSaveAsDraft() {
        this.callSavePropertyApi();
    }

    setAddressInputType() {
        if (this.state.isTypeAdreesManual) {
            this.props.propertyAddressChanged('');
            this.setState({ isTypeAdreesManual: false });
        }
        else {
            this.props.propertyAddressChanged('');
            this.setState({ isTypeAdreesManual: true });
        }

    }


    render() {


        return (
            <View style={{ flex: 1 }}>
                {this.navBar()}
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" >
                    <ScrollView>
                        {/* <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={AddPropertyScreenStyle.scrollViewContainerStyle}> */}
                        <View>

                            <View style={AddPropertyScreenStyle.headerContainer}>
                                <View style={AddPropertyScreenStyle.dotContainer}>
                                    <View style={AddPropertyScreenStyle.blueDotStyle} />
                                    <View style={AddPropertyScreenStyle.greyDotStyle} />
                                    <View style={AddPropertyScreenStyle.greyDotStyle} />
                                    <View style={AddPropertyScreenStyle.greyDotStyle} />
                                </View>

                            </View>

                            <View style={AddPropertyScreenStyle.addPropertyInputContainer}>

                                {
                                    /*<Text style={AddPropertyScreenStyle.labelStyle}>
                                        {Strings.PROPERT_NAME}
                                    </Text>
                                    <TextInput style={AddPropertyScreenStyle.inputTextStyle}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        returnKeyType='next'
                                        onChangeText={this.onPropertyNameChange.bind(this)}
                                        value={this.props.addPropertyReducer.propertyName}
                                     />
                                    {
                                        this.state.errorMsg != '' && this.state.errorOnTextField == 0 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                                    }
        
                                    <Text style={AddPropertyScreenStyle.labelStyle}>
                                        {Strings.COUNTRY}
                                    </Text>
                                    <TextInput style={AddPropertyScreenStyle.inputTextStyle} 
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        returnKeyType='next'
                                        onChangeText={this.onPropertyCountryChange.bind(this)}
                                        value={this.props.addPropertyReducer.propertyCountry}
                                    />
                                    {
                                        this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                                    }*/

                                }

                                <Text style={AddPropertyScreenStyle.labelStyle}>
                                    {Strings.PROPERT_CATEGORY}
                                </Text>
                                <Dropdown
                                    label=''
                                    labelHeight={5}
                                    fontSize={14}
                                    baseColor={Colors.WHITE}
                                    containerStyle={AddPropertyScreenStyle.dropDownViewStyle}
                                    data={propertyCategory}
                                    onChangeText={this.onPropertyCategoryChange.bind(this)}
                                    value={this.props.addPropertyReducer.propertyCategory}
                                />

                                {
                                    this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                                }


                                <Text style={AddPropertyScreenStyle.labelStyle}>
                                    {Strings.PROPERTY_TYPE}
                                </Text>
                                <Dropdown
                                    label=''
                                    labelHeight={5}
                                    fontSize={14}
                                    baseColor={Colors.WHITE}
                                    containerStyle={AddPropertyScreenStyle.dropDownViewStyle}
                                    data={propertyType}
                                    onChangeText={this.onPropertyTypeChange.bind(this)}
                                    value={this.props.addPropertyReducer.propertyType}
                                />

                                {
                                    this.state.errorMsg != '' && this.state.errorOnTextField == 2 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                                }

                                {
                                    Strings.USER_ROLE_OWNER != this.state.roleName ?
                                        <Text style={AddPropertyScreenStyle.labelStyle}>
                                            {Strings.OWNER}
                                        </Text> : null
                                }
                                {
                                    Strings.USER_ROLE_OWNER != this.state.roleName ?
                                        <Dropdown
                                            ref='ownerDrop'
                                            label=''
                                            labelHeight={5}
                                            fontSize={14}
                                            baseColor={Colors.WHITE}
                                            containerStyle={AddPropertyScreenStyle.dropDownViewStyle}
                                            data={this.state.ownerData}
                                            onChangeText={this.onPropertyOwnerChange.bind(this)}
                                            value={this.props.addPropertyReducer.propertyOwner}
                                        /> : null
                                }

                                {
                                    Strings.USER_ROLE_OWNER != this.state.roleName ? (this.state.errorMsg != '' && this.state.errorOnTextField == 3 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null) : null
                                }

                                {
                                    Strings.USER_ROLE_OWNER != this.state.roleName ? <TouchableOpacity onPress={() => this.callAddOwnerScreen()}>
                                        <View style={AddPropertyScreenStyle.addOwnerLabelContainer}>
                                            <Image source={ImagePath.ADD_OWNER} />
                                            <Text style={AddPropertyScreenStyle.addOwnerLabelTextStyle}>
                                                {Strings.ADD_NEW_OWNER}
                                            </Text>
                                        </View>
                                    </TouchableOpacity> : null
                                }




                                <Text style={AddPropertyScreenStyle.labelStyle}>
                                    {Strings.PROPERTY_ADDRESS}
                                </Text>
                                {
                                    this.state.isTypeAdreesManual ?
                                        <TextInput style={AddPropertyScreenStyle.inputTextStyle}
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            underlineColorAndroid='transparent'
                                            returnKeyType='next'
                                            onChangeText={this.onPropertyAddressChange.bind(this)}
                                            value={this.props.addPropertyReducer.propertyAddress}
                                        /> :
                                        <View>
                                            <GooglePlacesAutocomplete
                                                placeholder=''
                                                minLength={2}
                                                autoFocus={false}
                                                returnKeyType={'default'}
                                                fetchDetails={true}
                                                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true

                                                    var address = JSON.stringify(details);
                                                    let obj = JSON.parse(address);
                                                    //this.setState({propertyAdd:obj.formatted_address});
                                                    this.props.propertyAddressChanged(obj.formatted_address);

                                                }}

                                                getDefaultValue={() => {

                                                    return '';
                                                }}
                                                query={{
                                                    // available options: https://developers.google.com/places/web-service/autocomplete
                                                    key: Strings.GOOGLE_PALCES_API_KEY,
                                                    language: 'en', // language of the results
                                                    components: 'country:aus'
                                                }}
                                                styles={
                                                    {

                                                        description:
                                                        {
                                                            paddingLeft: 5

                                                        },
                                                        predefinedPlacesDescription:
                                                        {
                                                            color: Colors.LOCATION_DESCRIPTION

                                                        },
                                                        listView:
                                                        {
                                                            backgroundColor: Colors.WHITE,
                                                            paddingRight: 10
                                                        },
                                                        textInputContainer:
                                                        {
                                                            height: 38,
                                                            borderWidth: 1,
                                                            marginTop: 10,
                                                            marginBottom: 15,
                                                            borderColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
                                                            borderRadius: 4,
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
                                                            borderTopWidth: 1,
                                                            borderTopColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
                                                            backgroundColor: Colors.WHITE,

                                                        },
                                                        textInput:
                                                        {
                                                            marginLeft: 0,
                                                            marginRight: 0,
                                                            marginTop: 5,
                                                            fontSize: 14,
                                                            color: Colors.BLACK,
                                                            paddingLeft: 15,
                                                            paddingRight: 60,
                                                            backgroundColor: Colors.WHITE,

                                                        }
                                                    }
                                                }
                                                currentLocation={false}
                                            />

                                            <Image source={ImagePath.MAP_MARKER} style={{ position: 'absolute', right: 10, bottom: 20 }} />


                                        </View>


                                }


                                {
                                    this.state.errorMsg != '' && this.state.errorOnTextField == 4 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                                }
                                <TouchableOpacity onPress={this.setAddressInputType.bind(this)}>

                                    <Text style={AddPropertyScreenStyle.labelTextStyle}>
                                        {this.state.isTypeAdreesManual ? Strings.SEARCH_ADDRESS : Strings.TYPE_ADDRESS_MANUALLY}
                                    </Text>
                                </TouchableOpacity>

                                <Text style={AddPropertyScreenStyle.labelStyle}>
                                    {Strings.PROPERTY_DESCRIPTION}
                                </Text>
                                <TextInput style={AddPropertyScreenStyle.inputDescriptionTextStyle}
                                    multiline={true}
                                    onChangeText={this.onPropertyDescChange.bind(this)}
                                    value={this.props.addPropertyReducer.propertyDes}
                                />

                                {
                                    this.state.errorMsg != '' && this.state.errorOnTextField == 5 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                                }

                            </View>
                        </View>
                    </ScrollView>
                    <View style={AddPropertyScreenStyle.buttonContainerStyle}>
                        <TouchableOpacity onPress={() => this.callSaveAsDraft()}>
                            <View style={AddPropertyScreenStyle.roundedTransparentDraftButtonStyle}>
                                <Text style={AddPropertyScreenStyle.draftButtonTextStyle}>
                                    {Strings.SAVE_AS_DRAFT}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.callProceedToStepTwo()}>
                            <View style={AddPropertyScreenStyle.roundedBlueProceedButtonStyle}>
                                <Text style={AddPropertyScreenStyle.proceedButtonTextStyle}>
                                    {Strings.PROCEED}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* </KeyboardAwareScrollView> */}
                </KeyboardAvoidingView>

                {

                    this.props.addPropertyReducer.isScreenLoading ?
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
        addPropertyReducer: state.addPropertyReducer
    }
}

export default connect(
    mapStateToProps,
    {
        resetState,
        savePropertyAsDraft,
        showLoading,
        propertyNameChanged,
        propertyCountryChanged,
        propertyTypeChanged,
        propertyOwnerChanged,
        propertyAddressChanged,
        propertyDescChanged,
        getPropertyOwnerList,
        clearPropertiesRes,
        selectedPropertyOwnerId,
        updateScene,
        propertyCategoryChanged

    }

)(AddPropertyScreenStepOne)

