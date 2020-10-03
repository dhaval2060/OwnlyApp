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

    getUserReviewsList,
    getAllUserReviewsList,
    addResponse,
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
import ImagePath from '../../Constants/ImagesPath';
import ReviewAndRatingScreenStyle from './ReviewAndRatingScreenStyle';
//import listData from  '../../../data';
import CommonStyles from '../../CommonStyle/CommonStyle';
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
            inputOn: '',
            responseInput: '',
            responses: []
        };
        ref = this;
    }


    componentDidUpdate() {
        this.onGetUserRatingSuccess();
        this.onGetAllUserReviewSuccess();
        this.onGetUserRoleReviewSuccess();
        this.onAddPropertySuccess();
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
    onAddPropertySuccess() {
        if (this.props.profileReducer.addResponse) {
            if (this.props.profileReducer.addResponse.code == 200) {
                
                this.callGetUserRating();
                this.callGetAlllUserReview();
                this.setState({ inputOn: '', responseInput: '' })
                // this.setState({ userReviewData: this.props.profileReducer.userReviewRes });

            }
            else {
                // alert(this.props.profileReducer.userReviewRes.message);
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

    onGetAllUserReviewSuccess() {

        if (this.props.profileReducer.userAllReviewRes != '') {
            if (this.props.profileReducer.userAllReviewRes.code == 200) {
                
                this.setState({ userReviewList: this.props.profileReducer.userAllReviewRes.data });
            }
            else {
                // alert(this.props.profileReducer.userAllReviewRes.message);
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

    renderItem = ({ item, index }) => {
        
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
                                    emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                    fullStarColor={Colors.STAR_COLOR}
                                    halfStarColor={Colors.STAR_COLOR}
                                    starColor={Colors.STAR_COLOR}
                                    rating={rating}

                                />
                            </View>
                            <Text style={ReviewAndRatingScreenStyle.reviewDateTextStyle}>{Moment(item.createdAt).format('MMM DD, YYYY')}</Text>
                        </View>
                    </View>

                </View>
                <Text style={ReviewAndRatingScreenStyle.reviewDetailTextStyle}>{item.comments}</Text>
                {/* {this.state.inputOn == item._id.toString() &&
                    <View style={{ padding: 5, marginTop: 10, borderTopWidth: 1, borderTopColor: '#aaa' }} />
                } */}
                <View>
                    {this.renderResponse(item.response)}
                </View>
                <View>
                    
                    {(this.state.inputOn != item._id && item.response.length == 0) &&
                        <View style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
                            <View style={{ flex: 0.5 }}></View>
                            <TouchableOpacity style={{ flex: 0.5 }} onPress={async () => {
                                
                                await this.setState({ inputOn: item._id })
                                
                            }}>
                                <Text style={{ justifyContent: 'flex-end', alignItems: 'flex-end', alignSelf: 'flex-end', color: Colors.SKY_BLUE_BUTTON_BACKGROUND, }}>Send Reply</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {this.state.inputOn == item._id &&
                        <View>
                            <View>
                                <View style={styles.textAreaContainer} >
                                    <TextInput
                                        style={styles.textArea}
                                        underlineColorAndroid="transparent"
                                        placeholder={"Responding to " + firstName + ' ' + lastName}
                                        placeholderTextColor="grey"
                                        numberOfLines={5}
                                        onChangeText={(val) => this.setState({ responseInput: val })}
                                        value={this.state.responseInput}
                                        multiline={true}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => this.submitResponse(item._id, item.review_by._id)}
                                style={[ReviewAndRatingScreenStyle.submitResponseButton]}>
                                <Text style={ReviewAndRatingScreenStyle.reviewButtonTextStyle}>Submit Response</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>

        );
    }
    renderResponse(item) {
        if (item.length != 0) {
            
            return (
                <View>
                    {item[0].response_by != null &&
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 0.1 }}>
                            </View>
                            <View style={{ flex: 0.8, paddingTop: 10, paddingBottom: 10, borderTopWidth: 0.5, borderTopColor: '#aaa', flexDirection: 'row' }}>
                                <Image source={{ uri: API.USER_IMAGE_PATH + item[0].response_by.image }} style={{ width: 30, borderRadius: 15, height: 30, marginRight: 10 }} />
                                <View>
                                    <Text style={ReviewAndRatingScreenStyle.reviewDetailTextStyle}>{item[0].response}</Text>
                                    <Text style={ReviewAndRatingScreenStyle.reviewDateTextStyle}>{Moment(item[0].createdDate).format(Strings.DATE_FORMATE)}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 0.1 }}>
                            </View>
                        </View>
                    }
                </View>
            )
        }

    }
    submitResponse(id, reviewByID) {
        
        if (this.state.responseInput != '') {
            AsyncStorage.getItem("SyncittUserInfo").then((value) => {
                if (value) {
                    var userData = JSON.parse(value);
                    
                    var authToken = userData.token;

                    var postData = {
                        review_id: id,
                        response: this.state.responseInput,
                        response_by: userData.data.user_id,
                    }
                    this.props.showLoading();
                    this.props.addResponse(authToken, postData);
                }
            }).done();
        }else
        {
            alert("Response can not be blank!")
        }
    }
    callWriteReview() {
        Actions.WriteReviewScreen({ reviewToId: this.props.reviewToId, reviewToName: this.props.reviewToName });
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
            this.state.roleName == Strings.USER_ROLE_TENANT || this.props.isFrom == 'TenantProfile' ?
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
                                            emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                            fullStarColor={Colors.STAR_COLOR}
                                            halfStarColor={Colors.STAR_COLOR}
                                            starColor={Colors.STAR_COLOR}
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
                        extraData={this.state}
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
const styles = StyleSheet.create({
    textAreaContainer: {
        borderColor: '#aaa',
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
        margin: 5
    },
    textArea: {
        height: 70,
        justifyContent: "flex-start"
    }
})
export default connect(
    mapStateToProps,
    {

        showLoading,
        resetState,
        getUserReviewsList,
        getAllUserReviewsList,
        getUserRoleReviewsList,
        addResponse
    }

)(ReviewAndRatingScreen);


