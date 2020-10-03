import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    View,
    Text,
    Button,
    TouchableOpacity,
    AsyncStorage,
    Alert,
    Platform,
    TextInput,
    ScrollView,
    FlatList,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import TradersRequestDetailScreenStyle from './TradersRequestDetailScreenStyle';
//import listData from  '../../../../data';
import { connect } from 'react-redux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import { Dropdown } from 'react-native-material-dropdown';
import { CardViewWithLowMargin } from '../../CommonComponent/CardViewWithLowMargin';
import StarRating from 'react-native-star-rating';
import API from '../../../Constants/APIUrls'; import Moment from 'moment';
import {

    getUserReviewsList,

} from "../../../Action/ActionCreators";

import {

    showLoading,
    resetState,

} from "../../MaintenanceRequestComponent/MaintenanceRequestDetailsComponent/MaintenanceRequestDetailsAction";
let ref;
class TradersReviewAndRatingScreen extends Component {
    constructor() {
        super();
        this.state = {
            isShowMore: false,
            userReviewData: {},
            starCount: 3.5,
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
    componentDidMount() {
        if (this.props.reqDetailData.trader_id) {
            this.setState({ trader_id: this.props.reqDetailData.trader_id._id })
            this.callGetUserRating(this.props.reqDetailData.trader_id._id);
        }
    }
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    callDocumentView(docURL) {
        Actions.LAWebView({ docURL: docURL });

    }
    fileRenderItem({ item, index }) {
        var path = API.MAINTENANCE_IMAGE_PATH + item.path;

        return (
            // <View style={TradersRequestDetailScreenStyle.listContainerStyle}>
            <TouchableOpacity style={TradersRequestDetailScreenStyle.listContainerStyle} onPress={ref.callDocumentView.bind(ref, path)}>

                <View style={TradersRequestDetailScreenStyle.imageContainerStyle}>
                    <Image source={{ uri: path }} style={TradersRequestDetailScreenStyle.userImageStyle} />
                </View>

                <View style={{ justifyContent: 'center', }}>
                    <View style={TradersRequestDetailScreenStyle.detailTitleContainerStyle}>
                        <Text style={TradersRequestDetailScreenStyle.detailTitleTextStyle}>{item.path}</Text>
                        <Image source={ImagePath.BLUE_HEART} style={TradersRequestDetailScreenStyle.listImageStyle} />
                        <Image source={ImagePath.DOTS_ICON} style={TradersRequestDetailScreenStyle.listImageStyle} />
                    </View>

                </View>

            </TouchableOpacity>
        );
    }

    watcherRenderItem({ item, index }) {
        var watcherData = item.users_id;
        if (item) {

            return (
                <View style={TradersRequestDetailScreenStyle.listContainerStyle}>

                    <View style={TradersRequestDetailScreenStyle.imageContainerStyle}>
                        <Image source={{ uri: API.USER_IMAGE_PATH + watcherData.image }} style={TradersRequestDetailScreenStyle.watcherImageStyle} />
                    </View>

                    <View style={TradersRequestDetailScreenStyle.detailTitleContainerStyle}>
                        <Text style={TradersRequestDetailScreenStyle.watcherTitleTextStyle}>{watcherData.firstname + ' ' + watcherData.lastname}</Text>

                        {/* <Image source={ImagePath.DRAWER_CROSS_ICON} style={TradersRequestDetailScreenStyle.listImageStyle} /> */}
                    </View>


                </View>
            );
        } else {
            return null;
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
        this.props.resetState();


    }

    showHideMore() {
        if (this.state.isShowMore == false) {
            this.setState({ isShowMore: true });
        }
        else {
            this.setState({ isShowMore: false });
        }

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
    goToTraderProfile(id, averageRate) {

        Actions.TradersProfileScreen({ user_id: this.state.trader_id, averageRating: averageRate });

    }
    render() {
        let data = [{
            value: 'Tenant reviews',
        }];

        var traderImage = this.props.reqDetailData.trader_id ? this.props.reqDetailData.trader_id.image ? API.USER_IMAGE_PATH + this.props.reqDetailData.trader_id.image : '' : '';
        // let name = this.props.reqDetailData && this.props.reqDetailData.created_by && this.props.reqDetailData.created_by != null && this.props.reqDetailData.created_by.firstname ? this.props.reqDetailData.created_by.firstname : "" + ' ' + (this.props.reqDetailData.created_by ? this.props.reqDetailData.created_by.lastname : false) ? this.props.reqDetailData.created_by.lastname : ""
        let firstname = this.props.reqDetailData && this.props.reqDetailData.created_by ? this.props.reqDetailData.created_by.firstname : ""
        let lastname = this.props.reqDetailData && this.props.reqDetailData.created_by ? this.props.reqDetailData.created_by.lastname : ""
        let name = (firstname ? firstname : "") + ' ' + (lastname ? lastname : "")
        var averagerate = this.state.userReviewData.data ? this.state.userReviewData.data : 0;
        var totalreviews = this.state.userReviewData.total_review ? this.state.userReviewData.total_review : 0;
        var uploadedImages = this.props.reqDetailData.images ? this.props.reqDetailData.images : [];
        console.log(this.props.reqDetailData.created_by, "this.props.reqDetailData.created_by")
        return (
            <ScrollView>
                {this.props.reqDetailData._id &&
                    <View style={{ backgroundColor: 'white', padding: 5 }}>
                        <Text style={{ padding: 5, paddingTop: 0 }}>Created By : {name}</Text>
                        <Text style={{ padding: 5 }}>Created Date: {Moment(this.props.reqDetailData.createdAt).format('lll')}</Text>
                        <Text style={{ padding: 5 }}>Due Date : {Moment(this.props.reqDetailData.due_date).format('lll')}</Text>

                    </View>
                }
                <View>
                    <CardViewWithLowMargin>
                        <Text numberOfLines={(this.state.isShowMore == false) ? 6 : null} style={TradersRequestDetailScreenStyle.aboutRequestDetailTextStyle}>{this.props.reqDetailData.request_detail}</Text>
                        {
                            this.props.reqDetailData.request_detail.length > 100
                                ?
                                <TouchableOpacity onPress={this.showHideMore.bind(this)}>
                                    <Text style={TradersRequestDetailScreenStyle.loadMoreTextStyle}>
                                        {(this.state.isShowMore == false) ? 'Show more' : 'Show less'}
                                    </Text>
                                </TouchableOpacity>
                                : null
                        }

                    </CardViewWithLowMargin>
                </View>


                <View>
                    <CardViewWithLowMargin>
                        <Text style={TradersRequestDetailScreenStyle.fileTitleTextStyle}>Files Attached</Text>
                        <View style={TradersRequestDetailScreenStyle.tileListContainerStyle} >
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
                        <View style={TradersRequestDetailScreenStyle.priceContainerStyle}>
                            <Text style={TradersRequestDetailScreenStyle.priceTextStyle}>${this.props.reqDetailData.budget}</Text>
                            <Text style={TradersRequestDetailScreenStyle.daysTextStyle}>{Moment(this.props.reqDetailData.completed_date).fromNow()}</Text>
                        </View>
                    </CardViewWithLowMargin>
                </View>


                {/* <View>
                    <CardViewWithLowMargin>
                        <View style={TradersRequestDetailScreenStyle.userRatingContainer}>

                            <View>
                                <Text style={TradersRequestDetailScreenStyle.ratingTitleTextStyle}>By Jerome Thompson</Text>
                                <View style={TradersRequestDetailScreenStyle.ratingStarContainerStyle}>
                                    <StarRating
                                        disabled={true}
                                        maxStars={5}
                                        starSize={20}
                                        starStyle={{ paddingRight: 5, marginTop: 8 }}
                                        emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                        fullStarColor={Colors.STAR_COLOR}
                                        starColor={Colors.STAR_COLOR}
                                        halfStarColor={Colors.STAR_COLOR}
                                        rating={ref.state.starCount}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />
                                </View>
                                <Text style={TradersRequestDetailScreenStyle.ratingReviewTextStyle}>{averagerate + ' ' + 'from' + ' ' + totalreviews + ' ' + 'reviews'}</Text>

                                {/* <Text style={TradersRequestDetailScreenStyle.ratingReviewTextStyle}>{'3.5 from 150 reviews'}</Text> */}
                {/* </View> */}
                {/* <View style={TradersRequestDetailScreenStyle.ratingImageContainerStyle}>
                        //     <TouchableOpacity >
                        //         <Image source={ImagePath.USER_DEFAULT} style={TradersRequestDetailScreenStyle.ratingImageStyle} />
                        //     </TouchableOpacity>
                        //     <View style={TradersRequestDetailScreenStyle.statusViewStyle} />
                        // </View> */}

                {/* <View style={TradersRequestDetailScreenStyle.ratingImageContainerStyle}>

                                {traderImage != '' ? <Image source={{ uri: traderImage }} style={TradersRequestDetailScreenStyle.ratingImageStyle} />
                                    :
                                    <View style={TradersRequestDetailScreenStyle.emptyUserListImageStyle}>
                                        <Text style={TradersRequestDetailScreenStyle.initialTextStyle}>{this.props.reqDetailData.trader_id.firstname.charAt(0).toUpperCase() + ' ' + this.props.reqDetailData.trader_id.lastname.charAt(0).toUpperCase()}</Text>
                                    </View>
                                }
                                <View style={TradersRequestDetailScreenStyle.statusViewStyle} />
                            </View>


                        </View>
                    </CardViewWithLowMargin>
                </View> */}

                {
                    this.props.reqDetailData.trader_id ?
                        <TouchableOpacity onPress={() => this.goToTraderProfile(this.props.reqDetailData.trader_id._id, averagerate)}>
                            <CardViewWithLowMargin>
                                <View style={TradersRequestDetailScreenStyle.userRatingContainer}>

                                    <View>
                                        <Text style={TradersRequestDetailScreenStyle.ratingTitleTextStyle}>{this.props.reqDetailData.trader_id.firstname + ' ' + this.props.reqDetailData.trader_id.lastname}</Text>
                                        <View style={TradersRequestDetailScreenStyle.ratingStarContainerStyle}>
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
                                        <Text style={TradersRequestDetailScreenStyle.ratingReviewTextStyle}>{averagerate + ' ' + 'from' + ' ' + totalreviews + ' ' + 'reviews'}</Text>
                                    </View>
                                    <View style={TradersRequestDetailScreenStyle.ratingImageContainerStyle}>
                                        {traderImage != '' ? <Image source={{ uri: traderImage }} style={TradersRequestDetailScreenStyle.ratingImageStyle} />
                                            :
                                            <View style={TradersRequestDetailScreenStyle.emptyUserListImageStyle}>
                                                <Text style={TradersRequestDetailScreenStyle.initialTextStyle}>{this.props.reqDetailData.trader_id.firstname.charAt(0).toUpperCase() + ' ' + this.props.reqDetailData.trader_id.lastname.charAt(0).toUpperCase()}</Text>
                                            </View>
                                        }
                                        <View style={TradersRequestDetailScreenStyle.statusViewStyle} />
                                    </View>

                                </View>
                            </CardViewWithLowMargin>
                        </TouchableOpacity> : null

                }
                {/* <View>
                    <CardViewWithLowMargin>
                        <Text style={TradersRequestDetailScreenStyle.titleTextStyle}>Watcher</Text>
                        <View style={TradersRequestDetailScreenStyle.tileListContainerStyle} >
                            {
                                (this.props.reqDetailData.watchers_list && this.props.reqDetailData.watchers_list.length) > 0 ?
                                    this.props.reqDetailData.watchers_list.map(item => {
                                        if (item) {
                                            var watcherData = item.users_id;
                                            console.log(watcherData, item, "watcherDatawatcherData")
                                            if (watcherData)
                                                return (
                                                    <View style={TradersRequestDetailScreenStyle.listContainerStyle}>
                                                        <View style={TradersRequestDetailScreenStyle.imageContainerStyle}>
                                                            <Image source={{ uri: API.USER_IMAGE_PATH + watcherData.image }} style={TradersRequestDetailScreenStyle.watcherImageStyle} />
                                                        </View>
                                                        <View style={TradersRequestDetailScreenStyle.detailTitleContainerStyle}>
                                                            <Text style={TradersRequestDetailScreenStyle.watcherTitleTextStyle}>{watcherData.firstname + ' ' + watcherData.lastname}</Text>
                                                        </View>
                                                    </View>
                                                )
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

)(TradersReviewAndRatingScreen)

