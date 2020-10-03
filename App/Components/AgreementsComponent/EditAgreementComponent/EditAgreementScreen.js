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

    uploadAgreementImage,
    updateAgreement,
    getAgreementPropertyTenantsList,
    getAgreementPropertyOwnerList,
    getPropertyOwnerList,
    getAgreementPropertyList,

} from "../../../Action/ActionCreators";

import {
    clearUploadAgreementImageRes,
    searchTenantsChanged,
    clearTenantsData,
    clearOwnerData,
    propertyOwnerChanged,
    propertyNameChanged,
    showLoading,
    resetState,
    clearAgencyData,
    updateAgreementData,
    clearUpdatedAgreementData

} from "./EditAgreementAction";


import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import EditAgreementScreenStyle from './EditAgreementScreenStyle';

import { Dropdown } from 'react-native-material-dropdown';

import ImagePicker from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet'
import API from '../../../Constants/APIUrls';
import DatePicker from 'react-native-datepicker'
import Moment from 'moment';
import * as Progress from 'react-native-progress';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import APICaller, { documentUpload } from '../../../Saga/APICaller';
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

const CANCEL_INDEX = 3
const DESTRUCTIVE_INDEX = 4
const actionOptions = ['Upload Photo', 'Take Photo', 'Document', 'Cancel'];

let spinerData = [{ value: 'Monthly' }, { value: 'Yearly' }];

var uploadImagesArray = [];
var uploadedImagesPath = [];
var tenantsArray = [];
let contextRef;
var PropertyData = {};
var MaintenanceData = [];
var agreementImageArray = []
class EditAgreementScreen extends Component {
    constructor() {
        super();
        this.state = {
            uploadImagesData: {},
            selectedImage: '',
            selectedPropertyId: '',
            selectedOwnerId: '',
            tenantsData: [],
            tenantsSearchedData: [],
            agencyData: [],
            removeArr: [],
            ownerData: [],
            selectedTenantsData: [],
            isSearchTenantsListShow: false,
            minDate: Moment().format('MMM DD YYYY'),
            rentAmount: '',
            paymentMode: 0,
            paymentModeVal: '',
            errorMsg: '',
            errorOnTextField: '',
            agreementDetail: [],
            agreementDetail: ''

        };
        this.handlePress = this.handlePress.bind(this)
        contextRef = this;

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onGetAgencySuccess();
        this.onGetPropertyOwnerSuccess();
        this.onGetTenantsSuccess();
        this.onUpdateAgreementSuccess();
        this.onUploadImageSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.getAlltenancies()
        agreementImageArray = []
        tenantsArray = [];
        this.callGetAgencyProperty();
        this.setState({ agreementDetail: this.props.agreementData });

    }

    async setAgreementData() {

        {
            this.state.agreementDetail.length > 0
                ?
                PropertyData = this.state.agreementDetail[0].propertyData ? this.state.agreementDetail[0].propertyData : {}
                : {}
        }

        {
            this.state.agreementDetail.length > 0
                ?
                MaintenanceData = this.state.agreementDetail[1].maintenanceData ? this.state.agreementDetail[1].maintenanceData : {}
                : {}
        }

        
        this.props.propertyNameChanged(PropertyData.property_id.address);
        this.setState({ selectedPropertyId: PropertyData.property_id._id });
        this.callGetPropertyOwner(PropertyData.property_id._id);
        this.callGetTenantsList(PropertyData.property_id._id);
        this.pushTenantsData(PropertyData.tenants);
        await this.setState({ rentAmount: PropertyData.rent_price.toString() });
        await this.prepareUploadedImageData(PropertyData.images);
        
        this.setState({ agreementDetail: PropertyData.detail });
        if (PropertyData.terms == 1) {
            this.setState({ paymentModeVal: 'Monthly' });
        }
        else {
            this.setState({ paymentModeVal: 'Yearly' });
        }
        this.setState({ date: Moment(PropertyData.tenancy_start_date).format(Strings.DATE_FORMATE) });
        this.setState({ rentalValidityDate: Moment(PropertyData.case_validity).format(Strings.DATE_FORMATE) });


    }


    closeAddProperty() {

        Actions.pop();
    }



