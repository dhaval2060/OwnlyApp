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
    FlatList,
    AsyncStorage,
    Modal
} from 'react-native';

import {
    getAgencyProperty,
    updateBannerImage,
    getPropertyList,
    getLoggedInUserProfile,
    getUserReviewsList,
    getAgencyProfile,
    getTraderJobHistory,
} from "../../Action/ActionCreators";

import {


    showLoading,
    resetState,
} from "./ProfileAction";

import API, { URL, CHAT_CONNECTION_URL } from "../../Constants/APIUrls";
import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import ProfileScreenStyle from './ProfileScreenStyle';
import TradersProfileScreenStyle from '../TradersComponent/TradersProfileComponent/TradersProfileScreenStyle'
//import listData from  '../../../data';
import CommonStyles from '../../CommonStyle/CommonStyle';
import MaintenanceRequestDetailsScreenStyle from '../MaintenanceRequestComponent/MaintenanceRequestDetailsComponent/MaintenanceRequestDetailsScreenStyle'
import OverviewScreen from './OverviewScreen';
import ReviewAndRatingScreen from './ReviewAndRatingScreen';
import TradersOverviewScreen from '../TradersComponent/TradersProfileComponent/TradersOverviewScreen';
import TradersReviewAndRatingScreen from '../TradersComponent/TradersProfileComponent/TradersReviewAndRatingScreen';
import StarRating from 'react-native-star-rating';
import ImagePicker from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet';
import * as Progress from 'react-native-progress';
import { CardView } from '../CommonComponent/CardView';
import Moment from 'moment';

let ref;
var bannerImage = '';
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
var uploadImagesArray = [];

class ProfileScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: 1,
            starCount: 0,
            profileData: {},
            propertyListData: [],
            userReviewData: {},
            updateBanner: false,
            roleName: '',
            infoData: {},
            isShowPopup: false,
            jobHistoryData: '',
        };

        this.handlePress = this.handlePress.bind(this)
    }


    componentDidUpdate() {

        //this.onGetProfileSuccess();
        this.onPropertyListSuccess();
        this.onGetUserRatingSuccess();
        this.onUploadBannerSuccess();
        this.onGetAgencyPropertySuccess();
        this.onGetTraderJobHistorySuccess();
        this.onGetAgencyProfileSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {

        this.getRoleName();
        //this.callGetUserProfile();
        this.callGetUserRating();
        this.callGetAgencyProfile();
    }

    callGetTradersJobHistory() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;

                var postData = {

                    trader_id: userData.data._id,
                    page_number: 0,
                    number_of_pages: 0

                }
                this.props.showLoading();
                this.props.getTraderJobHistory(authToken, postData);
            }
        }).done();

    }

    onGetTraderJobHistorySuccess() {

        if (this.props.tradersReducer.jobHistoryRes != '') {
            if (this.props.tradersReducer.jobHistoryRes.code == 200) {
                
                this.setState({ jobHistoryData: this.props.tradersReducer.jobHistoryRes.data });
            }
            else {
                alert(this.props.tradersReducer.jobHistoryRes.message);
            }
            this.props.resetState();
        }
    }

    callGetAgencyProfile() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                }
                
                this.props.showLoading();
                this.props.getAgencyProfile(authToken, postData);
            }
        }).done();

    }

    onGetAgencyPropertySuccess() {

        if (this.props.profileReducer.agencyPropertyRes != '') {

            if (this.props.profileReducer.agencyPropertyRes.code == 200) {

                
                this.setState({ propertyListData: this.props.profileReducer.agencyPropertyRes.data });
            }
            else {

                alert(this.props.profileReducer.agencyPropertyRes.message);
            }
            this.props.resetState();
        }
    }


    closeNotifications() {

        Actions.popTo('Dashboard');
    }

    onAllTabClick() {

        this.setState({ isTabSelected: 1 });
    }
    onActiveTabClick() {

        this.setState({ isTabSelected: 2 });
    }
    onRequestedByTenentTabClick() {

        this.setState({ isTabSelected: 3 });
    }
    onStarRatingPress(rating) {

        this.setState({
            starCount: rating
        });
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
                var path = response.uri.replace('file://', '');
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

                AsyncStorage.getItem('SyncittUserInfo').then((value) => {
                    if (value) {
                        var userData = JSON.parse(value);
                        var authToken = userData.token;
                        var _id = userData.data._id;
                        this.props.showLoading();
                        
                        this.props.updateBannerImage(authToken, response.uri.replace('file://', ''), _id);
                    }
                }).done();
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

                AsyncStorage.getItem('SyncittUserInfo').then((value) => {
                    if (value) {
                        var userData = JSON.parse(value);
                        var authToken = userData.token;
                        var _id = userData.data._id;
                        this.props.showLoading();
                        
                        this.props.updateBannerImage(authToken, response.uri.replace('file://', ''), _id);
                    }
                }).done();
            }
        });
    }

    showActionSheet() {

        //this.setState({ isShowPopup: false });
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

    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                
                this.setState({ roleName: value });

            }
        }).done();
    }




    callGetUserPofile() {
        var roleid = ''
        AsyncStorage.getItem("roleId").then((value) => {
            if (value) {
                roleid = value
            }
        }).done();
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {

                    userId: userData.data._id,
                    roleId: roleid
                }
                this.props.showLoading();
                this.props.getLoggedInUserProfile(authToken, postData);

            }
        }).done();
    }

    callGetUserRating() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                
                
                this.props.showLoading();
                this.props.getUserReviewsList(authToken, userData.data._id);
            }
        }).done();

    }

    onUploadBannerSuccess() {

        if (this.props.profileReducer.updateBannerImgRes != '') {
            if (this.props.profileReducer.updateBannerImgRes.code == 200) {
                
                var resData = this.props.profileReducer.updateBannerImgRes.data;
                bannerImage = resData.bannerImage ? API.USER_IMAGE_PATH + resData.bannerImage : '';
                
                this.setState({ updateBanner: true });
            }
            else {
                alert(this.props.profileReducer.updateBannerImgRes.message);
            }
            this.props.resetState();
        }
    }
    onGetUserRatingSuccess() {

        if (this.props.profileReducer.userReviewRes != '') {
            if (this.props.profileReducer.userReviewRes.code == 200) {
                
                this.setState({ userReviewData: this.props.profileReducer.userReviewRes });
            }
            else {
                // alert(this.props.profileReducer.userReviewRes.message);
            }
            this.props.resetState();
        }
    }

    onGetProfileSuccess() {

        if (this.props.profileReducer.userProfileRes != '') {
            if (this.props.profileReducer.userProfileRes.code == 200) {
                
                this.setState({ profileData: this.props.profileReducer.userProfileRes.data });
                if (this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER) {

                    this.callGetAgencyProperty();
                }
                else if (this.state.roleName == Strings.USER_ROLE_TRADER) {

                    this.callGetTradersJobHistory();

                }
                else {

                    this.callGetProperty();
                }


            }
            else {
                alert(this.props.profileReducer.userProfileRes.message);
            }
            this.props.resetState();
        }
    }

    onGetAgencyProfileSuccess() {
        
        if (this.props.profileReducer.agencyProfileRes != '') {
            if (this.props.profileReducer.agencyProfileRes.code == 200) {
                this.setState({ profileData: this.props.profileReducer.agencyProfileRes.data[0].users, bannerImage: this.props.profileReducer.agencyProfileRes.data[0].banner });
                this.callGetAgencyProperty();
            }
            else {

                //alert(this.props.profileReducer.agencyProfileRes.message);
            }
            this.props.resetState();
        }
    }

    callGetProperty() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    request_by_role: userData.data.role_id,
                    user_id: userData.data._id,
                }
                this.props.showLoading();
                
                this.props.getPropertyList(authToken, postData);
            }
        }).done();
    }
    callGetAgencyProperty() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    user_id: userData.data._id,
                }
                this.props.showLoading();
                
                this.props.getAgencyProperty(authToken, postData);
            }
        }).done();
    }

    onPropertyListSuccess() {

        if (this.props.homeScreenReducer.propertyListResponse != '') {

            if (this.props.homeScreenReducer.propertyListResponse.code == 200) {
                
                this.setState({ propertyListData: this.props.homeScreenReducer.propertyListResponse.data });
            }
            else {

                alert(this.props.homeScreenReducer.propertyListResponse.message);
            }
            this.props.resetState();
        }
    }


    callSendMessageScreen() {

        Actions.MessageToTraderScreen({ userFirstName: this.state.profileData.firstname, userLastName: this.state.profileData.lastname, receiverId: this.state.profileData._id });
    }


    renderImageItem(item, index) {
        return (
            <Image source={{ uri: item.url }} style={ProfileScreenStyle.userListImageStyle} />
        );
    }

    callPropertyDetailsScreen(id) {

        Actions.PropertiesDetailsScreen({ propertyId: id });
    }


    renderItem({ item, index }) {

        var propertyImagePath = item.image ? (item.image.length > 0 ? API.PROPERTY_IMAGE_PATH + item.image[0].path : '') : '';
        var userImage = item.owned_by ? (item.owned_by.image ? API.USER_IMAGE_PATH + item.owned_by.image : '') : '';
        var number_of_bedroom = item.number_bedroom ? item.number_bedroom : 0;
        var number_of_bathroom = item.number_of_bathroom ? item.number_of_bathroom : 0;
        var number_of_parking = item.number_of_parking ? item.number_of_parking : 0;

        return (
            <View style={ProfileScreenStyle.listMainContainerStyle}>

                <TouchableOpacity onPress={ref.callPropertyDetailsScreen.bind(ref, item._id)} >
                    <View style={ProfileScreenStyle.propertyImageViewStyle}>
                        {
                            propertyImagePath != '' ?
                                <Image source={{ uri: propertyImagePath }} style={ProfileScreenStyle.propertyImageStyle} />
                                : <View style={ProfileScreenStyle.emptyPropertyImageContainer} />
                        }

                        <Image source={ImagePath.HEART} style={ProfileScreenStyle.likeImageViewStyle} />
                    </View>
                    <View style={ProfileScreenStyle.propertyTitleViewStyle}>
                        <Text numberOfLines={2} style={ProfileScreenStyle.propertyTitleTextStyle}>{item.address}</Text>
                    </View>
                    <View style={ProfileScreenStyle.propetySubTitleViewStyle}>
                        <Text numberOfLines={2} style={ProfileScreenStyle.propertySubTitleTextStyle}>{item.description}</Text>
                    </View>
                </TouchableOpacity>

                <View style={ProfileScreenStyle.imageListMainContainerStyle}>
                    <View>

                        {
                            userImage != '' ?
                                <Image source={{ uri: userImage }} style={ProfileScreenStyle.userImageStyle} />
                                :
                                <Image source={ImagePath.USER_DEFAULT} style={ProfileScreenStyle.userImageStyle} />
                        }

                    </View>

                    {/*<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                            <View style={ProfileScreenStyle.imageListContainerStyle}>
                                                {
                                                    listData.map((data, index) => {
                                                        
                                                        return ref.renderImageItem(data, index);
                                                    })
                                                }
                                            </View>
                                        </ScrollView>*/}

                </View>

                <View style={ProfileScreenStyle.propertyInfoContainerViewStyle}>

                    <View style={ProfileScreenStyle.propertyBedroomViewContainer}>
                        <Image source={ImagePath.BEDROOM_ICON} />
                        <Text style={ProfileScreenStyle.propertyValueTextStyle}>{number_of_bedroom}</Text>
                    </View>

                    <View style={ProfileScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.BATHROOM_ICON} />
                        <Text style={ProfileScreenStyle.propertyValueTextStyle}>{number_of_bathroom}</Text>
                    </View>

                    <View style={ProfileScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.GARAGE_ICON} />
                        <Text style={ProfileScreenStyle.propertyValueTextStyle}>{number_of_parking}</Text>
                    </View>



                </View>
            </View>
        );
    }


    callAddAgentScreen() {
        AsyncStorage.getItem("SyncittUserInfo")
            .then(value => {
                if (value) {
                    var userData = JSON.parse(value);
                    if (this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER) {
                        var BaseURL =
                            CHAT_CONNECTION_URL + "#!/property_manager/" + userData.data._id;
                    } else {
                        var BaseURL =
                            CHAT_CONNECTION_URL + "#!/strata_manager/" + userData.data._id;
                    }
                    this.handleEmail(BaseURL);

                }
            })
            .done();
        // Actions.AddAgentScreen();
    }
    handleEmail = BaseURL => {
        Mailer.mail(
            {
                subject: "Sign Up to become Ownly Agent",
                recipients: [""],
                ccRecipients: [""],
                bccRecipients: [""],
                body:
                    "Hi team<br><br>Please join using the url below.<br><br><b>" +
                    BaseURL +
                    "</b><br><br>Best Regards, <br>Ownly Team",
                isHTML: true,
            },
            (error, event) => {
                
                Alert.alert(
                    error,
                    event,
                    [
                        {
                            text: "Ok",
                            
                        },
                        {
                            text: "Cancel",
                            
                        }
                    ],
                    { cancelable: true }
                );
            }
        );
    };


    showPopup() {

        if (this.state.isShowPopup == false) {

            this.setState({ isShowPopup: true });
        }
        else {

            this.setState({ isShowPopup: false });
        }
    }

    navBar() {
        return (
            <View style={ProfileScreenStyle.profileHeaderContainer}>

                <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginLeft: 20 }}>
                    <Image source={null} />
                </TouchableOpacity>



                {/* <TouchableOpacity onPress={this.showPopup.bind(this)} style={{ marginRight: 20, marginTop: 10 }}>
                    <View style={MaintenanceRequestDetailsScreenStyle.optionViewStyle} >
                        <Image source={ImagePath.THREE_DOTS_ICON} />
                    </View>
                </TouchableOpacity> */}


                {/* <TouchableOpacity style={ProfileScreenStyle.roundedBlueButtonStyle} onPress={() => this.showActionSheet()}>
                    <View >
                        <Text style={ProfileScreenStyle.blueButtonTextStyle}>
                            {Strings.EDIT}
                        </Text>
                    </View>
                </TouchableOpacity> */}


                {/* {
                    (this.state.isShowPopup) ?

                        <Modal transparent >
                            <TouchableOpacity onPress={this.showPopup.bind(this)} style={MaintenanceRequestDetailsScreenStyle.modalContainer}>
                                <View style={{
                                    flex: 1, justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={MaintenanceRequestDetailsScreenStyle.modalContainerStyles}>
                                        <TouchableOpacity style={{ marginTop: 10 }} onPress={this.showActionSheet.bind(this)}>

                                            <View style={MaintenanceRequestDetailsScreenStyle.roundedGrayButtonStyle}>
                                                <Text style={MaintenanceRequestDetailsScreenStyle.grayButtonTextStyle}>
                                                    {Strings.EDIT_BANNER_IMAGE}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                        {this.state.roleName = Strings.USER_ROLE_AGENCY_OWNER ?
                                            <TouchableOpacity style={{ marginBottom: 20 }} >
                                                <View style={MaintenanceRequestDetailsScreenStyle.roundedTransparentButtonStyle}>
                                                    <Text style={MaintenanceRequestDetailsScreenStyle.redTextStyle}>
                                                        {Strings.ADD_MANAGER}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            : null
                                        }
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Modal> : null
                } */}


            </View>
        );
    }

    renderJobHistory({ item, index }) {
        return (

            <CardView>
                <View style={TradersProfileScreenStyle.listMainContainerStyle}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={TradersProfileScreenStyle.propertyTitleViewStyle}>
                            <Text style={TradersProfileScreenStyle.propertyTitleTextStyle}>{item.request_overview}</Text>
                        </View>
                        <View style={TradersProfileScreenStyle.propetySubTitleViewStyle}>
                            <Text style={TradersProfileScreenStyle.propertySubTitleTextStyle}>${item.budget}</Text>
                            <Text style={TradersProfileScreenStyle.dateTextStyle}>{Moment(item.due_date).fromNow()}</Text>

                        </View>
                    </View>

                </View>
            </CardView>
        );
    }

    render() {
        var userImagePath = this.state.profileData.image ? API.USER_IMAGE_PATH + this.state.profileData.image : '';
        if (bannerImage == '') {
            bannerImage = this.state.bannerImage ? API.USER_IMAGE_PATH + this.state.bannerImage : '';
        }
        var firstName = this.state.profileData.firstname ? this.state.profileData.firstname : '';
        var lastName = this.state.profileData.lastname ? this.state.profileData.lastname : '';
        var averagerate = this.state.userReviewData ? (this.state.userReviewData.data ? this.state.userReviewData.data : 0) : 0;
        var totalreviews = this.state.userReviewData.total_review ? this.state.userReviewData.total_review : 0;

        return (
            <ScrollView contentContainerStyle={{ paddingBottom: 70, backgroundColor: Colors.SETTING_SCREEN_BG_COLOR }}>
                <View style={ProfileScreenStyle.profileContainer}>
                    <View style={ProfileScreenStyle.topCoverImageContainer}>
                        {
                            bannerImage != '' ?
                                <Image source={{ uri: bannerImage }} style={ProfileScreenStyle.topCoverImageContainer} />
                                : <View style={ProfileScreenStyle.topCoverImageContainer} />
                        }
                        {this.navBar()}
                    </View>
                    <View style={ProfileScreenStyle.bottomCoverImageContainer}>
                        <Image source={ImagePath.PROFILE_BG} style={ProfileScreenStyle.bottomCoverImageContainer} />
                    </View>
                    <View style={ProfileScreenStyle.profileDataContainer}>
                        <View style={ProfileScreenStyle.profileNameAndReviewContainer}>
                            {
                                userImagePath != '' ? <Image source={{ uri: userImagePath }} style={ProfileScreenStyle.profileImageStyle} />
                                    :
                                    <View style={CommonStyles.emptyUserImageStyle}>
                                        <Text style={CommonStyles.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                    </View>
                            }
                            <Text style={ProfileScreenStyle.userNameTextStyle}>{firstName + ' ' + lastName}</Text>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                starSize={20}
                                starStyle={{ paddingRight: 2, paddingLeft: 2, marginTop: 8 }}
                                emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                fullStarColor={Colors.STAR_COLOR}
                                halfStarColor={Colors.STAR_COLOR}
                                rating={averagerate}
                                selectedStar={(rating) => ref.onStarRatingPress(rating)}

                            />
                            <Text style={ProfileScreenStyle.userReviewtextStyle}>{averagerate + ' ' + 'from' + ' ' + totalreviews + ' ' + 'reviews'}</Text>
                            {this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER
                                ?
                                <TouchableOpacity style={ProfileScreenStyle.contactAgentView} onPress={this.callAddAgentScreen.bind(this)}>
                                    <View >
                                        <Text style={ProfileScreenStyle.buttonTextStyle}>{Strings.ADD_MANAGER}</Text>
                                    </View>
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                        <View style={ProfileScreenStyle.userInfoContainerStyle}>
                            <View style={ProfileScreenStyle.userInfoTextContainerStyle}>
                                <Text style={ProfileScreenStyle.labelTextStyle}>Location</Text>
                                <Text style={ProfileScreenStyle.infoTextStyle}>
                                    {this.state.profileData.city}, {this.state.profileData.state}
                                </Text>
                            </View>
                            <View style={ProfileScreenStyle.userInfoTextContainerStyle}>
                                <Text style={ProfileScreenStyle.labelTextStyle}>Phone number</Text>
                                <Text style={ProfileScreenStyle.infoTextStyle}>{this.state.profileData.mobile_no}</Text>
                            </View>
                            <View style={ProfileScreenStyle.userInfoTextContainerStyle}>
                                <Text style={ProfileScreenStyle.labelTextStyle}>Email address</Text>
                                <Text style={ProfileScreenStyle.infoTextStyle}>{this.state.profileData.email}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={ProfileScreenStyle.profileImageContainer}>

                        {this.state.profileData.is_online ?
                            <View style={ProfileScreenStyle.onLineStatusViewStyle} />
                            :
                            <View style={ProfileScreenStyle.statusViewStyle} />
                        }
                    </View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={ProfileScreenStyle.tabContainerScrollViewStyle}>
                        <View style={ProfileScreenStyle.tabContainerStyle}>

                            <TouchableOpacity onPress={() => this.onAllTabClick()} >
                                <View >
                                    <View style={ProfileScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 1) ? ProfileScreenStyle.tabLabelTextStyle : ProfileScreenStyle.tabLabelDiselectTextStyle}>{(this.state.roleName == Strings.USER_ROLE_TRADER) ? Strings.JOB_HISTORY : Strings.PROPERTIES}</Text>
                                    </View>
                                    {this.state.isTabSelected == 1 ? <View style={ProfileScreenStyle.tabIndicatorStyle}></View> : <View style={ProfileScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onActiveTabClick()}>
                                <View>
                                    <View style={ProfileScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 2) ? ProfileScreenStyle.tabLabelTextStyle : ProfileScreenStyle.tabLabelDiselectTextStyle}>{Strings.OVERVIEW}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 2) ? <View style={ProfileScreenStyle.tabIndicatorStyle}></View> : <View style={ProfileScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onRequestedByTenentTabClick()}>
                                <View>
                                    <View style={ProfileScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 3) ? ProfileScreenStyle.tabLabelTextStyle : ProfileScreenStyle.tabLabelDiselectTextStyle}>{Strings.REVIEWS_AND_RATINGS}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 3) ? <View style={ProfileScreenStyle.tabIndicatorStyle}></View> : <View style={ProfileScreenStyle.tabWhiteIndicatorStyle}></View>}
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
                    </ScrollView>
                    {
                        (this.state.isTabSelected == 1)
                            ?
                            (this.state.roleName == Strings.USER_ROLE_TRADER) ?
                                <FlatList
                                    data={this.state.jobHistoryData}
                                    renderItem={this.renderJobHistory}
                                    extraData={this.state}
                                />
                                :
                                this.state.propertyListData.length > 0
                                    ?
                                    <FlatList
                                        data={this.state.propertyListData}
                                        renderItem={this.renderItem}
                                        extraData={this.state}
                                    />
                                    : <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.PROPERTY_NOT_FOUND}</Text>
                                    </View>
                            : null
                    }

                    {

                        (this.state.isTabSelected == 2) ?
                            (this.state.roleName == Strings.USER_ROLE_TRADER) ? <TradersOverviewScreen overViewData={this.state.profileData} /> : <OverviewScreen overviewData={this.state.profileData} />
                            : null
                    }
                    {(this.state.isTabSelected == 3) ?
                        (this.state.roleName == Strings.USER_ROLE_TRADER)
                            ?
                            <TradersReviewAndRatingScreen reviewToId={this.state.profileData._id} reviewToName={this.state.profileData} averageRate={averagerate} totalreviews={totalreviews} isUserProfile={true} />
                            :
                            <ReviewAndRatingScreen reviewToId={this.state.profileData._id} reviewToName={this.state.profileData} />
                        : null
                    }
                </View>
                {   //23 Nov
                    this.props.profileReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                        </View>
                        : null
                    //
                }

            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    return {
        profileReducer: state.profileReducer,
        homeScreenReducer: state.homeScreenReducer,
        tradersReducer: state.tradersReducer

    }
}

export default connect(
    mapStateToProps,
    {
        getAgencyProperty,
        updateBannerImage,
        getPropertyList,
        getLoggedInUserProfile,
        showLoading,
        resetState,
        getUserReviewsList,
        getAgencyProfile,
        getTraderJobHistory,
    }

)(ProfileScreen);

