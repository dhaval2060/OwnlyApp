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
    AsyncStorage
} from 'react-native';

import {
    getPropertyList,
    getTradersProfile,
    getAgencyProfile,
    getUserReviewsList,
    getAgentProfileData
} from "../../../Action/ActionCreators";

import {
    showLoading,
    resetState,
} from "../AgentsScreenAction";

import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import ImagePath from '../../../Constants/ImagesPath';
import AgentProfileScreenStyle from './AgentProfileScreenStyle';
import APICaller from '../../../Saga/APICaller';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import API from '../../../Constants/APIUrls';
import StarRating from 'react-native-star-rating';
let ref;
import * as Progress from "react-native-progress";
import SearchedAgentReviewAndRatingScreen from './SearchedAgentReviewAndRatingScreen';
import SearchedAgentOverviewScreen from './SearchedAgentOverviewScreen';


var authToken='';

class SearchedAgentProfileScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            starCount: 0,
            isTabSelected: 0,
            tradersId: '',
            profileData: {},
            averageRate: 0,
            totalreviews: 0,
            isScreenLoading: true,
            propertyListData: [],
            userReviewData: {},
            roleId:'',
            mobileVisible:false,
            getUserRolesList:''
        };
    }

    componentDidUpdate() {
        this.onGetProfileSuccess();
        this.onPropertyListSuccess();
        this.onGetAgencyProfileSuccess();
        this.onGetAgentProfileSuccess();
        this.onGetUserRatingSuccess();
    }

    componentDidMount() {
        this.setState({ tradersId: this.props.user_id});
        this.setState({ averageRate: this.props.averageRate });
        this.setState({ totalreviews: this.props.totalReviewLength });

        AsyncStorage.getItem("roleId").then(async(role) => {
            if (role) {
                await this.setState({ roleId: role });
            }
        }).done();
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                authToken = userData.token;
            }
        }).done();
        this._getRoleID();
        this._getratingandreview();
        this.APICalled();
    }
     
    _getRoleID = ()=>{
        APICaller('roles/','GET',
        ).then(data => {
            if (data.code == 200) {
                data.data.map(async (item)=>{
                    if(item.description==='Agency Owner'){
                        console.log('item.description',item._id);
                        this.state.roleId==='' && await this.setState({ roleId: item._id });
                    }
                });
            }else{
                Alert.alert(
                    "Alert",
                    "No more data available for this agent",
                    [
                        {
                        text: "Cancel",
                        onPress: () => Actions.pop(),
                        style: "cancel"
                        },
                        { text: "OK", onPress: () => Actions.pop() }
                    ],
                    { cancelable: false }
                )
            }
        });
    }
    _getratingandreview = () => {
        APICaller(`getUserReview/${this.props.user_id}`,"GET",
        ).then(data => {
            console.log('Review and Rating',data);
            if (data.code == 200) {
                this.setState({ averageRate: data.data });
                this.setState({ totalreviews: data.total_review });
            }else{
                this.setState({ averageRate: 0 });
                this.setState({ totalreviews: 0 });
            }
        });
    }
    
    APICalled = () => {
        this.setState({isScreenLoading:true});
        setTimeout(() => {
            var params = {role_id: this.state.roleId, user_id: this.state.tradersId};
            // this.props.getAgentProfileData('',params);
            console.log('params',params,authToken);
            APICaller('getAgentProfile', 'POST', authToken!==''?authToken:'',params).then(data => {
                this.setState({isScreenLoading:false});
                if (data.code === 200) {
                    console.log('Response Data For getAgentProfile : ',data.data);
                    if(data.data.length > 0){
                        if(data.data[0]){
                            this.setState({profileData:data.data[0]});
                            this.setState({isTabSelected:2})
                        }else{
                            Alert.alert(
                                "Alert",
                                "No more data available for this agent",
                                [
                                    {
                                    text: "Cancel",
                                    onPress: () => Actions.pop(),
                                    style: "cancel"
                                    },
                                    { text: "OK", onPress: () => Actions.pop() }
                                ],
                                { cancelable: false }
                            )
                        }
                    }
                }else {
                    // alert("Something went wrong, Please try again.")
                    this.setState({ profileData:{} })
                }
            }, err => {
            this.setState({ profileData:{} })
                // alert("Something went wrong, Please try again.")
            })   
        }, 1000);
    }

    callGetAgencyProfile() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: this.state.profileData.agency_id ? this.state.profileData.agency_id._id : '',
                }
                this.props.showLoading();
                this.props.getAgencyProfile(authToken, postData);
            }
        }).done();

    }

    onGetAgencyProfileSuccess() {
        if (this.props.profileReducer.agencyProfileRes != '') {
            if (this.props.profileReducer.agencyProfileRes.code == 200) {
                this.setState({ infoData: this.props.profileReducer.agencyProfileRes });
            }
            else {
                //alert(this.props.profileReducer.agencyProfileRes.message);
            }
            this.props.resetState();
        }
    }
    onGetAgentProfileSuccess() {
        if (this.props.agentreducer.agentprofiledata != '') {
            if (this.props.agentreducer.agentprofiledata.code == 200) {
                this.setState({isScreenLoading:false});
                // this.setState({ infoData: this.props.agentreducer.agentprofiledata });
                    if(this.props.agentreducer.agentprofiledata.data.length > 0){
                        console.log('agentprofiledata',this.props.agentreducer.agentprofiledata.data[0]);
                        this.setState({profileData:this.props.agentreducer.agentprofiledata.data[0]});
                        this.setState({isTabSelected:2})
                    }else{
                        this.setState({ profileData:[] })
                    }
            }
            else {
                this.setState({isScreenLoading:false});
                this.setState({ profileData:[] })
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
                    agency_id: this.state.profileData.agency_id._id,
                    request_by_role: userData.data.role_id,
                    user_id: this.state.profileData._id,
                }
                this.props.showLoading();
                this.props.getPropertyList(authToken, postData);
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

    callGetUserRating() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.getUserReviewsList(authToken, this.state.profileData.agency_id ? this.state.profileData.agency_id.principle_id._id : '');
            }
        }).done();

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

    closeNotifications() {

        Actions.popTo('AgentsListScreen');
    }
    onJobHistoryTabClick() {

        this.setState({ isTabSelected: 2 });
    }
    onReviewAndRatingsTabClick() {

        this.setState({ isTabSelected: 3 });
    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }
    renderImageItem(item, index) {
        return (
            <Image source={{ uri: item.url }} style={AgentProfileScreenStyle.userListImageStyle} />
        );
    }
    callSendMessageScreen() {

        Actions.MessageToTraderScreen({ userFirstName: this.state.profileData.firstname, userLastName: this.state.profileData.lastname, receiverId: this.state.profileData._id,goBackToPop: true });
    }

    callGetTradersProfile() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            console.log('value',value);
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {

                    userId: this.props.user_id,
                }
                this.props.showLoading();
                this.props.getTradersProfile(authToken, postData);
            }
        }).done();
    }
    onGetProfileSuccess() {
        if (this.props.tradersReducer.tradersProfileRes != '') {
            if (this.props.tradersReducer.tradersProfileRes.code == 200) {
                this.setState({ isScreenLoading: false, profileData: this.props.tradersReducer.tradersProfileRes.data });
                this.callGetAgencyProfile();
                this.callGetUserRating();
                this.callGetProperty();
            }
            else {
                alert(this.props.tradersReducer.tradersProfileRes.message);
            }
            this.props.resetState();
        }
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
            <View style={AgentProfileScreenStyle.listMainContainerStyle}>
                <TouchableOpacity onPress={ref.callPropertyDetailsScreen.bind(ref, item._id)} >
                    <View style={AgentProfileScreenStyle.propertyImageViewStyle}>
                        {
                            propertyImagePath != '' ?
                                <Image source={{ uri: propertyImagePath }} style={AgentProfileScreenStyle.propertyImageStyle} />
                                : <View style={AgentProfileScreenStyle.emptyPropertyImageContainer} />
                        }
                        <Image source={ImagePath.HEART} style={AgentProfileScreenStyle.likeImageViewStyle} />
                    </View>
                    <View style={AgentProfileScreenStyle.propertyTitleViewStyle}>
                        <Text numberOfLines={2} style={AgentProfileScreenStyle.propertyTitleTextStyle}>{item.address}</Text>
                    </View>
                    <View style={AgentProfileScreenStyle.propetySubTitleViewStyle}>
                        <Text numberOfLines={2} style={AgentProfileScreenStyle.propertySubTitleTextStyle}>{item.description}</Text>
                    </View>
                </TouchableOpacity>

                <View style={AgentProfileScreenStyle.imageListMainContainerStyle}>
                    <View>

                        {userImage != '' ?

                            <Image source={{ uri: userImage }} style={AgentProfileScreenStyle.userImageStyle} />
                            :
                            <Image source={ImagePath.USER_DEFAULT} style={AgentProfileScreenStyle.userImageStyle} />

                        }

                    </View>

                </View>

                <View style={AgentProfileScreenStyle.propertyInfoContainerViewStyle}>

                    <View style={AgentProfileScreenStyle.propertyBedroomViewContainer}>
                        <Image source={ImagePath.BEDROOM_ICON} />
                        <Text style={AgentProfileScreenStyle.propertyValueTextStyle}>{number_of_bedroom}</Text>
                    </View>

                    <View style={AgentProfileScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.BATHROOM_ICON} />
                        <Text style={AgentProfileScreenStyle.propertyValueTextStyle}>{number_of_bathroom}</Text>
                    </View>

                    <View style={AgentProfileScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.GARAGE_ICON} />
                        <Text style={AgentProfileScreenStyle.propertyValueTextStyle}>{number_of_parking}</Text>
                    </View>

                </View>
            </View>
        );
    }
    navBar() {
        return (
            <View style={AgentProfileScreenStyle.profileHeaderContainer}>
                <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginLeft: 10, marginTop: 10 }}>
                    <View style={{ padding: 20, paddingLeft: 20 }}>
                        <Image source={ImagePath.BACK_WHITE} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    _mobileNoCountAPI = () => {        
        var requestParams = {
            reveal_contact_number:1,
            user_id:this.state.profileData._id
        }
        APICaller('updateRevealContactNumber', 'post', authToken !== ''?authToken:'', requestParams).then(data => {
            if (data.code == 200) {
                this.setState({mobileVisible:true});
            }
            else {
                this.setState({mobileVisible:false});
            }
        }, err => {
            this.setState({mobileVisible:false});
        })
    }
    render() {

        if(this.state.profileData){
            var userImagePath = this.state.profileData.image ? API.USER_IMAGE_PATH + this.state.profileData.image : ''
            var bannerImage = this.state.profileData.bannerImage ? API.USER_IMAGE_PATH + this.state.profileData.bannerImage : '';
            var firstName = this.state.profileData.firstname ? this.state.profileData.firstname : '';
            var lastName = this.state.profileData.lastname ? this.state.profileData.lastname : '';
            var mobile4digit = this.state.profileData.mobile_no ? this.state.profileData.mobile_no:'';
            var lastFour = mobile4digit.substr(mobile4digit.length - 4);
            var lastFourmobileNo = `*** *** ${lastFour}`;
            var averageRate = this.state.averageRate ? this.state.averageRate : 0;
            var totalreviews = this.state.totalreviews ? this.state.totalreviews : 0;
            var agencyName = this.state.profileData.agency_id?this.state.profileData.agency_id.name:'';
            var agentName = this.state.profileData.firstname?this.state.profileData.lastname?this.state.profileData.firstname + ' ' + this.state.profileData.lastname:'':'';
            // backgroundColor: Colors.SETTING_SCREEN_BG_COLOR 
        }
        return (
            <View style={{backgroundColor:'white'}}>
                {
                this.state.profileData ? (
                <ScrollView contentContainerStyle={{ paddingBottom: 70, }}>
                    <View style={AgentProfileScreenStyle.profileContainer}>
                        <View style={AgentProfileScreenStyle.topCoverImageContainer}>
                            {
                                bannerImage != '' ?
                                    <Image source={{ uri: bannerImage }} style={AgentProfileScreenStyle.topCoverImageContainer} />
                                   : <View style={AgentProfileScreenStyle.topCoverImageContainer} />
                            }
                        </View>

                        <View style={AgentProfileScreenStyle.bottomCoverImageContainer}>
                        </View>
                        <View style={AgentProfileScreenStyle.profileDataContainer}>
                            <View style={AgentProfileScreenStyle.profileNameAndReviewContainer}>
                                {
                                    userImagePath != '' ? <Image source={{ uri: userImagePath }} style={AgentProfileScreenStyle.profileImageStyle} />
                                        :
                                        <View style={CommonStyles.emptyUserImageStyle}>
                                            <Text style={[CommonStyles.initialTextStyle,{color:Colors.BLACK}]}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                        </View>
                                }
                                <Text style={[AgentProfileScreenStyle.userNameTextStyle,{color:Colors.BLACK}]}>{agentName}</Text>
                                <Text style={[AgentProfileScreenStyle.agentcyDetailsTextValue,{marginBottom:0}]}>{agencyName}</Text>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    starSize={20}
                                    starStyle={{ paddingRight: 2, paddingLeft: 2, marginTop: 8 }}
                                    fullStarColor={Colors.STAR_COLOR}
                                    starColor={Colors.STAR_COLOR}
                                    halfStarColor={Colors.STAR_COLOR}

                                    rating={averageRate}
                                    selectedStar={(rating) => ref.onStarRatingPress(rating)}
                                />
                                <Text style={AgentProfileScreenStyle.agentcyDetailsTextValue}>{averageRate + ' ' + 'from' + ' ' + totalreviews + ' ' + 'reviews'}</Text>
                                
                            </View>
                            <View style={{marginTop:15}}>
                                    <Text style={AgentProfileScreenStyle.agentcyDetailsText}>AGENCY ADDRESS</Text>
                                    <Text style={AgentProfileScreenStyle.agentcyDetailsTextValue}>{this.state.profileData.address}</Text>
                                
                                    <Text style={AgentProfileScreenStyle.agentcyDetailsText}>MOBILE NUMBER</Text>
                                    <Text style={[AgentProfileScreenStyle.agentcyDetailsTextValue,{marginBottom:1}]}>{this.state.mobileVisible?mobile4digit:lastFourmobileNo}</Text>
                                    {
                                        !this.state.mobileVisible && (
                                            <TouchableOpacity onPress={()=>this._mobileNoCountAPI()} style={{alignSelf:"center"}}>
                                                <Text style={[AgentProfileScreenStyle.agentcyDetailsTextValue,{fontWeight:'bold',color:Colors.SKY_BLUE_BUTTON_BACKGROUND}]}>SHOW NUMBER</Text>
                                            </TouchableOpacity>
                                        )
                                    }
                            </View>
                            <TouchableOpacity onPress={this.callSendMessageScreen.bind(this)} style={{alignSelf:'center',marginBottom:10}}>
                                    <View style={AgentProfileScreenStyle.contactAgentView}>
                                        <Text style={AgentProfileScreenStyle.buttonTextStyle}>{'CONTACT AGENT'}</Text>
                                    </View>
                                </TouchableOpacity>
                        </View>
                        <View style={AgentProfileScreenStyle.profileImageContainer}>
                            {this.state.profileData.is_online ?
                                <View style={AgentProfileScreenStyle.onLineStatusViewStyle} />
                               :
                                <View style={AgentProfileScreenStyle.statusViewStyle} />
                            }
                        </View>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={AgentProfileScreenStyle.tabContainerScrollViewStyle}>
                            <View style={[AgentProfileScreenStyle.tabContainerStyle,{backgroundColor:'#fafafa'}]}>

                                <TouchableOpacity onPress={() => this.onJobHistoryTabClick()} >
                                    <View >
                                        <View style={AgentProfileScreenStyle.tabTextViewStyle}>
                                            <Text style={(this.state.isTabSelected == 2) ? [AgentProfileScreenStyle.tabLabelTextStyle,{fontSize:14}] : [AgentProfileScreenStyle.tabLabelDiselectTextStyle,{fontSize:14}]}>{'OVERVIEW'}</Text>
                                        </View>
                                        {this.state.isTabSelected == 2 ? <View style={AgentProfileScreenStyle.tabIndicatorStyle}></View> : <View style={AgentProfileScreenStyle.tabWhiteIndicatorStyle}></View>}
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.onReviewAndRatingsTabClick()}>
                                    <View>
                                        <View style={AgentProfileScreenStyle.tabTextViewStyle}>
                                            <Text style={(this.state.isTabSelected == 3) ? [AgentProfileScreenStyle.tabLabelTextStyle,{fontSize:14}] : [AgentProfileScreenStyle.tabLabelDiselectTextStyle,{fontSize:14}]}>{'REVIEWS AND RATINGS'}</Text>
                                        </View>
                                        {(this.state.isTabSelected == 3) ? <View style={AgentProfileScreenStyle.tabIndicatorStyle}></View> : <View style={AgentProfileScreenStyle.tabWhiteIndicatorStyle}></View>}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        {(this.state.isTabSelected == 2) ?
                            <SearchedAgentOverviewScreen overviewData={this.state.profileData} ratingData={this.state.userReviewData} />
                            : null}
                        {(this.state.isTabSelected == 3) ?
                            <SearchedAgentReviewAndRatingScreen reviewToId={this.state.tradersId} reviewToName={this.state.profileData.firstname + ' ' + this.state.profileData.lastname} averageRate={averageRate} totalreviews={totalreviews} />
                            : null}
                        {this.state.isScreenLoading ? (
                            <View style={CommonStyles.circles}>
                                <Progress.CircleSnail
                                    color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]}
                                />
                            </View>
                        ) : null}
                    </View>
                </ScrollView>
                    ):null
                }
                {this.navBar()}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        tradersReducer: state.tradersReducer,
        homeScreenReducer: state.homeScreenReducer,
        profileReducer: state.profileReducer,
        agentreducer:state.agentsScreenReducer,
    }
}

export default connect(
    mapStateToProps,
    {
        getTradersProfile,
        getPropertyList,
        showLoading,
        resetState,
        getAgencyProfile,
        getUserReviewsList,
        getAgentProfileData,
    }

)(SearchedAgentProfileScreen);