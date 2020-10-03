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
    clearPropertiesDetailRes,
    propertyCategoryChanged
} from "./EditPropertyAction";

import {
    savePropertyAsDraft,
    getPropertyOwnerList,

} from "../../../Action/ActionCreators";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import EditPropertyScreenStyle from './EditPropertyScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Progress from 'react-native-progress';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
var ownerData = [];
let propertyType = [

    {value: 'House'},{ value: 'Town house'}, {value: 'Unit'}, 
    {value: 'Apartment'}, {value: 'Vila'}, {value: 'Land'}
];
let propertyCategory = [
        
    {value: 'Sale'},{ value: 'Rental'}
];


var self;
class EditPropertyScreenStepOne extends Component {
    constructor() {
        super();
        this.state = {
            propertyAdd: '',
            isTypeAdreesManual: false,
            errorMsg: '',
            errorOnTextField: '',
            roleName:''
            //propertyDetailData: {},
        };
        self = this;
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

        this.onGetPropertyOwnerSuccess();
        // this.onSavePropertySuccess();
        // this.onGetPropertyDetailsSuccess();

    }

    componentWillUnmount() {

    }

    componentWillMount() {

        this.getRoleName(); 
        this.updateView(this.props.propertyData);

    }
    componentDidMount() {
        
        this.callGetPropertyOwner();
    }



