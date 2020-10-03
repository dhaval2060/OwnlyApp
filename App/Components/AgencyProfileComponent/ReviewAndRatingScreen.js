import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    AsyncStorage
} from 'react-native';

import {
    getUserReviewsList,
    getAllUserReviewsList,
    getUserRoleReviewsList
} from "../../Action/ActionCreators";

import {
    showLoading,
    resetState,
} from "./ProfileAction";

import Moment from 'moment';
import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ReviewAndRatingScreenStyle from './ReviewAndRatingScreenStyle';
import { Dropdown } from 'react-native-material-dropdown';
import { CardView } from '../CommonComponent/CardView';
import StarRating from 'react-native-star-rating';
import API from '../../Constants/APIUrls';
let ref;
var UserID = '';
class ReviewAndRatingScreen extends Component {
    constructor() {
        super();
        this.state = {
            roleName: '',
            userReviewData: {},
            userReviewList: [],
        };
        ref = this;
    }
    componentDidUpdate() {
        this.onGetUserRatingSuccess();
        this.onGetAllUserReviewSuccess();
       this.onGetUserRoleReviewSuccess();
    }
    componentWillMount() {
        this.getRoleName();
        this.callGetUserRating();
        this.callGetAlllUserReview();
    }

    callGetUserRating() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;

