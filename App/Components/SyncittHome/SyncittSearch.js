import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator, Dimensions, AsyncStorage, Easing, PanResponder, Animated, ScrollView, Modal, TextInput, Image, ImageBackground, Platform, KeyboardAvoidingView, TouchableOpacity, StyleSheet, Text } from 'react-native'
import MapView from "react-native-maps";
import { Actions } from "react-native-router-flux";
import COLORS from '../../Constants/Colors';
import IMAGEPATH from '../../Constants/ImagesPath';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const { width, height } = Dimensions.get("window");
import StarRating from "react-native-star-rating";
import APICaller, { GetLocation, GETAPICaller, GetLatLong, documentUpload } from '../../Saga/APICaller';
import MenuModal from './MenuModal';
import Drawer from 'react-native-drawer'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import DatePicker from 'react-native-datepicker'
import DocumentPicker from 'react-native-document-picker';
import AddAgreementScreenStyle from '../AgreementsComponent/AddAgreementComponent/AddAgreementScreenStyle';
import ActionSheet from "react-native-actionsheet";
import ImagePicker from 'react-native-image-picker';
import API from '../../Constants/APIUrls';
import Moment from 'moment';
import { Matrics } from '../../CommonConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const actionOptions = ["Upload Photo", "Take Photo", "Document", "Cancel"];
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

const CANCEL_INDEX = 3;
const DESTRUCTIVE_INDEX = 3;
const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
    main: { paddingLeft: 0 },
}
class SyncittSearch extends Component {
    constructor() {
        super();
        this.state = {
            newTraderId: '',
            mainRole: '',
            renderSlide: 1,
            showModal: false,
            showMore: false,
            documentsList: [],
            selectedLocation: {},
            showSearchLoader: false,
            submitRequestLoader: false,
            showMobileNumber: false,
            setTrade:true,
            setAgent:false,
            traderProfileActiveTab: 1,
            locationSearchText: "",
            selectedItem: {},
            selectedCategory: {},
            searchText: "",
            predictions: [],
            searchTradersList: [],
            businessUserList: [],
            categoriesList: [],
            traderDetails: {},
            traderReviews: [],
            traderTotalReviews: 0,
            traderTotalRatting: 0,
            traderJobHistory: [],
            cityData:'',

            //=====  request form data   ===== 

            trader_id: 0,
            reqCategory: "",
            reqDate: "",
            reqBudget: "",
            reqSubject: "",
            reqDescription: "",
            reqName: "",
            reqEmail: "",
            reqPhoneNumber: "",
            reqAddress: "",
            reqLatitude: "",
            reqLongitude: ""
        }
        console.disableYellowBox = true
        this.animatedValue = new Animated.Value(0)
        this.handlePress = this.handlePress.bind(this);
    }
    componentDidMount() {
        const {navigation}= this.props;
        if(navigation){
            if (this.props.navigation.getParam('fromTraderProfile')) {
                var _id = this.props.navigation.getParam('_id');
                var userData = this.props.navigation.getParam('userData');
                this.setState({ renderSlide: 2, })
                if (userData != null) {
                    let address = (userData.data.city ? userData.data.city : "") + (userData.data.location_postal_code ? (',' + userData.data.location_postal_code) : "") + (userData.data.state ? (',' + userData.data.state) : "") + (userData.data.country ? (',' + userData.data.country) : "")
                    this.setState({
                        reqName: userData.data.name,
                        trader_id: _id,
                        reqEmail: (userData.data.email).toLowerCase(),
                        reqPhoneNumber: userData.data.mobile_no,
                        reqAddress: address,
                        reqLongitude: userData.data.location_longitude,
                        reqLatitude: userData.data.location_latitude
                    })
                }
            }
        }
        AsyncStorage.getItem("roleId").then(role => {
            if (role) {
                this.setState({ mainRole: role })
            }
        })

        this.getServiceCategory()
        this.getUserDetails()
    }

