
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
    Dimensions
} from 'react-native';
import { SkypeIndicator } from 'react-native-indicators';

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import TradersScreenStyle from './TradersScreenStyle';
//import listData from  '../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import API from '../../Constants/APIUrls';
import { CardView } from '../CommonComponent/CardView';
import StarRating from 'react-native-star-rating';
import * as Progress from 'react-native-progress';
import FilterScreen from './TraderFilterComponent/FilterScreen';
import {
    addUserToFav,
    getFavTradersList,
    getTradersList,
} from "../../Action/ActionCreators";
import {

    showLoading,
    resetState,
    clearTraderListRes,
    callTraderListOnClearFilter
} from "./TradersAction";
import {

    updateRating
} from "../WriteReviewComponent/WriteReviewAction";
const window = Dimensions.get('window');
let ref;
class TradersScreen extends Component {
    constructor() {
        super();
        ref = this;

        this.state = {
            isTabSelected: true,
            responseData: {},
            traderListData: [],
            starCount: 0,
            isFilter: false,
            seed: 1,
            page: 0, fetchingStatus: true,
            setOnLoad: false,
            isLoading: false,
            isRefreshing: false, maxPage: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tradersReducer.isFilterClearCall == 'Yes') {
            if (this.state.isTabSelected == true) {
                this.callGetTradersList();
            }
            else if (this.state.isTabSelected == false) {
                this.callGetFavTradersList();
            }
            this.props.callTraderListOnClearFilter('');
        }

        if (nextProps.writeReviewReducer.isRatingUpdate != '') {
            this.callGetTradersList();
            //this.props.updateRating('');
        }
    }

    componentDidUpdate() {
        this.onSuccess();
        this.onGetFavTraderSuccess();
        this.onAddUserFavSuccess();
    }

    componentWillUnmount() {

    }


    componentWillMount() {

        this.callGetTradersList();
    }

    callSendMessageScreen(item) {

        Actions.MessageToTraderScreen({ userFirstName: item.firstname, userLastName: item.lastname, receiverId: item._id });
    }

