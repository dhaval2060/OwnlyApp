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
    getAllAgentListWithiInAgency

} from "../../../Action/ActionCreators";
import {
    updateAgreementList
} from "../AgreementsAction";
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
    clearUpdatedAgreementData,
    clearAgentData,
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
import DocumentPicker from 'react-native-document-picker';
import APICaller, { documentUpload, GetLocation, GetLatLong } from '../../../Saga/APICaller';
import { Matrics } from '../../../CommonConfig';
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
            propertymanagerSearchFocus:false,
            tenantsSearchedData: [],
            agencyData: [],
            removeArr: [],
            ownerData: [],
            selectedTenantsData: [],
            isSearchTenantsListShow: false,
            minDate: Moment().format('MMM DD YYYY'),
            rentAmount: '',
            paymentMode: 1,
            paymentModeVal: '',
            errorMsg: '',
            errorOnTextField: '',
            agreementDetail: [],
            agreementDetail: '',
            //
            isloading:false,
            agreementID:'',
            oldpropertymanagerID:'',
            propertymanagerID:'',
            propertymanager:'',
            propertymanagerFocus:null,
            locationSearchText:'',
            predictions:[],
            addressSearchFocus:null,
            reqLatitude:null,
            selectedLocation:'',
            reqLongitude:'',
            cityData:null,
            reqAddress:null,
            email:'',
            date:'',
            enddate:'',
            rentalValidityDate:'',
            tenantenter:"",
            tenantenterStatus:false,
            agentData:[],
            searchedAgentdata:[]

        };
        this.handlePress = this.handlePress.bind(this)
        contextRef = this;
    }

    componentDidUpdate() {
        this.onGetPropertyOwnerSuccess();
        this.onGetTenantsSuccess();
        this.onUpdateAgreementSuccess();
        this.onUploadImageSuccess();
        this.onAgentListWithiInAgencySuccess();
    }

    componentWillMount() {
        this.getAlltenancies()
        agreementImageArray = []
        tenantsArray = [];
        this.callGetAgencyProperty();
        this.callGetAgentList();
        this.setState({ agreementDetail: this.props.agreementData });
        this._setAgreementDatabyProps(this.props.agreementData);

    }
    _setAgreementDatabyProps =async (agreementdata) => {
        if(agreementdata.length >0){
            if(agreementdata[0].propertyData){
                console.log('Hello Decor :D',agreementdata[0].propertyData);
                this.setState({agreementID:agreementdata[0].propertyData._id});
                this.setState({oldpropertymanagerID:agreementdata[0].propertyData.created_by._id});
                this.setState({propertymanagerID:agreementdata[0].propertyData.created_by._id});
                this.setState({propertymanager:`${agreementdata[0].propertyData.created_by.firstname} ${agreementdata[0].propertyData.created_by.lastname}`});
                this.setState({locationSearchText:agreementdata[0].propertyData.property_address});
                this.setState({reqLatitude:agreementdata[0].propertyData.property_lat});
                this.setState({reqLongitude:agreementdata[0].propertyData.property_lng});
                this.setState({email:agreementdata[0].propertyData.owner_id.email});
                agreementdata[0].propertyData.tenants.map((item)=>{
                    tenantsArray.push(item.users_id.email);
                })
                this.setState({selectedTenantsData:tenantsArray});
                const startDate = Moment(agreementdata[0].propertyData.tenancy_start_date).format('MMM DD YYYY');
                console.log('startDate',startDate);
                this.setState({date:startDate});
                const endDate = Moment(agreementdata[0].propertyData.tenancy_length).format('MMM DD YYYY');
                this.setState({enddate:endDate});
                this.setState({rentAmount:agreementdata[0].propertyData.rent_price.toString()});
                this.setState({paymentMode:agreementdata[0].propertyData.rental_period});
                const payableAdvanceDate = Moment(agreementdata[0].propertyData.payable_advance_start_on).format('MMM DD YYYY');
                this.setState({rentalValidityDate:payableAdvanceDate});
                const regex = /(<([^>]+)>)/ig;
                const result = agreementdata[0].propertyData.detail.replace(regex, '');
                this.setState({agreementDetail:result});
                await this.prepareUploadedImageData(agreementdata[0].propertyData.images);

            }
        }
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
                var postData = {

                    request_by_id: userData.data._id,
                    request_by_role: userData.data.role_id,
                }
                
                this.props.showLoading();
                this.props.getAgreementPropertyList(authToken, postData);
            }
        }).done();
    }
    callGetAgentList() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    user_id: userData.data._id
                  };
                this.props.showLoading();
                this.props.getAllAgentListWithiInAgency(authToken, postData);
            }
        }).done();
    }
    onAgentListWithiInAgencySuccess() {
        if (this.props.agentsScreenReducer.agentListWithInAgencyResponse != "") {
          if (
            this.props.agentsScreenReducer.agentListWithInAgencyResponse.code == 200
          ) {
            this.setState({agentData: this.props.agentsScreenReducer.agentListWithInAgencyResponse.data});
          } else {
            this.setState({agentData: []});
          }
          this.props.resetState();
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
        if(!this.state.propertymanagerID.toString().trim()){
            this.setState({ errorMsg: 'Select Property Manager' });
            this.setState({ errorOnTextField: 0 });
        }else if(!this.state.locationSearchText.toString().trim()){
            this.setState({ errorMsg: 'Enter property address' });
            this.setState({ errorOnTextField: 1 });
        }else if(!this.state.rentAmount.toString().trim()){
            this.setState({ errorMsg: 'Enter rent amount' });
            this.setState({ errorOnTextField: 5 });
        }else if(!this.state.rentalValidityDate.toString().trim()){
            this.setState({ errorMsg: 'Select payable in advance date' });
            this.setState({ errorOnTextField: 6 });
        }else {
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    var userData = JSON.parse(value);
                    var authToken = userData.token;
                    var postData = {
                        agreement_id: this.state.agreementID,
                        created_by: this.state.propertymanagerID,
                        detail: this.state.agreementDetail,
                        payable_advance_start_on:this.state.rentalValidityDate,
                        property_address:this.state.locationSearchText,
                        property_lat:this.state.reqLatitude,
                        property_lng:this.state.reqLongitude,
                        rent_price: parseInt(this.state.rentAmount),
                        rental_period: this.state.paymentMode,
                        save_as_draft: isSaveAsDraft,
                        tenancy_length: this.state.enddate,
                        tenancy_start_date: this.state.date
                    };
                    this.props.showLoading();
                    this.setState({isloading:true});
                    this.props.updateAgreement(authToken, postData);
                }
            }).done();
        }
    }


    onUpdateAgreementSuccess() {

        if (this.props.editAgreementReducer.updateAgreementRes != '') {

            if (this.props.editAgreementReducer.updateAgreementRes.code == 200) {
                console.log('Hello',this.props.editAgreementReducer.updateAgreementRes.data);
                this.setState({ agreementId: this.props.editAgreementReducer.updateAgreementRes.data._id })
                this.uploadAgreementImage(this.props.editAgreementReducer.updateAgreementRes.data._id);
            }
            else {
                this.setState({isloading:false});
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
            this.setState({ paymentMode: 1 });
        }
        else {

            this.setState({ paymentMode: 2 });
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

    uploadAgreementImage(aid) {
        if(agreementImageArray.length > 0){
            AsyncStorage.getItem("SyncittUserInfo")
            .then(value => {
                console.log('10');
                if (value) {
                    console.log('11');
                    var userData = JSON.parse(value);
                    var authToken = userData.token;
                    console.log('agreementImageArray',agreementImageArray);
                    agreementImageArray.forEach(element => {
                        const body = new FormData();
                        body.append("file", element);
                        body.append("_id", aid);
                        console.log('BODY',body,authToken);
                        documentUpload(
                            "uploadAgreementDocs",
                            authToken,
                            body,
                            userData.data._id
                        ).then(
                            data => {
                                this.setState({isloading:false});
                                if (data.code == 200) {
                                    console.log('INSIDE',data);
                                    var arr = this.state.document_id;
                                    this.setState({ document_id: arr, isScreenLoading: false });                      
                                    uploadImagesArray = [];
                                    uploadedImagesPath = [];
                                    tenantsArray = [];
                                    this.props.updateAgreementData('agreementUpdated');
                                    if(this.state.oldpropertymanagerID === this.state.propertymanagerID){
                                        // this.props.updateAgreementData('agreementUpdated');
                                        Actions.pop();
                                    }else{
                                        // this.props.updateAgreementData('agreementUpdated');
                                        Actions.pop();
                                        // Actions.AgreementsScreen();
                                        // this.props.updateAgreementList('updateAgreementList');
                                    }
                                }else if(data.code === 400 ){
                                    this.setState({isloading:false});
                                    Alert.alert(data.message);
                                }
                            },
                            err => {
                                this.setState({isloading:false});
                            }
                        );
                    });
                }
            })
        }else{
            uploadImagesArray = [];
            uploadedImagesPath = [];
            tenantsArray = [];
            this.props.updateAgreementData('agreementUpdated');
            if(this.state.oldpropertymanagerID === this.state.propertymanagerID){
                // this.props.updateAgreementData('agreementUpdated');
                Actions.pop();
                
            }else{
                // this.props.updateAgreementData('agreementUpdated');
                Actions.pop();
                // Actions.AgreementsScreen();
                // this.props.updateAgreementList('updateAgreementList');
            }
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
                    'isSelected': 0,
                    '_id':''
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
                    'isSelected': 0,
                    '_id':''
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
        console.log('aid',aid,agreementImageArray);
        let uploadCounter = 0

        if (agreementImageArray.length > 0) {
            AsyncStorage.getItem("SyncittUserInfo")
                .then(value => {
                    if (value) {
                        var userData = JSON.parse(value);
                        var authToken = userData.token;
                        agreementImageArray.forEach(element => {
                            if (!element.id) {
                                const body = new FormData();
                                body.append("file", element);
                                body.append("_id", aid);
                                console.log('BODY',body,authToken);
                                documentUpload(
                                    "uploadAgreementDocs",
                                    authToken,
                                    body,
                                    userData.data._id
                                ).then(data => {
                                        // uploadCounter++
                                        // let imageArr = this.state.uploadImagesData.imageArray
                                        // newArr = data.data.images
                                        // data.data.images.forEach(resImgItem => {
                                        //     this.state.removeArr.forEach(removeItem => {
                                        //         if (resImgItem.path == removeItem.path) {
                                        //             newArr.splice(newArr.indexOf(resImgItem), 1);
                                        //         }
                                        //     });
                                        // });
                                        // this.setState({ uploadImagesData: { imageArray: newArr } })
                                        if (data.code == 200) {
                                            // var arr = this.state.document_id;
                                            // this.setState({ document_id: arr, isScreenLoading: false });
                                            console.log('data',data);
                                            this.setState({isScreenLoading: false });
                                            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                                                if (value) {
                                                    var userData = JSON.parse(value);
                                                    var authToken = userData.token;
                                                    var postData = {
                                                        agreement_id: this.state.agreementID,
                                                        created_by: this.state.propertymanagerID,
                                                        detail: this.state.agreementDetail,
                                                        payable_advance_start_on:this.state.rentalValidityDate,
                                                        property_address:this.state.locationSearchText,
                                                        property_lat:this.state.reqLatitude,
                                                        property_lng:this.state.reqLongitude,
                                                        rent_price: parseInt(this.state.rentAmount),
                                                        rental_period: this.state.paymentMode,
                                                        save_as_draft: isSaveAsDraft,
                                                        tenancy_length: this.state.enddate,
                                                        tenancy_start_date: this.state.date,
                                                        // property_id: this.state.selectedPropertyId,
                                                        // owner_id: this.state.selectedOwnerId,
                                                        // agency_id: userData.data.agency_id,
                                                        // created_by_role: userData.data.role_id,
                                                        // case_validity: this.state.rentalValidityDate,
                                                        // tenants: tenantsArray,
                                                        // images: newArr
                                                    };
                                                    this.props.showLoading();
                                                    this.props.updateAgreement(authToken, postData);
                                                }

                                            }).done();
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
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    var userData = JSON.parse(value);
                    var authToken = userData.token;
                    var postData = {
                        agreement_id: this.state.agreementID,
                        created_by: this.state.propertymanagerID,
                        detail: this.state.agreementDetail,
                        payable_advance_start_on:this.state.rentalValidityDate,
                        property_address:this.state.locationSearchText,
                        property_lat:this.state.reqLatitude,
                        property_lng:this.state.reqLongitude,
                        rent_price: parseInt(this.state.rentAmount),
                        rental_period: this.state.paymentMode,
                        save_as_draft: isSaveAsDraft,
                        tenancy_length: this.state.enddate,
                        tenancy_start_date: this.state.date,
                        // property_id: this.state.selectedPropertyId,
                        // owner_id: this.state.selectedOwnerId,
                        // agency_id: userData.data.agency_id,
                        // created_by_role: userData.data.role_id,
                        // case_validity: this.state.rentalValidityDate,
                        // tenants: tenantsArray,
                        // images: newArr
                    };
                    
                    this.props.showLoading();
                    this.props.updateAgreement(authToken, postData);
                }

            }).done();
        }
    }
    async openFileChooser() {
        // iPhone/Android
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.pdf],
            });
            console.log(res);
            //
            res.data = '';
            let source = { uri: res.uri };
            var path = res.uri.replace("file://", "");
            let imagePath = (Platform.OS == 'ios') ? path : res.path;
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
            //
            const file = {
                uri: res.uri, // e.g. 'file:///path/to/file/image123.jpg'
                name: res.name, // e.g. 'image123.jpg',
                type: res.type // e.g. 'image/jpg'
            };
            agreementImageArray.push(file);
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
              console.log('isCancel');
            } else {
                console.log('err');
            //   throw err;
            }
          }
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
        var lastThree = item.path.substr(item.path.length - 3);
        console.log('item.path',item);
        var path = '';
        if (item.url && item.url.uri) {
            path = item.url.uri
        }
        else {
            path = API.AGREEMENT_PATH + item.path;
        }
        return (
            <View>
                {
                (!item.path || lastThree === 'pdf') ?
                <View style={EditAgreementScreenStyle.uploadImageListItemStyle}>
                    <Image source={ImagePath.PDF_IMAGE} style={[EditAgreementScreenStyle.uploadPropertyListImageStyle,{tintColor:'black'}]} />
                </View>
                :
                <TouchableOpacity onPress={() => contextRef.uploadImageListSelection(index)} style={{borderRadius:5,borderWidth:1,borderColor:'black',marginLeft:5,padding:5}}>
                    <View style={EditAgreementScreenStyle.uploadImageListItemStyle}>
                        <Image source={{ uri: path }} style={EditAgreementScreenStyle.uploadPropertyListImageStyle} />
                    </View>
                </TouchableOpacity>
                }
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
                        this.setState({ removeArr: removeArr, uploadImagesData: { imageArray: arr } });
                    }} style={{borderRadius:4,borderColor:'red',marginVertical:5,paddingHorizontal:5,paddingVertical:2,borderWidth:1,alignSelf:'center'}}>
                        <Text style={{alignSelf:'center',fontWeight:'700',fontSize:13,color:'red'}}>
                            Remove
                        </Text>
                    </TouchableOpacity>
            </View>
        );
    }

    renderSearchTenantsItem({ item, index }) {
        return (
            <TouchableOpacity onPress={contextRef.onTenantsSelect.bind(contextRef, item)}>
                <Text style={EditAgreementScreenStyle.searchTraderListItemTextStyle}>{item.firstname + ' ' + item.lastname}</Text>
            </TouchableOpacity>
        );
    }

    searchRenderItem({ item, index }) {
        return (
            <TouchableOpacity style={EditAgreementScreenStyle.serachListItemContainer} onPress={contextRef.popTenant.bind(contextRef,item,index)}>
                <Text style={EditAgreementScreenStyle.searchListItemTextStyle}>{item}</Text>
                <Image source={ImagePath.DRAWER_CROSS_ICON} style={[EditAgreementScreenStyle.searchListItemCloseImageStyle,{tintColor:'black'}]} />
            </TouchableOpacity>
        );
    }
    onLocationChangeText(val, reqAddress) {
        this.setState({ locationSearchText: val })
        if (reqAddress == 'reqAddress') {
            this.setState({ reqAddress: val.trimLeft() })
        }
        GetLocation(val).then(data => {
            console.log(data, "data.predictions")
            if (data.predictions.length > 0) {
                console.log(data.predictions, "data.predictions")
                this.setState({ predictions: data.predictions })
            }
            else if (data.status == 'ZERO_RESULTS') {
                this.setState({ predictions: [] })
            }
        })
    }
    onPropertyManagerEnter = (val)=> {
        if(val.trim() !==''){
            const PMData = this.state.agentData;
            const newData = PMData.filter(item => {      
                const itemData = `${item.firstname.toUpperCase()} ${item.lastname.toUpperCase()}`;
                const textData = val.toUpperCase();
                return itemData.indexOf(textData) > -1;    
              });
            this.setState({ searchedAgentdata: newData }); 
        }else{
            this.setState({ searchedAgentdata: [],propertymanagerID:'' }); 
        }
        this.setState({propertymanager:val});
    }
    onPressLocation(element, reqAddress) {
        this.setState({ locationSearchText: element.description, predictions: [],cityData:element.structured_formatting.main_text})
        if (reqAddress == "reqAddress") {
            // alert(JSON.stringify(element))
            this.setState({ reqAddress: element.description })
        }
        GetLatLong(element.place_id).then(data => {
            console.log("hghghhg " + JSON.stringify(data.result))
            console.log(data, element, "datadatadatadataq")
            if (data.status == "INVALID_REQUEST") {

            } else {
                this.setState({ reqLatitude: data.result.geometry.location.lat, selectedLocation: data.result, reqLongitude: data.result.geometry.location.lng })
            }
        })
    }
    searchRenderItem({ item, index }) {
        return (
            // onPress={contextRef.popTenant.bind(contextRef,item,index)}
            <TouchableOpacity style={EditAgreementScreenStyle.serachListItemContainer} >  
                <Text style={EditAgreementScreenStyle.searchListItemTextStyle}>{item}</Text>
                {/* <Image source={ImagePath.DRAWER_CROSS_ICON} style={[EditAgreementScreenStyle.searchListItemCloseImageStyle,{tintColor:'black'}]} /> */}
            </TouchableOpacity>
        );
    }
    popTenant(item,index) {
        const selectedTenantsData = this.state.selectedTenantsData;
        selectedTenantsData.splice(index, 1);
        this.setState({ selectedTenantsData });
        // this.showSearchTenantsList();
        this.props.searchTenantsChanged('');
        // this.state.selectedTenantsData.pop(item);
        tenantsArray.splice(index, 1);
        // tenantsArray.pop(item);
        this.setState({ isSearchTenantsListShow: !this.state.isSearchTenantsListShow});
    }
    _addtenantValue(event) {
        console.log('keyPress',event.nativeEvent.key);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(event.nativeEvent.key === ' '){
            this.setState({tenantenterStatus:false});
            if(this.state.tenantenter.toString().trim()){
                if(reg.test(this.state.tenantenter.toString().trim()) === false) {
                    this.setState({ errorMsg: 'tenant email not valid' });
                    this.setState({ errorOnTextField: 2 });        
                }else{
                    this.state.selectedTenantsData.push(this.state.tenantenter.toString().trim());
                    tenantsArray.push(this.state.tenantenter.toString().trim());
                    this.setState({ isSearchTenantsListShow: !this.state.isSearchTenantsListShow,tenantenterStatus:true});
                }
            }
        }
    }
    _addTenantOnChange = (t) => {
        if(this.state.tenantenterStatus){
            this.setState({tenantenter:'',tenantenterStatus:false})
        }else{
            this.setState({tenantenter:t})
        }
    }
    searchedAgentdatahRenderItem = (element)=>{
        console.log(element);
        return (
            <View style={{ alignItems: 'center', backgroundColor: 'white', justifyContent: 'center', borderRadius: Matrics.ScaleValue(5), alignSelf: 'center', width: '85%'}}>
                <TouchableOpacity onPress={()=>{
                    this.setState({propertymanager:`${element.firstname} ${element.lastname}`});
                    this.setState({propertymanagerID:element._id});
                    this.setState({searchedAgentdata:[]});
                }} style={{ height: Matrics.ScaleValue(45), alignSelf: 'center', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', width: '100%', flexDirection: 'row', paddingLeft: Matrics.ScaleValue(15),backgroundColor:'#ffffff'}}>
                    <View style={{ flex: 1}}>
                        <Text style={{ color: 'gray', marginRight: Matrics.ScaleValue(5) }}>{`${element.firstname} ${element.lastname}`}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    render() {
        // console.log('StartDate',this.state.date,'enddate',this.state.enddate,'PaybleDate',this.state.rentalValidityDate);
        return (
            <View style={EditAgreementScreenStyle.mainContainer}>
                {this.navBar()}
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'} contentContainerStyle={EditAgreementScreenStyle.scrollViewContainerStyle}>
                    <View style={EditAgreementScreenStyle.addPropertyInputContainer}>
                    <View style={[EditAgreementScreenStyle.labelContainerStyle,,{marginTop:25}]}>
                            <Text style={EditAgreementScreenStyle.labelStyle}>
                                {'Property manager *'}
                            </Text>
                        </View>
                        <View style={EditAgreementScreenStyle.searchViewStyle}>
                        <TextInput
                                placeholder= {'Select property manager *'}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={EditAgreementScreenStyle.searchTextInputStyle}
                                onChangeText={(val) => this.onPropertyManagerEnter(val)}
                                value={this.state.propertymanager}
                                onFocus={() => {
                                    // this.setState({ propertymanagerSearchFocus: true })
                                }}
                            />
                        </View>
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 0 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                        {this.state.searchedAgentdata.length > 0 && <View style={{borderWidth:0.5,borderRadius:5,borderColor:'gray'}}>
                        <FlatList
                                data={this.state.searchedAgentdata}
                                renderItem={({item})=>this.searchedAgentdatahRenderItem(item)}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            </View>
                            }
                        {/* { 
                            this.state.searchedAgentdata.map((item)=>{
                                <View style={{ alignItems: 'center', backgroundColor: 'white', justifyContent: 'center', borderRadius: Matrics.ScaleValue(5), alignSelf: 'center', width: '85%' }}>
                                    <TouchableOpacity onPress={this.setState({propertymanager:item.firstname})} style={{ height: Matrics.ScaleValue(45), alignSelf: 'center', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', width: '100%', flexDirection: 'row', paddingLeft: Matrics.ScaleValue(15),backgroundColor:'#ffffff'}}>
                                        <View style={{ flex: 1}}>
                                            <Text style={{ color: 'gray', marginRight: Matrics.ScaleValue(5) }}>{item.firstname}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            })
                            this.state.searchedAgentdata.length > 0 &&
                            
                        } */}
                            
                        <View style={EditAgreementScreenStyle.labelContainerStyle}>
                            <Text style={EditAgreementScreenStyle.labelStyle}>
                                {'Property address *'}
                            </Text>
                        </View>
                        <View style={EditAgreementScreenStyle.searchViewStyle}>
                        <TextInput
                                placeholder={'Address'}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={EditAgreementScreenStyle.searchTextInputStyle}
                                onChangeText={(val) => this.onLocationChangeText(val.trimLeft())}
                                value={this.state.locationSearchText}
                                onFocus={() => {
                                    this.setState({ addressSearchFocus: true })
                                }}
                            />
                        </View>
                        {this.state.addressSearchFocus && this.state.locationSearchText !== '' && this.state.predictions.length > 0 &&
                        <View style={{ alignItems: 'center', backgroundColor: 'white', justifyContent: 'center', borderRadius: Matrics.ScaleValue(5), alignSelf: 'center', width: '90%' }}>
                            {this.state.predictions.map(element => {
                                return (
                                    <TouchableOpacity onPress={this.onPressLocation.bind(this, element)} style={{ height: Matrics.ScaleValue(45), alignSelf: 'center', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', width: '100%', flexDirection: 'row', paddingLeft: Matrics.ScaleValue(15)}}>
                                        <View style={{ flex: 1}}>
                                            <Text style={{ color: 'gray', marginRight: Matrics.ScaleValue(5) }}>{element.description}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    }
                    {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                        {/* <View style={EditAgreementScreenStyle.labelContainerStyle}>
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
                        } */}

                        <View style={EditAgreementScreenStyle.labelContainerStyle}>
                            <Text style={EditAgreementScreenStyle.labelStyle}>
                                {'Property owner email *'}
                            </Text>
                        </View>

                        <View style={EditAgreementScreenStyle.searchViewStyle}>
                            <TextInput
                                placeholder={'Owner email'}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={EditAgreementScreenStyle.searchTextInputStyle}
                                onChangeText={(email)=>this.setState({email})}
                                value={this.state.email}
                                editable={false}
                                focusable={false}
                            />
                        </View>

                        <View style={EditAgreementScreenStyle.labelContainerStyle}>
                            <Text style={EditAgreementScreenStyle.labelStyle}>
                                {Strings.ADD_TENANT+' (add more than 1) *'}
                            </Text>
                        </View>

                        <View style={EditAgreementScreenStyle.searchViewStyle}>
                            <TextInput
                                placeholder={'Add a tenant'}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                ref={input => { this.textInput = input }} 
                                style={EditAgreementScreenStyle.searchTextInputStyle}
                                onChangeText={(t)=>this._addTenantOnChange(t)}
                                value={this.state.tenantenter}
                                keyboardType={'email-address'}
                                onKeyPress={this._addtenantValue.bind(this)}
                                editable={false}
                                focusable={false}
                            />
                        </View>
                        <FlatList
                            horizontal={false}
                            numColumns={2}
                            data={this.state.selectedTenantsData}
                            renderItem={this.searchRenderItem}
                            extraData={this.state}
                        />
                        {/* <View style={EditAgreementScreenStyle.labelContainerStyle}>
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
                        </View> */}

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
                        {/* {
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

                        /> */}
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
                                placeholder={`Tenancy start date`}
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
                                        color:Colors.FILTER_TEXT_VIEW_COLOR
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
                        <View style={EditAgreementScreenStyle.labelContainerStyle}>
                            <Text style={EditAgreementScreenStyle.labelStyle}>
                                {'Tenancy end date'}
                            </Text>
                        </View>
                        <View style={EditAgreementScreenStyle.searchViewStyle}>
                            <DatePicker
                                style={EditAgreementScreenStyle.datePickerStyle}
                                date={this.state.enddate}
                                mode="date"
                                placeholder={`Tenancy end date`}
                                format='MMM DD YYYY'
                                minDate={this.state.date}
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
                                        color:Colors.FILTER_TEXT_VIEW_COLOR
                                    }
                                    // ... You can check the source to find the other keys. 
                                }}
                                onDateChange={(date) => { this.setState({ enddate: date }) }}
                            />
                        </View>
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 4 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                        <Text style={EditAgreementScreenStyle.labelStyle}>
                            {Strings.RENT+' *'}
                        </Text>
                        <View style={{flexDirection:"row",justifyContent:'center',marginTop: 15}}>
                            <View style={[EditAgreementScreenStyle.searchViewStyle,{flex:1,marginRight:10,marginTop:0}]}>
                                <TextInput
                                    placeholder={'Rent'}
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    style={EditAgreementScreenStyle.searchTextInputStyle}
                                    onChangeText={this.onRentChange.bind(this)}
                                    value={this.state.rentAmount}
                                    keyboardType={'number-pad'}
                                />

                            </View>
                            <View style={{flex:1}}>
                                <Dropdown
                                    ref='ref_payment_mode'
                                    label=''
                                    labelHeight={5}
                                    fontSize={14}
                                    baseColor={Colors.WHITE}
                                    itemTextStyle={EditAgreementScreenStyle.dropDownTextStyle}
                                    textColor={Colors.FILTER_TEXT_VIEW_COLOR}
                                    containerStyle={[EditAgreementScreenStyle.dropDownViewStyle,{marginTop:0}]}
                                    data={spinerData}
                                    onChangeText={this.onModeOfPaymentChange.bind(this)}
                                    value={this.state.paymentMode===1?'Monthly':'Yearly'}
                                />
                            </View>
                        </View>
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 5 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                        <View style={EditAgreementScreenStyle.labelContainerStyle}>
                            <Text style={EditAgreementScreenStyle.labelStyle}>
                            {'Payable in advance starting on *'}
                            </Text>
                        </View>
                        <View style={EditAgreementScreenStyle.searchViewStyle}>
                            <DatePicker
                                style={EditAgreementScreenStyle.datePickerStyle}
                                date={this.state.rentalValidityDate}
                                mode="date"
                                placeholder={`Payable in advance date`}
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
                                        color:Colors.FILTER_TEXT_VIEW_COLOR
                                    }
                                    // ... You can check the source to find the other keys. 
                                }}
                                onDateChange={(date) => { this.setState({ rentalValidityDate: date }) }}
                            />
                        </View>
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 6 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                        <Text style={EditAgreementScreenStyle.labelStyle}>
                            {Strings.AGREEMENT_DETAILS}
                        </Text>
                        <TextInput 
                            style={[EditAgreementScreenStyle.inputDescriptionTextStyle,{color:Colors.FILTER_TEXT_VIEW_COLOR}]}
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
                    
                    <TouchableOpacity onPress={() => this.callAddAgreementApi(true)}>
                        <View style={EditAgreementScreenStyle.roundedTransparentDraftButtonStyle}>
                            <Text style={EditAgreementScreenStyle.draftButtonTextStyle}>
                                {Strings.SAVE_AS_DRAFT}
                            </Text>
                        </View>
                    </TouchableOpacity>
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


                    (this.props.editAgreementReducer.isScreenLoading || this.state.isloading) ?
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

        editAgreementReducer: state.editAgreementReducer,
        agentsScreenReducer: state.agentsScreenReducer
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
        clearAgentData,
        clearOwnerData,
        clearTenantsData,
        uploadAgreementImage,
        clearAgencyData,
        updateAgreementData,
        clearUpdatedAgreementData,
        getAllAgentListWithiInAgency,
        updateAgreementList,
    }

)(EditAgreementScreen);


