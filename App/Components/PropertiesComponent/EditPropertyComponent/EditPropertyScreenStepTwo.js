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

import {

    showLoading,
    resetState,
    numberOfBedroomChanged,
    numberOfCarNoChanged,
    numberOfBathroomChanged,
    numberOfFloorAreaChanged,
    numberOfLotAreaChanged,
    clearUploadPropertyImageRes

} from "./EditPropertyAction";

import {
    savePropertyAsDraft,
    uploadImage,
} from "../../../Action/ActionCreators";

import API from '../../../Constants/APIUrls';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import EditPropertyScreenStyle from './EditPropertyScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
//import listData from  '../../../../data';
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

const CANCEL_INDEX = 2
const DESTRUCTIVE_INDEX = 3
const actionOptions = ['Upload Photo', 'Take Photo', 'Cancel']

let spinerData = [{
    value: '1',
}, { value: '2', }, { value: '3', }, { value: '4', }, {
    value: '5',
}, { value: '6', }, { value: '7', }, { value: '8', }, {
    value: '9',
}, { value: '10', }, { value: '11', }, { value: '12', }, {
    value: '13',
}, { value: '14', }, { value: '15', }, { value: '16', }, {
    value: '17',
}, { value: '18', }, { value: '19', }, {
    value: '20',
}



];

var uploadImagesArray = [];
var uploadedImagesPath = []
let contextRef;
class EditPropertyScreenStepTwo extends Component {
    constructor() {
        super();
        this.state = {
            uploadImagesData: {
                imageArray: []
            },
            selectedImage: '',

        };
        this.handlePress = this.handlePress.bind(this)
        contextRef = this;

    }

    componentDidUpdate() {
        this.onUploadImageSuccess();
        this.onSavePropertySuccess();
    }

    componentWillMount() {
        this.setData();
    }
    componentDidMount() {
        if (uploadImagesArray.length > 0) {
            this.uploadImageListSelection(0);
        }
    }

    closeAddProperty() {

        Actions.popTo('Dashboard');
    }

    callBack() {
        Actions.pop();
    }



    callProceedToStepThree() {
        this.state.uploadImagesData.imageArray.map((data, index) => {
            if (data.isFeatured == 1) {
                if (uploadedImagesPath[index]) {
                    uploadedImagesPath[index].isFeatured = true
                }
            }
            else {
                if (uploadedImagesPath[index]) {
                    uploadedImagesPath[index].isFeatured = false
                }
            }
        })
        // Actions.AddPropertyScreenStepThree({ imgResponse: this.state.imgResponse });
        Actions.EditPropertyScreenStepThree({ imgResponse: this.state.imgResponse, uploadedImages: uploadedImagesPath, propertyData: this.props.propertyData.data[0], amenities: this.props.propertyData.data[0].amenities });
    }

    setData() {
        uploadedImagesPath = this.props.propertyData.data[0].image
        this.props.numberOfBedroomChanged('' + this.props.propertyData.data[0].number_bedroom);
        this.props.numberOfCarNoChanged('' + this.props.propertyData.data[0].number_of_parking);
        this.props.numberOfBathroomChanged('' + this.props.propertyData.data[0].number_of_bathroom);
        this.props.numberOfFloorAreaChanged('' + this.props.propertyData.data[0].floor_area);
        this.props.numberOfLotAreaChanged('' + this.props.propertyData.data[0].lot_erea);
        this.prepareUploadedImageData();

    }

    onNoOfBedroomChange(text) {

        this.props.numberOfBedroomChanged(text);
        //this.setState({ errorMsg: '' });
        //this.setState({ errorOnTextField: '' });
    }
    onNoOfCarPortChange(text) {

        this.props.numberOfCarNoChanged(text);
        //this.setState({ errorMsg: '' });
        //this.setState({ errorOnTextField: '' });
    }
    onNoOfBathroomChange(text) {

        this.props.numberOfBathroomChanged(text);
        //this.setState({ errorMsg: '' });
        //this.setState({ errorOnTextField: '' });
    }
    onFloorAreaChange(text) {

        this.props.numberOfFloorAreaChanged(text);
        //this.setState({ errorMsg: '' });
        //this.setState({ errorOnTextField: '' });
    }
    onLotAreaChange(text) {

        this.props.numberOfLotAreaChanged(text);
        //this.setState({ errorMsg: '' });
        //this.setState({ errorOnTextField: '' });
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

                let source = { uri: response.uri };
                let imagePath = (Platform.OS == 'ios') ? response.origURL : response.path;
                var imageItem = {
                    'url': source,
                    'path': imagePath,
                    'isSelected': 0,
                    'isFeatured': 0
                }
                var imagagesData = { 'imageArray': [] }
                uploadImagesArray = this.state.uploadImagesData.imageArray
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
                this.setState({ imgResponse: uploadImagesArray })
                // AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                //     if (value) {
                //         var userData = JSON.parse(value);
                //         var authToken = userData.token;
                //this.props.showLoading();

                // this.props.uploadImage(authToken, response.uri.replace("file://", ""));
                //     }
                // }).done();



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
                    'isSelected': 0,
                    'isFeatured': 0
                }
                var imagagesData = { 'imageArray': [] }
                uploadImagesArray = this.state.uploadImagesData.imageArray
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
                this.setState({ imgResponse: uploadImagesArray })
                // AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                //     if (value) {
                //         var userData = JSON.parse(value);
                //         var authToken = userData.token;
                //this.props.showLoading();