    callAddAsFav(userId, favStatus) {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    fav_by: userData.data._id,
                    fav_to: userId,
                    fav_status: favStatus
                }
                this.props.showLoading();
                this.props.addUserToFav(authToken, postData);
            }
        }).done();

    }

    callAddFavUserClick(userid, favStatus) {

        this.callAddAsFav(userid, favStatus);
    }

    onAddUserFavSuccess() {

        if (this.props.tradersReducer.addUserFavRes != '') {

            if (this.props.tradersReducer.addUserFavRes.code == 200) {
                if (this.state.isTabSelected == true) {
                    this.callGetTradersList();
                }
                else if (this.state.isTabSelected == false) {
                    this.callGetFavTradersList();
                }
            }
            else {
                alert(this.props.tradersReducer.addUserFavRes.message);
            }
            this.props.resetState();
        }
    }

    onFilterClick() {

        if (this.state.isFilter) {

            this.setState({ isFilter: false });
        }
        else {

            this.setState({ isFilter: true });
        }
    }

    onAllTabClick() {

        this.setState({ isTabSelected: true });
        this.callGetTradersList();
    }
    onSavedTabClick() {

        this.setState({ isTabSelected: false });
        this.callGetFavTradersList();
    }
    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    callTradersProfileScreen(id, averageRate, totalReviewLength) {
        // alert(totalReviewLength)
        Actions.TradersProfileScreen({ user_id: id, averageRating: averageRate, totalReviewLengthrating: totalReviewLength });
    }

    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.SERVICE_TRADERS}</Text>
            </View>
        );
    }

    renderImageItem(item, index) {
        return (
            <Image source={{ uri: item.url }} style={TradersScreenStyle.userListImageStyle} />
        );
    }

    callGetFavTradersList() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    user_id: userData.data._id,
                }
                this.props.showLoading();
                this.props.getFavTradersList(authToken, postData);
            }
        }).done();
    }

    onGetFavTraderSuccess() {
        if (this.props.tradersReducer.favTraderListRes != '') {
            if (this.props.tradersReducer.favTraderListRes.code == 200) {
                this.setState({ responseData: this.props.tradersReducer.favTraderListRes });

            }
            else {
                alert(this.props.tradersReducer.favTraderListRes.message);
            }
            this.props.resetState();
        }
    }

    reCall = () => {
        if (this.state.page <= this.state.maxPage) {
            this.callGetTradersList();
        }
        else {
            this.setState({ fetchingStatus: false })

        }

    }
    callGetTradersList() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    user_id: userData.data._id,
                    number_of_pages: 10,
                    page_number: this.state.page

                }
                // this.props.showLoading();
                this.props.getTradersList(authToken, postData);
            }
        }).done();

    }
    renderFacilityView(index) {
        // alert(JSON.stringify(this.state.traderListData[1]))
        var categoryIDs = this.state.traderListData[index].categories_id;
        var categoryLength = (categoryIDs != undefined) ? ((categoryIDs.length > 0) ? categoryIDs.length : 0) : 0;

        if (categoryLength == 1) {
            return (
                <View style={TradersScreenStyle.listTagViewContainer}>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.traderListData[index].categories_id[0].name}</Text>
                    </View>
                </View>
            );
        }
        else if (categoryLength == 2) {
            return (
                <View style={TradersScreenStyle.listTagViewContainer}>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.traderListData[index].categories_id[0].name}</Text>
                    </View>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.traderListData[index].categories_id[1].name}</Text>
                    </View>

                </View>


            );
        }
        else if (categoryLength == 3) {
            return (
                <View style={TradersScreenStyle.listTagViewContainer}>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.traderListData[index].categories_id[0].name}</Text>
                    </View>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.traderListData[index].categories_id[1].name}</Text>
                    </View>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.traderListData[index].categories_id[2].name}</Text>
                    </View>
                </View>


            );
        }
    }


    BottomView = () => {
        return (
            <View>
                {this.state.fetchingStatus ?
                    <SkypeIndicator color={'#4ECEA1'} style={{ alignSelf: 'center', }} size={50} />
                    : null}
            </View>
        )
    }


    renderFacilityView2(index) {
        var categoryIDs = this.state.traderListData[index].categories_id;
        var categoryLength = (categoryIDs != undefined) ? ((categoryIDs.length > 0) ? categoryIDs.length : 0) : 0;
        if (categoryLength == 4) {
            return (
                <View style={TradersScreenStyle.listTagViewContainer}>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.traderListData[index].categories_id[3].name}</Text>
                    </View>
                </View>
            );
        }
        else if (categoryLength == 5) {
            return (
                <View style={TradersScreenStyle.listTagViewContainer}>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.traderListData[index].categories_id[4].name}</Text>
                    </View>

                    {
                        this.state.traderListData[index].categories_id.length > 4 ?
                            <View style={TradersScreenStyle.tagViewStyle}>
                                <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.traderListData[index].categories_id.length - 4}</Text>
                            </View>
                            :
                            null
                    }


                </View>
            );
        }
        else if (categoryLength == 3) {
            return (
                <View style={TradersScreenStyle.listTagViewContainer}>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.traderListData[index].categories_id[0].name}</Text>
                    </View>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.traderListData[index].categories_id[1].name}</Text>
                    </View>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.traderListData[index].categories_id[2].name}</Text>
                    </View>
                </View>
            );
        }
    }

    onSuccess() {
        if (this.props.tradersReducer.tradersListResponse != '') {
            if (this.props.tradersReducer.tradersListResponse.code == 200) {
                alert("length " + this.props.tradersReducer.tradersListResponse.data.length)
                if (this.props.tradersReducer.tradersListResponse.data.length === 0) {
                    this.setState({ traderListData: this.state.traderListData, fetchingStatus: false, responseData: this.state.responseData })
                }
                else {
                    let addedData = [];
                    this.props.tradersReducer.tradersListResponse.data.map((res) => {
                        this.state.traderListData.push(res);

                        addedData.push(res);
                    })
                    // this.state.traderListData.push(addedData);
                    // this.state.responseData.push();
                    this.setState({ traderListData: this.state.traderListData, maxPage: this.props.tradersReducer.tradersListResponse.totalCount, fetchingStatus: true, responseData: this.props.tradersReducer.tradersListResponse }
                        // ,()=>
                        // alert("ttt "+JSON.stringify(this.state.traderListData.length))
                    );
                }
            }
            else {
                alert(this.props.tradersReducer.tradersListResponse.message);
            }
            this.props.clearTraderListRes();
        }
    }

    renderItem({ item, index }) {
        // alert(JSON.stringify(item.data))

        // let item = dd.data;
        // var item = data.data;
        var userImagePath = item.data.image ? API.USER_IMAGE_PATH + item.data.image : '';
        var firstName = item.data.firstname ? item.data.firstname : '';
        var lastName = item.data.lastname ? item.data.lastname : '';
        var averageRate = item.data.averageRate ? item.data.averageRate : 0;
        var totalReview = item.data.totalReviewLength ? item.data.totalReviewLength : 0;
        return (

           

            <CardView>
                <View style={TradersScreenStyle.listItemContainer}>
                    <View style={TradersScreenStyle.listImageContainerStyle}>
                        <TouchableOpacity onPress={ref.callTradersProfileScreen.bind(ref, item.data._id, averageRate, totalReview)} >
                            {
                                userImagePath != '' ?
                                 <Image source={{ uri: userImagePath }} style={TradersScreenStyle.listImageStyle} />
                                    :
                                    <View style={TradersScreenStyle.emptyUserListImageStyle}>
                                        <Text style={CommonStyles.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                    </View>
                            }
                        </TouchableOpacity>
                        {item.data.is_online ?
                            <View style={TradersScreenStyle.onLineStatusViewStyle} />
                            :
                            <View style={TradersScreenStyle.statusViewStyle} />
                        }
                    </View>

                    <Text style={TradersScreenStyle.listTitleTextStyle}>{firstName + ' ' + lastName}</Text>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        starSize={20}
                        starStyle={{ paddingLeft: 2, paddingRight: 2, marginTop: 8 }}
                        fullStarColor={Colors.STAR_COLOR}
                        starColor={Colors.STAR_COLOR}
                        halfStarColor={Colors.STAR_COLOR}
                        rating={averageRate}
                        selectedStar={(rating) => ref.onStarRatingPress(rating)}
                    />
                    {/* <Text numberOfLines={4} style={TradersScreenStyle.listReviewTextStyle}>{item.about_user}</Text> */}

                    <View style={TradersScreenStyle.listTagViewMainContainer}>
                        {
                            ref.renderFacilityView(index)

                        }
                        {
                            ref.renderFacilityView2(index)
                        }

                    </View>
                    <TouchableOpacity onPress={ref.callSendMessageScreen.bind(ref, item.data)} >
                        <View style={TradersScreenStyle.roundedBlueMessageButtonStyle}>
                            <Text style={TradersScreenStyle.messageButtonTextStyle}>
                                {Strings.SEND_MESSAGE}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={TradersScreenStyle.likeImageViewStyle} onPress={() => ref.callAddFavUserClick(item.data._id, item.data.is_fav == 2 ? 1 : 2)}>
                        <Image source={(item.data.is_fav == 2) ? ImagePath.HEART_OUTLINE : ImagePath.BLUE_HEART} />
                    </TouchableOpacity>
                </View>
            </CardView>
        );
    }



    render() {
        let data = [{
            value: 'By best match',
        }];
        var dataList = (this.state.traderListData.length > 0 ? this.state.traderListData : [])
        // alert(this.state.responseData)
        return (
            <View style={CommonStyles.listMainContainerStyle}>
                {this.navBar()}
                <TouchableOpacity onPress={() => this.onFilterClick()} >
                    <View style={TradersScreenStyle.refineResultContainerStyle}>
                        <View>
                            <Text style={TradersScreenStyle.refineResultTextStyle}>{Strings.TRADER_SEARCH}</Text>
                            <View style={TradersScreenStyle.refineResultBottomBarStyle} />
                        </View>
                        {this.state.isFilter ? <Image source={ImagePath.ARROW_DOWN} style={TradersScreenStyle.refineResultArrowUpStyle} />
                            : <Image source={ImagePath.ARROW_DOWN} style={TradersScreenStyle.refineResultArrowStyle} />
                        }

                    </View>
                </TouchableOpacity>
                <View style={TradersScreenStyle.tabContainerStyle}>

                    <TouchableOpacity onPress={() => this.onAllTabClick()} >
                        <View >
                            <View style={TradersScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected) ? TradersScreenStyle.tabLabelTextStyle : TradersScreenStyle.tabLabelDiselectTextStyle}>{Strings.ALL}</Text>
                            </View>
                            {this.state.isTabSelected ? <View style={TradersScreenStyle.tabIndicatorStyle}></View> : <View style={TradersScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onSavedTabClick()}>
                        <View>
                            <View style={TradersScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == false) ? TradersScreenStyle.tabLabelTextStyle : TradersScreenStyle.tabLabelDiselectTextStyle}>{Strings.SAVED}</Text>
                            </View>
                            {(this.state.isTabSelected == false) ? <View style={TradersScreenStyle.tabIndicatorStyle}></View> : <View style={TradersScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>
                    </TouchableOpacity>

                </View>

                <ScrollView contentContainerStyle={CommonStyles.flatListStyle}>
                    {this.state.isFilter ?
                                    <FilterScreen /> 
                        : null 
                    }
                    {
                        dataList.length > 0 ?
                            <FlatList
                            style={{flex:1}}
                                contentContainerStyle={[CommonStyles.flatListStyle]}
                                keyExtractor={(item, index) => index}
                                data={dataList}
                                renderItem={this.renderItem}
                                extraData={this.state}
                                // initialNumToRender={10}
                                //maxToRenderPerBatch={0}
                                onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 0.01}

                                // onEndReachedThreshold={0.1}
                                onEndReached={({ distanceFromEnd }) => {
                                    this.state.fetchingStatus ? this.setState({ page: this.state.page + 1 }, () => this.reCall()) : null
                                }}
                                ListFooterComponent={this.BottomView}
                            // scrollEventThrottle={1000}
                            />

                            :
                            <View style={{ flex: 1, justifyContent: 'center', marginTop: window.height * 0.25 }}>
                                <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.TRADER_NOT_FOUND}</Text>
                            </View>
                    }
                </ScrollView>

                {/* </View> */}

                {

                    this.props.tradersReducer.isScreenLoading ?
                        <View style={CommonStyles.circles}>
                            <Progress.CircleSnail color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]} />
                        </View>
                        : null

                }
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
        addUserToFav,
        getFavTradersList,
        getTradersList,
        showLoading,
        resetState,
        clearTraderListRes,
        callTraderListOnClearFilter,
        updateRating
    }

)(TradersScreen);

