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
    addAgreement,
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
    clearAddAgreementRes
} from "./AddAgreementAction";
import {

    updateAgreementList

} from "../AgreementsAction";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import AddAgreementScreenStyle from './AddAgreementScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';

import ImagePicker from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet'
import API from '../../../Constants/APIUrls';
import DatePicker from 'react-native-datepicker'
import Moment from 'moment';
import * as Progress from 'react-native-progress';
// import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import DocumentPicker from 'react-native-document-picker';
import APICaller, { documentUpload, GetLocation, GetLatLong } from '../../../Saga/APICaller';
import { Matrics } from '../../../CommonConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail } from '../../../Constants/CommonFunctions';

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
var agreementImageArray = []
var uploadImagesArray = [];
var uploadedImagesPath = [];
var tenantsArray = [];
let contextRef;
class AddAgreementScreen extends Component {
    constructor() {
        super();
        this.state = {
            uploadImagesData: {},
            selectedImage: '',
            selectedPropertyId: '',
            selectedOwnerId: '',
            tenantsData: [],
            tenantDataBackUp: [],
            tenantData: [],
            tenantsSearchedData: [],
            agencyData: [],
            ownerData: [],
            selectedTenantsData: [],
            isSearchTenantsListShow: false,
            minDate: Moment().format('MMM DD YYYY'),
            rentAmount: '',
            removeArr: [],
            paymentMode: 1,
            errorMsg: '',
            errorOnTextField: '',
            agreementDetail: '',
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
            isloading:false,
            savedisable:false,
        };
        this.textInput = React.createRef();
        this.handlePress = this.handlePress.bind(this)
        contextRef = this;

    }

    componentDidUpdate() {
        this.onGetAgencySuccess();
        this.onGetPropertyOwnerSuccess();
        this.onGetTenantsSuccess();
        this.onAddAgreementSuccess();
        this.onUploadImageSuccess();
    }

    componentWillMount() {

        this.getAlltenancies();
        this.callGetAgencyProperty();
    }


    closeAddProperty() {

        Actions.popTo('Dashboard');
    }



    callGetAgencyProperty() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {

                    agency_id: userData.data.agency_id,
                    request_by_id: userData.data._id,
                    request_by_role: userData.data.role_id,
                }
                