    getRoleName() {

		AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
			if (value) {
				
				this.setState({ roleName: value });
				
			}
		}).done();
    }
    
    closeAddProperty() {

        Actions.popTo('Dashboard');
    }
    callProceedToStepTwo() {


        if( Strings.USER_ROLE_OWNER==this.state.roleName){

            if(this.props.editPropertyReducer.propertyCategory=='Select Category'){
                    
                this.setState({ errorMsg: Strings.EMPTY_PROPERTY_CATEGORY_ERROR });
                this.setState({ errorOnTextField: 1 });
            }
            else if (this.props.editPropertyReducer.propertyType == 'Select property type') {
    
                this.setState({ errorMsg: Strings.EMPTY_PROPERTY_TYPE_ERROR });
                this.setState({ errorOnTextField: 2 });
            }
            else if (this.props.editPropertyReducer.propertyAddress == '') {
    
                this.setState({ errorMsg: Strings.EMPTY_ADDRESS_ERROR });
                this.setState({ errorOnTextField: 4 });
            }
            else if (this.props.editPropertyReducer.propertyDes == '') {
    
                this.setState({ errorMsg: Strings.EMPTY_PROPERTY_DES_ERROR });
                this.setState({ errorOnTextField: 5 });
            }
            else {
                
                Actions.EditPropertyScreenStepTwo({ propertyData: this.props.propertyData });
            }
    
        }else{

            if(this.props.editPropertyReducer.propertyCategory=='Select Category'){
                    
                this.setState({ errorMsg: Strings.EMPTY_PROPERTY_CATEGORY_ERROR });
                this.setState({ errorOnTextField: 1 });
            }
            else if (this.props.editPropertyReducer.propertyType == 'Select property type') {
    
                this.setState({ errorMsg: Strings.EMPTY_PROPERTY_TYPE_ERROR });
                this.setState({ errorOnTextField: 2 });
            }
            else if (this.props.editPropertyReducer.propertyOwnerId == '') {
    
                this.setState({ errorMsg: Strings.EMPTY_OWNER_ERROR });
                this.setState({ errorOnTextField: 3 });
            }
            else if (this.props.editPropertyReducer.propertyAddress == '') {
    
                this.setState({ errorMsg: Strings.EMPTY_ADDRESS_ERROR });
                this.setState({ errorOnTextField: 4 });
            }
            else if (this.props.editPropertyReducer.propertyDes == '') {
    
                this.setState({ errorMsg: Strings.EMPTY_PROPERTY_DES_ERROR });
                this.setState({ errorOnTextField: 5 });
            }
            else {
                
                Actions.EditPropertyScreenStepTwo({ propertyData: this.props.propertyData });
            }

        }

      

    }

    onPropertyNameChange(text) {

        this.props.propertyNameChanged(text);
        //this.setState({ errorMsg: '' });
        //this.setState({ errorOnTextField: '' });
    }

    onPropertyCountryChange(text) {

        this.props.propertyCountryChanged(text);
        //this.setState({ errorMsg: '' });
        //this.setState({ errorOnTextField: '' });
    }

    onPropertyTypeChange(text) {

        this.props.propertyTypeChanged(text);
        //this.setState({ errorMsg: '' });
        //this.setState({ errorOnTextField: '' });
    }
    onPropertyCategoryChange(text){

        this.props.propertyCategoryChanged(text);
        //this.setState({ errorMsg: '' });
        //this.setState({ errorOnTextField: '' });
    }



    onPropertyOwnerChange(text) {

        this.props.propertyOwnerChanged(text);
        this.props.selectedPropertyOwnerId(ownerData[this.refs.ownerDrop.selectedIndex()].id);
        
        //this.setState({ errorMsg: '' });
        //this.setState({ errorOnTextField: '' });
    }

    onPropertyAddressChange(text) {

        this.props.propertyAddressChanged(text);
        //this.setState({ errorMsg: '' });
        //this.setState({ errorOnTextField: '' });
    }

    onPropertyDescChange(text) {

        this.props.propertyDescChanged(text);
        //this.setState({ errorMsg: '' });
        //this.setState({ errorOnTextField: '' });
    }
    callGetPropertyOwner() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;

                AsyncStorage.getItem("roleId").then((role) => {
                    if (role) {              
                        var postData = {
                            agency_id: userData.data.agency_id,
                            request_by_role: role,
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

        if (this.props.editPropertyReducer.getPropertyOwnerResponse != '') {

            if (this.props.editPropertyReducer.getPropertyOwnerResponse.code == 200) {

                ownerData = this.preparePropertyOwnerDropdownData(this.props.editPropertyReducer.getPropertyOwnerResponse.data)
                this.updateView(this.props.propertyData);
            }
            else {

                alert(this.props.editPropertyReducer.getPropertyOwnerResponse.message);
            }
            this.props.clearPropertiesRes();
        }
    }

    updateView(propertyInfo) {


        var propertyOwnerData = propertyInfo.length>0 ? propertyInfo.data[0].owned_by : '';
        this.props.propertyCategoryChanged(propertyInfo.data.length>0 ?propertyInfo.data[0].property_category:'');
        this.props.propertyTypeChanged(propertyInfo.data.length>0 ?propertyInfo.data[0].property_type:'');
        
        if (ownerData.length > 0) {
            ownerData.map((data, index) => {
                if (ownerData[index].id == propertyInfo.data[0].owned_by) {
                    this.props.propertyOwnerChanged(ownerData[index].value);
                }
            })
        }

        this.props.selectedPropertyOwnerId(propertyInfo.data.length>0 ?propertyInfo.data[0].owned_by:'');
        this.props.propertyAddressChanged(propertyInfo.data.length>0?propertyInfo.data[0].address:'')
        this.setState({propertyAdd:propertyInfo.data[0].address});
        this.props.propertyDescChanged(propertyInfo.data.length>0 ?propertyInfo.data[0].description:'');
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

                    property_name: this.props.editPropertyReducer.propertyName,
                    country: this.props.editPropertyReducer.propertyCountry,
                    property_type: this.props.editPropertyReducer.propertyType,
                    created_by: userData.data._id,
                    owned_by: this.props.editPropertyReducer.propertyOwnerId,
                    address: this.props.editPropertyReducer.propertyAddress,
                    description: this.props.editPropertyReducer.propertyDes,

                };
                this.props.showLoading();
                this.props.savePropertyAsDraft(authToken, addPropertyData);
            }
        }).done();



    }

    onSavePropertySuccess() {
        if (this.props.editPropertyReducer.savePropertyResponse != '') {
            if (this.props.editPropertyReducer.savePropertyResponse.code == 200) {
                Actions.popTo('Dashboard');
            }
            else {
                alert(this.props.editPropertyReducer.savePropertyResponse.message);
            }
            this.props.resetState();
        }
    }
    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NAV_UPDATE_PROPERTY_TITLE}</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView}>
                    <View>
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

            this.setState({ isTypeAdreesManual: false });
        }
        else {

            this.setState({ isTypeAdreesManual: true });
        }

    }

    render() {




        return (
            <View style={{ flex: 1 }}>
                {this.navBar()}

                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={EditPropertyScreenStyle.scrollViewContainerStyle}>
                    <View>

                        <View style={EditPropertyScreenStyle.headerContainer}>
                            <View style={EditPropertyScreenStyle.dotContainer}>
                                <View style={EditPropertyScreenStyle.blueDotStyle} />
                                <View style={EditPropertyScreenStyle.greyDotStyle} />
                                <View style={EditPropertyScreenStyle.greyDotStyle} />
                                <View style={EditPropertyScreenStyle.greyDotStyle} />
                            </View>


                        </View>

                        <View style={EditPropertyScreenStyle.addPropertyInputContainer}>

                            {
                                /*
                                    <Text style={EditPropertyScreenStyle.labelStyle}>
                                        {Strings.PROPERT_NAME}
                                    </Text>
                                    <TextInput style={EditPropertyScreenStyle.inputTextStyle}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        underlineColorAndroid={Colors.TRANSPARENT}
                                        returnKeyType='next'
                                        onChangeText={this.onPropertyNameChange.bind(this)}
                                        value={this.props.editPropertyReducer.propertyName}
                                    />


                                    <Text style={EditPropertyScreenStyle.labelStyle}>
                                        {Strings.COUNTRY}
                                    </Text>
                                    <TextInput style={EditPropertyScreenStyle.inputTextStyle}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        underlineColorAndroid={Colors.TRANSPARENT}
                                        returnKeyType='next'
                                        onChangeText={this.onPropertyCountryChange.bind(this)}
                                        value={this.props.editPropertyReducer.propertyCountry}
                                    />


                                */
                            }

                        <Text style={EditPropertyScreenStyle.labelStyle}>
                            {Strings.PROPERT_CATEGORY}
                        </Text>
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            containerStyle={EditPropertyScreenStyle.dropDownViewStyle}
                            data={propertyCategory}
                            onChangeText={this.onPropertyCategoryChange.bind(this)}
                            value={this.props.editPropertyReducer.propertyCategory}
                        />

                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }


                            <Text style={EditPropertyScreenStyle.labelStyle}>
                                {Strings.PROPERTY_TYPE}
                            </Text>
                            <Dropdown
                                label=''
                                labelHeight={5}
                                fontSize={14}
                                baseColor={Colors.WHITE}
                                containerStyle={EditPropertyScreenStyle.dropDownViewStyle}
                                data={propertyType}
                                onChangeText={this.onPropertyTypeChange.bind(this)}
                                value={this.props.editPropertyReducer.propertyType}
                            />
                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 2 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }

                        {
                            Strings.USER_ROLE_OWNER!=this.state.roleName?
                            <Text style={EditPropertyScreenStyle.labelStyle}>
                                {Strings.OWNER}
                            </Text>:null
                        }
                        {
                             Strings.USER_ROLE_OWNER!=this.state.roleName?
                             <Dropdown
                                ref='ownerDrop'
                                label=''
                                labelHeight={5}
                                fontSize={14}
                                baseColor={Colors.WHITE}
                                containerStyle={EditPropertyScreenStyle.dropDownViewStyle}
                                data={ownerData}
                                onChangeText={this.onPropertyOwnerChange.bind(this)}
                                value={this.props.editPropertyReducer.propertyOwner}
                            />:null
                        }
                           
                        {
                             Strings.USER_ROLE_OWNER!=this.state.roleName?(this.state.errorMsg != '' && this.state.errorOnTextField == 3 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null):null
                        }
                        
                        {
                              Strings.USER_ROLE_OWNER!=this.state.roleName?  <TouchableOpacity onPress={() => this.callAddOwnerScreen()}>
                              <View style={EditPropertyScreenStyle.addOwnerLabelContainer}>
                                  <Image source={ImagePath.ADD_OWNER} />
                                  <Text style={EditPropertyScreenStyle.addOwnerLabelTextStyle}>
                                      {Strings.ADD_NEW_OWNER}
                                  </Text>
                              </View>
                          </TouchableOpacity>:null
                        }

                        

                            <Text style={EditPropertyScreenStyle.labelStyle}>
                                {Strings.PROPERTY_ADDRESS}
                            </Text>

                            {
                                this.state.isTypeAdreesManual ?
                                    <TextInput style={EditPropertyScreenStyle.inputTextStyle}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        underlineColorAndroid='transparent'
                                        returnKeyType='next'
                                        onChangeText={this.onPropertyAddressChange.bind(this)}
                                        value={this.props.editPropertyReducer.propertyAddress}
                                    /> :

                                    <View>
                                        <GooglePlacesAutocomplete
                                            placeholder=''
                                            minLength={2}
                                            autoFocus={false}
                                            returnKeyType={'default'}
                                            listViewDisplayed={this.state.propertyAdd!=''?'false':'true'}
                                            fetchDetails={true}
                                            renderDescription={(row) => row.description}
                                            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true

                                                var address = JSON.stringify(details);
                                                let obj = JSON.parse(address);
                                                this.props.propertyAddressChanged(obj.formatted_address);

                                            }}

                                            getDefaultValue={() => {

                                                return this.state.propertyAdd;
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
                                            debounce={200}
                                        />
                                        <Image source={ImagePath.MAP_MARKER} style={{ position: 'absolute', right: 10, bottom: 20 }} />


                                    </View>
                            }


                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 4 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }
                            <TouchableOpacity onPress={this.setAddressInputType.bind(this)}>

                                <Text style={EditPropertyScreenStyle.labelTextStyle}>
                                    {this.state.isTypeAdreesManual ? Strings.SEARCH_ADDRESS : Strings.TYPE_ADDRESS_MANUALLY}
                                </Text>
                            </TouchableOpacity>



                            <Text style={EditPropertyScreenStyle.labelStyle}>
                                {Strings.PROPERTY_DESCRIPTION}
                            </Text>
                            <TextInput style={EditPropertyScreenStyle.inputDescriptionTextStyle}
                                multiline={true}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                onChangeText={this.onPropertyDescChange.bind(this)}
                                value={this.props.editPropertyReducer.propertyDes}
                            />

                            {
                                this.state.errorMsg != '' && this.state.errorOnTextField == 5 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                            }

                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <View style={EditPropertyScreenStyle.buttonContainerStyle}>
                    { /* <TouchableOpacity onPress={() => this.callSaveAsDraft()}>
                                            <View style={EditPropertyScreenStyle.roundedTransparentDraftButtonStyle}>
                                                <Text style={EditPropertyScreenStyle.draftButtonTextStyle}>
                                                    {Strings.SAVE_AS_DRAFT}
                                                </Text>
                                            </View>
                                        </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => this.callProceedToStepTwo()}>
                        <View style={EditPropertyScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={EditPropertyScreenStyle.proceedButtonTextStyle}>
                                {Strings.PROCEED}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {

                    this.props.editPropertyReducer.isScreenLoading ?
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
        editPropertyReducer: state.editPropertyReducer
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
        propertyCategoryChanged,
        clearPropertiesDetailRes
    }

)(EditPropertyScreenStepOne)

