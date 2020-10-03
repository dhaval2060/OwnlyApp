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
    getAmenitiesList,

} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,
    clearAmenitiesRes

} from "./AddPropertyAction";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import AddPropertyScreenStyle from './AddPropertyScreenStyle';
import CheckBox from 'react-native-checkbox';
import * as Progress from 'react-native-progress';
import { documentUpload } from '../../../Saga/APICaller';
let contextRef;
var amenitiesSelectedArrray = [];
var uploadedImageArray = [];
var isAmenitiesSelected = false;
class AddPropertyScreenStepThree extends Component {
    constructor() {
        super();
        this.state = {
            amenitiesListData: {},
            roleName: ''
        };
        contextRef = this;
    }

    componentWillReceiveProps(nextProps) {

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
        console.log(this.props, "this.props==")
        this.callGetAmenities();
        this.getRoleName();
        uploadedImageArray = this.props.uploadedImages;
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
    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {

                this.setState({ roleName: value });

            }
        }).done();
    }

    onAddPropertySuccess() {
        let lengthOfImgs = this.props.imgResponse;
        let imagesUploadedLength = 0
        if (this.props.addPropertyReducer.addPropertyResponse != '') {

            if (this.props.addPropertyReducer.addPropertyResponse.code == 200) {
                this.props.imgResponse && this.props.imgResponse.forEach(element => {
                    const body = new FormData();
                    const file = {
                        uri: element.path, // e.g. 'file:///path/to/file/image123.jpg'
                        name: 'image123.jpg', // e.g. 'image123.jpg',
                        type: 'image/jpg' // e.g. 'image/jpg'
                    };
                    body.append("file", file);
                    body.append("_id", this.props.addPropertyReducer.addPropertyResponse && this.props.addPropertyReducer.addPropertyResponse.data && this.props.addPropertyReducer.addPropertyResponse.data._id);
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
                                    imagesUploadedLength++
                                    // if (imagesUploadedLength == lengthOfImgs) {

                                    // }
                                }, async err => {
                                    console.log(err, "err===>>>>")
                                    imagesUploadedLength++
                                })
                        }
                    })
                });
                Actions.AddPropertyScreenFinalStep({ AddPropertyData: this.props.addPropertyReducer.addPropertyResponse });
                this.props.resetState();

            }
            else {
                alert(this.props.addPropertyReducer.addPropertyResponse.message);
                this.props.resetState();
            }
        }
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

    onGetAmenitiesSuccess() {

        if (this.props.addPropertyReducer.amenitiesListResponse != '') {
            if (this.props.addPropertyReducer.amenitiesListResponse.code == 200) {

                this.setState({ amenitiesListData: this.prePareAmenitiesData(this.props.addPropertyReducer.amenitiesListResponse.data) });

                this.props.clearAmenitiesRes();
            }
            else {
                alert(this.props.addPropertyReducer.amenitiesListResponse.message);
                this.props.clearAmenitiesRes();
            }
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

        //propertyName:'',
        //propertyCountry:'',
        //propertyOwner:'',

        this.state.amenitiesListData.map((data, index) => {


            if (this.state.amenitiesListData[index].isChecked) {
                isAmenitiesSelected = true;
            }
            var selectedAmenities = {
                amenity_id: this.state.amenitiesListData[index]._id,
                amenity_name: this.state.amenitiesListData[index].name,
                is_checked: this.state.amenitiesListData[index].isChecked
            }
            amenitiesSelectedArrray.push(selectedAmenities);

        })

        if (isAmenitiesSelected == false) {

            alert(Strings.EMPTY_PROPERTY_AMENETIES_ERROR);
        }
        else {

            var userData;
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    userData = JSON.parse(value);
                    var authToken = userData.token;

                    let addPropertyData = {

                        property_name: this.props.addPropertyReducer.propertyName,
                        country: this.props.addPropertyReducer.propertyCountry,
                        property_category: this.props.addPropertyReducer.propertyCategory.toLowerCase(),
                        property_type: this.props.addPropertyReducer.propertyType,
                        created_by: userData.data._id,
                        created_by_agency_id: userData.data.agency_id,

                        address: this.props.addPropertyReducer.propertyAddress,
                        description: this.props.addPropertyReducer.propertyDes,
                        number_of_bathroom: parseInt(this.props.addPropertyReducer.propertyBathroomNo),
                        number_of_parking: parseInt(this.props.addPropertyReducer.propertyCarNo),
                        floor_area: parseInt(this.props.addPropertyReducer.propertyFloorArea),
                        lot_erea: parseInt(this.props.addPropertyReducer.propertyLotArea),
                        other_amenity: '',
                        number_bedroom: parseInt(this.props.addPropertyReducer.propertyBedroomNo),
                        amenities: amenitiesSelectedArrray,
                        image: []

                    };
                    if (Strings.USER_ROLE_OWNER != this.state.roleName) {
                        addPropertyData.owned_by = this.props.addPropertyReducer.propertyOwnerId;
                    }
                    else {
                        addPropertyData.owned_by = userData.data._id;
                    }

                    this.props.showLoading();
                    this.props.addProperty(authToken, addPropertyData);
                }
            }).done();

        }

    }


    callSavePropertyApi() {

        //propertyName:'',
        //propertyCountry:'',
        //propertyOwner:'',

        this.state.amenitiesListData.map((data, index) => {


            if (this.state.amenitiesListData[index].isChecked) {

                isAmenitiesSelected = true;

            }
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

                    property_name: this.props.addPropertyReducer.propertyName,
                    country: this.props.addPropertyReducer.propertyCountry,
                    property_category: this.props.addPropertyReducer.propertyCategory.toLowerCase(),
                    property_type: this.props.addPropertyReducer.propertyType,
                    created_by: userData.data._id,
                    created_by_agency_id: userData.data.agency_id,
                    address: this.props.addPropertyReducer.propertyAddress,
                    description: this.props.addPropertyReducer.propertyDes,
                    number_of_bathroom: parseInt(this.props.addPropertyReducer.propertyBathroomNo),
                    number_of_parking: parseInt(this.props.addPropertyReducer.propertyCarNo),
                    floor_area: parseInt(this.props.addPropertyReducer.propertyFloorArea),
                    lot_erea: parseInt(this.props.addPropertyReducer.propertyLotArea),
                    other_amenity: '',
                    number_bedroom: parseInt(this.props.addPropertyReducer.propertyBedroomNo),
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
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NAV_ADD_NEW_PROPERTY_TITLE}</Text>
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

        var tempArray = amenitiesData;
        tempArray.map((data, index) => {

            tempArray[index].isChecked = false;
        })

        return tempArray;

    }

    updateCheckBoxSelection(selectedIndex, amenitiesData) {

        var tempArray = amenitiesData;
        tempArray.map((data, index) => {


            if (tempArray[selectedIndex].isChecked) {

                tempArray[selectedIndex].isChecked = false;
                isAmenitiesSelected = false;
            }
            else {
                tempArray[selectedIndex].isChecked = true;
                isAmenitiesSelected = true;

            }


        })

        return tempArray;

    }

    renderItem({ item, index }) {

        return (

            <View style={AddPropertyScreenStyle.amenitiesListItemContainerStyle}>
                <CheckBox

                    label={item.name}
                    labelStyle={AddPropertyScreenStyle.amenitisListCheckboxLabelStyle}
                    checked={item.isChecked}
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
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={AddPropertyScreenStyle.scrollViewContainerStyle}>
                    <View style={AddPropertyScreenStyle.headerContainer}>
                        <View style={AddPropertyScreenStyle.dotContainer}>
                            <View style={AddPropertyScreenStyle.blueDotStyle} />
                            <View style={AddPropertyScreenStyle.blueDotStyle} />
                            <View style={AddPropertyScreenStyle.blueDotStyle} />
                            <View style={AddPropertyScreenStyle.greyDotStyle} />
                        </View>


                    </View>

                    <View style={AddPropertyScreenStyle.addPropertyInputContainer}>
                        <Text style={AddPropertyScreenStyle.checkAllAmenitiesTextStyle}>{Strings.CHECK_ALL_AMENITIES}</Text>
                        <View style={AddPropertyScreenStyle.amenitiesListViewStyle}>
                            <FlatList
                                data={this.state.amenitiesListData}
                                extraData={this.state}
                                renderItem={this.renderItem}
                            />
                        </View>
                    </View>

                    <View style={AddPropertyScreenStyle.addPropertyInputContainer}>

                        <Text style={AddPropertyScreenStyle.labelStyle}>
                            {Strings.PROPERTY_DESCRIPTION}
                        </Text>
                        <TextInput style={AddPropertyScreenStyle.inputDescriptionTextStyle}
                            multiline={true} />

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
                    <TouchableOpacity onPress={() => this.callProceedToFinalStep()}>
                        <View style={AddPropertyScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={AddPropertyScreenStyle.proceedButtonTextStyle}>
                                {Strings.PUBLISH}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    //23 Nov
                    this.props.addPropertyReducer.isScreenLoading ?
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
        addPropertyReducer: state.addPropertyReducer
    }
}

export default connect(
    mapStateToProps,
    {
        savePropertyAsDraft,
        addProperty,
        getAmenitiesList,
        showLoading,
        resetState,
        clearAmenitiesRes
    }

)(AddPropertyScreenStepThree);

