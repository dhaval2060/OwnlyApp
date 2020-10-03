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
    FlatList
} from 'react-native';

import {
    savePropertyAsDraft,
    addProperty,
    editProperty,
    getAmenitiesList,

} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,
    clearAmenitiesRes

} from "./EditPropertyAction";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import EditPropertyScreenStyle from './EditPropertyScreenStyle';
import CheckBox from 'react-native-checkbox';
import * as Progress from 'react-native-progress';
import { documentUpload } from '../../../Saga/APICaller';
let contextRef;
var amenitiesSelectedArrray = [];

var uploadedImageArray = [];
var propertyId = '';

class EditPropertyScreenStepThree extends Component {
    constructor() {
        super();
        this.state = {
            amenitiesListData: {},
            roleName: ''
        };
        contextRef = this;
    }


    componentDidUpdate() {
        this.onGetAmenitiesSuccess();
        this.onAddPropertySuccess();
        this.onSavePropertySuccess();
    }

    componentWillUnmount() {
        amenitiesSelectedArrray = [];
        uploadedImageArray = [];
        this.setState({ amenitiesListData: {} });
    }
    componentWillMount() {
        this.callGetAmenities();
        this.getRoleName();
        uploadedImageArray = this.props.uploadedImages;

        propertyId = this.props.propertId;
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

    callBack() {
        Actions.pop();
    }

    callProceedToFinalStep() {
        this.callAddPropertyApi();
        //Actions.AddPropertyScreenFinalStep();
    }

    onAddPropertySuccess() {

        if (this.props.editPropertyReducer.addPropertyResponse != '') {

            if (this.props.editPropertyReducer.addPropertyResponse.code == 200) {

                // Actions.AddPropertyScreenFinalStep();
                console.log(this.props.imgResponse, "this.props.imgResponse")
                this.props.imgResponse && this.props.imgResponse.forEach(element => {
                    if (element.path != "") {
                        const body = new FormData();
                        const file = {
                            uri: element.path, // e.g. 'file:///path/to/file/image123.jpg'
                            name: 'image123.jpg', // e.g. 'image123.jpg',
                            type: 'image/jpg' // e.g. 'image/jpg'
                        };
                        body.append("file", file);
                        body.append("_id", this.props.editPropertyReducer.addPropertyResponse && this.props.editPropertyReducer.addPropertyResponse.data && this.props.editPropertyReducer.addPropertyResponse.data._id);
                        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                            if (value) {
                                let userData = JSON.parse(value);
                                var authToken = userData.token;
                                documentUpload(
                                    "createPropertyImage",
                                    authToken,
                                    body
                                ).then(
                                    async data => {
                                        console.log(data, "data===>>>>")
                                        // imagesUploadedLength++
                                        // if (imagesUploadedLength == lengthOfImgs) {

                                        // }
                                    }, async err => {
                                        console.log(err, "err===>>>>")
                                        // imagesUploadedLength++
                                    })
                            }
                        })
                    }
                });
                Actions.EditPropertyScreenFinalStep({ AddPropertyData: this.props.editPropertyReducer.addPropertyResponse });
                this.props.resetState();

            }
            else {
                alert(this.props.editPropertyReducer.addPropertyResponse.message);
                this.props.resetState();
            }
        }
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

