import React, { Component } from 'react';
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    AsyncStorage,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import AgentReviewAndRatingScreenStyle from './AgentReviewAndRatingScreenStyle';

import CommonStyles from '../../../CommonStyle/CommonStyle';
import StarRating from 'react-native-star-rating';
import API from '../../../Constants/APIUrls';
import { CardView } from '../../CommonComponent/CardView';
import Moment from 'moment';
let ref;
var UserID = '';

import {

    getAllUserReviewsList,

} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,
} from "../AgentsScreenAction";
import { Dropdown } from 'react-native-material-dropdown';


class ReviewAndRatingScreen extends Component {
    constructor() {
        super();
        this.state = {
            starCount: 3.5,
            userReviewList: [],
        };
        ref = this;
    }
    componentDidUpdate() {
        this.onGetAllUserReviewSuccess();
    }
    componentWillMount() {
        this.callGetAlllUserReview();
    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
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

    onGetAllUserReviewSuccess() {

        if (this.props.profileReducer.userAllReviewRes != '') {
            if (this.props.profileReducer.userAllReviewRes.code == 200) {
                this.setState({ userReviewList: this.props.profileReducer.userAllReviewRes.data });
            }
            else {
                alert(this.props.profileReducer.userAllReviewRes.message);
            }
            this.props.resetState();
        }
    }

    callWriteReview() {
           Actions.WriteReviewScreen({reviewToName:this.props.reviewToName, reviewToId: this.props.reviewToId, reviewToName: this.props.reviewToName, isFrom: this.props.isFrom });
    }

    renderItem({ item, index }) {
        var userImage = item.review_by.image ? API.USER_IMAGE_PATH + item.review_by.image : '';
        var firstName = item.review_by.firstname;
        var lastName = item.review_by.lastname;
        var rating = item.avg_total ? item.avg_total : 0;
        return (
            <View style={AgentReviewAndRatingScreenStyle.listMainContainerStyle}>
                <View style={AgentReviewAndRatingScreenStyle.listContainerStyle}>

                    <View style={AgentReviewAndRatingScreenStyle.imageContainerStyle}>
                        {
                            userImage != '' ? <Image source={{ uri: userImage }} style={AgentReviewAndRatingScreenStyle.userImageStyle} />
                                :
                                <View style={AgentReviewAndRatingScreenStyle.emptyUserMessageListImageStyle}>
                                    <Text style={AgentReviewAndRatingScreenStyle.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                </View>
                        }

                    </View>

                    <View>
                        <Text style={AgentReviewAndRatingScreenStyle.detailTitleTextStyle}>{firstName + ' ' + lastName}</Text>
                        <View style={[AgentReviewAndRatingScreenStyle.detailTitleContainerStyle,{marginTop:5}]}>
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
                            <Text style={AgentReviewAndRatingScreenStyle.reviewDateTextStyle}>{Moment(item.createdAt).format('MMM DD, YYYY')}</Text>
                        </View>
                    </View>

                </View>
                <Text style={AgentReviewAndRatingScreenStyle.reviewDetailTextStyle}>{item.comments}</Text>
            </View>

        );
    }

    onValueChanged(text) {
       if (text == 'All') {
            this.callGetAlllUserReview();
        } else if (text == 'Tenant reviews') {

        } else if (text == 'Owner reviews') {

        }

    }

    render() {

        let data = [{
            value: 'All',
        }, {

            value: 'Tenant reviews',

        },
        {
            value: 'Owner reviews',
        }];
        return (
            <View>
                <View>
                    <CardView>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 25, paddingBottom: 25, paddingLeft: 20, paddingRight: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: Colors.FILTER_TEXT_VIEW_COLOR, fontSize: 38, fontWeight: '300' }}>
                                    {this.props.averageRate}
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

                                        rating={this.props.averageRate}
                                        selectedStar={(rating) => ref.onStarRatingPress(rating)}
                                    />
                                    <Text style={{ fontSize: 14, color: Colors.FILTER_TEXT_VIEW_COLOR }}>{' ' + this.props.totalreviews + ' reviews'}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={AgentReviewAndRatingScreenStyle.wirteReviewButtonView} onPress={this.callWriteReview.bind(this)}>
                                <View >
                                    <Text style={AgentReviewAndRatingScreenStyle.reviewButtonTextStyle}>Write a review</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </CardView>
                </View>
                <View style={{backgroundColor:'white'}}>
                    <Dropdown
                        label=''
                        labelHeight={5}
                        fontSize={14}
                        baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                        containerStyle={AgentReviewAndRatingScreenStyle.dropDownViewStyle}
                        data={data}
                        value={data[0].value}
                        onChangeText={this.onValueChanged.bind(this)}
                    />
                </View>

                {this.state.userReviewList.length > 0
                    ?
                    <FlatList
                        data={this.state.userReviewList}
                        renderItem={this.renderItem}
                    />
                    : <View style={{ flex: 1, justifyContent: 'center' }}>
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
        getAllUserReviewsList
    }

)(ReviewAndRatingScreen);
