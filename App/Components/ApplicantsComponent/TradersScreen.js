
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
            starCount: 0,
            isFilter: false,
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
        Actions.TradersProfileScreen({ user_id: id, averageRating: averageRate, totalReviewLengthrating: totalReviewLength });
    }

    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.APPLICANT}</Text>
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

    callGetTradersList() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                    user_id: userData.data._id,
                }
                this.props.showLoading();
                this.props.getTradersList(authToken, postData);
            }
        }).done();
    }
    renderFacilityView(index) {
        
        var categoryIDs = this.state.responseData.data[index].categories_id;
        var categoryLength = (categoryIDs != undefined) ? ((categoryIDs.length > 0) ? categoryIDs.length : 0) : 0;

        if (categoryLength == 1) {
            return (
                <View style={TradersScreenStyle.listTagViewContainer}>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.responseData.data[index].categories_id[0].name}</Text>
                    </View>
                </View>
            );
        }
        else if (categoryLength == 2) {
            return (
                <View style={TradersScreenStyle.listTagViewContainer}>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.responseData.data[index].categories_id[0].name}</Text>
                    </View>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.responseData.data[index].categories_id[1].name}</Text>
                    </View>

                </View>


            );
        }
        else if (categoryLength == 3) {
            return (
                <View style={TradersScreenStyle.listTagViewContainer}>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.responseData.data[index].categories_id[0].name}</Text>
                    </View>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.responseData.data[index].categories_id[1].name}</Text>
                    </View>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.responseData.data[index].categories_id[2].name}</Text>
                    </View>
                </View>


            );
        }
    }
    renderFacilityView2(index) {
        var categoryIDs = this.state.responseData.data[index].categories_id;
        var categoryLength = (categoryIDs != undefined) ? ((categoryIDs.length > 0) ? categoryIDs.length : 0) : 0;
        if (categoryLength == 4) {
            return (
                <View style={TradersScreenStyle.listTagViewContainer}>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.responseData.data[index].categories_id[3].name}</Text>
                    </View>
                </View>
            );
        }
        else if (categoryLength == 5) {
            return (
                <View style={TradersScreenStyle.listTagViewContainer}>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.responseData.data[index].categories_id[4].name}</Text>
                    </View>

                    {
                        this.state.responseData.data[index].categories_id.length > 4 ?
                            <View style={TradersScreenStyle.tagViewStyle}>
                                <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.responseData.data[index].categories_id.length - 4}</Text>
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
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.responseData.data[index].categories_id[0].name}</Text>
                    </View>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.responseData.data[index].categories_id[1].name}</Text>
                    </View>
                    <View style={TradersScreenStyle.tagViewStyle}>
                        <Text style={TradersScreenStyle.tagViewTextStyle}>{this.state.responseData.data[index].categories_id[2].name}</Text>
                    </View>
                </View>


            );
        }
    }
    onSuccess() {
        if (this.props.tradersReducer.tradersListResponse != '') {
            if (this.props.tradersReducer.tradersListResponse.code == 200) {
                this.setState({ responseData: this.props.tradersReducer.tradersListResponse });
            }
            else {
                alert(this.props.tradersReducer.tradersListResponse.message);
            }
            this.props.clearTraderListRes();
        }
    }

    renderItem({ item, index }) {
        var userImagePath = item.image ? API.USER_IMAGE_PATH + item.image : '';
        var firstName = item.firstname ? item.firstname : '';
        var lastName = item.lastname ? item.lastname : '';
        var averageRate = item.averageRate ? item.averageRate : 0;
        var totalReview = item.totalReviewLength ? item.totalReviewLength : 0;
        return (

            <CardView>
                <View style={TradersScreenStyle.listItemContainer}>

                    <View style={TradersScreenStyle.listImageContainerStyle}>
                        <TouchableOpacity onPress={ref.callTradersProfileScreen.bind(ref, item._id, averageRate, totalReview)} >

                            {
                                userImagePath != '' ? <Image source={{ uri: userImagePath }} style={TradersScreenStyle.listImageStyle} />
                                    :
                                    <View style={TradersScreenStyle.emptyUserListImageStyle}>
                                        <Text style={CommonStyles.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                    </View>
                            }

                        </TouchableOpacity>
                        {item.is_online ?
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
                    <Text numberOfLines={4} style={TradersScreenStyle.listReviewTextStyle}>{item.about_user}</Text>

                    <View style={TradersScreenStyle.listTagViewMainContainer}>
                        {/* {
                            ref.renderFacilityView(index)

                        }
                        {
                            ref.renderFacilityView2(index)
                        } */}

                    </View>
                    <TouchableOpacity onPress={ref.callSendMessageScreen.bind(ref, item)} >
                        <View style={TradersScreenStyle.roundedBlueMessageButtonStyle}>
                            <Text style={TradersScreenStyle.messageButtonTextStyle}>
                                {Strings.SEND_MESSAGE}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={TradersScreenStyle.likeImageViewStyle} onPress={()=>ref.callAddFavUserClick(item._id,item.is_fav == 2?1:2)}>
                        <Image source={(item.is_fav == 2) ? ImagePath.HEART_OUTLINE : ImagePath.BLUE_HEART}  />
                    </TouchableOpacity> */}
                </View>
            </CardView>
        );
    }



    render() {
        let data = [{
            value: 'By best match',
        }];
        var dataList = this.state.responseData.data ? (this.state.responseData.data.length > 0 ? this.state.responseData.data : []) : [];
        return (
            <View style={CommonStyles.listMainContainerStyle}>
                {this.navBar()}
                <TouchableOpacity onPress={() => this.onFilterClick()} >
                    <View style={TradersScreenStyle.refineResultContainerStyle}>
                        <View>
                            <Text style={TradersScreenStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                            <View style={TradersScreenStyle.refineResultBottomBarStyle} />
                        </View>
                        {this.state.isFilter ? <Image source={ImagePath.ARROW_DOWN} style={TradersScreenStyle.refineResultArrowUpStyle} />
                            : <Image source={ImagePath.ARROW_DOWN} style={TradersScreenStyle.refineResultArrowStyle} />
                        }

                    </View>
                </TouchableOpacity>
                {/* <View style={TradersScreenStyle.tabContainerStyle}>

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

                </View> */}


                {/* <Dropdown
                    label=''
                    labelHeight={5}
                    fontSize={14}
                    baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                    containerStyle={TradersScreenStyle.dropDownViewStyle}
                    data={data}
                    value={data[0].value}
                /> */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={CommonStyles.flatListStyle}>
                    {this.state.isFilter ?
                        <FilterScreen /> : null
                    }
                    {
                        dataList.length > 0 ?

                            <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={dataList}
                                renderItem={this.renderItem}
                                extraData={this.state}
                            />

                            : <View style={{ flex: 1, justifyContent: 'center', marginTop: window.height * 0.25 }}>
                                <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.APPLICANT_NOT_FOUND}</Text>
                            </View>
                    }
                </ScrollView>
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

