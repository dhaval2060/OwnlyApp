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
    getTraderJobHistory,
    getTradersProfile,
} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,
} from "../TradersAction";
import {

    updateRating
} from "../../WriteReviewComponent/WriteReviewAction";

import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import TradersProfileScreenStyle from './TradersProfileScreenStyle';

import CommonStyles from '../../../CommonStyle/CommonStyle';
import TradersOverviewScreen from './TradersOverviewScreen';
import TradersReviewAndRatingScreen from './TradersReviewAndRatingScreen';
import API from '../../../Constants/APIUrls';
import StarRating from 'react-native-star-rating';
import { CardView } from '../../CommonComponent/CardView';
import Moment from 'moment';
import APICaller from '../../../Saga/APICaller';
let ref;


class TradersProfileScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            starCount: 0,
            isTabSelected: 0,
            tradersId: '',
            jobHistoryData: '',
            profileData: {},
            averageRate: 0,
            totalreviews: 0
        };
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.writeReviewReducer.isRatingUpdate != '') {

            this.callGetTradersProfile();
            this.props.updateRating('');
        }
    }

    componentDidUpdate() {

        this.onGetProfileSuccess();
        this.onGetTraderJobHistorySuccess();
    }

    componentWillUnmount() {

    }
    componentWillMount() {
        this.setState({ tradersId: this.props.user_id });
        this.setState({ averageRate: this.props.averageRating });
        this.setState({ totalreviews: this.props.totalReviewLengthrating });
        this.callGetTradersProfile();
        this._getratingandreview();
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
    closeNotifications() {
        Actions.popTo('Dashboard');
    }

    onOverviewTabClick() {

        this.setState({ isTabSelected: 1 });
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
            <Image source={{ uri: item.url }} style={TradersProfileScreenStyle.userListImageStyle} />
        );
    }


    callSendMessageScreen() {

        Actions.MessageToTraderScreen({ userFirstName: this.state.profileData.firstname, userLastName: this.state.profileData.lastname, receiverId: this.state.profileData._id });
    }


    callGetTradersJobHistory() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;

                var postData = {

                    trader_id: this.props.user_id,
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


    callGetTradersProfile() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
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
                this.setState({ profileData: this.props.tradersReducer.tradersProfileRes.data });
                this.callGetTradersJobHistory();
            }
            else {
                alert(this.props.tradersReducer.tradersProfileRes.message);
            }
            this.props.resetState();
        }

    }

    renderJobHistory({ item, index }) {
        return (

            <CardView>
                <View style={TradersProfileScreenStyle.listMainContainerStyle}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={TradersProfileScreenStyle.propertyTitleViewStyle}>
                            <Text style={TradersProfileScreenStyle.propertyTitleTextStyle}>{item.request_overview}</Text>
                            {item.reviews && item.reviews.length > 0 && item.reviews[0].avg_total &&
                                <View style={{ width: 150 }}>
                                    <StarRating
                                        disabled={true}
                                        maxStars={5}
                                        starSize={25}
                                        starStyle={{ paddingRight: 5, marginTop: 8 }}
                                        starColor={Colors.STAR_COLOR}
                                        emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                        rating={item.reviews && item.reviews.length > 0 && item.reviews[0].avg_total ? item.reviews[0].avg_total : 0}
                                        selectedStar={rating => ref.onStarRatingPress(rating)}
                                    />
                                </View>
                            }
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



    /*renderItem({ item, index }) {

        return (
            <View style={TradersProfileScreenStyle.listMainContainerStyle}>

                <View style={TradersProfileScreenStyle.propertyImageViewStyle}>
                    <Image source={{ uri: item.url }} style={TradersProfileScreenStyle.propertyImageStyle} />
                    <Image source={ImagePath.HEART} style={TradersProfileScreenStyle.likeImageViewStyle} />
                </View>
                <View style={TradersProfileScreenStyle.propertyTitleViewStyle}>
                    <Text style={TradersProfileScreenStyle.propertyTitleTextStyle}>{item.category}</Text>
                </View>
                <View style={TradersProfileScreenStyle.propetySubTitleViewStyle}>
                    <Text style={TradersProfileScreenStyle.propertySubTitleTextStyle}>{item.category}</Text>
                </View>

                <View style={TradersProfileScreenStyle.imageListMainContainerStyle}>
                    <View>
                        <Image source={ImagePath.USER_DEFAULT} style={TradersProfileScreenStyle.userImageStyle} />
                    </View>


                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={TradersProfileScreenStyle.imageListContainerStyle}>
                            {
                                listData.map((data, index) => {
                                    return ref.renderImageItem(data, index);
                                })
                            }
                        </View>
                    </ScrollView>

                </View>

                <View style={TradersProfileScreenStyle.propertyInfoContainerViewStyle}>

                    <View style={TradersProfileScreenStyle.propertyBedroomViewContainer}>
                        <Image source={ImagePath.DOLLAR_ICON} />
                        <Text style={TradersProfileScreenStyle.propertyValueTextStyle}>4500</Text>
                    </View>
                    <View style={TradersProfileScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.CALENDAR_ICON} />
                        <Text style={TradersProfileScreenStyle.propertyValueTextStyle}>Jul 29, 2017</Text>
                    </View>
                    <View style={TradersProfileScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.SEARCH_ICON} />
                        <Text style={TradersProfileScreenStyle.propertyValueTextStyle}>4 times</Text>
                    </View>

                </View>
            </View>
        );
    }*/

    navBar() {
        return (
            <View style={TradersProfileScreenStyle.profileHeaderContainer}>

                <TouchableOpacity onPress={() => this.closeNotifications()} style={{ marginLeft: 10, marginTop: 10 }}>
                    <View style={{ padding: 20, paddingLeft: 20 }}>
                        <Image source={ImagePath.BACK_WHITE} />
                    </View>
                </TouchableOpacity>

                {/*<TouchableOpacity style={{ marginRight: 20 }}>
                    <Image source={ImagePath.HEART} />
                </TouchableOpacity>*/}
            </View>
        );
    }

    render() {

        var userImagePath = this.state.profileData.image ? API.USER_IMAGE_PATH + this.state.profileData.image : ''
        var bannerImage = this.state.profileData.bannerImage ? API.USER_IMAGE_PATH + this.state.profileData.bannerImage : '';
        var firstName = this.state.profileData.firstname ? this.state.profileData.firstname : '';
        var lastName = this.state.profileData.lastname ? this.state.profileData.lastname : '';
        var averageRate = this.state.averageRate ? this.state.averageRate : 0;
        var totalreviews = this.state.totalreviews ? this.state.totalreviews : 0;

        return (

            <View>
                <ScrollView contentContainerStyle={{ paddingBottom: 70, backgroundColor: Colors.SETTING_SCREEN_BG_COLOR }}>
                    <View style={TradersProfileScreenStyle.profileContainer}>
                        <View style={TradersProfileScreenStyle.topCoverImageContainer}>
                            {
                                bannerImage != '' ?
                                    <Image source={{ uri: bannerImage }} style={TradersProfileScreenStyle.topCoverImageContainer} />
                                    : <View style={TradersProfileScreenStyle.topCoverImageContainer} />
                            }



                        </View>

                        <View style={TradersProfileScreenStyle.bottomCoverImageContainer}>
                            <Image source={ImagePath.HEADER_BG} style={TradersProfileScreenStyle.bottomCoverImageContainer} />
                        </View>
                        <View style={TradersProfileScreenStyle.profileDataContainer}>
                            <View style={TradersProfileScreenStyle.profileNameAndReviewContainer}>

                                {
                                    userImagePath != '' ? <Image source={{ uri: userImagePath }} style={TradersProfileScreenStyle.profileImageStyle} />
                                        :
                                        <View style={CommonStyles.emptyUserImageStyle}>
                                            <Text style={CommonStyles.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                        </View>
                                }
                                <Text style={TradersProfileScreenStyle.userNameTextStyle}>{firstName + ' ' + lastName}</Text>
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
                                <Text style={TradersProfileScreenStyle.userReviewtextStyle}>{averageRate + ' ' + 'from' + ' ' + totalreviews + ' ' + 'reviews'}</Text>
                                <TouchableOpacity onPress={this.callSendMessageScreen.bind(this)} >
                                    <View style={TradersProfileScreenStyle.contactAgentView}>
                                        <Text style={TradersProfileScreenStyle.buttonTextStyle}>{Strings.SEND_MESSAGE}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={TradersProfileScreenStyle.userInfoContainerStyle}>
                                <View style={TradersProfileScreenStyle.userInfoTextContainerStyle}>
                                    <Text style={TradersProfileScreenStyle.labelTextStyle}>Location</Text>
                                    <Text style={TradersProfileScreenStyle.infoTextStyle}>{this.state.profileData.address}</Text>
                                </View>
                                <View style={TradersProfileScreenStyle.userInfoTextContainerStyle}>
                                    <Text style={TradersProfileScreenStyle.labelTextStyle}>Phone number</Text>
                                    <Text style={TradersProfileScreenStyle.infoTextStyle}>{this.state.profileData.mobile_no}</Text>
                                </View>
                                <View style={TradersProfileScreenStyle.userInfoTextContainerStyle}>
                                    <Text style={TradersProfileScreenStyle.labelTextStyle}>Email address</Text>
                                    <Text style={TradersProfileScreenStyle.infoTextStyle}>{this.state.profileData.email}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={TradersProfileScreenStyle.profileImageContainer}>
                            {this.state.profileData.is_online ?
                                <View style={TradersProfileScreenStyle.onLineStatusViewStyle} />
                                :
                                <View style={TradersProfileScreenStyle.statusViewStyle} />
                            }
                        </View>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={TradersProfileScreenStyle.tabContainerScrollViewStyle}>
                            <View style={TradersProfileScreenStyle.tabContainerStyle}>

                                <TouchableOpacity onPress={() => this.onOverviewTabClick()}>
                                    <View>
                                        <View style={TradersProfileScreenStyle.tabTextViewStyle}>
                                            <Text style={(this.state.isTabSelected == 1) ? TradersProfileScreenStyle.tabLabelTextStyle : TradersProfileScreenStyle.tabLabelDiselectTextStyle}>{Strings.OVERVIEW}</Text>
                                        </View>
                                        {(this.state.isTabSelected == 1) ? <View style={TradersProfileScreenStyle.tabIndicatorStyle}></View> :
                                            <View style={TradersProfileScreenStyle.tabWhiteIndicatorStyle}></View>}
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.onJobHistoryTabClick()} >
                                    <View >
                                        <View style={TradersProfileScreenStyle.tabTextViewStyle}>
                                            <Text style={(this.state.isTabSelected == 2) ? TradersProfileScreenStyle.tabLabelTextStyle : TradersProfileScreenStyle.tabLabelDiselectTextStyle}>{Strings.JOB_HISTORY}</Text>
                                        </View>
                                        {this.state.isTabSelected == 2 ? <View style={TradersProfileScreenStyle.tabIndicatorStyle}></View> : <View style={TradersProfileScreenStyle.tabWhiteIndicatorStyle}></View>}
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.onReviewAndRatingsTabClick()}>
                                    <View>
                                        <View style={TradersProfileScreenStyle.tabTextViewStyle}>
                                            <Text style={(this.state.isTabSelected == 3) ? TradersProfileScreenStyle.tabLabelTextStyle : TradersProfileScreenStyle.tabLabelDiselectTextStyle}>{Strings.REVIEWS_AND_RATINGS}</Text>
                                        </View>
                                        {(this.state.isTabSelected == 3) ? <View style={TradersProfileScreenStyle.tabIndicatorStyle}></View> : <View style={TradersProfileScreenStyle.tabWhiteIndicatorStyle}></View>}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        {(this.state.isTabSelected == 1 && this.state.profileData != undefined) ?

                            <TradersOverviewScreen overViewData={this.state.profileData} />

                            : null}
                        {(this.state.isTabSelected == 2) ?
                            <FlatList
                                data={this.state.jobHistoryData && this.state.jobHistoryData.reverse()}
                                renderItem={this.renderJobHistory}
                                extraData={this.state}
                            />
                            : null
                        }
                        {(this.state.isTabSelected == 3) ?
                            <TradersReviewAndRatingScreen reviewToId={this.state.tradersId} averageRate={averageRate} totalreviews={totalreviews} isUserProfile={false} />
                            : null}
                    </View>
                </ScrollView>

                {this.navBar()}
            </View>
        );
    }
}

function mapStateToProps(state) {

    return {
        tradersReducer: state.tradersReducer,
        writeReviewReducer: state.writeReviewReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getTraderJobHistory,
        getTradersProfile,
        showLoading,
        resetState,
        updateRating
    }

)(TradersProfileScreen);


