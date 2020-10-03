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

} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,

} from "./MaintenanceRequestDetailsAction";

import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import RequestDetailScreenStyle from './RequestDetailScreenStyle';

import CommonStyles from '../../../CommonStyle/CommonStyle';
import { Dropdown } from 'react-native-material-dropdown';
import { CardViewWithLowMargin } from '../../CommonComponent/CardViewWithLowMargin';
import StarRating from 'react-native-star-rating';
import API from '../../../Constants/APIUrls';
import Moment from 'moment';
let ref;
class RequestDetailScreen extends Component {
    constructor() {
        super();
        this.state = {
            isShowMore: false,
            trader_id: 0,
            imgErr: false,
            userReviewData: {},
        };
        ref = this;
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onGetUserRatingSuccess();
    }

    componentWillUnmount() {

    }

    componentWillMount() {
        if (this.props.reqDetailData.trader_id) {
            this.setState({ trader_id: this.props.reqDetailData.trader_id._id })
            this.callGetUserRating(this.props.reqDetailData.trader_id._id);
        }
    }

    fileRenderItem({ item, index }) {
        var path = API.MAINTENANCE_IMAGE_PATH + item.path;

        // alert(path);
        return (
            <TouchableOpacity style={RequestDetailScreenStyle.listContainerStyle} onPress={ref.callDocumentView.bind(ref, path)}>

                <View style={RequestDetailScreenStyle.imageContainerStyle}>
                    <Image source={{ uri: path }} style={RequestDetailScreenStyle.userImageStyle} />
                </View>

                <View style={{ justifyContent: 'center', }}>
                    <View style={RequestDetailScreenStyle.detailTitleContainerStyle}>
                        <Text style={RequestDetailScreenStyle.detailTitleTextStyle}>{item.path}</Text>

                        {/*<Image source={ImagePath.DOTS_ICON} style={RequestDetailScreenStyle.listImageStyle} />*/}
                    </View>

                </View>

            </TouchableOpacity>
        );
    }

    watcherRenderItem = ({ item, index }) => {

        if (item) {
            var watcherData = item.users_id;

            return (
                <View style={RequestDetailScreenStyle.listContainerStyle}>
                    {watcherData.image ?
                        <View style={RequestDetailScreenStyle.imageContainerStyle}>
                            <Image onError={({ nativeEvent: { error } }) => {
                                this.setState({ imgErr: item })
                            }} source={{ uri: API.USER_IMAGE_PATH + watcherData.image }} style={RequestDetailScreenStyle.watcherImageStyle} />
                        </View>
                        :
                        <View style={RequestDetailScreenStyle.emptyUserListImageStyle2}>
                            <Text style={RequestDetailScreenStyle.initialTextStyle2}>{watcherData.firstname.charAt(0).toUpperCase() + ' ' + watcherData.lastname.charAt(0).toUpperCase()}</Text>
                        </View>
                    }
                    <View style={RequestDetailScreenStyle.detailTitleContainerStyle}>
                        <Text style={RequestDetailScreenStyle.watcherTitleTextStyle}>{watcherData.firstname + ' ' + watcherData.lastname}</Text>
                        {/* <Image source={ImagePath.DOTS_ICON} style={RequestDetailScreenStyle.listImageStyle} /> */}
                    </View>
                </View>
            );
        }
    }

    showHideMore() {
        if (this.state.isShowMore == false) {
            this.setState({ isShowMore: true });
        }
        else {
            this.setState({ isShowMore: false });
        }

    }

    callGetUserRating(traderId) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;


