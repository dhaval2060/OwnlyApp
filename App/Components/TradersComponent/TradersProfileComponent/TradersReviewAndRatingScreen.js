import React, { Component } from 'react';
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
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import TradersReviewAndRatingScreenStyle from './TradersReviewAndRatingScreenStyle';
//import listData from  '../../../../data';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import { Dropdown } from 'react-native-material-dropdown';
import StarRating from 'react-native-star-rating';
import API from '../../../Constants/APIUrls';
import { CardView } from '../../CommonComponent/CardView';
import Moment from 'moment';
let ref;
var UserID = '';

import {

   
    getAllUserReviewsList,
    addResponse
} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,
} from "../TradersAction";


class ReviewAndRatingScreen extends Component {
    constructor() {
        super();
        this.state = {
            starCount: 3.5,
            userReviewList: [],
            inputOn: '',
            responseInput: '',
            responses: []
        };
        ref = this;
    }

    componentDidUpdate() {
        this.onGetAllUserReviewSuccess();
        this.onAddPropertySuccess();

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
        
        Actions.WriteReviewScreen({ reviewToId: this.props.reviewToId, reviewToName: this.props.reviewToName });
    }

    renderItem= ({ item, index }) => {
        var userImage = item.review_by.image ? API.USER_IMAGE_PATH + item.review_by.image : '';
        var firstName = item.review_by.firstname;
        var lastName = item.review_by.lastname;
        var rating = item.avg_total ? item.avg_total : 0;
        
        return (
            <View style={TradersReviewAndRatingScreenStyle.listMainContainerStyle}>
                <View style={TradersReviewAndRatingScreenStyle.listContainerStyle}>

                    <View style={TradersReviewAndRatingScreenStyle.imageContainerStyle}>
                        {
                            userImage != '' ? <Image source={{ uri: userImage }} style={TradersReviewAndRatingScreenStyle.userImageStyle} />
                                :
                                <View style={TradersReviewAndRatingScreenStyle.emptyUserMessageListImageStyle}>
                                    <Text style={TradersReviewAndRatingScreenStyle.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                </View>
                        }

                    </View>

                    <View>
                        <Text style={TradersReviewAndRatingScreenStyle.detailTitleTextStyle}>{firstName + ' ' + lastName}</Text>
                        <View style={TradersReviewAndRatingScreenStyle.detailTitleContainerStyle}>
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
                            <Text style={TradersReviewAndRatingScreenStyle.reviewDateTextStyle}>{Moment(item.createdAt).format('MMM DD, YYYY')}</Text>
                        </View>
                    </View>

                </View>
                <Text style={TradersReviewAndRatingScreenStyle.reviewDetailTextStyle}>{item.comments}</Text>


                {/* //Response View */}
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
                                style={[TradersReviewAndRatingScreenStyle.submitResponseButton]}>
                                <Text style={TradersReviewAndRatingScreenStyle.reviewButtonTextStyle}>Submit Response</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>

        );
    }
    onAddPropertySuccess() {
        if (this.props.profileReducer.addResponse) {
            if (this.props.profileReducer.addResponse.code == 200) {
                
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
                                    <Text style={TradersReviewAndRatingScreenStyle.reviewDetailTextStyle}>{item[0].response}</Text>
                                    <Text style={TradersReviewAndRatingScreenStyle.reviewDateTextStyle}>{Moment(item[0].createdDate).format(Strings.DATE_FORMATE)}</Text>
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
                            {
                                this.props.isUserProfile
                                ?
                                null
                                :
                                <TouchableOpacity style={TradersReviewAndRatingScreenStyle.wirteReviewButtonView} onPress={this.callWriteReview.bind(this)}>
                                    <View >
                                        <Text style={TradersReviewAndRatingScreenStyle.reviewButtonTextStyle}>Write a review</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                         

                        </View>
                    </CardView>
                </View>
                <Dropdown
                    label=''
                    labelHeight={5}
                    fontSize={14}
                    baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                    containerStyle={TradersReviewAndRatingScreenStyle.dropDownViewStyle}
                    data={data}
                    value={data[0].value}
                    onChangeText={this.onValueChanged.bind(this)}
                />


                {this.state.userReviewList.length > 0
                    ?
                    <FlatList
                        data={this.state.userReviewList}
                        extraData={this.state}
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
        getAllUserReviewsList,
        addResponse

    }

)(ReviewAndRatingScreen);