                this.props.showLoading();
                this.props.getAgreementPropertyList(authToken, postData);
            }
        }).done();
    }

    onGetAgencySuccess() {

        if (this.props.addAgreementReducer.agencyListResponse != '') {

            if (this.props.addAgreementReducer.agencyListResponse.code == 200) {

                this.setState({ agencyData: this.preparePropertyData(this.props.addAgreementReducer.agencyListResponse.data) });

            }
            else {

                alert(this.props.addAgreementReducer.agencyListResponse.message);
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

        if (this.props.addAgreementReducer.tenantsListResponse != '') {

            if (this.props.addAgreementReducer.tenantsListResponse.code == 200) {

                this.setState({ tenantsData: this.props.addAgreementReducer.tenantsListResponse.data, tenantsSearchedData: this.props.addAgreementReducer.tenantsListResponse.data });
            }
            else {

                alert(this.props.addAgreementReducer.tenantsListResponse.message);
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

        if (this.props.addAgreementReducer.ownerListResponse != '') {

            if (this.props.addAgreementReducer.ownerListResponse.code == 200) {

                this.setState({ ownerData: this.prepareOwnerData(this.props.addAgreementReducer.ownerListResponse.data) });

            }
            else {

                alert(this.props.addAgreementReducer.ownerListResponse.message);
            }
            this.props.clearOwnerData();
        }
    }

    prepareOwnerData(ownerList) {

        var tempArray = [];
        ownerList.map((data, index) => {
            var ownerInfo = ownerList[index].owned_by;
            var tempData = {

                value: ownerInfo.firstname + ' ' + ownerInfo.lastname,
                id: ownerInfo._id
            }
            tempArray.push(tempData);

        })
        
        return tempArray;
    }


    callAddAgreementApi(isSaveAsDraft) {
        if(!this.state.locationSearchText.toString().trim()){
            this.setState({ errorMsg: 'Enter property address' });
            this.setState({ errorOnTextField: 0 });
        }else if(!this.state.email.toString().trim() || !validateEmail(this.state.email)){
            this.setState({ errorMsg: 'Enter valid email address' });
            this.setState({ errorOnTextField: 1 });
        }else if(this.state.selectedTenantsData.length <= 0&& !this.state.tenantenter.toString().trim()){
            this.setState({ errorMsg: 'Add tenant' });
            this.setState({ errorOnTextField: 2 });
        }else if(this.state.selectedTenantsData.length <= 0 && !validateEmail(this.state.tenantenter.toString().trim())){
            this.setState({ errorMsg: 'Enter valid tenat email address' });
            this.setState({ errorOnTextField: 2 });
        }else if(!this.state.rentAmount.toString().trim()){
            this.setState({ errorMsg: 'Enter rent amount' });
            this.setState({ errorOnTextField: 5 });
        }else if(!this.state.rentalValidityDate.toString().trim()){
            this.setState({ errorMsg: 'Select payable in advance date' });
            this.setState({ errorOnTextField: 6 });
        }else {
            this.setState({savedisable:true});
            if(this.state.selectedTenantsData.length <= 0){
                tenantsArray.push(this.state.tenantenter.toString().trim());
            }
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    this.setState({isloading:true});
                    var userData = JSON.parse(value);
                    var authToken = userData.token;
                    var postData = {
                        agency_id: userData.data.agency_id,
                        created_by: userData.data._id,
                        created_by_role: userData.data.role_id,
                        detail: this.state.agreementDetail,
                        payable_advance_start_on:this.state.rentalValidityDate,
                        property_address:this.state.locationSearchText,
                        property_lat:this.state.reqLatitude,
                        property_lng:this.state.reqLongitude,
                        property_owner:this.state.email,
                        rent_price: parseInt(this.state.rentAmount),
                        rental_period: this.state.paymentMode,
                        save_as_draft: isSaveAsDraft,
                        tenancy_length:this.state.enddate,
                        tenancy_start_date: this.state.date,
                        tenants: tenantsArray,
                    };
                    this.props.showLoading();
                    // console.log(postData);
                    this.props.addAgreement(authToken, postData);
                }
            }).done();
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
    onAddAgreementSuccess() {
        if (this.props.addAgreementReducer.addAgreementRes != '') {
            if (this.props.addAgreementReducer.addAgreementRes.code == 200) {
                this.setState({ agreementId: this.props.addAgreementReducer.addAgreementRes.data._id });
                console.log('agreementImageArray',agreementImageArray)
                if(agreementImageArray.length > 0){
                    this.uploadAgreementImage(this.props.addAgreementReducer.addAgreementRes.data._id);
                } else{
                    uploadImagesArray = [];
                    uploadedImagesPath = [];
                    tenantsArray = [];
                    Actions.pop();
                    this.setState({savedisable:false});
                    this.props.updateAgreementList('updateAgreementList');
                }
            }
            else {
                this.setState({isloading:false,savedisable:false});
                alert(this.props.addAgreementReducer.addAgreementRes.message);
            }
            this.props.clearAddAgreementRes();
        }
    }

    onPropertySelectChange(text) {

        this.props.propertyNameChanged(text);
        this.setState({ selectedPropertyId: this.state.agencyData[this.refs.ref_property.selectedIndex()].id });
        this.callGetPropertyOwner(this.state.agencyData[this.refs.ref_property.selectedIndex()].id);
        this.callGetTenantsList(this.state.agencyData[this.refs.ref_property.selectedIndex()].id);
        this.setState({ tenantsSearchedData: [] });
        this.setState({ selectedTenantsData: [] });

    }
    onPropertyOwnerChange(text) {

        this.props.propertyOwnerChanged(text);
        this.setState({ selectedOwnerId: this.state.ownerData[this.refs.ref_owner.selectedIndex()].id });

    }

    onTenantsNameChange(text) {

        this.props.searchTenantsChanged(text);
        if (text != '') {
            this.setState({ isSearchTenantsListShow: true });
        }
        else {
            this.setState({ isSearchTenantsListShow: false });
        }

        this.SearchTenantsFunction(text);
    }

    onRentChange(text) {
        this.setState({ rentAmount: text });
    }
    onDetailChange(text) {
        this.setState({ agreementDetail: text });
    }
    onModeOfPaymentChange(text) {
        if (text = 'Monthly') {

            this.setState({ paymentMode: 1 });
        }
        else {

            this.setState({ paymentMode: 2 });
        }

    }

    onTenantsSelect(item) {
        console.log('DATA',item);
        this.showSearchTenantsList();
        this.props.searchTenantsChanged('');
        this.state.selectedTenantsData.push(item);
        var tempData = {
            email: item.email
        }
        tenantsArray.push(tempData);
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
                agreementImageArray.push(file);
            }

        });
    }

    onUploadImageSuccess() {
        if (this.props.addAgreementReducer.uploadedImageRes != '') {
            console.log('5')
            if (this.props.addAgreementReducer.uploadedImageRes.code == 200) {
                console.log('6')
                var imagePath = {
                    path: this.props.addAgreementReducer.uploadedImageRes.data
                }
                uploadedImagesPath.push(imagePath);
            }
            else {
                console.log('7')
                alert(this.props.addAgreementReducer.uploadedImageRes.message);
            }
            console.log('8')
            this.props.clearUploadAgreementImageRes();
        }
    }

    uploadAgreementImage(aid) {
        this.props.showLoading();
        AsyncStorage.getItem("SyncittUserInfo")
            .then(value => {
                if (value) {
                    var userData = JSON.parse(value);
                    var authToken = userData.token;
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
                                this.setState({isloading:false,savedisable:false});
                                if (data.code == 200) {
                                    console.log('INSIDE',data);
                                    var arr = this.state.document_id;
                                    this.setState({ document_id: arr});
                                    uploadImagesArray = [];
                                    uploadedImagesPath = [];
                                    tenantsArray = [];
                                    Actions.pop();
                                    this.props.updateAgreementList('updateAgreementList');
                                }else if(data.code === 400 ){
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
        // DocumentPicker.show({
        //     filetype: [DocumentPickerUtil.allFiles()],
        // }, (error, res) => {
        //     // Android
        //     const file = {
        //         uri: res.uri, // e.g. 'file:///path/to/file/image123.jpg'
        //         name: res.fileName, // e.g. 'image123.jpg',
        //         type: res.type // e.g. 'image/jpg'
        //     };
        //     agreementImageArray.push(file);

        // });
    }

    navBar() {
        return (
            <View >

                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{'Agreement'}</Text>
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
        return (
            <View>
            {
                !item.path ?
                <View style={AddAgreementScreenStyle.uploadImageListItemStyle}>
                    <Image source={ImagePath.PDF_IMAGE} style={[AddAgreementScreenStyle.uploadPropertyListImageStyle,{tintColor:'black'}]} />
                </View>
            :
            <TouchableOpacity onPress={() => contextRef.uploadImageListSelection(index)}>
                <View style={AddAgreementScreenStyle.uploadImageListItemStyle}>
                    <Image source={item.url} style={AddAgreementScreenStyle.uploadPropertyListImageStyle} />
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
                <Text style={AddAgreementScreenStyle.searchTraderListItemTextStyle}>{item.firstname + ' ' + item.lastname}</Text>
            </TouchableOpacity>
        );
    }

    searchRenderItem({ item, index }) {
        return (
            <TouchableOpacity style={AddAgreementScreenStyle.serachListItemContainer} onPress={contextRef.popTenant.bind(contextRef,item,index)}>
                <Text style={AddAgreementScreenStyle.searchListItemTextStyle}>{item}</Text>
                <Image source={ImagePath.DRAWER_CROSS_ICON} style={[AddAgreementScreenStyle.searchListItemCloseImageStyle,{tintColor:'black'}]} />
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
        this.renderselectedTenantsData(tenantsArray);
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

    renderselectedTenantsData = ()=>{
        return (
            <FlatList
                horizontal={false}
                numColumns={2}
                data={this.state.selectedTenantsData}
                renderItem={this.searchRenderItem}
                extraData={this.state}
            />
        )
    }
    _addtenantValue(event) {
        console.log('keyPress',event.nativeEvent.key);
        if(event.nativeEvent.key === ' '){
            this.setState({tenantenterStatus:false});
            if(this.state.tenantenter.toString().trim()){
                if(!validateEmail(this.state.tenantenter.toString().trim())) {
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
    render() {

        return (
            <View style={AddAgreementScreenStyle.mainContainer}>
                {this.navBar()}

                {/* <KeyboardAwareScrollView
                    extraScrollHeight={Platform.OS ==='ios'?0:0}
                    enableOnAndroid
                    enableAutomaticScroll
                    style={{flex:1}}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{flex:1}}
                    keyboardShouldPersistTaps
                    scrollEnabled={true}
                > */}
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'} contentContainerStyle={AddAgreementScreenStyle.scrollViewContainerStyle}>

                    <View style={AddAgreementScreenStyle.addPropertyInputContainer}>

                    <View style={[AddAgreementScreenStyle.labelContainerStyle,{marginTop:25}]}>
                            <Text style={AddAgreementScreenStyle.labelStyle}>
                                {'Property address *'}
                            </Text>
                        </View>
                        <View style={AddAgreementScreenStyle.searchViewStyle}>
                        <TextInput
                                placeholder={'Address'}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={AddAgreementScreenStyle.searchTextInputStyle}
                                onChangeText={(val) => this.onLocationChangeText(val.trimLeft())}
                                value={this.state.locationSearchText}
                                onFocus={() => {
                                    this.setState({ addressSearchFocus: true })
                                }}
                            />
                        </View>
                        {this.state.addressSearchFocus && this.state.locationSearchText !== '' && this.state.predictions.length > 0 &&
                        <View style={{ alignItems: 'center',borderWidth:1,borderColor:Colors.GRAY_COLOR, backgroundColor: 'white', justifyContent: 'center', borderRadius: Matrics.ScaleValue(5), alignSelf: 'center', width: '95%' }}>
                            {this.state.predictions.map(element => {
                                return (
                                    <TouchableOpacity onPress={this.onPressLocation.bind(this, element)} style={{ height: Matrics.ScaleValue(45), alignSelf: 'center', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', width: '100%', flexDirection: 'row', paddingLeft: Matrics.ScaleValue(15) }}>
                                        <View style={{ flex: 1}}>
                                            <Text style={{ color: 'gray', marginRight: Matrics.ScaleValue(5) }}>{element.description}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    }
                    {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 0 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                    <View style={AddAgreementScreenStyle.labelContainerStyle}>
                            <Text style={AddAgreementScreenStyle.labelStyle}>
                                {'Property owner email *'}
                            </Text>
                        </View>

                        <View style={AddAgreementScreenStyle.searchViewStyle}>
                            <TextInput
                                placeholder={'Owner email'}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                style={AddAgreementScreenStyle.searchTextInputStyle}
                                onChangeText={(email)=>this.setState({email})}
                                value={this.state.email}
                                keyboardType={'email-address'}
                                autoCapitalize={'none'}
                            />
                        </View>
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 1 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }

                        <View style={AddAgreementScreenStyle.labelContainerStyle}>
                            <Text style={AddAgreementScreenStyle.labelStyle}>
                                {Strings.ADD_TENANT+' (add more than 1) *'}
                            </Text>
                        </View>

                        <View style={AddAgreementScreenStyle.searchViewStyle}>
                            <TextInput
                                placeholder={'Add a tenant'}
                                underlineColorAndroid={Colors.TRANSPARENT}
                                ref={input => { this.textInput = input }} 
                                style={AddAgreementScreenStyle.searchTextInputStyle}
                                onChangeText={(t)=>this._addTenantOnChange(t)}
                                value={this.state.tenantenter}
                                keyboardType={'email-address'}
                                autoCapitalize={'none'}
                                onKeyPress={this._addtenantValue.bind(this)}
                            />
                        </View>
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 2 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                        {this.renderselectedTenantsData()} 
                        <View style={AddAgreementScreenStyle.labelContainerStyle}>
                            <Text style={AddAgreementScreenStyle.labelStyle}>
                                {Strings.TENANCY_START_DATE}
                            </Text>
                        </View>
                        <View style={AddAgreementScreenStyle.searchViewStyle}>
                            <DatePicker
                                style={AddAgreementScreenStyle.datePickerStyle}
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
                                        marginLeft: 0,
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
                                onDateChange={(date) => { this.setState({ date: date }) }}
                            />
                        </View>
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 3 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                        <View style={AddAgreementScreenStyle.labelContainerStyle}>
                            <Text style={AddAgreementScreenStyle.labelStyle}>
                                {'Tenancy end date'}
                            </Text>
                        </View>
                        <View style={AddAgreementScreenStyle.searchViewStyle}>
                            <DatePicker
                                style={AddAgreementScreenStyle.datePickerStyle}
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

                        <Text style={AddAgreementScreenStyle.labelStyle}>
                            {Strings.RENT+' *'}
                        </Text>
                        <View style={{flexDirection:"row",justifyContent:'center'}}>
                            <View style={[AddAgreementScreenStyle.searchViewStyle,{flex:1,marginRight:10}]}>
                                <TextInput
                                    placeholder={'Rent'}
                                    underlineColorAndroid={Colors.TRANSPARENT}
                                    style={AddAgreementScreenStyle.searchTextInputStyle}
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
                                    itemTextStyle={AddAgreementScreenStyle.dropDownTextStyle}
                                    textColor={Colors.FILTER_TEXT_VIEW_COLOR}
                                    containerStyle={[AddAgreementScreenStyle.dropDownViewStyle,{marginTop:10}]}
                                    data={spinerData}
                                    onChangeText={this.onModeOfPaymentChange.bind(this)}
                                    value={this.state.paymentMode===1?'Monthly':'Yearly'}
                                />
                            </View>
                        </View>
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 5 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                        <View style={AddAgreementScreenStyle.labelContainerStyle}>
                            <Text style={AddAgreementScreenStyle.labelStyle}>
                                {'Payable in advance starting on *'}
                            </Text>
                        </View>
                        <View style={AddAgreementScreenStyle.searchViewStyle}>
                            <DatePicker
                                style={AddAgreementScreenStyle.datePickerStyle}
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
                        <Text style={AddAgreementScreenStyle.labelStyle}>
                            {Strings.AGREEMENT_DETAILS}
                        </Text>
                        <TextInput 
                            style={[AddAgreementScreenStyle.inputDescriptionTextStyle,{color:Colors.FILTER_TEXT_VIEW_COLOR}]}
                            multiline={true}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            onChangeText={this.onDetailChange.bind(this)}
                            value={this.state.agreementDetail}
                        />
                        {
                            this.state.errorMsg != '' && this.state.errorOnTextField == 7 ? <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text> : null
                        }
                    </View>

                    <View>
                        <View style={AddAgreementScreenStyle.uploadImageListContainerView}>
                            <Text style={AddAgreementScreenStyle.maxImageTextStyle}>{Strings.MAX_IMAGE_LIMIT}</Text>
                            {
                                this.state.selectedImage != ''
                                    ?
                                    <Image source={this.state.selectedImage} style={AddAgreementScreenStyle.uploadPropertyImageStyle} />
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
                            <TouchableOpacity style={AddAgreementScreenStyle.uploadImageButtonStyle} onPress={() => this.showActionSheet()}  >
                                <View >
                                    <Text style={AddAgreementScreenStyle.uploadButtonTextStyle}>
                                        {Strings.UPLOAD_IMAGE}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>



                </ScrollView>
                <View style={AddAgreementScreenStyle.buttonContainerStyle}>
                    <TouchableOpacity onPress={() => this.callAddAgreementApi(true)} disabled={this.state.savedisable}>
                        <View style={AddAgreementScreenStyle.roundedTransparentDraftButtonStyle}>
                            <Text style={AddAgreementScreenStyle.draftButtonTextStyle}>
                                {Strings.SAVE_AS_DRAFT}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.callAddAgreementApi(false)} disabled={this.state.savedisable}>
                        <View style={AddAgreementScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={AddAgreementScreenStyle.proceedButtonTextStyle}>
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
                    (this.props.addAgreementReducer.isScreenLoading || this.state.isloading) ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                        </View>
                        : null
                }

                {/* </KeyboardAwareScrollView> */}
            </View>
        );
    }
}

function mapStateToProps(state) {
    
    return {

        addAgreementReducer: state.addAgreementReducer
    }
}

export default connect(
    mapStateToProps,
    {
        clearUploadAgreementImageRes,
        addAgreement,
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
        updateAgreementList,
        clearAddAgreementRes
    }

)(AddAgreementScreen);