                this.props.showLoading();
                this.props.getUserReviewsList(authToken, traderId);
            }
        }).done();

    }

    onGetUserRatingSuccess() {

        if (this.props.maintenanceRequestDetailsReducer.userReviewRes != '') {
            if (this.props.maintenanceRequestDetailsReducer.userReviewRes.code == 200) {

                this.setState({ userReviewData: this.props.maintenanceRequestDetailsReducer.userReviewRes });
            }
            else {
                // alert(this.props.profileReducer.userReviewRes.message);
            }
            this.props.resetState();
        }
    }
    callDocumentView(docURL) {
    
       Actions.LAWebView({ docURL: docURL });

    }
    goToTraderProfile(id, averageRate) {

        Actions.TradersProfileScreen({ user_id: this.state.trader_id, averageRating: averageRate });

    }
    render() {
        var uploadedImages = this.props.reqDetailData.images ? this.props.reqDetailData.images : [];
        var traderImage = this.props.reqDetailData.trader_id ? this.props.reqDetailData.trader_id.image ? API.USER_IMAGE_PATH + this.props.reqDetailData.trader_id.image : '' : '';
        var averagerate = this.state.userReviewData.data ? this.state.userReviewData.data : 0;
        var totalreviews = this.state.userReviewData.total_review ? this.state.userReviewData.total_review : 0;
        return (
            <ScrollView>
                <View style={{ backgroundColor: 'white', padding: 5 }}>
                    <Text style={{ padding: 5, paddingTop: 0 }}>Created By : {this.props.reqDetailData && this.props.reqDetailData.created_by && this.props.reqDetailData.created_by.firstname ? this.props.reqDetailData.created_by.firstname : "" + ' ' + (this.props.reqDetailData.created_by && this.props.reqDetailData.created_by.lastname) ? this.props.reqDetailData.created_by.lastname : ""}</Text>
                    <Text style={{ padding: 5 }}>Created Date: {Moment(this.props.reqDetailData.createdAt).format('lll')}</Text>
                    <Text style={{ padding: 5 }}>Due Date : {Moment(this.props.reqDetailData.due_date).format('lll')}</Text>

                </View>
                <View>
                    <CardViewWithLowMargin>
                        <Text numberOfLines={(this.state.isShowMore == false) ? 6 : null} style={RequestDetailScreenStyle.aboutRequestDetailTextStyle}>{this.props.reqDetailData.request_detail}</Text>
                        {
                            this.props.reqDetailData.request_detail.length > 100
                                ?
                                <TouchableOpacity onPress={this.showHideMore.bind(this)}>
                                    <Text style={RequestDetailScreenStyle.loadMoreTextStyle}>
                                        {(this.state.isShowMore == false) ? 'Show more' : 'Show less'}
                                    </Text>
                                </TouchableOpacity>
                                : null
                        }

                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        <Text style={RequestDetailScreenStyle.fileTitleTextStyle}>Files Attached</Text>
                        <View style={RequestDetailScreenStyle.tileListContainerStyle} >
                            {
                                uploadedImages.length > 0 ?
                                    <FlatList
                                        horizontal={false}
                                        data={uploadedImages}
                                        renderItem={this.fileRenderItem}
                                        extraData={this.state}
                                    /> : null
                            }
                        </View>
                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        <View style={RequestDetailScreenStyle.priceContainerStyle}>
                            <Text style={RequestDetailScreenStyle.priceTextStyle}>${this.props.reqDetailData.budget}</Text>
                            <Text style={RequestDetailScreenStyle.daysTextStyle}>{this.props.reqDetailData.due_date != null ? Moment(this.props.reqDetailData.due_date).fromNow() : ''}</Text>
                        </View>
                    </CardViewWithLowMargin>
                </View>
                {
                    this.props.reqDetailData.trader_id ?
                        <TouchableOpacity onPress={() => this.goToTraderProfile(this.props.reqDetailData.trader_id._id, averagerate)}>
                            <CardViewWithLowMargin>
                                <View style={RequestDetailScreenStyle.userRatingContainer}>

                                    <View>
                                        <Text style={RequestDetailScreenStyle.ratingTitleTextStyle}>{this.props.reqDetailData.trader_id.firstname + ' ' + this.props.reqDetailData.trader_id.lastname}</Text>
                                        <View style={RequestDetailScreenStyle.ratingStarContainerStyle}>
                                            <StarRating
                                                disabled={true}
                                                maxStars={5}
                                                starSize={20}
                                                starStyle={{ paddingRight: 5, marginTop: 8 }}
                                                emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                                fullStarColor={'red'}
                                                halfStarColor={Colors.STAR_COLOR}
                                                rating={averagerate}
                                                starColor={Colors.STAR_COLOR}
                                            />
                                        </View>
                                        <Text style={RequestDetailScreenStyle.ratingReviewTextStyle}>{averagerate + ' ' + 'from' + ' ' + totalreviews + ' ' + 'reviews'}</Text>
                                    </View>
                                    <View style={RequestDetailScreenStyle.ratingImageContainerStyle}>
                                        {traderImage != '' ? <Image source={{ uri: traderImage }} style={RequestDetailScreenStyle.ratingImageStyle} />
                                            :
                                            <View style={RequestDetailScreenStyle.emptyUserListImageStyle}>
                                                <Text style={RequestDetailScreenStyle.initialTextStyle}>{this.props.reqDetailData.trader_id.firstname.charAt(0).toUpperCase() + ' ' + this.props.reqDetailData.trader_id.lastname.charAt(0).toUpperCase()}</Text>
                                            </View>
                                        }
                                        <View style={RequestDetailScreenStyle.statusViewStyle} />
                                    </View>

                                </View>
                            </CardViewWithLowMargin>
                        </TouchableOpacity> : null

                }

                {/* <View>
                    <CardViewWithLowMargin>
                        <Text style={RequestDetailScreenStyle.titleTextStyle}>Watcher</Text>
                        <View style={RequestDetailScreenStyle.tileListContainerStyle} >
                           
                            {
                                (this.props.reqDetailData && this.props.reqDetailData.watchers_list && this.props.reqDetailData.watchers_list != {} && this.props.reqDetailData.watchers_list.length > 0) ?
                                    this.props.reqDetailData.watchers_list.map(item => {
                                        if (item) {
                                            var watcherData = item.users_id;
                                            console.log(watcherData,item, "watcherDatawatcherData")
                                            if (watcherData)

                                                return (
                                                    <View style={RequestDetailScreenStyle.listContainerStyle}>
                                                        {watcherData.image ?
                                                            <View style={RequestDetailScreenStyle.imageContainerStyle}>
                                                                <Image onError={({ nativeEvent: { error } }) => {
                                                                    this.setState({ imgErr: item })
                                                                }} source={{ uri: API.USER_IMAGE_PATH + watcherData.image }} style={RequestDetailScreenStyle.watcherImageStyle} />
                                                            </View>
                                                            :
                                                            <View style={RequestDetailScreenStyle.emptyUserListImageStyle2}>
                                                                <Text style={RequestDetailScreenStyle.initialTextStyle2}>{watcherData.firstname.charAt(0).toUpperCase() + ' ' + watcherData.lastname.charAt(0).toUpperCase()}</Text>
                                                            </View>
                                                        }
                                                        <View style={RequestDetailScreenStyle.detailTitleContainerStyle}>
                                                            <Text style={RequestDetailScreenStyle.watcherTitleTextStyle}>{watcherData.firstname + ' ' + watcherData.lastname}</Text>
                                                        </View>
                                                    </View>
                                                );
                                        }
                                    })
                                    : null
                            }
                        </View>
                    </CardViewWithLowMargin>
                </View> */}

            </ScrollView>

        );
    }
}

function mapStateToProps(state) {


    return {

        maintenanceRequestDetailsReducer: state.maintenanceRequestDetailsReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getUserReviewsList,
        showLoading,
        resetState,
    }

)(RequestDetailScreen);