                this.props.showLoading();
                this.props.getUserReviewsList(authToken, this.props.reviewToId);
            }
        }).done();

    }

    callGetAlllUserReview() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                UserID = this.props.reviewToId == undefined ? userData.data._id : this.props.reviewToId;

                this.props.showLoading();
                this.props.getAllUserReviewsList(authToken, UserID);
            }
        }).done();

    }

    onGetUserRatingSuccess() {

        if (this.props.profileReducer.userReviewRes != '') {
            if (this.props.profileReducer.userReviewRes.code == 200) {
                this.setState({ userReviewData: this.props.profileReducer.userReviewRes });
            }
            else {
                console.log('ERROR_',this.props.profileReducer.userReviewRes.message);
            }
            this.props.resetState();
        }
    }

    onGetAllUserReviewSuccess() {
        if (this.props.profileReducer.userAllReviewRes != '') {
            if (this.props.profileReducer.userAllReviewRes.code == 200) {
                this.setState({ userReviewList: this.props.profileReducer.userAllReviewRes.data });
            }
            else {
               console.log('ERROR_',this.props.profileReducer.userAllReviewRes.message);
            }
            this.props.resetState();
        }
    }


    onGetUserRoleReviewSuccess() {

        if (this.props.profileReducer.userRoleReviewRes != '') {
            if (this.props.profileReducer.userRoleReviewRes.code == 200) {
                this.setState({ userReviewList: this.props.profileReducer.userRoleReviewRes.data });
            }
            else {
                //alert(this.props.profileReducer.userRoleReviewRes.message);
            }
            this.props.resetState();
        }
    }

    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {
                this.setState({ roleName: value });

            }
        }).done();
    }

    renderItem({ item, index }) {
        var userImage = item.review_by.image ? API.USER_IMAGE_PATH + item.review_by.image : '';
        var firstName = item.review_by ? item.review_by.firstname : '';
        var lastName = item.review_by ? item.review_by.lastname : '';
        var rating = item.avg_total ? item.avg_total : 0;
        return (
            <View style={ReviewAndRatingScreenStyle.listMainContainerStyle}>
                <View style={ReviewAndRatingScreenStyle.listContainerStyle}>

                    <View style={ReviewAndRatingScreenStyle.imageContainerStyle}>

                        {
                            userImage != '' ? <Image source={{ uri: userImage }} style={ReviewAndRatingScreenStyle.userImageStyle} />
                                :
                                <View style={ReviewAndRatingScreenStyle.emptyUserMessageListImageStyle}>
                                    <Text style={ReviewAndRatingScreenStyle.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                </View>
                        }

                    </View>

                    <View>
                        <Text style={ReviewAndRatingScreenStyle.detailTitleTextStyle}>{firstName + ' ' + lastName}</Text>
                        <View style={ReviewAndRatingScreenStyle.detailTitleContainerStyle}>
                            <View style={{ paddingRight: 5 }}>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    starSize={20}
                                    starStyle={{ paddingRight: 5 }}
                                    fullStarColor={Colors.STAR_COLOR}
                                    starColor={Colors.STAR_COLOR}
                                    halfStarColor={Colors.STAR_COLOR}
                                    
                                    rating={rating}

                                />
                            </View>
                            <Text style={ReviewAndRatingScreenStyle.reviewDateTextStyle}>{Moment(item.createdAt).format('MMM DD, YYYY')}</Text>
                        </View>
                    </View>

                </View>
                <Text style={ReviewAndRatingScreenStyle.reviewDetailTextStyle}>{item.comments}</Text>
            </View>

        );
    }

    callWriteReview() {
        Actions.WriteReviewScreen({ reviewToId: this.props.reviewToId ,reviewToName:this.props.reviewToName});
    }
    callUserRoleReviewforAgent() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                UserID = this.props.reviewToId == undefined ? userData.data._id : this.props.reviewToId;
    
               var postData = {
                    user_id: UserID,
                    user_role: '5a12b4fe6b53784648d45479',
                };
                this.props.showLoading();
                this.props.getUserRoleReviewsList(authToken, postData);
            }
        }).done();
    }

    callUserRoleReviewforTenant() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                UserID = this.props.reviewToId == undefined ? userData.data._id : this.props.reviewToId;

                var postData = {
                    user_id: UserID,
                    user_role: '5a1d11c016bed22901ce050c',
                };

                this.props.showLoading();
                this.props.getUserRoleReviewsList(authToken, postData);
            }
        }).done();
    }

    callUserRoleReviewforOwner() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                UserID = this.props.reviewToId == undefined ? userData.data._id : this.props.reviewToId;

                postData = {
                    user_id: UserID,
                    user_role: '5a1d295034240d4077dff208',
                };

                this.props.showLoading();
                this.props.getUserRoleReviewsList(authToken, postData);
            }
        }).done();
    }

    onValueChanged(text) {
        if (text == 'All') {
            this.callGetAlllUserReview();

        } else if (text == 'Agent reviews') {

            this.callUserRoleReviewforAgent();

        } else if (text == 'Tenant reviews') {

            this.callUserRoleReviewforTenant();

        } else if (text == 'Owner reviews') {

            this.callUserRoleReviewforOwner();
        }

    }


    render() {
        //trader or Agency and agent: tenant+owner//tenant:agent
        let data =
            this.state.roleName == Strings.USER_ROLE_TENANT||this.props.isFrom == 'TenantProfile' ?
                [{
                    value: 'All',
                }, {

                    value: 'Agent reviews',

                }] :
                [{
                    value: 'All',
                }, {

                    value: 'Tenant reviews',

                },
                {
                    value: 'Owner reviews',
                }];


        return (
            <View>
                {this.props.reviewToId == undefined ? null :
                    <View>
                        <CardView>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 25, paddingBottom: 25, paddingLeft: 20, paddingRight: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: Colors.FILTER_TEXT_VIEW_COLOR, fontSize: 38, fontWeight: '300' }}>
                                        {this.state.userReviewData.data}
                                    </Text>

                                    <View style={{ paddingLeft: 10 }}>
                                        <StarRating
                                            disabled={true}
                                            maxStars={5}
                                            starSize={20}
                                            starStyle={{ paddingRight: 5 }}
                                            fullStarColor={Colors.STAR_COLOR}
                                            starColor={Colors.STAR_COLOR}
                                            halfStarColor={Colors.STAR_COLOR}
                                            
                                            rating={this.state.userReviewData.data}

                                        />
                                        <Text style={{ fontSize: 14, color: Colors.FILTER_TEXT_VIEW_COLOR }}>{this.state.userReviewData.total_review} reviews</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={ReviewAndRatingScreenStyle.wirteReviewButtonView} onPress={this.callWriteReview.bind(this)}>
                                    <View >
                                        <Text style={ReviewAndRatingScreenStyle.reviewButtonTextStyle}>Write a review</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </CardView>
                    </View>
                }
                <Dropdown
                    label=''
                    labelHeight={5}
                    fontSize={14}
                    baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                    containerStyle={ReviewAndRatingScreenStyle.dropDownViewStyle}
                    data={data}
                    value={data[0].value}
                    onChangeText={this.onValueChanged.bind(this)}
                />
                {this.state.userReviewList.length > 0
                    ?
                    <FlatList
                        data={this.state.userReviewList}
                        renderItem={this.renderItem}
                    />
                    : <View style={{ flex: 1, justifyContent: 'center', alignItem: 'center' }}>
                        <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.REVIEW_NOT_FOUND}</Text>
                    </View>
                }
            </View>

        );
    }
}

function mapStateToProps(state) {
    return {

        profileReducer: state.profileReducer,

    }
}

export default connect(
    mapStateToProps,
    {

        showLoading,
        resetState,
        getUserReviewsList,
        getAllUserReviewsList,
        getUserRoleReviewsList,
    }

)(ReviewAndRatingScreen);