    callGetAgencyProperty() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                AsyncStorage.getItem("roleId").then((role) => {
                    if (role) {
                        var postData = {
                            request_by_id: userData.data._id,
                            request_by_role: role,
                        }
                        this.props.showLoading();
                        this.props.getAgreementPropertyList(authToken, postData);
                    }
                }).done();
            }
        }).done();
    }

    onGetAgencySuccess() {

        if (this.props.editAgreementReducer.agencyListResponse != '') {

            if (this.props.editAgreementReducer.agencyListResponse.code == 200) {

                this.setState({ agencyData: this.preparePropertyData(this.props.editAgreementReducer.agencyListResponse.data) });
                this.setAgreementData();
            }
            else {

                alert(this.props.editAgreementReducer.agencyListResponse.message);
            }
            this.props.clearAgencyData();

        }
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
    pushTenantsData(tenantsData) {


        var tempArray = [];
        tenantsData.map((data, index) => {

            tempArray.push(tenantsData[index].users_id);
            var tempData = {
                _id: tenantsData[index].users_id._id
            }
            tenantsArray.push(tempData);

        })
        this.setState({ selectedTenantsData: tempArray })

    }

    prepareUploadedImageData(imagesData) {
        // if (this.state.uploadImagesData.length <= imagesData.length) {
        
        uploadImagesArray = []
        imagesData.map((data, index) => {
            var imageItem = {
                'url': imagesData[index].path,
                '_id': imagesData[index]._id,
                'status': imagesData[index].status,
                'path': imagesData[index].path,
                'isSelected': 0
            }
            uploadImagesArray.push(imageItem);
            var imagagesData = {
                'imageArray': uploadImagesArray
            }
            this.setState({ uploadImagesData: imagagesData });
        })
        // }

    }


    callGetTenantsList(propertyId) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                
                this.props.showLoading();
                this.props.getAgreementPropertyTenantsList(authToken, propertyId);
            }
        }).done();
    }

    onGetTenantsSuccess() {

        if (this.props.editAgreementReducer.tenantsListResponse != '') {

            if (this.props.editAgreementReducer.tenantsListResponse.code == 200) {

                this.setState({ tenantsData: this.props.editAgreementReducer.tenantsListResponse.data, tenantsSearchedData: this.props.editAgreementReducer.tenantsListResponse.data });
            }
            else {

                alert(this.props.editAgreementReducer.tenantsListResponse.message);
            }
            this.props.clearTenantsData();
        }
    }


    callGetPropertyOwner(propertyId) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                
                this.props.showLoading();
                this.props.getAgreementPropertyOwnerList(authToken, propertyId);
            }
        }).done();
    }

    onGetPropertyOwnerSuccess() {

        if (this.props.editAgreementReducer.ownerListResponse != '') {

            if (this.props.editAgreementReducer.ownerListResponse.code == 200) {
                
                this.setState({ ownerData: this.prepareOwnerData(this.props.editAgreementReducer.ownerListResponse.data) });

            }
            else {

                alert(this.props.editAgreementReducer.ownerListResponse.message);
            }
            this.props.clearOwnerData();
        }
    }

    getAlltenancies() {

        AsyncStorage.getItem("SyncittUserInfo").then(value => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postBody = {
                    number_of_pages: "",
                    page_number: "",
                    user_id: userData.data._id
                };
                
                APICaller(
                    "allTenentsFromDatabase",
                    "POST",
                    authToken,
                    postBody
                ).then(data => {
                    
                    if (data.code == 200) {
                        this.setState({
                            tenantDataBackUp: data.data,
                            tenantData: data.data
                        });
                    }
                });
            }
        });
    }

    prepareOwnerData(ownerList) {

        var tempArray = [];
        ownerList.map((data, index) => {
            var ownerInfo = ownerList[index].owned_by;
            var tempData = {

                value: ownerInfo.firstname + ' ' + ownerInfo.lastname,
                id: ownerInfo._id
            }
            
            
            if (PropertyData.owner_id == ownerInfo._id) {

                this.props.propertyOwnerChanged(ownerInfo.firstname + ' ' + ownerInfo.lastname);
                this.setState({ selectedOwnerId: ownerInfo._id });
            }
            tempArray.push(tempData);

        })
        
        return tempArray;
    }


    callAddAgreementApi(isSaveAsDraft) {
        this.agreementUploadImage(PropertyData._id, isSaveAsDraft)





    }


    onUpdateAgreementSuccess() {

        if (this.props.editAgreementReducer.updateAgreementRes != '') {

            if (this.props.editAgreementReducer.updateAgreementRes.code == 200) {
                this.props.updateAgreementData('agreementUpdated');
                uploadImagesArray = [];
                uploadedImagesPath = [];
                tenantsArray = [];
                Actions.pop();

            }
            else {

                alert(this.props.editAgreementReducer.updateAgreementRes.message);
            }
            this.props.clearUpdatedAgreementData();
        }
    }

    onPropertySelectChange(text) {

        this.props.propertyNameChanged(text);
        this.setState({ selectedPropertyId: this.state.agencyData[this.refs.ref_property.selectedIndex()].id });
        this.callGetPropertyOwner(this.state.agencyData[this.refs.ref_property.selectedIndex()].id);
        this.callGetTenantsList(this.state.agencyData[this.refs.ref_property.selectedIndex()].id);
    }
    onPropertyOwnerChange(text) {

        this.props.propertyOwnerChanged(text);
        this.setState({ selectedOwnerId: this.state.ownerData[this.refs.ref_owner.selectedIndex()].id });

    }

    onTenantsNameChange(text) {

        this.props.searchTenantsChanged(text);
        this.setState({ isSearchTenantsListShow: true });
        this.SearchTenantsFunction(text);
    }

    onRentChange(text) {

        this.setState({ rentAmount: text });
    }

    onDetailChange(text) {
        this.setState({ agreementDetail: text });
    }
    onModeOfPaymentChange(text) {

        this.setState({ paymentModeVal: text });
        if (text = 'Monthly') {

            this.setState({ paymentMode: 0 });

        }
        else {

            this.setState({ paymentMode: 1 });
        }

    }

    async onTenantsSelect(item) {
        this.showSearchTenantsList();
        this.props.searchTenantsChanged('');
        let flag = true
        await tenantsArray.forEach(element => {
            if (element._id == item._id) {
                flag = false
            }
        });
        if (flag == true) {
            var tempData = {
                _id: item._id
            }
            tenantsArray.push(tempData);
            let arr = this.state.selectedTenantsData
            arr.push(item)
            // this.state.selectedTenantsData.push(item);
            this.setState({ selectedTenantsData: arr })
            
        }
    }


    showSearchTenantsList() {

        if (this.state.isSearchTenantsListShow == false) {

            this.setState({ isSearchTenantsListShow: true });
        }
        else {

            this.setState({ isSearchTenantsListShow: false });
        }
    }


    SearchTenantsFunction(text) {


        const newData = this.state.tenantDataBackUp.filter(function (item) {

            const itemData = item.firstname.toUpperCase();
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            tenantData: newData,
        })
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
                const file = {
                    uri: response.uri, // e.g. 'file:///path/to/file/image123.jpg'
                    name: response.fileName, // e.g. 'image123.jpg',
                    type: response.type // e.g. 'image/jpg'
                };
                agreementImageArray.push(file)
                // AsyncStorage.getItem("SyncittUserInfo")
                // .then(value => {
                //   if (value) {
                //     var userData = JSON.parse(value);
                //     var authToken = userData.token;
                //     const body = new FormData();
                //     body.append("file", file);
                //     body.append("_id", userData.data._id);
                //     documentUpload(
                //       "uploadAgreementDocs",
                //       authToken,
                //       body,
                //       userData.data._id
                //     ).then(
                //       data => {
                
                //         if (data.code == 200) {
                //           var arr = this.state.document_id;
                //           this.setState({ document_id: arr, isScreenLoading: false });
                //         }
                //       },
                //       err => {
                //         this.setState({ isScreenLoading: false });
                //       }
                //     );
                //   }
                // })
                // .done();
                // AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                //     if (value) {
                //         var userData = JSON.parse(value);
                //         var authToken = userData.token;
                //         this.props.showLoading();
                
                //         this.props.uploadAgreementImage(authToken, response.uri.replace("file://", ""), response.fileName, 'image/jpeg');
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
                const file = {
                    uri: response.uri, // e.g. 'file:///path/to/file/image123.jpg'
                    name: response.fileName, // e.g. 'image123.jpg',
                    type: response.type // e.g. 'image/jpg'
                };
                agreementImageArray.push(file)
                // AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                //     if (value) {
                //         var userData = JSON.parse(value);
                //         var authToken = userData.token;
                //         this.props.showLoading();
                
                //         this.props.uploadAgreementImage(authToken, response.uri.replace("file://", ""), response.fileName, 'image/jpeg');
                //     }
                // }).done();



            }

        });
    }


    onUploadImageSuccess() {

        if (this.props.editAgreementReducer.uploadedImageRes != '') {
            if (this.props.editAgreementReducer.uploadedImageRes.code == 200) {
                
                var imagePath = {
                    path: this.props.editAgreementReducer.uploadedImageRes.data
                }
                uploadedImagesPath.push(imagePath);
            }
            else {

                alert(this.props.editAgreementReducer.uploadedImageRes.message);
            }
            this.props.clearUploadAgreementImageRes();
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
        else if (i == 2) {
            this.openFileChooser();
        }
    }

    agreementUploadImage(aid, isSaveAsDraft) {
        
        let uploadCounter = 0
        

        if (agreementImageArray.length > 0) {

            AsyncStorage.getItem("SyncittUserInfo")
                .then(value => {
                    if (value) {
                        var userData = JSON.parse(value);
                        var authToken = userData.token;
                        agreementImageArray.forEach(element => {
                            
                            if (element.id == undefined) {
                                const body = new FormData();
                                body.append("file", element);
                                body.append("_id", aid);
                                documentUpload(
                                    "uploadAgreementDocs",
                                    authToken,
                                    body,
                                    userData.data._id
                                ).then(
                                    async data => {
                                        uploadCounter++
                                        let imageArr = this.state.uploadImagesData.imageArray
                                        newArr = data.data.images
                                        data.data.images.forEach(resImgItem => {
                                            this.state.removeArr.forEach(removeItem => {
                                                if (resImgItem.path == removeItem.path) {
                                                    newArr.splice(newArr.indexOf(resImgItem), 1);
                                                }
                                            });
                                        });
                                        this.setState({ uploadImagesData: { imageArray: newArr } })
                                        if (data.code == 200) {
                                            var arr = this.state.document_id;
                                            this.setState({ document_id: arr, isScreenLoading: false });
                                            if (uploadCounter == agreementImageArray.length) {
                                                if (this.props.editAgreementReducer.propertyName == 'Select Property') {
                                                    this.setState({ errorMsg: Strings.ERROR_SELECT_PROPERTY });
                                                    this.setState({ errorOnTextField: 0 });
                                                }
                                                else {

                                                    AsyncStorage.getItem("SyncittUserInfo").then((value) => {

                                                        if (value) {
                                                            var userData = JSON.parse(value);
                                                            var authToken = userData.token;

                                                            AsyncStorage.getItem("roleId").then((role) => {
                                                                if (role) {
                                                                    var postData = {
                                                                        agreement_id: PropertyData._id,
                                                                        created_by: userData.data._id,
                                                                        property_id: this.state.selectedPropertyId,
                                                                        owner_id: this.state.selectedOwnerId,
                                                                        agency_id: userData.data.agency_id,
                                                                        created_by_role: role,
                                                                        case_validity: this.state.rentalValidityDate,
                                                                        tenancy_start_date: this.state.date,
                                                                        rent_price: parseInt(this.state.rentAmount),
                                                                        rental_period: this.state.paymentMode,
                                                                        save_as_draft: isSaveAsDraft,
                                                                        tenants: tenantsArray,
                                                                        detail: this.state.agreementDetail,
                                                                        images: newArr
                                                                    };
                                                                    
                                                                    this.props.showLoading();
                                                                    this.props.updateAgreement(authToken, postData);
                                                                }
                                                            }).done();
                                                            
                                                        }

                                                    }).done();
                                                }
                                            }
                                        }
                                    },
                                    err => {
                                        
                                        this.setState({ isScreenLoading: false });
                                    }
                                );
                            }
                        });
                    }
                })
        }
        else {
            if (this.props.editAgreementReducer.propertyName == 'Select Property') {
                this.setState({ errorMsg: Strings.ERROR_SELECT_PROPERTY });
                this.setState({ errorOnTextField: 0 });
            }
            else {
                AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                    if (value) {
                        var userData = JSON.parse(value);
                        var authToken = userData.token;

                        AsyncStorage.getItem("roleId").then((role) => {
                            if (role) {
                                var postData = {
                                    agreement_id: PropertyData._id,
                                    created_by: userData.data._id,
                                    property_id: this.state.selectedPropertyId,
                                    owner_id: this.state.selectedOwnerId,
                                    agency_id: userData.data.agency_id,
                                    created_by_role: role,
                                    case_validity: this.state.rentalValidityDate,
                                    tenancy_start_date: this.state.date,
                                    rent_price: parseInt(this.state.rentAmount),
                                    rental_period: this.state.paymentMode,
                                    save_as_draft: isSaveAsDraft,
                                    tenants: tenantsArray,
                                    detail: this.state.agreementDetail,
                                    images: this.state.uploadImagesData.imageArray
                                };
                                
                                this.props.showLoading();
                                this.props.updateAgreement(authToken, postData);
                            }
                        }).done();
                    }

                }).done();
            }
        }

    }
    openFileChooser() {
        // iPhone/Android
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        }, (error, res) => {
            // Android
            
            const file = {
                uri: res.uri, // e.g. 'file:///path/to/file/image123.jpg'
                name: res.fileName, // e.g. 'image123.jpg',
                type: res.type // e.g. 'image/jpg'
            };
            agreementImageArray.push(file)
            // AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            //     if (value) {
            //         var userData = JSON.parse(value);
            //         var authToken = userData.token;

            //         //this.props.showLoading();
            
            //         this.props.showLoading();
            //         this.props.uploadAgreementImage(authToken, res.uri.replace("file://", ""), res.fileName, res.type);
            //         // this.props.uploadMyFileDoc(authToken, res.uri.replace("file://", ""), userData.data._id, res.type, res.fileName);
            //     }
            // }).done();

        });
    }

    navBar() {
        return (
            <View >

                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.AGREEMENTS}</Text>
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


    renderItem = ({ item, index }) => {
        
        var path = '';
        
        if (item.url && item.url.uri) {
            path = item.url.uri
        }
        else {
            path = API.AGREEMENT_PATH + item.path;
        }
        return (
            <TouchableOpacity onPress={() => contextRef.uploadImageListSelection(index)}>
                <View style={EditAgreementScreenStyle.uploadImageListItemStyle}>
                    <Image source={{ uri: path }} style={EditAgreementScreenStyle.uploadPropertyListImageStyle} />
                </View>
                <TouchableOpacity onPress={() => {
                    let arr = this.state.uploadImagesData.imageArray
                    let removeArr = this.state.removeArr
                    let index = arr.indexOf(item)
                    if (index > -1) {
                        arr.splice(index, 1);
                        removeArr.push(item)
                    }
                    if (agreementImageArray.length > 0) {
                        let newAgreementImageArr = []
                        agreementImageArray.map(imageRes => {
                            
                            if (imageRes.uri != item.url.uri) {
                                newAgreementImageArr.push(imageRes)
                                
                            }
                        })
                        agreementImageArray = newAgreementImageArr
                    }
                    
                    // this.state.uploadImagesData.imageArray = arr
                    this.setState({ removeArr: removeArr, uploadImagesData: { imageArray: arr } })

                }}>
                    <Text>
                        Remove
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    renderSearchTenantsItem({ item, index }) {

        return (

            <TouchableOpacity onPress={contextRef.onTenantsSelect.bind(contextRef, item)}>
                <Text style={EditAgreementScreenStyle.searchTraderListItemTextStyle}>{item.firstname + ' ' + item.lastname}</Text>
            </TouchableOpacity>
        );
    }

    searchRenderItem = ({ item, index }) => {

        return (

            <View style={EditAgreementScreenStyle.serachListItemContainer} >

                <Text style={EditAgreementScreenStyle.searchListItemTextStyle}>{item.firstname + ' ' + item.lastname}</Text>
                <TouchableOpacity onPress={async () => {
                    let arr = this.state.selectedTenantsData
                    let arr1 = tenantsArray
                    let temp = []
                    let temp1 = []
                    await arr.forEach(element => {
                        if (element._id != item._id) {
                            temp.push(element)
                        }
                    });
                    await arr1.forEach(element => {
                        if (element._id != item._id) {
                            temp1.push(element)
                        }
                    });
                    this.setState({ selectedTenantsData: temp })
                    tenantsArray = temp1
                }}>
                    <Image source={ImagePath.DRAWER_CROSS_ICON} style={EditAgreementScreenStyle.searchListItemCloseImageStyle} />
                </TouchableOpacity>

            </View>
        );
    }

    render() {

        return (
            <View style={EditAgreementScreenStyle.mainContainer}>
                {this.navBar()}


                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={EditAgreementScreenStyle.scrollViewContainerStyle}>

                    <View style={EditAgreementScreenStyle.addPropertyInputContainer}>
                        <View style={EditAgreementScreenStyle.labelContainerStyle}>
                            <Text style={EditAgreementScreenStyle.labelStyle}>
                                {Strings.SELECT_PROPERTY}
                            </Text>
                        </View>
                        <Dropdown
                            ref='ref_property'
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={EditAgreementScreenStyle.dropDownTextStyle}
                            containerStyle={EditAgreementScreenStyle.dropDownViewStyle}
                            data={this.state.agencyData}
                            onChangeText={this.onPropertySelectChange.bind(this)}
                            value={this.props.editAgreementReducer.propertyName}
                        />
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 0 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }

                        <View style={EditAgreementScreenStyle.labelContainerStyle}>
                            <Text style={EditAgreementScreenStyle.labelStyle}>
                                {Strings.ADD_TENANT}
                            </Text>
                        </View>

                        <View style={EditAgreementScreenStyle.searchViewStyle}>
                            <TextInput
                                placeholder={Strings.SEARCH_TENANT}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={EditAgreementScreenStyle.searchTextInputStyle}
                                onChangeText={this.onTenantsNameChange.bind(this)}
                                value={this.props.editAgreementReducer.tenantSearch}
                            />
                            <Image source={ImagePath.SEARCH_ICON} style={EditAgreementScreenStyle.searchImageStyle} />
                        </View>

                        {/* {
                            (this.state.isSearchTenantsListShow == true) ?

                                <FlatList
                                    style={[EditAgreementScreenStyle.tenantsListContainerStyles, { flex: 1 }]}
                                    data={this.state.tenantDataBackUp}
                                    renderItem={this.renderSearchTenantsItem}
                                    extraData={this.state}
                                />
                                : null
                        } */}
                        {/* <ScrollView style={{ height: 150 }}>
                                </ScrollView> */}
                        {
                            (this.state.isSearchTenantsListShow == true) ?
                                <FlatList
                                    style={[EditAgreementScreenStyle.tenantsListContainerStyles, { flex: 1 }]}
                                    data={this.state.tenantData}
                                    renderItem={this.renderSearchTenantsItem}
                                    extraData={this.state}
                                />
                                :
                                null
                        }
                        <FlatList
                            horizontal={false}
                            numColumns={2}
                            data={this.state.selectedTenantsData}
                            renderItem={this.searchRenderItem}
                            extraData={this.state}
                        />

                        <Text style={EditAgreementScreenStyle.labelStyle}>
                            {Strings.PROPERTY_OWNER}
                        </Text>

                        <Dropdown
                            ref='ref_owner'
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={EditAgreementScreenStyle.dropDownTextStyle}
                            containerStyle={EditAgreementScreenStyle.dropDownViewStyle}
                            data={this.state.ownerData}
                            onChangeText={this.onPropertyOwnerChange.bind(this)}
                            value={this.props.editAgreementReducer.ownerName}

                        />
                        <View style={EditAgreementScreenStyle.labelContainerStyle}>
                            <Text style={EditAgreementScreenStyle.labelStyle}>
                                {Strings.TENANCY_START_DATE}
                            </Text>
                        </View>
                        <View style={EditAgreementScreenStyle.searchViewStyle}>
                            <DatePicker
                                style={EditAgreementScreenStyle.datePickerStyle}
                                date={this.state.date}
                                mode="date"
                                placeholder="select date"
                                format='MMM DD YYYY'
                                minDate={this.state.minDate}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        right: 0,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        marginLeft: 0,
                                        position: 'absolute',
                                        left: 5,
                                        borderBottomWidth: 0,
                                        borderLeftWidth: 0,
                                        borderTopWidth: 0,
                                        borderRightWidth: 0,
                                    }
                                    // ... You can check the source to find the other keys. 
                                }}
                                onDateChange={(date) => {
                                    
                                    let today = new Date()
                                    let sDate = new Date(date)
                                    if (sDate.getTime() < today.getTime()) {
                                        this.setState({ date: this.state.minDate })
                                    }
                                    else {
                                        this.setState({ date: date })
                                    }
                                }}

                            />
                        </View>

                        <Text style={EditAgreementScreenStyle.labelStyle}>
                            {Strings.RENT}
                        </Text>

                        <View style={EditAgreementScreenStyle.searchViewStyle}>
                            <TextInput
                                placeholder={''}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={EditAgreementScreenStyle.searchTextInputStyle}
                                onChangeText={this.onRentChange.bind(this)}
                                value={this.state.rentAmount}
                            />

                        </View>

                        <Text style={EditAgreementScreenStyle.labelStyle}>
                            {Strings.MODE_OF_PAYMENT}
                        </Text>
                        <Dropdown
                            ref='ref_payment_mode'
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            itemTextStyle={EditAgreementScreenStyle.dropDownTextStyle}
                            containerStyle={EditAgreementScreenStyle.dropDownViewStyle}
                            data={spinerData}
                            onChangeText={this.onModeOfPaymentChange.bind(this)}
                            value={this.state.paymentModeVal}
                        />
                        <View style={EditAgreementScreenStyle.labelContainerStyle}>
                            <Text style={EditAgreementScreenStyle.labelStyle}>
                                {Strings.RENTAL_CASE_VALIDITY}
                            </Text>
                        </View>
                        <View style={EditAgreementScreenStyle.searchViewStyle}>
                            <DatePicker
                                style={EditAgreementScreenStyle.datePickerStyle}
                                date={this.state.rentalValidityDate}
                                mode="date"
                                placeholder="select date"
                                format='MMM DD YYYY'
                                minDate={this.state.minDate}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        right: 0,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        marginLeft: 0,
                                        position: 'absolute',
                                        left: 5,
                                        borderBottomWidth: 0,
                                        borderLeftWidth: 0,
                                        borderTopWidth: 0,
                                        borderRightWidth: 0,
                                    }
                                    // ... You can check the source to find the other keys. 
                                }}
                                onDateChange={(date) => { this.setState({ rentalValidityDate: date }) }}
                            />
                        </View>
                        <Text style={EditAgreementScreenStyle.labelStyle}>
                            {Strings.AGREEMENT_DETAILS}
                        </Text>
                        <TextInput style={EditAgreementScreenStyle.inputDescriptionTextStyle}
                            multiline={true}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            onChangeText={this.onDetailChange.bind(this)}
                            value={this.state.agreementDetail}
                        />

                    </View>

                    <View>

                        <View style={EditAgreementScreenStyle.uploadImageListContainerView}>
                            <Text style={EditAgreementScreenStyle.maxImageTextStyle}>{Strings.MAX_IMAGE_LIMIT}</Text>
                            {
                                this.state.selectedImage != ''
                                    ?
                                    <Image source={{ uri: API.AGREEMENT_PATH + this.state.selectedImage }} style={EditAgreementScreenStyle.uploadPropertyImageStyle} />
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
                            <TouchableOpacity style={EditAgreementScreenStyle.uploadImageButtonStyle} onPress={() => this.showActionSheet()}  >
                                <View >
                                    <Text style={EditAgreementScreenStyle.uploadButtonTextStyle}>
                                        {Strings.UPLOAD_IMAGE}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>



                </ScrollView>
                <View style={EditAgreementScreenStyle.buttonContainerStyle}>
                    {
                        /*<TouchableOpacity onPress={() => this.callAddAgreementApi(true)}>
                            <View style={EditAgreementScreenStyle.roundedTransparentDraftButtonStyle}>
                                <Text style={EditAgreementScreenStyle.draftButtonTextStyle}>
                                    {Strings.SAVE_AS_DRAFT}
                                </Text>
                            </View>
                        </TouchableOpacity>*/
                    }
                    <TouchableOpacity onPress={() => this.callAddAgreementApi(false)}>
                        <View style={EditAgreementScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={EditAgreementScreenStyle.proceedButtonTextStyle}>
                                {Strings.SAVE}
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

                {


                    this.props.editAgreementReducer.isScreenLoading ?
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

        editAgreementReducer: state.editAgreementReducer
    }
}

export default connect(
    mapStateToProps,
    {
        clearUploadAgreementImageRes,
        updateAgreement,
        searchTenantsChanged,
        getAgreementPropertyTenantsList,
        propertyOwnerChanged,
        getAgreementPropertyOwnerList,
        getPropertyOwnerList,
        propertyNameChanged,
        getAgreementPropertyList,
        showLoading,
        resetState,
        clearOwnerData,
        clearTenantsData,
        uploadAgreementImage,
        clearAgencyData,
        updateAgreementData,
        clearUpdatedAgreementData
    }

)(EditAgreementScreen);


