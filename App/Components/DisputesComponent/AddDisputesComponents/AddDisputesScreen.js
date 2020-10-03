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
    Picker,
    FlatList,
    AsyncStorage
} from 'react-native';
import * as Progress from "react-native-progress";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import AddDisputesScreenStyle from './AddDisputesScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';

import ImagePicker from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet'

var options = {
    title: 'Select Property Image',
    quality: 1,
    customButtons: [
        { name: 'Ownly', title: 'Choose Photo' },
    ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};


var uploadImagesArray = [];
var uploadedImagesPath = [];
let contextRef;

import {
    addDisputes,
    getMaintenancePropertyList,
    getAgreementPropertyTenantsList
} from "../../../Action/ActionCreators";

import {
    showLoading,
    resetState,
    propertyNameChanged,
    agentNameChanged,
    tenantNameChanged,
    ownerNameChanged,
    subjectNameChanged,
    messageChanged,
    clearAddDisputesRes,
    updateDisputesList
} from "../DisputesScreenAction";

import {
    clearTenantsData,
} from "../../AgreementsComponent/AddAgreementComponent/AddAgreementAction";


class AddDisputesScreen extends Component {
    constructor() {
        super();
        this.state = {
            uploadImagesData: {},
            selectedImage: '',
            propertyListData: [],
            isScreenLoading:false,
            propertyData: [],
            selectedPropertyId: '',
            selectedAgentId: '',
            selectedOwnerId: '',
            tenantsData: [],
            tenantsSearchedData: [],
            tenant_id: '',
            errorMsg: '',
            errorOnTextField: ''
        };
        this.handlePress = this.handlePress.bind(this)
        contextRef = this;

    }


    componentDidUpdate() {
        this.onMaintenancePropertyListSuccess();
        this.onAddDisputesSuccess();
        this.onGetTenantsSuccess();
     }

    componentWillMount() {

        this.getMaintenancePropertyList();

    }

    preparePropertyData(propertyList) {
        var tempArray = [];
        propertyList.map((data, index) => {

            var tempData = {

                value: propertyList[index].address,
                id: propertyList[index]._id
            }
            tempArray.push(tempData);

        })
        
        return tempArray;
    }


    getMaintenancePropertyList() {
        this.setState({isScreenLoading:true})
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;

                var postData = {
                    agency_id: userData.data.agency_id,
                    request_by_role: userData.data.role_id,
                    request_by_id: userData.data._id,
                }
                // this.props.showLoading();
                this.props.getMaintenancePropertyList(authToken, postData);
            }
        }).done();
    }

    onMaintenancePropertyListSuccess() {
        if (this.props.disputesScreenReducer.propertyListRes != '') {
            if (this.props.disputesScreenReducer.propertyListRes.code == 200) {
        this.setState({isScreenLoading:false})

                
                this.setState({ propertyListData: this.preparePropertyData(this.props.disputesScreenReducer.propertyListRes.data), propertyData: this.props.disputesScreenReducer.propertyListRes.data });
            }
            else {
                //	alert(this.props.disputesScreenReducer.propertyListRes.message);
            }
            this.props.resetState();
        }
    }


    callAddDisputes() {

        
        if (this.props.disputesScreenReducer.propertyNameChanged == 'Select Property') {

            this.setState({ errorMsg: Strings.ERROR_SELECT_PROPERTY });
            this.setState({ errorOnTextField: 0 });

        } else if (this.props.disputesScreenReducer.tenantNameChanged == "") {
            this.setState({ errorMsg: 'Tenant is required' });
            this.setState({ errorOnTextField: 1 });
} else if (this.props.disputesScreenReducer.agentNameChanged == '') {
            this.setState({ errorMsg: 'Agent is required' });
            this.setState({ errorOnTextField: 2 });
} else if (this.props.disputesScreenReducer.ownerNameChanged == '') {
            this.setState({ errorMsg: 'Owner is required' });
            this.setState({ errorOnTextField: 3 });
} else if (this.props.disputesScreenReducer.subjectNameChanged == '') {
            this.setState({ errorMsg: Strings.ERROR_ENTER_SUBJECT });
            this.setState({ errorOnTextField: 4 });

        } else if (this.props.disputesScreenReducer.messageChanged == '') {
            this.setState({ errorMsg: Strings.ERROR_ENTER_MESSAGE });
            this.setState({ errorOnTextField: 5 });
        }
        else {

            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    var userData = JSON.parse(value);
                    var authToken = userData.token;

                    var postData = {

                        agency_id: userData.data.agency_id,
                        agent_id: this.state.selectedAgentId,
                        city: this.state.propertyData[0].city,
                        created_by_id: userData.data._id,
                        message: this.props.disputesScreenReducer.messageChanged,
                        request_by_role: userData.data.role_id,
                        owner_id: this.state.selectedOwnerId,
                        property_id: this.state.selectedPropertyId,
                        state: this.state.propertyData[0].state,
                        subject: this.props.disputesScreenReducer.subjectNameChanged,
                        tenant_id: this.state.tenant_id,

                    }
                    this.props.showLoading();
                    this.props.addDisputes(authToken, postData);
                }
            }).done();
        }
    }

    onAddDisputesSuccess() {
        if (this.props.disputesScreenReducer.addDisputesRes != '') {
            if (this.props.disputesScreenReducer.addDisputesRes.code == 200) {
                
                //this.setState({ propertyListData: this.preparePropertyData(this.props.disputesScreenReducer.addDisputesRes.data) });
                this.props.updateDisputesList('updateDisputesList');
                Actions.pop();
            }
            else {
                //	alert(this.props.disputesScreenReducer.propertyListRes.message);
            }
            this.props.clearAddDisputesRes();
        }
    }


    closeAddProperty() {

        Actions.popTo('Dashboard');
    }

    callBack() {
        Actions.pop();
    }

    callGetTenantsList(propertyId) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                
                // this.props.showLoading();
                this.props.getAgreementPropertyTenantsList(authToken, propertyId);
            }
        }).done();
    }

    onGetTenantsSuccess() {

        if (this.props.addAgreementReducer.tenantsListResponse != '') {

            if (this.props.addAgreementReducer.tenantsListResponse.code == 200) {
                
                
        this.setState({isScreenLoading:false})

                if (this.props.addAgreementReducer.tenantsListResponse.data && this.props.addAgreementReducer.tenantsListResponse.data.length > 0 ) {
                    this.setState({ tenantsData: this.props.addAgreementReducer.tenantsListResponse.data, tenantsSearchedData: this.props.addAgreementReducer.tenantsListResponse.data });
                    this.props.tenantNameChanged(this.props.addAgreementReducer.tenantsListResponse.data[0].invited_to.firstname + ' ' + this.props.addAgreementReducer.tenantsListResponse.data[0].invited_to.lastname);
                    this.props.agentNameChanged(this.state.propertyData[0].created_by.firstname + ' ' + this.state.propertyData[0].created_by.lastname);
                    this.props.ownerNameChanged(this.state.propertyData[0].owned_by.firstname + ' ' + this.state.propertyData[0].owned_by.lastname);
                    this.setState({ tenant_id: this.props.addAgreementReducer.tenantsListResponse.data[0].invited_to._id });
                }
                else{
                    // alert('No tenant available for selected property')
                    this.props.tenantNameChanged('');
                    this.props.agentNameChanged(this.state.propertyData[0].created_by.firstname + ' ' + this.state.propertyData[0].created_by.lastname);
                    this.props.ownerNameChanged(this.state.propertyData[0].owned_by.firstname + ' ' + this.state.propertyData[0].owned_by.lastname);
                    this.setState({ tenant_id: [] });
                }

            }
            else {

                alert(this.props.addAgreementReducer.tenantsListResponse.message);
            }
            this.props.clearTenantsData();
        }
    }



    onPropertyNameChange(text) {
        
        this.props.propertyNameChanged(text);
        this.setState({ selectedPropertyId: this.state.propertyListData[this.refs.ref_property.selectedIndex()].id });
        this.setState({ selectedAgentId: this.state.propertyData[this.refs.ref_property.selectedIndex()].created_by._id });
        this.setState({ selectedOwnerId: this.state.propertyData[this.refs.ref_property.selectedIndex()].owned_by._id });
        this.callGetTenantsList(this.state.propertyListData[this.refs.ref_property.selectedIndex()].id);
    }
    onAgentNameChange(text) {

        this.props.agentNameChanged(text);

    }

    onTenantNameChange(text) {

        this.props.tenantNameChanged(text);

    }
    onOwnerNameChange(text) {

        this.props.ownerNameChanged(text);

    }

    onSubjectnameChange(text) {

        this.props.subjectNameChanged(text);

    }
    onMessageChange(text) {

        this.props.messageChanged(text);

    }


    showCamera() {
        // Launch Camera:
        ImagePicker.launchCamera(options, (response) => {

            
            if (response.didCancel) {
                
            }
            else if (response.error) {
                
            }
            else if (response.customButton) {
                
            }
            else {

                response.data = '';
                let source = { uri: response.uri };
                var path = response.uri.replace("file://", "");
                let imagePath = (Platform.OS == 'ios') ? path : response.path;

            }

        });
    }

    showImageLibrary() {
        // Open Image Library:
        ImagePicker.launchImageLibrary(options, (response) => {

            
            if (response.didCancel) {
                
            }
            else if (response.error) {
                
            }
            else if (response.customButton) {
                
            }
            else {

                let source = { uri: response.uri };
                let imagePath = (Platform.OS == 'ios') ? response.origURL : response.path;
                var imageItem = {
                    'url': source,
                    'path': imagePath,
                    'isSelected': 0
                }
                if (uploadImagesArray.length < 20) {
                    uploadImagesArray.push(imageItem);
                    var imagagesData = {

                        'imageArray': uploadImagesArray
                    }
                    this.setState({ uploadImagesData: imagagesData });
                }
                else {
                    alert(Strings.MAX_IMAGE_LIMIT);
                }

                if (uploadImagesArray.length == 1) {
                    this.uploadImageListSelection(0);
                }
                AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                    if (value) {
                        var userData = JSON.parse(value);
                        var authToken = userData.token;
                        //this.props.showLoading();
                        
                        this.props.uploadImage(authToken, response.uri.replace("file://", ""));
                    }
                }).done();



            }

        });
    }




    showActionSheet() {

        this.ActionSheet.show()
    }

    handlePress(i) {
        if (i == 0) {
            this.showImageLibrary();
        }
        else if (i == 1) {
            this.showCamera();
        }
    }

    navBar() {
        return (
            <View >

                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.DISPUTES}</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView}>
                    <Image source={ImagePath.DRAWER_CROSS_ICON} />
                </TouchableOpacity>

            </View>
        );
    }

    uploadImageListSelection(index) {
        
        
        this.setState({ selectedImage: this.state.uploadImagesData.imageArray[index].url });
        var tempData = this.state.uploadImagesData;
        var tempArray = this.state.uploadImagesData.imageArray;
        tempArray.map((data, position) => {

            if (index == position) {

                if (tempArray[index].isSelected == 0) {
                    tempArray[index].isSelected = 1;
                }

            }
            else {
                tempArray[position].isSelected = 0;
            }


        })
        tempData.imageArray = tempArray;
        this.setState({ uploadImagesData: tempData });

    }


    renderItem({ item, index }) {

        return (
            <TouchableOpacity onPress={() => contextRef.uploadImageListSelection(index)}>
                <View style={AddDisputesScreenStyle.uploadImageListItemStyle}>
                    <Image source={item.url} style={AddDisputesScreenStyle.uploadPropertyListImageStyle} />
                </View>
                {
                    item.isSelected == 1 ? <View style={AddDisputesScreenStyle.selectedImageStyle}>
                        <View style={AddDisputesScreenStyle.roundedBlueFeaturedButtonStyle}>
                            <Text style={AddDisputesScreenStyle.featuredTextStyle}>
                                {Strings.FEATURED}
                            </Text>
                        </View>
                    </View> : null
                }
            </TouchableOpacity>
        );
    }

    render() {

        return (
            <View style={AddDisputesScreenStyle.mainContainer}>
                {this.navBar()}


                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={AddDisputesScreenStyle.scrollViewContainerStyle}>


                    <View style={AddDisputesScreenStyle.addPropertyInputContainer}>

                        <Text style={AddDisputesScreenStyle.labelStyle}>
                            {Strings.SELECT_PROPERTY}
                        </Text>

                        <Dropdown
                            ref='ref_property'
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={AddDisputesScreenStyle.dropDownTextStyle}
                            containerStyle={AddDisputesScreenStyle.dropDownViewStyle}
                            data={this.state.propertyListData}
                            onChangeText={this.onPropertyNameChange.bind(this)}
                            value={this.props.disputesScreenReducer.propertyNameChanged}
                       />
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 0 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }

                        <Text style={AddDisputesScreenStyle.labelStyle}>
                            {Strings.USER_ROLE_TENANT}
                        </Text>

                        <View style={AddDisputesScreenStyle.searchViewStyle}>
                            <TextInput
                                placeholder=''
                                editable={false}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={AddDisputesScreenStyle.searchTextInputStyle}
                                onChangeText={this.onTenantNameChange.bind(this)}
                                value={this.props.disputesScreenReducer.tenantNameChanged}
                            />

                        </View>
{
                            this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                        <View style={AddDisputesScreenStyle.labelContainerStyle}>
                            <Text style={AddDisputesScreenStyle.labelStyle}>
                                {Strings.USER_ROLE_AGENT}
                            </Text>
                        </View>

                        <View style={AddDisputesScreenStyle.searchViewStyle}>
                            <TextInput
                                placeholder=''
                                editable={false}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={AddDisputesScreenStyle.searchTextInputStyle}
                                onChangeText={this.onAgentNameChange.bind(this)}
                                value={this.props.disputesScreenReducer.agentNameChanged}
                            />
                            {/* <Image source={ImagePath.SEARCH_ICON} style={AddDisputesScreenStyle.searchImageStyle} /> */}
                        </View>
{
                            this.state.errorMsg != '' && this.state.errorOnTextField == 2 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                        <Text style={AddDisputesScreenStyle.labelStyle}>
                            {Strings.USER_ROLE_OWNER}
                        </Text>

                        <View style={AddDisputesScreenStyle.searchViewStyle}>
                            <TextInput
                                placeholder=''
                                editable={false}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={AddDisputesScreenStyle.searchTextInputStyle}
                                onChangeText={this.onOwnerNameChange.bind(this)}
                                value={this.props.disputesScreenReducer.ownerNameChanged}
                            />

                        </View>
{
                            this.state.errorMsg != '' && this.state.errorOnTextField == 3 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                        <Text style={AddDisputesScreenStyle.labelStyle}>
                            {Strings.SUBJECT}
                        </Text>

                        <View style={AddDisputesScreenStyle.searchViewStyle}>
                            <TextInput
                                placeholder=''
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={AddDisputesScreenStyle.searchTextInputStyle}
                                onChangeText={this.onSubjectnameChange.bind(this)}
                                value={this.props.disputesScreenReducer.subjectNameChanged}
                            />
                        </View>
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 4 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }

                        <Text style={AddDisputesScreenStyle.labelStyle}>
                            {Strings.MESSAGE_TAB}
                        </Text>

                        <TextInput style={AddDisputesScreenStyle.inputDescriptionTextStyle}
                            multiline={true}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            onChangeText={this.onMessageChange.bind(this)}
                            value={this.props.disputesScreenReducer.messageChanged}
                        />
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 5 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }

                    </View>

                </ScrollView>
                <View style={AddDisputesScreenStyle.buttonContainerStyle}>

                    <TouchableOpacity onPress={() => this.callAddDisputes()}>
                        <View style={AddDisputesScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={AddDisputesScreenStyle.proceedButtonTextStyle}>
                                {Strings.SUBMIT_REQUEST}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
{this.state.isScreenLoading ? (
          <View style={CommonStyles.circles}>
            <Progress.CircleSnail
              color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]}
            />
          </View>
        ) : null}
            </View>
        );
    }
}

function mapStateToProps(state) {
    
    return {
        disputesScreenReducer: state.disputesScreenReducer,
        addAgreementReducer: state.addAgreementReducer,
    }
}

export default connect(
    mapStateToProps,
    {
        addDisputes,
        getMaintenancePropertyList,
        getAgreementPropertyTenantsList,
        showLoading,
        resetState,
        propertyNameChanged,
        agentNameChanged,
        tenantNameChanged,
        ownerNameChanged,
        subjectNameChanged,
        messageChanged,
        clearTenantsData,
        clearAddDisputesRes,
        updateDisputesList

    }

)(AddDisputesScreen);