    onGetAmenitiesSuccess() {
        if (this.props.editPropertyReducer.amenitiesListResponse != '') {
            if (this.props.editPropertyReducer.amenitiesListResponse.code == 200) {

                if (this.props.editPropertyReducer.amenitiesListResponse.data.length > 0 && this.props.editPropertyReducer.amenitiesListResponse.data.length) {
                    this.setState({ amenitiesListData: this.prePareAmenitiesData(this.props.editPropertyReducer.amenitiesListResponse.data) });
                }

            }
            else {
                alert(this.props.editPropertyReducer.amenitiesListResponse.message);

            }
            this.props.clearAmenitiesRes();
        }
    }
    callGetAmenities() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.getAmenitiesList(authToken);
            }
        }).done();
    }


    callAddPropertyApi() {

        this.state.amenitiesListData.map((data, index) => {

            // if (this.state.amenitiesListData[index].isChecked) {

            // }

            var selectedAmenities = {
                amenity_id: this.state.amenitiesListData[index]._id,
                amenity_name: this.state.amenitiesListData[index].name,
                is_checked: this.state.amenitiesListData[index].isChecked
            }
            amenitiesSelectedArrray.push(selectedAmenities);

        })

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;

                let addPropertyData = {
                    _id: this.props.propertyData._id,
                    property_name: this.props.editPropertyReducer.propertyName,
                    country: this.props.editPropertyReducer.propertyCountry,
                    property_type: this.props.editPropertyReducer.propertyType,
                    property_category: this.props.editPropertyReducer.propertyCategory.toLowerCase(),
                    created_by: userData.data._id,
                    created_by_agency_id: userData.data.agency_id,
                    address: this.props.editPropertyReducer.propertyAddress,
                    description: this.props.editPropertyReducer.propertyDes,
                    number_of_bathroom: parseInt(this.props.editPropertyReducer.propertyBathroomNo),
                    number_of_parking: parseInt(this.props.editPropertyReducer.propertyCarNo),
                    floor_area: parseInt(this.props.editPropertyReducer.propertyFloorArea),
                    lot_erea: parseInt(this.props.editPropertyReducer.propertyLotArea),
                    other_amenity: '',
                    number_bedroom: parseInt(this.props.editPropertyReducer.propertyBedroomNo),
                    amenities: amenitiesSelectedArrray,
                    image: uploadedImageArray,
                    save_as_draft: false,
                };
                if (Strings.USER_ROLE_OWNER != this.state.roleName) {
                    addPropertyData.owned_by = this.props.editPropertyReducer.propertyOwnerId;
                }
                else {
                    addPropertyData.owned_by = userData.data._id;
                }
                this.props.showLoading();

                this.props.editProperty(authToken, addPropertyData);
            }
        }).done();

    }


    callSavePropertyApi() {

        //propertyName:'',
        //propertyCountry:'',
        //propertyOwner:'',

        this.state.amenitiesListData.map((data, index) => {


            // if (this.state.amenitiesListData[index].isChecked) {

            // }

            var selectedAmenities = {
                amenity_id: this.state.amenitiesListData[index]._id,
                amenity_name: this.state.amenitiesListData[index].name,
                is_checked: this.state.amenitiesListData[index].isChecked
            }
            amenitiesSelectedArrray.push(selectedAmenities);

        })

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;

                let addPropertyData = {

                    property_name: this.props.editPropertyReducer.propertyName,
                    country: this.props.editPropertyReducer.propertyCountry,
                    property_type: this.props.editPropertyReducer.propertyType,
                    created_by: userData.data._id,

                    address: this.props.editPropertyReducer.propertyAddress,
                    description: this.props.editPropertyReducer.propertyDes,
                    number_of_bathroom: parseInt(this.props.editPropertyReducer.propertyBathroomNo),
                    number_of_parking: parseInt(this.props.editPropertyReducer.propertyCarNo),
                    floor_area: parseInt(this.props.editPropertyReducer.propertyFloorArea),
                    lot_erea: parseInt(this.props.editPropertyReducer.propertyLotArea),
                    other_amenity: '',
                    number_bedroom: parseInt(this.props.editPropertyReducer.propertyBedroomNo),
                    amenities: amenitiesSelectedArrray,
                    image: uploadedImageArray
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

    callAddOwnerScreen() {
        Actions.AddOwnerScreen();
    }

    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NAV_UPDATE_PROPERTY_TITLE}</Text>
                <TouchableOpacity onPress={() => this.callBack()} style={CommonStyles.navBackRightImageView}>
                    <View>
                        <Image source={ImagePath.HEADER_BACK} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView} >
                    <View>
                        <Image source={ImagePath.DRAWER_CROSS_ICON} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    prePareAmenitiesData(amenitiesData) {


        var selectedamenities = [];
        var selectedamenitiesId = [];
        var tempArray = amenitiesData;
        if (this.props.amenities) {
            // selectedamenities = this.props.propertyData.data.amenities;
            selectedamenities = this.props.amenities;
        }


        selectedamenities.map((data, index) => {
            if (selectedamenities[index].is_checked) {
                selectedamenitiesId.push(selectedamenities[index].amenity_id);
            }


        })




        if (tempArray.length > 0) {
            tempArray.map((data, index) => {

                if (selectedamenitiesId != null && selectedamenitiesId != undefined) {

                    if (selectedamenitiesId.includes(tempArray[index]._id)) {

                        tempArray[index].isChecked = true;
                    }
                    else {

                        tempArray[index].isChecked = false;
                    }
                }
                else {

                    tempArray[index].isChecked = false;
                }



            })

        }


        return tempArray;

    }

    updateCheckBoxSelection(selectedIndex, amenitiesData) {

        var tempArray = amenitiesData;
        tempArray.map((data, index) => {


            if (tempArray[selectedIndex].isChecked) {

                tempArray[selectedIndex].isChecked = false;
            }
            else {

                tempArray[selectedIndex].isChecked = true;

            }

        })

        return tempArray;

    }

    renderItem({ item, index }) {


        return (
            <View style={EditPropertyScreenStyle.amenitiesListItemContainerStyle}>
                <CheckBox
                    label={item.name}
                    labelStyle={EditPropertyScreenStyle.amenitisListCheckboxLabelStyle}
                    checked={item.isChecked ? item.isChecked : false}
                    checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                    uncheckedImage={ImagePath.UNCHECK}
                    onChange={contextRef.onCheckBoxChangeListener.bind(contextRef, index)}
                />
            </View>
        );
    }

    onCheckBoxChangeListener(index) {

        var tempData = this.updateCheckBoxSelection(index, this.state.amenitiesListData);
        this.setState({ amenitiesListData: tempData });
    }

    callSaveAsDraft() {

        this.callSavePropertyApi();
    }


    render() {


        return (
            <View style={{ flex: 1 }}>
                {this.navBar()}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={EditPropertyScreenStyle.scrollViewContainerStyle}>
                    <View style={EditPropertyScreenStyle.headerContainer}>
                        <View style={EditPropertyScreenStyle.dotContainer}>
                            <View style={EditPropertyScreenStyle.blueDotStyle} />
                            <View style={EditPropertyScreenStyle.blueDotStyle} />
                            <View style={EditPropertyScreenStyle.blueDotStyle} />
                            <View style={EditPropertyScreenStyle.greyDotStyle} />
                        </View>

                    </View>

                    <View style={EditPropertyScreenStyle.addPropertyInputContainer}>
                        <Text style={EditPropertyScreenStyle.checkAllAmenitiesTextStyle}>{Strings.CHECK_ALL_AMENITIES}</Text>
                        <View style={EditPropertyScreenStyle.amenitiesListViewStyle}>
                            <FlatList
                                data={this.state.amenitiesListData}
                                extraData={this.state}
                                renderItem={this.renderItem}
                            />
                        </View>
                    </View>

                    <View style={EditPropertyScreenStyle.addPropertyInputContainer}>

                        <Text style={EditPropertyScreenStyle.labelStyle}>
                            {Strings.PROPERTY_DESCRIPTION}
                        </Text>
                        <TextInput style={EditPropertyScreenStyle.inputDescriptionTextStyle}
                            multiline={true} />

                    </View>

                </ScrollView>
                <View style={EditPropertyScreenStyle.buttonContainerStyle}>
                    { /*<TouchableOpacity onPress={() => this.callSaveAsDraft()}>
                                           <View style={EditPropertyScreenStyle.roundedTransparentDraftButtonStyle}>
                                               <Text style={EditPropertyScreenStyle.draftButtonTextStyle}>
                                                   {Strings.SAVE_AS_DRAFT}
                                               </Text>
                                           </View>
                                       </TouchableOpacity>*/}
                    <TouchableOpacity onPress={() => this.callProceedToFinalStep()}>
                        <View style={EditPropertyScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={EditPropertyScreenStyle.proceedButtonTextStyle}>
                                {Strings.PUBLISH}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    //23 Nov
                    this.props.editPropertyReducer.isScreenLoading ?
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
        editPropertyReducer: state.editPropertyReducer
    }
}

export default connect(
    mapStateToProps,
    {
        savePropertyAsDraft,
        addProperty,
        editProperty,
        getAmenitiesList,
        showLoading,
        resetState,
        clearAmenitiesRes
    }

)(EditPropertyScreenStepThree);