    getUserDetails() {
        AsyncStorage.getItem("SyncittUserInfo")
            .then(value => {
                console.log(JSON.parse(value), "valuevalue")
                this.setState({ loggedUserInfo: JSON.parse(value) })
            })
            .done();
    }
    handlePress(i) {
        if (i == 0) {
            this.showImageLibrary();
        } else if (i == 1) {
            this.showCamera();
        } else if (i == 2) {
            this.openFileChooser();
        }
    }
    onRequestSubmit() {
        console.log("this.state", this.state)
        if (this.state.reqSubject == "") {
            alert("Please enter subject.")
        } else if (this.state.reqDescription == "") {
            alert("Please enter description.")
        } else if (this.state.reqName == "") {
            alert("Please enter name.")
        } else if (this.state.reqEmail == "") {
            alert("Please enter email.")
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.reqEmail)) {
            alert("Please enter valid email.")
        } else if (this.state.reqPhoneNumber == "") {
            alert("Please enter phone number.")
        } else if (!this.state.reqPhoneNumber.match(/^\d{10}$/)) {
            alert("Please enter valid phone number.")
        } else if (this.state.reqAddress == "") {
            alert("Please enter address.")
        }
        else {
            // if()
            // trader_id
            let userData = this.state.loggedUserInfo;
            let watcherList = { user_id: userData.data._id, firstname: userData.data.firstname, lastname: userData.data.lastname }


            this.setState({ submitRequestLoader: true })
            // 5d3eb671a4728c25432fea6c
            // alert(JSON.stringify(this.state.newTraderId))
            let requestParams = {

                "category_id": this.state.selectedCategory._id ? this.state.selectedCategory._id : this.state.newTraderId,
                "budget": Number(this.state.reqBudget),
                "due_date": Moment(new Date, this.state.reqDate).format(),
                "request_overview": this.state.reqSubject,
                "request_detail": this.state.reqDescription,
                "firstname": this.state.reqName,
                "email": (this.state.reqEmail).toLowerCase(),
                "mobile_no": this.state.reqPhoneNumber,
                "address": this.state.reqAddress,
                "latitude": this.state.reqLatitude ? Number(this.state.reqLatitude) : (this.state.selectedLocation && this.state.selectedLocation.geometry && this.state.selectedLocation.geometry.location && this.state.selectedLocation.geometry.location.lat),
                "longitude": this.state.reqLongitude ? Number(this.state.reqLongitude) : (this.state.selectedLocation && this.state.selectedLocation.geometry && this.state.selectedLocation.geometry.location && this.state.selectedLocation.geometry.location.lng),
                "request_type": 0,

                "created_by": userData.data._id,
                "created_by_role": this.state.mainRole,
                "dt": Moment(new Date, this.state.reqDate).format(),
                "watchers_list": watcherList
            }
            if (this.state.trader_id != 0) {
                requestParams["trader_id"] = this.state.trader_id
            }
            console.log(JSON.stringify(requestParams) + "paramsdatadataa")

            APICaller('addMR', 'post', "", requestParams).then(data => {
                console.log(JSON.stringify(data), "datadataa")
                if (data.code == 200) {

                    if (this.state.documentsList.length > 0) {
                        this.state.documentsList.forEach(element => {
                            const body = new FormData();
                            body.append("file", element);
                            body.append("_id", data.data._id);
                            console.log(body, "bodybody")
                            documentUpload(
                                "uploadMaintenanceImages",
                                "",
                                body,
                                ""
                            ).then(
                                data => {
                                    console.log(data, "datadatadatadata")
                                    if (data.code == 200) {
                                        var arr = this.state.document_id;
                                        this.setState({ document_id: arr, isScreenLoading: false });
                                        let arr1 = []
                                        this.state.documentsList.forEach(ele => {
                                            if (ele != element) {
                                                arr1.push(ele)
                                            }
                                        });
                                        this.setState({ documentsList: arr1 })
                                    }
                                },
                                err => {
                                    this.setState({ isScreenLoading: false });
                                }
                            );
                        });
                    }
                    this.setState({
                        renderSlide: 1,
                        trader_id: 0,
                        reqCategory: "",
                        searchText: "",
                        reqDate: "",
                        reqBudget: "",
                        reqSubject: "",
                        reqDescription: "",
                        locationSearchText: "",
                        reqLatitude: "",
                        reqLongitude: "",
                        reqName: "",
                        reqEmail: "",
                        reqPhoneNumber: "",
                        reqAddress: "",
                        selectedCategory: {},
                        selectedItem: {},
                        submitRequestLoader: false,

                    })
                    if (this.props.navigation.getParam('fromTraderProfile')) {
                        this.props.navigation.goBack();
                    } 
                    else{
                    setTimeout(() => {
                        alert("Success")
                    }, 50);
                }

                }
                else {
                    alert("Something went wrong, Please try again.")
                    this.setState({ submitRequestLoader: false })
                }
            }, err => {
                this.setState({ submitRequestLoader: false })
                alert("Something went wrong, Please try again.")
            })
        }
        // this.setState({ renderSlide: 1 })
    }
    async openFileChooser() {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            console.log(res, 'resres')
            let arr = this.state.documentsList
            const file = {
                uri: res.uri, // e.g. 'file:///path/to/file/image123.jpg'
                name: res.fileName == null ? 'image.jpg' : res.fileName, // e.g. 'image123.jpg',
                type: res.type // e.g. 'image/jpg'
            };
            arr.push(file)
            this.setState({ documentsList: arr })
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }
    showCamera() {
        // Launch Camera:
        ImagePicker.launchCamera(options, response => {

            if (response.didCancel) {

            } else if (response.error) {

            } else if (response.customButton) {

            } else {
                console.log(response, 'resres')
                let arr = this.state.documentsList
                const file = {
                    uri: response.uri, // e.g. 'file:///path/to/file/image123.jpg'
                    name: response.fileName == null ? 'image.jpg' : response.fileName, // e.g. 'image123.jpg',
                    type: response.type // e.g. 'image/jpg'
                };
                arr.push(file)
                this.setState({ documentsList: arr })
            }
        });
    }

    showImageLibrary() {
        // Open Image Library:
        ImagePicker.launchImageLibrary(options, response => {

            if (response.didCancel) {

            } else if (response.error) {

            } else if (response.customButton) {

            } else {
                console.log(response, 'resres')
                let arr = this.state.documentsList
                const file = {
                    uri: response.uri, // e.g. 'file:///path/to/file/image123.jpg'
                    name: response.fileName == null ? 'image.jpg' : response.fileName, // e.g. 'image123.jpg',
                    type: response.type // e.g. 'image/jpg'
                };
                arr.push(file)
                this.setState({ documentsList: arr })
            }
        });
    }
    onSearchChangeText(val, category) {

        if (!/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(val)) {
            this.setState({ searchText: val, selectedItem: {} })
            if (val != "") {
                let arr = this.state.servicesListbackUp && this.state.servicesListbackUp.filter(item => item.name.toLowerCase().match(val.toLowerCase()))
                APICaller('getCategoriesBusinessnamesList', 'POST', "", { "search_text": val }).then(data => {
                    if (data.code === 200) {
                        console.log('data.date',data.date)
                        // this.setState({ categoriesList: data.data.categories, businessUserList: data.data.users })
                    }
                })
                this.setState({ servicesList: arr })
            }
            else {
                this.setState({ servicesList: [], categoriesList: [], businessUserList: [] })
            }
            if (category == 'category') {
                this.setState({ reqCategory: val.trimLeft() })
            }
        }
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
        console.log('Hello Decor :D',element);
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

    getServiceCategory() {
        var authToken = ""
        GETAPICaller(
            "getServiceCategory",
            "GET",
            authToken
        ).then(data => {
            if (data.code == 200) {
                this.setState({ servicesListbackUp: data.data })
                console.log(data, "datadata")
            }
        });
    }

    onPressSearchItem(name, item, type) {

        this.setState({
            servicesList: [],
            searchText: name,
            reqCategory: name,
            selectionType: type,
            categoriesList: [],
            businessUserList: [],
            newTraderId: item._id,
            selectedItem: item
        }, () => console.log('On press search Item selected Data respose ' + JSON.stringify(item)))
    }

    onSearchPress() {
        this.setState({ showSearchLoader: true });
        if(this.state.setAgent){
            console.log('locationSearchText',this.state.cityData);
            if(this.state.cityData || this.state.locationSearchText !== ''){
                Actions.AgentsListScreen({cityData : this.state.cityData});
            }
        }else{
            if (this.state.searchText == '' || JSON.stringify(this.state.selectedItem) == '{}') {
                Animated.timing(this.animatedValue, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.linear,
                }).start(this.animatedValue.setValue(0))
                this.setState({
                    showSearchLoader: false,
                    reqBudget: '',
                    reqDate: "",
                    reqBudget: "",
                    reqSubject: "",
                    reqDescription: "",
                    searchText: "",
                    locationSearchText: "",
                    reqLatitude: "",
                    reqLongitude: "",
                    reqName: "",
                    reqEmail: "",
                    reqPhoneNumber: "",
                    reqAddress: "", trader_id: 0,
                    showMobileNumber: false
                })
            } else {
                if (this.state.selectionType == 'request') {
                    this.setState({
                        renderSlide: 2, showSearchLoader: false,
                        reqBudget: '',
                        reqDate: "",
                        reqBudget: "",
                        reqSubject: "",
                        searchText: "",
                        locationSearchText: "",
                        reqLatitude: "",
                        reqLongitude: "",
                        reqDescription: "",
                        reqName: "",
                        reqEmail: "",
                        reqPhoneNumber: "",
                        reqAddress: "", trader_id: 0,
                        showMobileNumber: false,
                        selectedCategory: this.state.selectedItem, reqCategory: this.state.selectedItem.name
                    }, () => console.log("selected category " + JSON.stringify(this.state.selectedCategory)))
                    if (this.state.loggedUserInfo != null) {
                        // alert(JSON.stringify(this.state.loggedUserInfo))
    
                        let address = (this.state.loggedUserInfo.data.city ? this.state.loggedUserInfo.data.city : "") + (this.state.loggedUserInfo.data.location_postal_code ? (',' + this.state.loggedUserInfo.data.location_postal_code) : "") + (this.state.loggedUserInfo.data.state ? (',' + this.state.loggedUserInfo.data.state) : "") + (this.state.loggedUserInfo.data.country ? (',' + this.state.loggedUserInfo.data.country) : "")
                        console.log("================dddddd")
                        this.setState({
                            reqName: this.state.loggedUserInfo.data.name,
                            reqEmail: (this.state.loggedUserInfo.data.email).toLowerCase(),
                            reqPhoneNumber: this.state.loggedUserInfo.data.mobile_no,
                            reqAddress: address,
                            reqLongitude: this.state.loggedUserInfo.data.location_longitude,
                            reqLatitude: this.state.loggedUserInfo.data.location_latitude
                        })
                    }
                } else if (this.state.selectionType == 'category') {
                    let postcode = '';
                    let suburb = '';
                    let state = '';
                    this.state.selectedLocation && this.state.selectedLocation.address_components && this.state.selectedLocation.address_components.forEach(element => {
                        element.types.forEach(ele => {
                            if (ele == 'administrative_area_level_1') {
                                state = element.short_name
                            } else if (ele == 'locality') {
                                postcode = element.short_name
                                suburb = element.short_name
                            }
                        });
                    });
                    // let state = this.state.selectedLocation.address_components.filter(item => item.types.map(element => element == 'political' ? true : false) ? item : false)
                    let requestParams = {
                        "category_slug": (this.state.selectedItem.name).toLowerCase().split(' ').join('_'),
                        "state": state.toLocaleLowerCase(),
                        "suburb": suburb.toLocaleLowerCase(),
                        "postcode": postcode.toLocaleLowerCase()
                    }
                    console.log(JSON.stringify(requestParams) + "requestParamsrequestParams")
                    APICaller('tradersList', 'POST', "", requestParams).then(data => {
                        console.log(data, "tradersList")
                        if (data.code == 200) {
                            if (data.data.length > 0) {
                                this.setState({
                                    showSearchLoader: false, renderSlide: 3,
                                    reqBudget: '',
                                    reqDate: "",
                                    reqBudget: "",
                                    reqSubject: "",
                                    reqDescription: "",
                                    searchText: "",
                                    locationSearchText: "",
                                    reqLatitude: "",
                                    reqLongitude: "",
                                    reqName: "",
                                    reqEmail: "",
                                    reqPhoneNumber: "",
                                    reqAddress: "", trader_id: 0, showMobileNumber: false, searchTradersList: data.data
                                })
                            }
                            else {
                                this.setState({ showSearchLoader: false })
                                alert("No trader found.")
                            }
                        }
                    }, err => {
                        this.setState({ showSearchLoader: false, showMobileNumber: false })
                        alert("Something went wrong, Please try again.")
                    })
                } else if (this.state.selectionType == 'business') {
                    let requestParams = {
                        "userId": this.state.selectedItem._id,
                        "roleId": "5a1d26b26ef60c3d44e9b377"
                    }
                    GETAPICaller('getTraderAllReviews/' + this.state.selectedItem._id, "GET", "", "").then(data => {
                        console.log(data, "getTraderAllReviews")
                        if (data.code == 200) {
                            this.setState({ renderSlide: 4, traderProfileActiveTab: 1, traderReviews: data.data })
                        }
                    }, err => {
                        console.log(err, "getTraderAllReviews")
                    })
    
                    GETAPICaller('getUserReview/' + this.state.selectedItem._id, "GET", "", "").then(data => {
                        console.log(data, "getUserReview")
                        if (data.code == 200) {
                            this.setState({ traderTotalRatting: data.data, traderProfileActiveTab: 1, traderTotalReviews: data.total_review })
                        }
                        else {
                            this.setState({ traderTotalRatting: 0, traderProfileActiveTab: 1, traderTotalReviews: 0 })
                        }
                    })
                    let tradersJobHistoryRequestParams = {
                        "trader_id": this.state.selectedItem._id
                    }
                    APICaller('tradersJobHistory', 'POST', "", tradersJobHistoryRequestParams).then(data => {
                        console.log(data, "tradersJobHistory")
                        if (data.code == 200) {
                            this.setState({ traderJobHistory: data.data })
                        }
                    })
                    APICaller('getUserDetails', 'POST', "", requestParams).then(data => {
                        console.log(data, "datadata1")
                        if (data.code == 200) {
    
                            this.setState({
                                showSearchLoader: false, renderSlide: 4,
                                reqBudget: '',
                                reqDate: "",
                                reqBudget: "",
                                reqSubject: "",
                                searchText: "",
                                locationSearchText: "",
                                reqLatitude: "",
                                reqLongitude: "",
                                reqDescription: "",
                                reqName: "",
                                reqEmail: "",
                                reqPhoneNumber: "",
                                reqAddress: "", trader_id: 0,
                                showMobileNumber: false, traderProfileActiveTab: 1, traderDetails: data.data
                            })
                            this.setAvailability(data)
                        }
                    }, err => {
                        this.setState({
                            showSearchLoader: false, reqBudget: '',
                            reqDate: "",
                            reqBudget: "",
                            reqSubject: "",
                            searchText: "",
                            locationSearchText: "",
                            reqLatitude: "",
                            reqLongitude: "",
                            reqDescription: "",
                            reqName: "",
                            reqEmail: "",
                            reqPhoneNumber: "",
                            reqAddress: "", trader_id: 0, showMobileNumber: false
                        })
                        alert("Something went wrong, Please try again.")
                    })
                }
            }
        }
    }
    async getDaysInMonth(month, year, days) {

        let pivot = Moment()
            .month(month)
            .year(year)
            .startOf("month");
        const end = Moment()
            .month(month)
            .year(year + 10)
            .endOf("month");
        let dates = {};
        const DISABLED_DAYS = ["0", "2"];
        const disabled = { marked: true, activeOpacity: 0, dotColor: 'rgb(114,202,238)' };
        while (await pivot.isBefore(end)) {
            if (days != null) {
                days.forEach(day => {
                    if (Moment().format('YYYY-MM-DD') == pivot.day(day).format("YYYY-MM-DD")) {
                        dates[pivot.day(day).format("YYYY-MM-DD")] = { selected: true };
                    } else {
                        dates[pivot.day(day).format("YYYY-MM-DD")] = disabled;
                    }
                });
            }
            pivot.add(7, "days");
        }
        console.log(dates, "datesdates")
        setTimeout(() => {
            this.setState({ markedDatesObj: dates });
        }, 2000);
    }
    setAvailability(data) {
        setTimeout(() => {
            let days = [];
            if (
                data.data.availability != undefined &&
                this.state.markedDatesObj != []
            ) {

                if (data.data.availability.option == 0) {
                    days = ["0", "1", "2", "3", "4", "5", "6"];
                } else if (data.data.availability.option == 1) {
                    days = ["1", "2", "3", "4", "5"];
                } else if (data.data.availability.option == 2) {
                    days = ["0", "6"];
                } else if (data.data.availability.option == 3) {
                    // days = data.data.availability.days;
                    days = [];
                    arr = ["0", "1", "2", "3", "4", "5", "6"];
                    var flag = false;
                    if (arr != null) {
                        arr.forEach(element => {
                            if (data.data.availability.days.includes(element)) {

                            } else {
                                days.push(element);
                            }
                        });
                    }
                }
                this.getDaysInMonth(Moment().month(), Moment().year(), days);
            }
        }, 1000);
    }
    navigateToTrader(item) {
        GETAPICaller('getTraderAllReviews/' + item._id, "GET", "", "").then(data => {
            console.log(data, "getTraderAllReviews")
            if (data.code == 200) {
                this.setState({ renderSlide: 4, traderProfileActiveTab: 1, traderReviews: data.data })
            }
        }, err => {
            console.log(err, "getTraderAllReviews")
        })

        GETAPICaller('getUserReview/' + item._id, "GET", "", "").then(data => {
            console.log(data, "getUserReview")
            if (data.code == 200) {
                this.setState({ traderTotalRatting: data.data, traderProfileActiveTab: 1, traderTotalReviews: data.total_review })
            }
            else {
                this.setState({ traderTotalRatting: 0, traderProfileActiveTab: 1, traderTotalReviews: 0 })
            }
        })
        let requestParams = {
            "userId": item._id,
            "roleId": "5a1d26b26ef60c3d44e9b377"
        }
        APICaller('getUserDetails', 'POST', "", requestParams).then(data => {
            console.log(data, "datadata1")
            if (data.code == 200) {
                this.setState({ renderSlide: 4, traderProfileActiveTab: 1, traderDetails: data.data })
                this.setAvailability(data)
            }
        })


        let tradersJobHistoryRequestParams = {
            "trader_id": item._id
        }
        APICaller('tradersJobHistory', 'POST', "", tradersJobHistoryRequestParams).then(data => {
            console.log(data, "tradersJobHistory")
            if (data.code == 200) {
                this.setState({ traderJobHistory: data.data })
            }
        })
    }
    showMobileNumber(id) {
        // 

        let requestParams = { "reveal_contact_number": 1, "user_id": id }
        APICaller('updateRevealContactNumber', 'POST', "", requestParams).then(data => {
            if (data.code == 200) {
                console.log(data, "updateRevealContactNumber")
            }
        })
        this.setState({ showMobileNumber: true })
    }

    sendMessage() {
        console.log("send Message", this.state)
        AsyncStorage.getItem("SyncittUserInfo")
            .then(value => {
                console.log(JSON.parse(value), "valuevalue")
                this.setState({ loggedUserInfo: JSON.parse(value) })
                if (JSON.parse(value)) {
                    Actions.MessageToTraderScreen({
                        userFirstName: this.state.traderDetails.firstname,
                        userLastName: this.state.traderDetails.lastname,
                        receiverId: this.state.traderDetails._id,
                        goBackToPop: true
                    });
                }
                else {
                    Actions.RegistrationScreen({ registrationType: 'login', isBackToTrader: true });
                }
            })
            .done();
    }

    renderRequestForm() {
        return (
            <View onRequestClose={() => this.setState({ renderSlide: 1 })} animationType={'slide'} visible={this.state.renderSlide == 2}>
                <ScrollView showsVerticalScrollIndicator={false} style={[style.scrollViewContainer, { width: null }]}>
                    <ImageBackground source={IMAGEPATH.BACKGROUND_IMAGE} style={{ flex: 1 }}>

                        <View style={style.transparentFormContainer}>
                            <View style={style.syncittLogoContainer2}>
                                <Image source={IMAGEPATH.SYNCITTLOGO} style={style.syncittLogoStyle} resizeMode={"contain"} />
                            </View>
                            <View style={style.formHeaderTextContainer}>
                                <Text style={style.searchResultTextStyle}>SEARCH RESULT</Text>
                                <Text style={style.serviceRequestTextStyle}>Service Request</Text>



                                {this.props.navigation.getParam('fromTraderProfile') ?
                                    <TouchableOpacity style={{ height: 30, borderRadius: 100, width: 30, justifyContent: 'center', backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, position: 'absolute', right: 0, margin: 10, zindex: 2 }} onPress={() => this.props.navigation.goBack()}>
                                        <Image source={IMAGEPATH.DRAWER_CROSS_ICON} style={{ height: 20, alignSelf: 'center', width: 20, }} />
                                    </TouchableOpacity>
                                    : null}


                                {/* ======= What do you need ? Block ======= */}
                                <View style={style.textInputConatiner1}>
                                    <Text style={style.textInputContainer1Text}>What do you need? (Service Category)<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                                    <View style={style.inputBoxContainer1}>
                                        <TextInput
                                            style={style.input1Style}
                                            value={this.state.reqCategory}
                                            placeholderTextColor={'gray'}
                                            onChangeText={(val) => this.onSearchChangeText(val.trimLeft(), "category")}
                                            // onChangeText={(text) => this.setState({ reqCategory: text })}
                                            placeholder={'Search Category'}
                                        />
                                        <View style={style.searchIconStyle}>
                                            <Image source={IMAGEPATH.SEARCH_ICON} />
                                        </View>
                                    </View>
                                </View>
                                <FlatList
                                    data={this.state.servicesList}
                                    style={{ height: this.state.servicesList && this.state.servicesList.length > 0 ? 250 : 0, borderWidth: this.state.servicesList && this.state.servicesList.length > 0 ? 1.5 : 0, borderRadius: 5, borderColor: '#eee' }}
                                    extraData={this.state}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View>
                                                <TouchableOpacity onPress={() => this.onPressSearchItem(item.name, item, "request")} style={{ height: Matrics.ScaleValue(45), backgroundColor: 'white', alignSelf: 'center', alignItems: 'center', borderBottomWidth: 0, borderBottomColor: 'lightgray', width: '100%', flexDirection: 'row', paddingLeft: Matrics.ScaleValue(15) }}>
                                                    <Text style={{ color: 'gray', marginRight: Matrics.ScaleValue(5) }}>{item.name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }}
                                />

                                {/* ======= When ======= */}
                                <View style={style.textInputConatiner2}>
                                    <Text style={style.textInputContainer2Text}>When</Text>
                                    <View style={style.inputBoxContainer2}>
                                        <DatePicker
                                            style={{ flex: 1, width: '100%' }}
                                            date={this.state.reqDate}
                                            mode="date"
                                            iconComponent={() => { return <View></View> }}
                                            placeholder="Select Date"
                                            format='MM-DD-YYYY'
                                            minDate={new Date()}
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    right: 0,
                                                    top: Matrics.ScaleValue(4),
                                                    borderWidth: 0,
                                                    marginLeft: 0
                                                },
                                                dateInput: {
                                                    marginLeft: 0,
                                                    position: 'absolute',
                                                    left: Matrics.ScaleValue(0),
                                                    borderWidth: 0,
                                                    borderBottomWidth: 0,
                                                    borderTopWidth: 0,
                                                    borderRightWidth: 0,
                                                }
                                            }}
                                            onDateChange={(date) => {
                                                console.log(date, "datedatedatedate")
                                                this.setState({ reqDate: date })
                                            }}
                                        />



                                        <View style={style.calenderIconStyle}>
                                            <Image source={IMAGEPATH.CALENDAR_ICON} />
                                        </View>
                                    </View>
                                </View>

                                {/* ======= Budget ======= */}
                                <View style={style.textInputConatiner2}>
                                    <Text style={style.textInputContainer2Text}>Budget($)</Text>
                                    <View style={style.inputBoxContainer2}>
                                        <TextInput
                                            style={style.input2Style}
                                            placeholderTextColor={'gray'}
                                            value={this.state.reqBudget}
                                            keyboardType={'number-pad'}
                                            onChangeText={(text) => this.setState({ reqBudget: text.trimLeft() })}
                                            placeholder={'Enter Budget'}
                                        />
                                    </View>
                                </View>

                                {/* ======= Subject ======= */}
                                <View style={style.textInputConatiner2}>
                                    <Text style={style.textInputContainer2Text}>Subject<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                                    <View style={style.inputBoxContainer2}>
                                        <TextInput
                                            style={style.input2Style}
                                            placeholderTextColor={'gray'}
                                            onChangeText={(text) => this.setState({ reqSubject: text.trimLeft() })}
                                            value={this.state.reqSubject}
                                            placeholder={'Enter Subject'}
                                        />
                                        <View style={{ justifyContent: 'center', paddingRight: Matrics.ScaleValue(10) }}>
                                            <Image source={IMAGEPATH.SEARCH_ICON} />
                                        </View>
                                    </View>
                                </View>

                                {/* ======= Description ======= */}
                                <View style={style.textInputConatiner2}>
                                    <Text style={style.textInputContainer2Text}>Description<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                                    <View style={[style.inputBoxContainer2, { height: Matrics.ScaleValue(200), padding: Matrics.ScaleValue(15) }]}>
                                        <TextInput
                                            placeholder={'Enter Description'}
                                            placeholderTextColor={'gray'}
                                            onChangeText={(text) => this.setState({ reqDescription: text.trimLeft() })}
                                            value={this.state.reqDescription}
                                            style={[style.input2Style, { height: Matrics.ScaleValue(200) }]}
                                            multiline={true}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={style.whiteBackgroundContainer}>

                        {/* ======= Name ======= */}
                        <View style={{ marginTop: Matrics.ScaleValue(0) }}>
                            <Text style={style.textInputContainer2Text}>Name<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                            <View style={style.inputBoxContainer2}>
                                <TextInput
                                    style={style.input2Style}
                                    placeholderTextColor={'gray'}
                                    onChangeText={(text) => this.setState({ reqName: text.trimLeft() })}
                                    value={this.state.reqName}
                                    placeholder={'Enter Name'}
                                />
                            </View>
                        </View>


                        {/* ======= Email ======= */}
                        <View style={style.textInputConatiner2}>
                            <Text style={style.textInputContainer2Text}>Email<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                            <View style={style.inputBoxContainer2}>
                                <TextInput
                                    style={style.input2Style}
                                    placeholder={'Enter Email'}
                                    placeholderTextColor={'gray'}
                                    onChangeText={(text) => this.setState({ reqEmail: text.trimLeft() })}
                                    value={(this.state.reqEmail).toLowerCase()}
                                />
                            </View>
                        </View>

                        {/* ======= Phone Number ======= */}
                        <View style={style.textInputConatiner2}>
                            <Text style={style.textInputContainer2Text}>Phone Number<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                            <View style={style.inputBoxContainer2}>
                                <TextInput
                                    style={style.input2Style}
                                    placeholder={'Enter Phone Number'}
                                    placeholderTextColor={'gray'}
                                    onChangeText={(text) => this.setState({ reqPhoneNumber: text.trimLeft() })}
                                    keyboardType={'phone-pad'}
                                    maxLength={10}
                                    value={this.state.reqPhoneNumber}
                                />
                            </View>
                        </View>

                        {/* ======= Address ======= */}
                        <View style={style.textInputConatiner2}>
                            <Text style={style.textInputContainer2Text}>Address<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                            <View style={style.inputBoxContainer2}>
                                <TextInput
                                    style={style.input2Style}
                                    placeholderTextColor={'gray'}
                                    // onChangeText={(text) => this.setState({ reqAddress: text })}
                                    onChangeText={(val) => this.onLocationChangeText(val.trimLeft(), "reqAddress")}
                                    value={this.state.reqAddress}
                                    placeholder={'Search Address'}
                                />
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', marginBottom: Matrics.ScaleValue(15), borderWidth: this.state.predictions.length > 0 ? 1 : 0, borderColor: '#eee', backgroundColor: 'white', justifyContent: 'center', borderRadius: Matrics.ScaleValue(5), alignSelf: 'center', width: '100%' }}>
                            {this.state.predictions.map((element,index) => {
                                return (
                                    <TouchableOpacity key={index.toString()} onPress={this.onPressLocation.bind(this, element, "reqAddress")} style={{ height: Matrics.ScaleValue(45), alignSelf: 'center', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', width: '100%', flexDirection: 'row', paddingLeft: Matrics.ScaleValue(15) }}>
                                        <View style={{ flex: 0.1 }}>
                                            <Image source={IMAGEPATH.MAP_MARKER} style={{ marginRight: Matrics.ScaleValue(15) }} />
                                        </View>
                                        <View style={{ flex: 0.9 }}>
                                            <Text style={{ color: 'gray', marginRight: Matrics.ScaleValue(5) }}>{element.description}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <Text style={style.addressMessageStyle}>(YOUR ADDRESS WILL BE KEPT PRIVATE UNTIL YOU APPROVE YOUR TRADER)</Text>
                        <TouchableOpacity onPress={() => this.ActionSheet.show()} style={style.uploadFileButtonContainer}>
                            <Text style={style.uploadFileTextStyle}>UPLOAD A FILE</Text>
                        </TouchableOpacity>
                        <View style={{ paddingBottom: 10 }}>
                            {this.state.documentsList.map(element => {
                                return (<View style={{ width: '100%', flexDirection: 'row', height: 40, borderBottomColor: '#eee', borderBottomWidth: 1, margin: 7 }}>
                                    <View style={{ flex: 2, justifyContent: 'center' }}>
                                        <Image source={{ uri: element.uri }} style={{ height: 30, width: 30, paddingRight: 10 }} />
                                    </View>
                                    <View style={{ flex: 7, justifyContent: 'center' }}>
                                        <Text>{element.name}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => {
                                        let arr = []
                                        this.state.documentsList.forEach(item => {
                                            console.log(item)
                                            if (item != element) {
                                                arr.push(item)
                                            }
                                        })
                                        this.setState({ documentsList: arr })
                                    }} style={{ flex: 1 }}><Text>X</Text></TouchableOpacity>
                                </View>)
                            })}
                        </View>
                        {this.state.submitRequestLoader ?
                            <TouchableOpacity style={style.submitButtonContainer}>
                                <ActivityIndicator size='small' color={COLORS.WHITE} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => { this.onRequestSubmit() }} style={style.submitButtonContainer}>
                                <Text style={style.submitTextStyle}>SUBMIT</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={[style.footerStepsConatiner, { marginTop: 0, }]}>
                        <View style={style.stepsContainer}>
                            <Text style={style.stepsTextStyle}>Step 1</Text>
                        </View>
                        <Text style={style.stepsDescriptionTextStyle}>Complete this request form, upload any relevant file, SUBMIT.</Text>
                    </View>
                    <View style={style.footerStepsConatiner}>
                        <View style={style.stepsContainer}>
                            <Text style={style.stepsTextStyle}>Step 2</Text>
                        </View>
                        <Text style={style.stepsDescriptionTextStyle}>Check the link in your email.</Text>
                    </View>
                    <View style={style.footerStepsConatiner}>
                        <View style={style.stepsContainer}>
                            <Text style={style.stepsTextStyle}>Step 3</Text>
                        </View>
                        <Text style={style.stepsDescriptionTextStyle}>Review public quotes, invites trades to quote directly, HIRE your trader.</Text>
                    </View>

                    <TouchableOpacity onPress={() => this.setState({ renderSlide: 1 })} style={style.backToHomeStyle}>
                        <Text style={style.backToHomeTextStyle}>BACK TO HOME</Text>
                    </TouchableOpacity>

                </ScrollView>
                <ActionSheet
                    ref={o => (this.ActionSheet = o)}
                    options={actionOptions}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={this.handlePress}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: Matrics.ScaleValue(65), backgroundColor: 'white' }}>
                    <View style={style.tabContainerInner}>
                        <TouchableOpacity onPress={() => Actions.SplashScreen()}>
                            <Image source={IMAGEPATH.SYNCITTHOMEICON} style={style.imageStyle} />
                        </TouchableOpacity>
                    </View>
                    <View style={style.tabContainerInner}>
                        <TouchableOpacity onPress={() => {
                            this.setState({ showModal: true })
                        }}>
                            <Image source={IMAGEPATH.DASHBOARD_MENU} style={style.imageStyle} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    renderIntialHomeSearch() {
        return (
            <KeyboardAwareScrollView
                extraScrollHeight={Platform.OS ==='ios'?30:0}
                enableOnAndroid
                enableAutomaticScroll
                style={style.renderIntialSearchContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flex:1}}
                keyboardShouldPersistTaps
                scrollEnabled={true}
                >
            {/* // <KeyboardAvoidingView style={style.renderIntialSearchContainer} behavior={Platform.OS === 'android' ? '' : 'padding'}> */}
                 <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps={'handled'} style={style.renderIntialSearchContainer}>
                 
                    <View style={style.syncittLogoContainer1}>
                        <Image source={IMAGEPATH.SYNCITTLOGO} style={{ height: 75 }} resizeMode={"contain"} />
                    </View>
                    <View style={style.headerTitleStyle}>
                    {this.state.setTrade &&<Text style={style.headerTextStyle}>Get Tradie Quotes <Text style={{ fontWeight: 'bold' }}>Fast</Text></Text>}
                    {this.state.setAgent &&<Text style={style.headerTextStyle}>{`Find & Compare `}<Text style={{ fontWeight: 'bold' }}>Agents</Text></Text>}
                    </View>
                    <View style={{justifyContent:'center',marginHorizontal:30,marginTop:22}}>
                        <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                            <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>this.setState({setTrade:true,setAgent:false,locationSearchText:'',searchText:''})}>
                                <Text style={{fontSize: Matrics.ScaleValue(16),marginBottom:15,fontWeight:this.state.setTrade?'bold':'500', textAlign: 'center', color: 'white'}}>Ownly Trade</Text>
                                {this.state.setTrade && <View style={{height:2.5,backgroundColor:'white'}}/>}
                            </TouchableOpacity>
                            <TouchableOpacity style={{justifyContent:'center',marginLeft:27}} onPress={()=>this.setState({setTrade:false,setAgent:true,locationSearchText:'',categorySearchFocus:false})}>
                                <Text style={{fontSize: Matrics.ScaleValue(16),marginBottom:15,fontWeight:this.state.setAgent?'bold':'500', textAlign: 'center', color: 'white'}}>Agent</Text>
                                {this.state.setAgent && <View style={{height:2.5,backgroundColor:'white'}}/>}
                            </TouchableOpacity>
                        </View>
                        <View style={{height:0.7,width:'100%',backgroundColor:'white'}}/>
                    </View>
                    {
                        this.state.setTrade && (
                            <Animated.View style={[style.textbox1Conatiner, {
                                marginLeft: this.animatedValue.interpolate({
                                    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
                                    outputRange: [10, -20, 20, -20, 20, -20, 10]
                                })
                            }]}>
                                <TextInput
                                    placeholder="Search by Service Category or Business Name"
                                    onChangeText={(val) => this.onSearchChangeText(val.trimLeft())}
                                    placeholderTextColor={'lightgray'}
                                    style={{ color: 'gray' }}
                                    onFocus={() => {
                                        this.setState({ categorySearchFocus: true })
                                    }}
                                    onBlur={() => {
                                        // this.setState({ categorySearchFocus: false })
                                    }}
                                    value={this.state.searchText}
                                />
                            </Animated.View>        
                        )
                    }
                    
                    {(this.state.categorySearchFocus && (this.state.servicesList && this.state.servicesList.length > 0)) || (this.state.categorySearchFocus && (this.state.businessUserList && this.state.businessUserList.length)) || (this.state.categorySearchFocus && (this.state.categoriesList && this.state.categoriesList.length)) ?
                        <ScrollView nestedScrollEnabled keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false} style={{ height: (this.state.servicesList && this.state.servicesList.length > 2) || this.state.categoriesList.length > 2 || this.state.businessUserList.length > 2 ? 300 : null, backgroundColor: 'white', borderRadius: 5, alignSelf: 'center', width: '85%' }}>
                            <View style={{ padding: Matrics.ScaleValue(10), borderRadius: Matrics.ScaleValue(5), width: '100%', alignSelf: 'center' }}>
                                {(this.state.servicesList && this.state.servicesList.length > 0) ?
                                    <View>
                                        <View style={{ height: Matrics.ScaleValue(40), paddingLeft: Matrics.ScaleValue(15), backgroundColor: rgb(249, 250, 252), justifyContent: 'center', }}>
                                            <Text style={{ color: '#19a6bf' }}>SERVICE REQUEST</Text>
                                        </View>
                                        <FlatList
                                            data={this.state.servicesList}
                                            extraData={this.state}
                                            keyboardShouldPersistTaps={'handled'}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <TouchableOpacity onPress={() => this.onPressSearchItem(item.name, item, "request")} style={{ height: Matrics.ScaleValue(45), backgroundColor: 'white', alignSelf: 'center', alignItems: 'center', borderBottomWidth: 0, borderBottomColor: 'lightgray', width: '100%', flexDirection: 'row', paddingLeft: Matrics.ScaleValue(15) }}>
                                                        <View style={{ flex: 0.4 }}>
                                                            <Text style={{ color: 'lightgray', marginRight: Matrics.ScaleValue(5) }}>{'Let us find you'}</Text>
                                                        </View>
                                                        <View style={{ flex: 0.6 }}>
                                                            <Text style={{ color: 'gray', marginRight: Matrics.ScaleValue(5) }}>{item.name}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }} />
                                    </View>
                                    : null}

                                {(this.state.categoriesList && this.state.categoriesList.length > 0) ?
                                    <View>
                                        <View style={{ height: Matrics.ScaleValue(45), paddingLeft: Matrics.ScaleValue(15), justifyContent: 'center', }}>
                                            <Text style={{ color: '#19a6bf' }}>SERVICE CATEGORY</Text>
                                        </View>
                                        <FlatList
                                            data={this.state.categoriesList}
                                            extraData={this.state}
                                            keyboardShouldPersistTaps={'handled'}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <TouchableOpacity onPress={() => this.onPressSearchItem(item.name, item, "category")} style={{ height: Matrics.ScaleValue(45), alignSelf: 'center', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', width: '100%', flexDirection: 'row', paddingLeft: Matrics.ScaleValue(15) }}>
                                                        <View style={{ flex: 0.3 }}>
                                                            <Text style={{ color: 'lightgray', marginRight: Matrics.ScaleValue(5) }}>{'Browse'}</Text>
                                                        </View>
                                                        <View style={{ flex: 0.7 }}>
                                                            <Text style={{ color: 'gray', marginRight: Matrics.ScaleValue(5) }}>{item.name}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }} />
                                    </View>
                                    : null}

                                {(this.state.businessUserList && this.state.businessUserList.length > 0) ?
                                    <View>
                                        <View style={{ height: Matrics.ScaleValue(45), paddingLeft: Matrics.ScaleValue(15), justifyContent: 'center' }}>
                                            <Text style={{ color: '#19a6bf' }}>BUSINESS NAME</Text>
                                        </View>
                                        <FlatList
                                            data={this.state.businessUserList}
                                            extraData={this.state}
                                            keyboardShouldPersistTaps={'handled'}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <TouchableOpacity onPress={() => this.onPressSearchItem(item.business_name, item, "business")} style={{ height: Matrics.ScaleValue(45), alignSelf: 'center', alignItems: 'center', borderBottomWidth: 0, borderBottomColor: 'lightgray', width: '100%', flexDirection: 'row', paddingLeft: Matrics.ScaleValue(15) }}>
                                                        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Image source={{ uri: API.USER_IMAGE_PATH + item.image }} style={{ height: Matrics.ScaleValue(25), width: Matrics.ScaleValue(25) }} />
                                                        </View>
                                                        <View style={{ flex: 0.8 }}>
                                                            <Text style={{ color: 'gray', marginRight: 5 }}>{item.business_name}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }} />
                                    </View>
                                    : null}
                            </View>
                        </ScrollView>
                        : null}
                        
                    <Animated.View style={[style.textbox2Conatiner, {
                        marginLeft: this.animatedValue.interpolate({
                            inputRange: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
                            outputRange: [Matrics.ScaleValue(10), Matrics.ScaleValue(-20), Matrics.ScaleValue(20), Matrics.ScaleValue(-20), Matrics.ScaleValue(20), Matrics.ScaleValue(-20), Matrics.ScaleValue(10)]
                        })
                    }]}>
                        <View style={{ flex: 0.1 }}>
                            <Image source={IMAGEPATH.MAP_MARKER} style={style.locationMarkerStyle} />
                        </View>
                        <View style={{ flex: 0.9 }}>
                            <TextInput
                                onChangeText={(val) => this.onLocationChangeText(val.trimLeft())}
                                value={this.state.locationSearchText}
                                placeholderTextColor={'lightgray'}
                                style={{ color: 'gray' }}
                                onFocus={() => {
                                    this.setState({ addressSearchFocus: true })
                                }}
                                onBlur={() => {
                                    // this.setState({ addressSearchFocus: false })
                                }}
                                placeholder={'Suburb and Postcode'}
                            />
                        </View>
                    </Animated.View>
                    {this.state.addressSearchFocus && this.state.locationSearchText !== '' &&
                        <View style={{ alignItems: 'center', backgroundColor: 'white', justifyContent: 'center', borderRadius: Matrics.ScaleValue(5), alignSelf: 'center', width: '85%' }}>
                            {this.state.predictions.map((element,index) => {
                                return (
                                    <TouchableOpacity key={index.toString()} onPress={this.onPressLocation.bind(this, element)} style={{ height: Matrics.ScaleValue(45), alignSelf: 'center', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'lightgray', width: '100%', flexDirection: 'row', paddingLeft: Matrics.ScaleValue(15) }}>
                                        <View style={{ flex: 0.1 }}>
                                            <Image source={IMAGEPATH.MAP_MARKER} style={{ marginRight: Matrics.ScaleValue(15) }} />
                                        </View>
                                        <View style={{ flex: 0.9 }}>
                                            <Text style={{ color: 'gray', marginRight: Matrics.ScaleValue(5) }}>{element.description}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    }

                    {/* {this.state.showSearchLoader ?
                        <TouchableOpacity onPress={() => this.onSearchPress()} style={[style.searchButtonContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                            <ActivityIndicator size='small' color={COLORS.WHITE} />
                        </TouchableOpacity>: */}
                         <TouchableOpacity onPress={() => this.onSearchPress()} style={style.searchButtonContainer}>
                            <View style={style.searchImageContainer}>
                                <Image source={IMAGEPATH.SEARCH_ICON} style={{ tintColor: 'white' }} />
                            </View>
                            <View style={style.searchTextContainer}>
                                <Text style={style.searchTextStyle}>Search</Text>
                            </View>
                            <View style={{ flex: 0.2 }}>
                            </View>
                        </TouchableOpacity>
                        {/* } */}
                        </ScrollView>
                    </KeyboardAwareScrollView>

        )
    }
    renderTrader({ item, index }) {
        return (
            <View style={style.renderTraderContainerStyle}>
                <View style={style.logoContainer}>
                    {item.image ?
                        <ImageBackground imageStyle={{ borderRadius: Matrics.ScaleValue(60) }} source={{ uri: API.USER_IMAGE_PATH + item.image }} style={style.profileImageStyle}>
                            {item.is_online &&
                                <View style={style.greenDotStyle}></View>
                            }
                        </ImageBackground>
                        :
                        <View style={[style.profileImageStyle, { backgroundColor: COLORS.BACKGROUND, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ color: 'white', fontSize: Matrics.ScaleValue(25), fontWeight: '600' }}>{(item.firstname && item.firstname.charAt(0).toUpperCase()) + ' ' + (item.lastname && item.lastname.charAt(0).toUpperCase())}</Text>
                        </View>
                    }
                </View>
                <View style={style.profileDataContainer}>
                    <Text style={style.traderNameTextStyle}>{item.firstname} {item.lastname}</Text>
                    <View>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            starSize={20}
                            starStyle={{ paddingRight: Matrics.ScaleValue(5), marginTop: Matrics.ScaleValue(8) }}
                            emptyStarColor={COLORS.EMPTY_STAR_COLOR}
                            starColor={COLORS.STAR_COLOR}
                            rating={item.averageRate}
                            selectedStar={rating => ref.onStarRatingPress(rating)}
                        />
                    </View>
                    <Text style={style.reviewsStyle}>
                        {item.totalReviewLength ? '(' + item.totalReviewLength + ')' + 'Reviews'
                            :
                            'No Reviews'}
                    </Text>
                    <View style={style.servicesContainer}>

                        <FlatList
                            data={item.categories_id && item.categories_id}
                            extraData={this.state}
                            style={[style.servicesContainer, { marginHorizontal: Matrics.ScaleValue(10) }]}
                            renderItem={(ele) => {
                                if (ele.index < 3) {
                                    return <View style={style.serviceTextContainer}><Text style={style.serviceTextStyle}>{ele.item.name}</Text></View>
                                } else if (ele.index == 3) {
                                    return <View style={style.serviceTextContainer}><Text style={style.serviceTextStyle}>+{item.categories_id && Number(item.categories_id.length) - 3}</Text></View>
                                } else {
                                    return null
                                }
                            }
                            }
                        />
                        {/* <View style={style.serviceTextContainer}><Text style={style.serviceTextStyle}>PAINTER</Text></View>
                        <View style={style.serviceTextContainer}><Text style={style.serviceTextStyle}>ELECTRICIAN</Text></View>
                        <View style={style.serviceTextContainer}><Text style={style.serviceTextStyle}>PAINTER</Text></View>
                        <View style={style.extServiceTextContainer}><Text style={style.serviceTextStyle}>+3</Text></View> */}
                    </View>
                    <View style={style.footerButtonContainer}>
                        <TouchableOpacity onPress={() => this.navigateToTrader(item)} style={style.viewProfileButtonStyle}>
                            <Text style={style.viewProfileButtonTextStyle}>VIEW PROFILE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({ renderSlide: 2, trader_id: item._id, selectedCategory: this.state.selectedItem, reqCategory: this.state.selectedItem.name })
                            if (this.state.loggedUserInfo != null) {

                                let address = (this.state.loggedUserInfo.data.city ? this.state.loggedUserInfo.data.city : "") + (this.state.loggedUserInfo.data.location_postal_code ? (',' + this.state.loggedUserInfo.data.location_postal_code) : "") + (this.state.loggedUserInfo.data.state ? (',' + this.state.loggedUserInfo.data.state) : "") + (this.state.loggedUserInfo.data.country ? (',' + this.state.loggedUserInfo.data.country) : "")
                                this.setState({
                                    reqName: this.state.loggedUserInfo.data.name,
                                    reqEmail: (this.state.loggedUserInfo.data.email).toLowerCase(),
                                    reqPhoneNumber: this.state.loggedUserInfo.data.mobile_no,
                                    reqAddress: address,
                                    reqLongitude: this.state.loggedUserInfo.data.location_longitude,
                                    reqLatitude: this.state.loggedUserInfo.data.location_latitude
                                })
                            }
                        }} style={style.getQuotesButtonStyle}>
                            <Text style={style.getQuotesButtonTextStyle}>GET A QUOTE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderTraderList() {
        return (
            <Modal onRequestClose={() => this.setState({ renderSlide: 1 })} transparent={true} animationType={'slide'} visible={this.state.renderSlide == 3}>
                <ImageBackground source={IMAGEPATH.BACKGROUND_IMAGE} style={style.renderTraderContainer}>
                    <View style={style.traderTransparentContainer}>
                        <ScrollView showsVerticalScrollIndicator={false} style={style.traderSubContainer}>
                            <View style={style.syncittLogoContainer}>
                                <Image source={IMAGEPATH.SYNCITTLOGO} style={style.logoImageStyle} resizeMode={"contain"} />
                            </View>
                            <FlatList
                                data={this.state.searchTradersList}
                                scrollEnabled={false}
                                initialNumToRender={this.state.searchTradersList.length}
                                renderItem={this.renderTrader.bind(this)}
                            />
                            <TouchableOpacity onPress={() => this.setState({ renderSlide: 1 })} style={[style.backToSearchContainer, { marginBottom: Matrics.ScaleValue(45) }]}>
                                <Text style={style.backToSearchTextStyle}>BACK TO SEARCH</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </ImageBackground>
            </Modal>
        )
    }
    renderTraderProfile() {
        console.log("trader profile :" + JSON.stringify(this.state.traderDetails))
        const { image, firstname, groups, images, bannerImage, categoriesDetails, is_online, availability, lastname, name, business_name, mobile_no, abn_number, about_user, address, _id } = this.state.traderDetails

        return (
            <View onRequestClose={() => this.setState({ renderSlide: 1 })} animationType={'slide'} visible={this.state.renderSlide == 4}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <ScrollView>
                        {bannerImage ?
                            <ImageBackground source={{ uri: API.USER_IMAGE_PATH + bannerImage }} style={{ height: Matrics.ScaleValue(180), backgroundColor: '#0073E6', width: '100%' }}>
                                <View><TouchableOpacity style={{ backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, width: Matrics.ScaleValue(40), height: Matrics.ScaleValue(40), padding: 10, margin: Matrics.ScaleValue(30), marginTop: Matrics.ScaleValue(50), borderRadius: 20, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ renderSlide: 1 })}><Image source={IMAGEPATH.BACK_WHITE} resizeMode={'contain'} style={{ height: Matrics.ScaleValue(20), tintColor: 'white', width: Matrics.ScaleValue(20) }} /></TouchableOpacity></View>
                            </ImageBackground>
                            :
                            <View style={{ height: Matrics.ScaleValue(180), backgroundColor: '#0073E6', width: '100%' }}>
                                <TouchableOpacity onPress={() => this.setState({ renderSlide: 1 })}><Image source={IMAGEPATH.BACK_WHITE} style={{ height: Matrics.ScaleValue(20), margin: Matrics.ScaleValue(30), marginTop: Matrics.ScaleValue(50), width: Matrics.ScaleValue(20) }} /></TouchableOpacity>
                            </View>
                        }
                        <View style={style.logoContainer}>
                            {image ?
                                <ImageBackground imageStyle={{ borderRadius: Matrics.ScaleValue(80) }} source={{ uri: API.USER_IMAGE_PATH + image }} style={[style.profileImageStyle, { height: Matrics.ScaleValue(150), width: Matrics.ScaleValue(150), position: 'absolute', top: Matrics.ScaleValue(-100) }]}>
                                    {is_online &&
                                        <View style={style.greenDotStyle}></View>
                                    }
                                </ImageBackground>
                                :
                                <View style={[style.profileImageStyle, { backgroundColor: COLORS.BACKGROUND, justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={{ color: 'white', fontSize: Matrics.ScaleValue(25), fontWeight: '600' }}>{(firstname && firstname.charAt(0).toUpperCase()) + ' ' + (lastname && lastname.charAt(0).toUpperCase())}</Text>
                                </View>
                            }
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: Matrics.ScaleValue(50) }}>
                            <Text style={{ color: COLORS.SIGN_UP_SUB_TITLE_COLOR, fontWeight: '600', fontSize: Matrics.ScaleValue(20) }}>{firstname + ' ' + lastname}</Text>
                            <Text style={{ color: COLORS.SKY_BLUE_BUTTON_BACKGROUND, fontSize: Matrics.ScaleValue(12) }}>{business_name}</Text>
                            <View>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    starSize={20}
                                    starStyle={{ paddingRight: Matrics.ScaleValue(5), marginTop: Matrics.ScaleValue(8) }}
                                    emptyStarColor={COLORS.EMPTY_STAR_COLOR}
                                    starColor={COLORS.STAR_COLOR}
                                    rating={4.5}
                                    selectedStar={rating => ref.onStarRatingPress(rating)}
                                />
                            </View>
                            <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(16) }}>{this.state.traderTotalRatting} from {this.state.traderTotalReviews} reviews</Text>

                            <Text style={{ color: COLORS.SIGN_UP_SUB_TITLE_COLOR, fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(16), marginTop: Matrics.ScaleValue(20), fontWeight: '600' }}>LOCATION</Text>
                            <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(18) }}>{address}</Text>

                            <Text style={{ color: COLORS.SIGN_UP_SUB_TITLE_COLOR, fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(16), marginTop: Matrics.ScaleValue(20), fontWeight: '600' }}>MOBILE NUMBER</Text>
                            {mobile_no && this.state.showMobileNumber ?
                                <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(18) }}>{mobile_no}</Text>
                                :
                                <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(18) }}>{mobile_no && mobile_no.replace(/.(?=.{4})/g, '*')}</Text>
                            }
                            {!this.state.showMobileNumber &&
                                <TouchableOpacity onPress={() => this.showMobileNumber(_id)}><Text style={{ color: COLORS.SKY_BLUE_BUTTON_BACKGROUND, fontSize: Matrics.ScaleValue(12), fontWeight: '600' }}>SHOW NUMBER</Text></TouchableOpacity>
                            }

                            <Text style={{ color: COLORS.SIGN_UP_SUB_TITLE_COLOR, fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(16), marginTop: Matrics.ScaleValue(20), fontWeight: '600' }}>ABN</Text>
                            <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(18) }}>{abn_number}</Text>

                            <TouchableOpacity onPress={() => {
                                this.setState({ renderSlide: 2, reqCategory: this.state.selectedItem.name, selectedCategory: this.state.selectedItem })
                                if (this.state.loggedUserInfo != null) {
                                    let address = (this.state.loggedUserInfo.data.city ? this.state.loggedUserInfo.data.city : "") + (this.state.loggedUserInfo.data.location_postal_code ? (',' + this.state.loggedUserInfo.data.location_postal_code) : "") + (this.state.loggedUserInfo.data.state ? (',' + this.state.loggedUserInfo.data.state) : "") + (this.state.loggedUserInfo.data.country ? (',' + this.state.loggedUserInfo.data.country) : "")
                                    this.setState({
                                        reqName: this.state.loggedUserInfo.data.name,
                                        trader_id: _id,
                                        reqEmail: (this.state.loggedUserInfo.data.email).toLowerCase(),
                                        reqPhoneNumber: this.state.loggedUserInfo.data.mobile_no,
                                        reqAddress: address,
                                        reqLongitude: this.state.loggedUserInfo.data.location_longitude,
                                        reqLatitude: this.state.loggedUserInfo.data.location_latitude
                                    })
                                }
                            }} style={{ height: Matrics.ScaleValue(40), width: '50%', backgroundColor: COLORS.ORANGE_BUTTON_BACKGROUND, borderRadius: Matrics.ScaleValue(50), marginTop: Matrics.ScaleValue(20), justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: Matrics.ScaleValue(12), fontWeight: '600', lineHeight: Matrics.ScaleValue(18) }}>REQUEST MAINTENANCE</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.sendMessage()} style={{ height: Matrics.ScaleValue(40), width: '50%', backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: Matrics.ScaleValue(50), marginTop: Matrics.ScaleValue(20), justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: Matrics.ScaleValue(12), fontWeight: '600', lineHeight: Matrics.ScaleValue(18) }}>SEND MESSAGE</Text>
                            </TouchableOpacity>


                            {/* /========= tab view ============== */}
                            <ScrollView horizontal={true} style={{ flex: 1, width: '100%', marginTop: Matrics.ScaleValue(15), backgroundColor: COLORS.BACKGROUND_COLOR }} showsHorizontalScrollIndicator={false}>
                                <TouchableOpacity onPress={() => this.setState({ traderProfileActiveTab: 1 })} style={{ height: Matrics.ScaleValue(55), justifyContent: 'center', borderBottomColor: this.state.traderProfileActiveTab == 1 ? COLORS.SKY_BLUE_BUTTON_BACKGROUND : COLORS.BOTTOM_NEXT_BUTTON_VIEW_BACKGROUND_COLOR, borderBottomWidth: Matrics.ScaleValue(2), alignItems: 'center', width: Matrics.ScaleValue(100) }}><Text style={{ fontWeight: '600', color: this.state.traderProfileActiveTab == 1 ? COLORS.SKY_BLUE_BUTTON_BACKGROUND : COLORS.SIGN_UP_SUB_TITLE_COLOR, fontSize: Matrics.ScaleValue(13) }}>ABOUT</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ traderProfileActiveTab: 2 })} style={{ height: Matrics.ScaleValue(55), justifyContent: 'center', borderBottomColor: this.state.traderProfileActiveTab == 2 ? COLORS.SKY_BLUE_BUTTON_BACKGROUND : COLORS.BOTTOM_NEXT_BUTTON_VIEW_BACKGROUND_COLOR, borderBottomWidth: Matrics.ScaleValue(2), alignItems: 'center', width: Matrics.ScaleValue(100) }}><Text style={{ fontWeight: '600', color: this.state.traderProfileActiveTab == 2 ? COLORS.SKY_BLUE_BUTTON_BACKGROUND : COLORS.SIGN_UP_SUB_TITLE_COLOR, fontSize: Matrics.ScaleValue(13) }}>AVAILABILITY</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ traderProfileActiveTab: 3 })} style={{ height: Matrics.ScaleValue(55), justifyContent: 'center', borderBottomColor: this.state.traderProfileActiveTab == 3 ? COLORS.SKY_BLUE_BUTTON_BACKGROUND : COLORS.BOTTOM_NEXT_BUTTON_VIEW_BACKGROUND_COLOR, borderBottomWidth: Matrics.ScaleValue(2), alignItems: 'center', width: Matrics.ScaleValue(100) }}><Text style={{ fontWeight: '600', color: this.state.traderProfileActiveTab == 3 ? COLORS.SKY_BLUE_BUTTON_BACKGROUND : COLORS.SIGN_UP_SUB_TITLE_COLOR, fontSize: Matrics.ScaleValue(13) }}>OVERVIEW</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ traderProfileActiveTab: 4 })} style={{ height: Matrics.ScaleValue(55), justifyContent: 'center', borderBottomColor: this.state.traderProfileActiveTab == 4 ? COLORS.SKY_BLUE_BUTTON_BACKGROUND : COLORS.BOTTOM_NEXT_BUTTON_VIEW_BACKGROUND_COLOR, borderBottomWidth: Matrics.ScaleValue(2), alignItems: 'center', width: Matrics.ScaleValue(100) }}><Text style={{ fontWeight: '600', color: this.state.traderProfileActiveTab == 4 ? COLORS.SKY_BLUE_BUTTON_BACKGROUND : COLORS.SIGN_UP_SUB_TITLE_COLOR, fontSize: Matrics.ScaleValue(13) }}>JOB HISTORY</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ traderProfileActiveTab: 5 })} style={{ height: Matrics.ScaleValue(55), justifyContent: 'center', borderBottomColor: this.state.traderProfileActiveTab == 5 ? COLORS.SKY_BLUE_BUTTON_BACKGROUND : COLORS.BOTTOM_NEXT_BUTTON_VIEW_BACKGROUND_COLOR, borderBottomWidth: Matrics.ScaleValue(2), alignItems: 'center', width: Matrics.ScaleValue(100) }}><Text style={{ fontWeight: '600', color: this.state.traderProfileActiveTab == 5 ? COLORS.SKY_BLUE_BUTTON_BACKGROUND : COLORS.SIGN_UP_SUB_TITLE_COLOR, fontSize: Matrics.ScaleValue(13) }}>REVIEWS</Text></TouchableOpacity>
                            </ScrollView>
                            {this.state.traderProfileActiveTab == 1 ? this.renderAbout(about_user) : null}
                            {this.state.traderProfileActiveTab == 2 ? this.renderAvailability(availability) : null}
                            {this.state.traderProfileActiveTab == 3 ? this.renderOverview(groups.about_user, categoriesDetails, images) : null}
                            {this.state.traderProfileActiveTab == 4 ? this.renderJobHistory(this.state.traderJobHistory) : null}
                            {this.state.traderProfileActiveTab == 5 ? this.renderReviews(this.state.traderReviews) : null}
                        </View>

                    </ScrollView>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: Matrics.ScaleValue(65), backgroundColor: 'white' }}>
                    <View style={style.tabContainerInner}>
                        <TouchableOpacity onPress={() => Actions.SplashScreen()}>
                            <Image source={IMAGEPATH.SYNCITTHOMEICON} style={style.imageStyle} />
                        </TouchableOpacity>
                    </View>
                    <View style={style.tabContainerInner}>
                        <TouchableOpacity onPress={() => {
                            this.setState({ showModal: true })
                        }}>
                            <Image source={IMAGEPATH.DASHBOARD_MENU} style={style.imageStyle} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    renderAbout(about_user) {
        return (
            <View style={{ backgroundColor: COLORS.BACKGROUND_COLOR, width: '100%' }}>

                {about_user ?
                    <View style={{ backgroundColor: COLORS.WHITE, margin: Matrics.ScaleValue(20), elevation: 2, shadowOffset: { width: 0, height: 0 }, shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: Matrics.ScaleValue(3), padding: Matrics.ScaleValue(20), borderRadius: Matrics.ScaleValue(3) }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.SIGN_UP_SUB_TITLE_COLOR }}>About</Text>
                        <Text numberOfLines={this.state.showMore ? null : 8} style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(20), marginTop: Matrics.ScaleValue(20) }}>{about_user}</Text>
                        {this.state.showMore ? <Text style={{ paddingTop: 10, fontSize: 12, color: COLORS.SKY_BLUE_BUTTON_BACKGROUND, fontWeight: 'bold' }} onPress={() => this.setState({ showMore: false })}>SHOW LESS</Text> : <Text onPress={() => this.setState({ showMore: true })} style={{ fontSize: 12, color: COLORS.SKY_BLUE_BUTTON_BACKGROUND, fontWeight: 'bold', paddingTop: 10 }}>SHOW MORE</Text>}
                    </View>
                    :
                    <View style={{ backgroundColor: COLORS.WHITE, margin: Matrics.ScaleValue(20), elevation: 2, shadowOffset: { width: 0, height: 0 }, shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: Matrics.ScaleValue(3), padding: Matrics.ScaleValue(20), borderRadius: Matrics.ScaleValue(3) }}>
                        <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(20), }}>{'No data found'}</Text>
                    </View>}
            </View>
        )
    }
    renderAvailability(availability) {
        return (
            <View style={{ backgroundColor: COLORS.BACKGROUND_COLOR, width: '100%' }}>
                <View style={{ backgroundColor: COLORS.WHITE, margin: Matrics.ScaleValue(20), padding: Matrics.ScaleValue(20), elevation: Matrics.ScaleValue(2), shadowOffset: { width: 0, height: 0 }, shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: Matrics.ScaleValue(3), borderRadius: Matrics.ScaleValue(3) }}>
                    <Text style={{ fontSize: Matrics.ScaleValue(18), fontWeight: '600', color: COLORS.SIGN_UP_SUB_TITLE_COLOR }}>Availability</Text>

                    <Calendar
                        style={{
                            borderTopWidth: 1,
                            paddingTop: Matrics.ScaleValue(5),
                            borderBottomWidth: 1,
                            borderColor: '#eee',
                            height: Matrics.ScaleValue(350),
                            marginTop: Matrics.ScaleValue(20)
                        }}
                        theme={{
                            dotColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
                        }}
                        current={Moment().format('YYYY-MM-DD')}
                        // minDate={Moment().format('YYYY-MM-DD')}
                        // onDayPress={(day) => this.showPopup(day)}
                        firstDay={1}
                        markedDates={this.state.markedDatesObj}
                        // disabledByDefault={true}
                        hideArrows={false}
                    />


                    <View style={{ height: 50, alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ height: 8, width: 8, margin: 15, backgroundColor: 'rgb(114,202,238)', borderRadius: 4 }} />
                        <Text>AVAILABLE DAYS</Text>
                    </View>
                </View>
            </View>
        )
    }
    renderOverview(about_user, categoriesDetails, images) {
        console.log(about_user, "about_userabout_user")
        return (
            <View style={{ backgroundColor: COLORS.BACKGROUND_COLOR, width: '100%' }}>
                <View style={{ backgroundColor: COLORS.WHITE, margin: Matrics.ScaleValue(20), elevation: 2, shadowOffset: { width: 0, height: 0 }, shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: Matrics.ScaleValue(3), padding: Matrics.ScaleValue(20), borderRadius: Matrics.ScaleValue(3) }}>

                    <Text style={{ fontSize: Matrics.ScaleValue(18), fontWeight: '600', color: COLORS.SIGN_UP_SUB_TITLE_COLOR }}>Overview</Text>
                    {about_user ?
                        <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(20), marginTop: Matrics.ScaleValue(20), }}>{about_user} </Text>
                        :
                        <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(20), marginTop: Matrics.ScaleValue(20), }}>{'No overview'} </Text>
                    }

                    <Text style={{ fontSize: Matrics.ScaleValue(18), marginTop: Matrics.ScaleValue(20), fontWeight: '600', color: COLORS.SIGN_UP_SUB_TITLE_COLOR }}>Services/Skills</Text>
                    <View style={[style.servicesContainer, { marginTop: Matrics.ScaleValue(20) }]}>
                        {/* <FlatList
                            data={categoriesDetails}
                            extraData={this.state}
                            style={[{ flexWrap: 'wrap', flexDirection: 'row' }]}
                            renderItem={(ele) => { */}
                        {categoriesDetails && categoriesDetails.map(ele => {
                            return <View style={style.serviceTextContainer}><Text style={style.serviceTextStyle}>{ele.name}</Text></View>
                        })}
                        {/* }}
                        /> */}
                    </View>

                    <Text style={{ fontSize: Matrics.ScaleValue(18), marginTop: Matrics.ScaleValue(20), marginBottom: Matrics.ScaleValue(20), fontWeight: '600', color: COLORS.SIGN_UP_SUB_TITLE_COLOR }}>Portfolio</Text>
                    {images && images.map(data => {
                        return (
                            <Image style={{ height: Matrics.ScaleValue(150), margin: Matrics.ScaleValue(5), width: '100%' }} source={{ uri: API.USER_IMAGE_PATH + data.url }} />
                        )
                    })}


                </View>
            </View>
        )
    }
    renderJobHistory(jobs) {
        console.log(jobs, "jobsjobs")
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_COLOR, width: '100%', paddingBottom: Matrics.ScaleValue(25) }}>
                {jobs && jobs.length > 0 ?
                    <FlatList
                        data={jobs}
                        extraData={this.state}
                        style={{ flex: 1 }}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ backgroundColor: COLORS.WHITE, marginBottom: 0, margin: Matrics.ScaleValue(20), elevation: 2, shadowOffset: { width: 0, height: 0 }, shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: Matrics.ScaleValue(3), padding: Matrics.ScaleValue(25), borderRadius: Matrics.ScaleValue(3) }}>
                                    <Text style={{ fontSize: Matrics.ScaleValue(18), fontWeight: '600', color: COLORS.SIGN_UP_SUB_TITLE_COLOR }}>{item.request_overview}</Text>
                                    <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(20), marginTop: Matrics.ScaleValue(20) }}>{item.request_detail}</Text>
                                    <View style={{ marginTop: Matrics.ScaleValue(20), justifyContent: 'space-between', flexDirection: 'row' }}>
                                        {item.reviews && item.reviews.length > 0 && item.reviews[0].avg_total &&
                                            <StarRating
                                                disabled={true}
                                                maxStars={5}
                                                starSize={20}
                                                starStyle={{ paddingRight: 5, marginTop: 8 }}
                                                emptyStarColor={COLORS.EMPTY_STAR_COLOR}
                                                starColor={COLORS.STAR_COLOR}
                                                rating={item.reviews && item.reviews.length > 0 && item.reviews[0].avg_total ? item.reviews[0].avg_total : 0}
                                                selectedStar={rating => ref.onStarRatingPress(rating)}
                                            />
                                        }
                                        <View></View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={{ fontSize: Matrics.ScaleValue(22), fontWeight: '600', color: COLORS.SIGN_UP_SUB_TITLE_COLOR }}>${item.budget}</Text>
                                            <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(20) }}>{Moment(item.createdAt).format('MMM DD, YYYY')} </Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        }}
                    />
                    :
                    <View style={{ backgroundColor: COLORS.WHITE, marginBottom: 0, margin: Matrics.ScaleValue(20), elevation: 2, shadowOffset: { width: 0, height: 0 }, shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: Matrics.ScaleValue(3), padding: Matrics.ScaleValue(25), borderRadius: Matrics.ScaleValue(3) }}>
                        <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(20) }}>No job history found</Text>
                    </View>
                }
            </View>
        )
    }
    renderReviews(reviews) {
        return (
            <View style={{ backgroundColor: COLORS.BACKGROUND_COLOR, width: '100%', paddingBottom: Matrics.ScaleValue(25), flex: 1 }}>
                <View style={{ backgroundColor: COLORS.WHITE, marginBottom: 0, margin: Matrics.ScaleValue(20), elevation: 2, shadowOffset: { width: 0, height: 0 }, shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: Matrics.ScaleValue(3), borderRadius: Matrics.ScaleValue(3) }}>
                    <View style={{ marginTop: Matrics.ScaleValue(10), alignItems: 'center', padding: Matrics.ScaleValue(25), paddingBottom: Matrics.ScaleValue(20), borderBottomColor: 'lightgray', borderBottomWidth: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            starSize={15}
                            starStyle={{ paddingRight: Matrics.ScaleValue(5), marginTop: Matrics.ScaleValue(8) }}
                            emptyStarColor={COLORS.EMPTY_STAR_COLOR}
                            starColor={COLORS.STAR_COLOR}
                            rating={this.state.traderTotalRatting}
                            selectedStar={rating => ref.onStarRatingPress(rating)}
                        />
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(20) }}>{this.state.traderTotalRatting} from {this.state.traderTotalReviews} reviews</Text>
                        </View>
                    </View>
                    <View style={{ height: Matrics.ScaleValue(60), width: '100%', borderBottomColor: 'lightgray', borderBottomWidth: 1 }}>
                        <View style={{ height: Matrics.ScaleValue(60), width: Matrics.ScaleValue(120), justifyContent: 'center', alignItems: 'center', borderBottomColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderBottomWidth: Matrics.ScaleValue(2) }}>
                            <Text>All</Text>
                        </View>
                    </View>
                    {reviews && reviews.length > 0 ?
                        <FlatList
                            data={reviews}
                            extraData={this.state}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{ marginTop: 0, borderBottomWidth: 0.5, borderBottomColor: 'lightgray', padding: Matrics.ScaleValue(25) }}>
                                        <ImageBackground imageStyle={{ borderRadius: Matrics.ScaleValue(60) }} source={{ uri: API.USER_IMAGE_PATH + item.review_by.image }} style={[style.profileImageStyle, { width: Matrics.ScaleValue(70), height: Matrics.ScaleValue(70), marginBottom: Matrics.ScaleValue(10) }]}>
                                        </ImageBackground>
                                        <Text style={{ fontSize: Matrics.ScaleValue(18), fontWeight: '600', color: COLORS.SIGN_UP_SUB_TITLE_COLOR }}>{item.review_by.firstname} {item.review_by.lastname ? item.review_by.lastname : ''}</Text>
                                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                            <StarRating
                                                disabled={true}
                                                maxStars={5}
                                                starSize={20}
                                                starStyle={{ paddingRight: Matrics.ScaleValue(5), marginTop: Matrics.ScaleValue(8) }}
                                                emptyStarColor={COLORS.EMPTY_STAR_COLOR}
                                                starColor={COLORS.STAR_COLOR}
                                                rating={item.avg_total}
                                                selectedStar={rating => ref.onStarRatingPress(rating)}
                                            />
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(20) }}>{Moment(item.createdAt).format('MMM DD, YYYY')}</Text>
                                            </View>
                                        </View>
                                        <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(20), marginTop: Matrics.ScaleValue(20) }}>{item.comments}</Text>

                                        {/* responses */}
                                        <FlatList
                                            data={item.response}
                                            extraData={this.state}
                                            renderItem={(element) => {
                                                return (
                                                    <View style={{ marginTop: 0, padding: Matrics.ScaleValue(25), paddingBottom: 0 }}>
                                                        <ImageBackground imageStyle={{ borderRadius: Matrics.ScaleValue(60) }} source={{ uri: API.USER_IMAGE_PATH + (element.item.response_by && element.item.response_by.image) }} style={[style.profileImageStyle, { width: Matrics.ScaleValue(70), height: Matrics.ScaleValue(70), marginBottom: Matrics.ScaleValue(10) }]}>
                                                        </ImageBackground>
                                                        <Text style={{ fontSize: Matrics.ScaleValue(18), fontWeight: '600', color: COLORS.SIGN_UP_SUB_TITLE_COLOR }}>{element.item.response_by && element.item.response_by.firstname} {element.item.response_by && element.item.response_by.lastname ? item.review_by.lastname : ''}</Text>
                                                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                                            <View style={{ alignItems: 'flex-end' }}>
                                                                <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(20) }}>{Moment(element.item.createdDate).format('MMM DD, YYYY')}</Text>
                                                            </View>
                                                        </View>
                                                        <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(20), marginTop: Matrics.ScaleValue(20) }}>{element.item.response}</Text>
                                                    </View>
                                                )
                                            }}
                                        />


                                    </View>
                                )
                            }}
                        />
                        :
                        <View style={{ marginTop: 0, borderBottomWidth: 0.5, borderBottomColor: 'lightgray', padding: Matrics.ScaleValue(25), }}>
                            <Text style={{ color: 'gray', fontSize: Matrics.ScaleValue(14), lineHeight: Matrics.ScaleValue(20), marginTop: Matrics.ScaleValue(20) }}>{'No reviews found'}</Text>
                        </View>
                    }

                </View>
            </View>
        )
    }
    renderMRequestForm() {
        return (
            <Modal onRequestClose={() => this.setState({ renderSlide: 4 })} animationType={'slide'} visible={this.state.renderSlide == 5}>
                <ImageBackground source={IMAGEPATH.BACKGROUND_IMAGE} style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={[style.scrollViewContainer, { backgroundColor: 'transparent' }]}>
                        <View style={[style.transparentFormContainer, { flex: 1, paddingTop: Matrics.ScaleValue(100), paddingBottom: Matrics.ScaleValue(100), height: '100%' }]}>
                            {/* <View style={style.syncittLogoContainer2}>
                                <Image source={IMAGEPATH.SYNCITTLOGO} style={style.syncittLogoStyle} resizeMode={"contain"} />
                            </View> */}
                            <View style={[style.formHeaderTextContainer, { borderRadius: Matrics.ScaleValue(10) }]}>
                                <Text style={style.searchResultTextStyle}>MAINTENANCE REQUEST</Text>
                                <Text style={style.serviceRequestTextStyle}>New Request</Text>

                                {/* ======= What do you need ? Block ======= */}
                                <View style={style.textInputConatiner1}>
                                    <Text style={style.textInputContainer1Text}>Service Category<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                                    <View style={style.inputBoxContainer1}>
                                        <TextInput
                                            style={style.input1Style}
                                            value={this.state.selectedCategory && this.state.selectedCategory.name}
                                            onChangeText={(text) => this.setState({ reqCategory: text.trimLeft() })}
                                            placeholder={'Search Category'}
                                        />
                                        <View style={style.searchIconStyle}>
                                            <Image source={IMAGEPATH.SEARCH_ICON} />
                                        </View>
                                    </View>
                                </View>

                                {/* ======= Request Subject ======= */}
                                <View style={style.textInputConatiner2}>
                                    <Text style={style.textInputContainer2Text}>Request Subject</Text>
                                    <View style={style.inputBoxContainer2}>
                                        <TextInput
                                            style={style.input2Style}
                                            value={this.state.reqBudget}
                                            onChangeText={(text) => this.setState({ reqSubject: text.trimLeft() })}
                                            placeholder={'Enter Subject'}
                                        />
                                    </View>
                                </View>



                                {/* ======= Description ======= */}
                                <View style={style.textInputConatiner2}>
                                    <Text style={style.textInputContainer2Text}>Request detail<Text style={{ fontSize: Matrics.ScaleValue(18), color: 'red' }}>*</Text></Text>
                                    <View style={[style.inputBoxContainer2, { height: Matrics.ScaleValue(200), padding: Matrics.ScaleValue(15) }]}>
                                        <TextInput
                                            placeholder={'Enter Description'}
                                            onChangeText={(text) => this.setState({ reqDescription: text.trimLeft() })}
                                            value={this.state.reqDescription}
                                            style={[style.input2Style, { height: Matrics.ScaleValue(200) }]}
                                            multiline={true}
                                        />
                                    </View>
                                </View>

                                {/* ======= Budget ======= */}
                                <View style={style.textInputConatiner2}>
                                    <Text style={style.textInputContainer2Text}>Budget($)</Text>
                                    <View style={style.inputBoxContainer2}>
                                        <TextInput
                                            style={style.input2Style}
                                            value={this.state.reqBudget}
                                            keyboardType={'number-pad'}
                                            onChangeText={(text) => this.setState({ reqBudget: text.trimLeft() })}
                                            placeholder={'Enter Budget'}
                                        />
                                    </View>
                                </View>


                                {/* ======= When ======= */}
                                <View style={style.textInputConatiner2}>
                                    <Text style={style.textInputContainer2Text}>When</Text>
                                    <View style={style.inputBoxContainer2}>
                                        <DatePicker
                                            style={AddAgreementScreenStyle.datePickerStyle}
                                            date={this.state.reqDate}
                                            iconComponent={() => {
                                                return (
                                                    <View></View>
                                                )
                                            }}
                                            mode="date"
                                            placeholder="Select Date"
                                            format='MM-DD-YYYY'
                                            minDate={new Date()}
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    right: 0,
                                                    top: Matrics.ScaleValue(4),
                                                    marginLeft: 0
                                                },
                                                dateInput: {
                                                    marginLeft: 0,
                                                    position: 'absolute',
                                                    left: Matrics.ScaleValue(5),
                                                    borderBottomWidth: 0,
                                                    borderLeftWidth: 0,
                                                    borderTopWidth: 0,
                                                    borderRightWidth: 0,
                                                }
                                                // ... You can check the source to find the other keys. 
                                            }}
                                            onDateChange={(date) => { this.setState({ reqDate: date }) }}
                                        />


                                        <View style={style.calenderIconStyle}>
                                            <Image source={IMAGEPATH.CALENDAR_ICON} />
                                        </View>
                                    </View>
                                </View>


                            </View>
                            <TouchableOpacity onPress={() => this.setState({ renderSlide: 1 })} style={style.backToHomeStyle}>
                                <Text style={style.backToHomeTextStyle}>BACK TO HOME</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </ImageBackground>
                <ActionSheet
                    ref={o => (this.ActionSheet = o)}
                    options={actionOptions}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={this.handlePress}
                />
            </Modal>
        )
    }
    render() {
        return (
            <ImageBackground source={IMAGEPATH.BACKGROUND_IMAGE} style={style.syncittBackgroundContainer}>
                {this.state.renderSlide == 1 && this.renderIntialHomeSearch()}
                {this.state.renderSlide == 2 && this.renderRequestForm()}
                {this.state.renderSlide == 3 && this.renderTraderList()}
                {this.state.renderSlide == 4 && this.renderTraderProfile()}
                {this.state.renderSlide == 5 && this.renderMRequestForm()}
                <View style={[style.tabContainer,{position:'absolute',bottom:0}]}>
                    <View style={style.tabContainerInner}>
                        <TouchableOpacity onPress={() => Actions.SplashScreen()}>
                            <Image source={IMAGEPATH.SYNCITTHOMEICON} style={style.imageStyle} />
                        </TouchableOpacity>
                    </View>
                    <View style={style.tabContainerInner}>
                        <TouchableOpacity onPress={() => {
                            this.setState({ showModal: true })
                        }}>
                            <Image source={IMAGEPATH.DASHBOARD_MENU} style={style.imageStyle} />
                        </TouchableOpacity>
                    </View>
                </View>
                
                {this.state.showModal &&
                    <MenuModal visible={this.state.showModal} onCloseRequest={() => {
                        this.setState({ showModal: false })
                    }} />
                }
            </ImageBackground>
        )
    }
}
export default SyncittSearch
const style = StyleSheet.create({
    syncittBackgroundContainer: {
        flex: 1, alignItems: 'center',
        // backgroundColor: 'black'
    },
    tabContainer: {
        height: Matrics.ScaleValue(65), backgroundColor: 'white', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%', borderTopWidth: Matrics.ScaleValue(1), borderTopColor: COLORS.GRAY
    },
    tabContainerInner: {
        flex: 0.2, justifyContent: 'center', alignItems: 'center'
    },
    imageStyle: {
        height: Matrics.ScaleValue(30), width: Matrics.ScaleValue(30), tintColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND
    },
    renderTraderContainer: {
        flex: 1, alignItems: 'center'
    },
    traderContainerScrollview: {
        flex: 1, width: '100%'
    },
    traderTransparentContainer: {
        // backgroundColor: COLORS.TRANSLUCENT,
        width: '100%', flex: 1
    },
    traderSubContainer: {
        margin: Matrics.ScaleValue(10), marginBottom: 0, borderTopLeftRadius: Matrics.ScaleValue(5), borderTopRightRadius: Matrics.ScaleValue(5), padding: Matrics.ScaleValue(25)
    },
    syncittLogoContainer: {
        height: Matrics.ScaleValue(120), justifyContent: 'center', alignItems: 'center'
    },
    logoImageStyle: {
        height: Matrics.ScaleValue(75)
    },
    backToSearchContainer: {
        height: Matrics.ScaleValue(38), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '55%', margin: Matrics.ScaleValue(15), backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: Matrics.ScaleValue(60)
    },
    backToSearchTextStyle: {
        color: COLORS.WHITE, fontSize: Matrics.ScaleValue(12), fontWeight: '600'
    },
    renderTraderContainerStyle: {
        height: Matrics.ScaleValue(385), backgroundColor: 'white', borderRadius: Matrics.ScaleValue(6), justifyContent: 'center', elevation: 2, shadowOffset: { width: 0, height: 0 }, shadowColor: 'gray', shadowOpacity: 0.3, shadowRadius: Matrics.ScaleValue(5), borderRadius: Matrics.ScaleValue(5), marginBottom: Matrics.ScaleValue(20),
    },
    logoContainer: {
        justifyContent: 'center', alignItems: 'center', margin: Matrics.ScaleValue(20)
    },
    greenDotStyle: {
        backgroundColor: COLORS.STATUS_GREEN_COLOR, width: Matrics.ScaleValue(25), borderRadius: Matrics.ScaleValue(20), bottom: Matrics.ScaleValue(5), right: Matrics.ScaleValue(5), position: 'absolute', height: Matrics.ScaleValue(25)
    },
    profileImageStyle: {
        height: Matrics.ScaleValue(120), width: Matrics.ScaleValue(120), borderRadius: Matrics.ScaleValue(60)
    },
    profileDataContainer: {
        justifyContent: 'center', alignItems: 'center'
    },
    traderNameTextStyle: {
        fontSize: Matrics.ScaleValue(18), color: 'gray', fontWeight: '600'
    },
    reviewsStyle: {
        fontSize: Matrics.ScaleValue(12), lineHeight: Matrics.ScaleValue(25), color: 'gray', fontWeight: '600'
    },
    servicesContainer: {
        flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    },
    serviceTextContainer: {
        height: Matrics.ScaleValue(20), margin: Matrics.ScaleValue(5), paddingHorizontal: Matrics.ScaleValue(15), borderRadius: Matrics.ScaleValue(5), justifyContent: 'center', alignItems: 'center', backgroundColor: 'skyblue'
    },
    extServiceTextContainer: {
        height: Matrics.ScaleValue(20), margin: Matrics.ScaleValue(5), width: Matrics.ScaleValue(50), borderRadius: Matrics.ScaleValue(5), justifyContent: 'center', alignItems: 'center', backgroundColor: 'skyblue'
    },
    serviceTextStyle: {
        color: 'white', fontWeight: '600', fontSize: Matrics.ScaleValue(12)
    },
    footerButtonContainer: {
        padding: Matrics.ScaleValue(10), width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center'
    },
    viewProfileButtonStyle: {
        height: Matrics.ScaleValue(30), width: Matrics.ScaleValue(120), borderRadius: Matrics.ScaleValue(30), justifyContent: 'center', alignItems: 'center', margin: Matrics.ScaleValue(5), borderColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderWidth: Matrics.ScaleValue(1)
    },
    viewProfileButtonTextStyle: {
        color: 'gray', fontWeight: '600', fontSize: 11
    },
    getQuotesButtonStyle: {
        height: 30, width: 120, justifyContent: 'center', alignItems: 'center', borderRadius: 30, margin: 5, backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND
    },
    getQuotesButtonTextStyle: {
        color: 'white', fontWeight: '600', fontSize: 11
    },
    renderIntialSearchContainer: {
        // backgroundColor: COLORS.TRANSLUCENT,
        width: '100%',
        flex: 1
    },
    syncittLogoContainer1: {
        height: Matrics.ScaleValue(200), justifyContent: 'center', alignItems: 'center'
    },
    headerTitleStyle: {
        justifyContent: 'center', margin: Matrics.ScaleValue(15), alignItems: 'center'
    },
    headerTextStyle: {
        fontSize: Matrics.ScaleValue(30), textAlign: 'center', color: 'white'
    },
    textbox1Conatiner: {
        height: Matrics.ScaleValue(55), borderRadius: Matrics.ScaleValue(5), justifyContent: 'center', paddingLeft: Matrics.ScaleValue(20), paddingRight: Matrics.ScaleValue(10), alignSelf: 'center', width: '85%', backgroundColor: 'white', margin: Matrics.ScaleValue(10)

    },
    textbox2Conatiner: {
        height: Matrics.ScaleValue(55), borderRadius: Matrics.ScaleValue(5), flexDirection: 'row', alignSelf: 'center', paddingLeft: Matrics.ScaleValue(20), paddingRight: Matrics.ScaleValue(0), alignItems: 'center', width: '85%', backgroundColor: 'white', margin: Matrics.ScaleValue(10)
    },
    locationMarkerStyle: {
        margin: 0
    },
    searchButtonContainer: {
        height: Matrics.ScaleValue(50), flexDirection: 'row', alignSelf: 'center', width: '60%', margin: Matrics.ScaleValue(20), backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: Matrics.ScaleValue(60)
    },
    searchImageContainer: {
        flex: 0.2, justifyContent: 'center', alignItems: 'center'
    },
    searchTextContainer: {
        flex: 0.6, justifyContent: 'center', alignItems: 'center'
    },
    searchTextStyle: {
        color: 'white',
        fontSize: Matrics.ScaleValue(15),
        fontWeight: '600'
    },
    scrollViewContainer: {
        backgroundColor: COLORS.DROP_DOWN_BACKGROUND_COLOR,
        width: '100%', flex: 1
    },
    transparentFormContainer: {
        backgroundColor: COLORS.TRANSLUCENT, width: '100%', flex: 1
    },
    syncittLogoContainer2: {
        height: Matrics.ScaleValue(180), justifyContent: 'center', alignItems: 'center'
    },
    syncittLogoStyle: {
        height: Matrics.ScaleValue(75), bottom: Matrics.ScaleValue(-20)
    },
    formHeaderTextContainer: {
        margin: Matrics.ScaleValue(25), marginBottom: 0, borderTopLeftRadius: Matrics.ScaleValue(5), borderTopRightRadius: Matrics.ScaleValue(5), backgroundColor: 'white', padding: Matrics.ScaleValue(25)
    },
    searchResultTextStyle: {
        color: COLORS.SKY_BLUE_BUTTON_BACKGROUND, height: Matrics.ScaleValue(16), fontSize: Matrics.ScaleValue(12)
    },
    serviceRequestTextStyle: {
        color: COLORS.GRAY_COLOR, fontSize: Matrics.ScaleValue(23), fontWeight: '600'
    },
    textInputConatiner1: {
        marginTop: Matrics.ScaleValue(30)
    },
    textInputContainer1Text: {
        color: COLORS.GRAY_COLOR, fontSize: Matrics.ScaleValue(14)
    },
    inputBoxContainer1: {
        height: Matrics.ScaleValue(40), borderWidth: Matrics.ScaleValue(1), flexDirection: 'row', borderColor: COLORS.GRAY, borderRadius: Matrics.ScaleValue(5), justifyContent: 'space-between', paddingLeft: Matrics.ScaleValue(20), alignSelf: 'center', width: '100%', backgroundColor: 'white', margin: Matrics.ScaleValue(10)
    },
    input1Style: {
        height: Matrics.ScaleValue(40), flex: 1, color: 'black'
    },
    searchIconStyle: {
        justifyContent: 'center', paddingRight: Matrics.ScaleValue(10)
    },
    textInputConatiner2: {
        marginTop: Matrics.ScaleValue(10)
    },
    textInputContainer2Text: {
        color: COLORS.GRAY_COLOR, fontSize: Matrics.ScaleValue(14)
    },
    inputBoxContainer2: {
        height: Matrics.ScaleValue(40),
        borderWidth: 1,
        flexDirection: 'row',
        borderColor: COLORS.GRAY,
        borderRadius: Matrics.ScaleValue(5),
        justifyContent: 'space-between',
        paddingLeft: Matrics.ScaleValue(20),
        alignSelf: 'center',
        width: '100%',
        backgroundColor: 'white',
        margin: Matrics.ScaleValue(10)
    },
    input2Style: {
        height: Matrics.ScaleValue(40), flex: 1, color: 'black'
    },
    calenderIconStyle: {
        justifyContent: 'center', paddingRight: Matrics.ScaleValue(10)
    },
    whiteBackgroundContainer: {
        margin: Matrics.ScaleValue(25), marginTop: 0, borderRadius: Matrics.ScaleValue(5), backgroundColor: 'white', padding: Matrics.ScaleValue(25), paddingTop: 0
    },
    addressMessageStyle: {
        fontSize: Matrics.ScaleValue(10), textAlign: 'center', color: COLORS.GRAY_COLOR
    },
    uploadFileButtonContainer: {
        height: Matrics.ScaleValue(38), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '70%', margin: Matrics.ScaleValue(20), borderColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderWidth: 1, borderRadius: Matrics.ScaleValue(60)
    },
    uploadFileTextStyle: {
        color: COLORS.GRAY_COLOR, fontSize: Matrics.ScaleValue(12), fontWeight: '600'
    },
    submitButtonContainer: {
        height: Matrics.ScaleValue(38), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '95%', margin: Matrics.ScaleValue(15), backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: Matrics.ScaleValue(60)
    },
    submitTextStyle: {
        color: COLORS.WHITE, fontSize: Matrics.ScaleValue(12), fontWeight: '600'
    },
    footerStepsConatiner: {
        margin: Matrics.ScaleValue(25), borderRadius: Matrics.ScaleValue(5)
    },
    stepsContainer: {
        height: Matrics.ScaleValue(50), justifyContent: 'center', alignSelf: 'flex-start', borderTopWidth: Matrics.ScaleValue(2), borderTopColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND
    },
    stepsTextStyle: {
        color: 'gray', fontWeight: '600', fontSize: Matrics.ScaleValue(25)
    },
    stepsDescriptionTextStyle: {
        color: COLORS.GRAY_COLOR
    },
    backToHomeStyle: {
        height: Matrics.ScaleValue(38), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '55%', margin: Matrics.ScaleValue(15), backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: Matrics.ScaleValue(60)
    },
    backToHomeTextStyle: {
        color: COLORS.WHITE, fontSize: Matrics.ScaleValue(12), fontWeight: '600'
    }
})