                // this.props.uploadImage(authToken, response.uri.replace("file://", ""));
                //     }
                // }).done();



            }

        });
    }

    prepareUploadedImageData() {
        uploadImagesArray = []
        if (this.props.propertyData.data[0].image.length > 0) {
            this.props.propertyData.data[0].image.map((data, index) => {

                let source = { uri: API.PROPERTY_IMAGE_PATH + this.props.propertyData.data[0].image[index].path };
                var imageItem = {
                    'url': source,
                    'path': '',
                    'isSelected': 0,
                    'isFeatured': 0
                }
                uploadImagesArray.push(imageItem);

            })

            var imagagesData = {

                'imageArray': uploadImagesArray
            }

            this.setState({ uploadImagesData: imagagesData });

        }
    }

    onUploadImageSuccess() {
        if (this.props.editPropertyReducer.uploadPropertyImageRes != '') {
            if (this.props.editPropertyReducer.uploadPropertyImageRes.code == 200) {
                var imagePath = {
                    path: this.props.editPropertyReducer.uploadPropertyImageRes.data
                }
                uploadedImagesPath.push(imagePath);
            }
            else {
                alert('');
            }
            this.props.clearUploadPropertyImageRes();
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
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NAV_UPDATE_PROPERTY_TITLE}</Text>
                <TouchableOpacity onPress={() => this.callBack()} style={CommonStyles.navBackRightImageView}>
                    <Image source={ImagePath.HEADER_BACK} />
                </TouchableOpacity>

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
                    tempArray[index].isFeatured = 1;
                }

            }
            else {
                tempArray[position].isSelected = 0;
                tempArray[position].isFeatured = 0;
            }


        })
        tempData.imageArray = tempArray;
        this.setState({ uploadImagesData: tempData });
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
                    number_of_bathroom: parseInt(this.props.editPropertyReducer.propertyBathroomNo),
                    number_of_parking: parseInt(this.props.editPropertyReducer.propertyCarNo),
                    floor_area: parseInt(this.props.editPropertyReducer.propertyFloorArea),
                    lot_erea: parseInt(this.props.editPropertyReducer.propertyLotArea),
                    other_amenity: '',
                    number_bedroom: parseInt(this.props.editPropertyReducer.propertyBedroomNo),

                };
                this.props.showLoading();
                this.props.savePropertyAsDraft(authToken, addPropertyData);
            }
        }).done();



    }
    callSaveAsDraft() {
        this.callSavePropertyApi();
    }

    async onRemovePress(item, index) {

        var data = { imageArray: [] }
        this.state.uploadImagesData.imageArray.map((userData, index1) => {



            if (item != userData) {
                data.imageArray.push(userData)
            }
        });
        uploadedImagesPath.splice(index, 1);
        await this.setState({ uploadImagesData: data })

    }
    renderItem = ({ item, index }) => {


        return (
            <TouchableOpacity onPress={() => contextRef.uploadImageListSelection(index)}>
                <View style={EditPropertyScreenStyle.uploadImageListItemStyle}>
                    <Image source={item.url} style={EditPropertyScreenStyle.uploadPropertyListImageStyle} />
                </View>
                {
                    item.isSelected == 1 ? <View style={EditPropertyScreenStyle.selectedImageStyle}>
                        <View style={EditPropertyScreenStyle.roundedBlueFeaturedButtonStyle}>
                            <Text style={EditPropertyScreenStyle.featuredTextStyle}>
                                {Strings.FEATURED}
                            </Text>
                        </View>
                    </View> : null
                }
                <TouchableOpacity
                    onPress={async () => this.onRemovePress(item, index)}
                    style={{ paddingTop: 5, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: 'black' }}>
                        REMOVE
                 </Text>
                </TouchableOpacity>
            </TouchableOpacity>

        );
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
                            <View style={EditPropertyScreenStyle.greyDotStyle} />
                            <View style={EditPropertyScreenStyle.greyDotStyle} />
                        </View>

                        <Text style={EditPropertyScreenStyle.addPropertyTitleStyle}>
                            {Strings.PROVIDE_DETAILS_ABOUT_THIS_LISTING}
                        </Text>

                        <Text style={EditPropertyScreenStyle.addPropertyInstructionTextStyle}>
                            {Strings.DUMMY_TEXT}
                        </Text>
                    </View>

                    <View style={EditPropertyScreenStyle.addPropertyInputContainer}>

                        <Text style={EditPropertyScreenStyle.labelStyle}>
                            {Strings.NUMBER_OF_BEDROOMS}
                        </Text>
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={EditPropertyScreenStyle.dropDownTextStyle}
                            containerStyle={EditPropertyScreenStyle.dropDownViewStyle}

                            data={spinerData}
                            onChangeText={this.onNoOfBedroomChange.bind(this)}
                            value={this.props.editPropertyReducer.propertyBedroomNo}
                        />

                        <Text style={EditPropertyScreenStyle.labelStyle}>
                            {Strings.NUMBER_OF_CAR_PORT}
                        </Text>
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={EditPropertyScreenStyle.dropDownTextStyle}
                            containerStyle={EditPropertyScreenStyle.dropDownViewStyle}
                            data={spinerData}
                            onChangeText={this.onNoOfCarPortChange.bind(this)}
                            value={this.props.editPropertyReducer.propertyCarNo}
                        />

                        <Text style={EditPropertyScreenStyle.labelStyle}>
                            {Strings.NUMBER_OF_BATHROOMS}
                        </Text>
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={EditPropertyScreenStyle.dropDownTextStyle}
                            containerStyle={EditPropertyScreenStyle.dropDownViewStyle}
                            data={spinerData}
                            onChangeText={this.onNoOfBathroomChange.bind(this)}
                            value={this.props.editPropertyReducer.propertyBathroomNo}
                        />

                        <Text style={EditPropertyScreenStyle.labelStyle}>
                            {Strings.FLOOR_AREA}
                        </Text>
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={EditPropertyScreenStyle.dropDownTextStyle}
                            containerStyle={EditPropertyScreenStyle.dropDownViewStyle}
                            data={spinerData}
                            onChangeText={this.onFloorAreaChange.bind(this)}
                            value={this.props.editPropertyReducer.propertyFloorArea}
                        />

                        <Text style={EditPropertyScreenStyle.labelStyle}>
                            {Strings.LOT_AREA}
                        </Text>
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={EditPropertyScreenStyle.dropDownTextStyle}
                            containerStyle={EditPropertyScreenStyle.dropDownViewStyle}
                            data={spinerData}
                            onChangeText={this.onLotAreaChange.bind(this)}
                            value={this.props.editPropertyReducer.propertyLotArea}
                        />
                    </View>

                    <View>

                        <View style={EditPropertyScreenStyle.uploadImageListContainerView}>
                            <Text style={EditPropertyScreenStyle.maxImageTextStyle}>{Strings.MAX_IMAGE_LIMIT}</Text>
                            {
                                this.state.selectedImage != ''
                                    ?
                                    <Image source={this.state.selectedImage} style={EditPropertyScreenStyle.uploadPropertyImageStyle} />

                                    :
                                    null
                            }
                            <View style={{ marginTop: 10 }}>
                                {
                                    this.state.uploadImagesData.imageArray ?
                                        <FlatList
                                            horizontal={true}
                                            data={this.state.uploadImagesData.imageArray}
                                            renderItem={this.renderItem}
                                            extraData={this.state}
                                        /> : null
                                }

                            </View>
                            <TouchableOpacity style={EditPropertyScreenStyle.uploadImageButtonStyle} onPress={() => this.showActionSheet()}  >
                                <View >
                                    <Text style={EditPropertyScreenStyle.uploadButtonTextStyle}>
                                        {Strings.UPLOAD_IMAGE}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>



                </ScrollView>
                <View style={EditPropertyScreenStyle.buttonContainerStyle}>
                    <TouchableOpacity onPress={() => this.callSaveAsDraft()}>
                        <View style={EditPropertyScreenStyle.roundedTransparentDraftButtonStyle}>
                            <Text style={EditPropertyScreenStyle.draftButtonTextStyle}>
                                {Strings.SAVE_AS_DRAFT}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.callProceedToStepThree()}>
                        <View style={EditPropertyScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={EditPropertyScreenStyle.proceedButtonTextStyle}>
                                {Strings.PROCEED}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={actionOptions}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={this.handlePress}
                />
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
        showLoading,
        resetState,
        savePropertyAsDraft,
        uploadImage,
        numberOfBedroomChanged,
        numberOfCarNoChanged,
        numberOfBathroomChanged,
        numberOfFloorAreaChanged,
        numberOfLotAreaChanged,
        clearUploadPropertyImageRes
    }

)(EditPropertyScreenStepTwo)

