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
import TenantScreenStyle from './TenantScreenStyle';
// import listData from  '../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import API from '../../Constants/APIUrls';
import { CardView } from '../CommonComponent/CardView';
import * as Progress from 'react-native-progress';
import {
    addUserToFav,
    getTenantList,
} from "../../Action/ActionCreators";
import {
    callTenantListOnClearFilter,
    clearTenantListRes,
    showLoading,
    resetState,
} from "./TenantScreenAction";
import StarRating from 'react-native-star-rating';
import FilterScreen from './TenantFilterComponent/FilterScreen';
const window = Dimensions.get('window');
let ref;
class TenantScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            starCount: 3.5,
            responseData: [],
            isFilter: false,
            isTabSelected: true,
        };
    }


    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    onFilterClick() {

        if (this.state.isFilter) {

            this.setState({ isFilter: false });
        }
        else {

            this.setState({ isFilter: true });
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.tenantScreenReducer.isFilterClearCall=='Yes'){
            this.callGetTenantApi();
            this.props.callTenantListOnClearFilter('');
        }
    }

    componentDidUpdate() {
        this.onSuccess();
        this.onAddUserFavSuccess();
    }

    componentWillUnmount() {
        this.setState({ responseData: [] });
    }

    componentWillMount() {
        this.callGetTenantList(API.GET_TENANT_LIST);
    }

    callSendMessageScreen(item) {

        Actions.MessageToTraderScreen({ userFirstName: item.firstname, userLastName: item.lastname, receiverId: item._id });
    }
    callTenantsProfileScreen(id, averageRate, totalReviewLength) {
        Actions.TenantsProfile({ user_id: id, averageRating: averageRate, totalReviewLengthrating: totalReviewLength });
    }

    onActiveTenantTabClick() {

        this.setState({ isTabSelected: 1 });
        this.callGetTenantList(API.GET_TENANT_LIST);
    }
    onFavTabClick() {

        this.setState({ isTabSelected: 2 });
        this.callGetFavTenantList(API.GET_FAV_TENANTS);
    }
    onDatabaseTabClick() {

        this.setState({ isTabSelected: 3 });
        this.callGetDatabaseTenantList(API.GET_DATABASE_TENANTS);

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
    callGetTenantApi(){
        if (this.state.isTabSelected == 1) {
            this.callGetTenantList(API.GET_TENANT_LIST);
        }
        else if (this.state.isTabSelected == 2) {
            this.callGetFavTenantList(API.GET_FAV_TENANTS);
        }
        else if (this.state.isTabSelected == 3) {
            this.callGetDatabaseTenantList(API.GET_DATABASE_TENANTS);
        }

    }

    onAddUserFavSuccess() {

        if (this.props.tenantScreenReducer.addUserFavRes != '') {

            if (this.props.tenantScreenReducer.addUserFavRes.code == 200) {
               this.callGetTenantApi();
            }
            else {
                alert(this.props.tenantScreenReducer.addUserFavRes.message);
            }
            this.props.resetState();
        }
    }

    callGetTenantList(APIName) {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                AsyncStorage.getItem("roleId").then((role) => {
                    if (role) {
                        var postData = {
                            agency_id: userData.data.agency_id,
                            request_by_role: role,
                            user_id: userData.data._id,
                        }
                        this.props.showLoading();
                        this.props.getTenantList(authToken, postData, APIName);
                    }
                }).done();
            }
        }).done();
    }

    callGetFavTenantList(APIName) {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {

            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;

                var postData = {
                    user_id: userData.data._id,
                    fav_status: 1
                }
                
                this.props.showLoading();
                this.props.getTenantList(authToken, postData, APIName);
            }
        }).done();
    }

    callGetDatabaseTenantList(APIName) {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {

            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;

                var postData = {
                    page_number: "",
                    number_of_pages: "",
                    user_id: userData.data._id
                }
                
                this.props.showLoading();
                this.props.getTenantList(authToken, postData, APIName);
            }
        }).done();
    }

    callAddNewTenantScreen() {
        
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var agency_id = userData.data.agency_id;
                if (agency_id == undefined || agency_id == null) {
                    alert(Strings.ERROR_ADD_TENANT_MESSAGE);
                } else {
                    Actions.AddNewTenantScreen();
                }
            }
        }).done();

    }

    onSuccess() {

        if (this.props.tenantScreenReducer.tenantListResponse != '') {
            
            if (this.props.tenantScreenReducer.tenantListResponse.code == 200) {
                this.setState({ responseData: this.props.tenantScreenReducer.tenantListResponse.data });

                
            }
            else {
                alert(this.props.tenantScreenReducer.tenantListResponse.message);
            }
            this.props.clearTenantListRes();
        }
    }

    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.TENANTS}</Text>
                <TouchableOpacity onPress={() => this.callAddNewTenantScreen()} style={CommonStyles.navPlusImageView}>
                    <View>
                        <Image source={ImagePath.PLUS_ICON} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderImageItem(item, index) {
        return (
            <Image source={{ uri: item.url }} style={TenantScreenStyle.userListImageStyle} />
        );
    }

    getRandomColor() {
        var color = "#" + (Math.random() * 0xFFFFFF << 0).toString(16);
        return color;
    }

    renderItem({ item, index }) {

        var userImagePath = item.image ? API.USER_IMAGE_PATH + item.image : '';
        var averageRate = item.averageRate ? item.averageRate : 0;
        var totalReviewLength = item.totalReviewLength ? item.totalReviewLength : 0;

        return (

            <CardView>
                <View style={TenantScreenStyle.listItemContainer}>
                    <View style={TenantScreenStyle.listImageContainerStyle}>
                        <TouchableOpacity onPress={ref.callTenantsProfileScreen.bind(ref, item._id, averageRate, totalReviewLength)}>
                            {
                                userImagePath != '' ? <Image source={{ uri: userImagePath }} style={TenantScreenStyle.listImageStyle} />
                                    :
                                    <View style={TenantScreenStyle.emptyUserListImageStyle}>
                                        <Text style={TenantScreenStyle.nameTextStyle}>{item.firstname.charAt(0).toUpperCase() + ' ' + item.lastname.charAt(0).toUpperCase()}</Text>
                                    </View>
                            }
                        </TouchableOpacity>
                        {item.is_online ?
                            <View style={TenantScreenStyle.onLineStatusViewStyle} />
                            :
                            <View style={TenantScreenStyle.statusViewStyle} />
                        }
                    </View>
                    <View style={TenantScreenStyle.listTitleViewContainer}>
                        <Text style={TenantScreenStyle.listTitleTextStyle}>{item.firstname + ' ' + item.lastname}</Text>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            starSize={20}
                            starStyle={{ paddingRight: 5, marginTop: 8 }}
                            emptyStarColor={Colors.EMPTY_STAR_COLOR}
                            starColor={Colors.STAR_COLOR}
                            rating={averageRate}
                            selectedStar={(rating) => ref.onStarRatingPress(rating)}
                        />
                        <Text style={TenantScreenStyle.listReviewTextStyle}>{averageRate + ' ' + 'from' + ' ' + totalReviewLength + ' ' + 'reviews'}</Text>
                        <Text style={TenantScreenStyle.listAddressTextStyle}>{item.address}</Text>

                        <TouchableOpacity style={TenantScreenStyle.roundedBlueMessageButtonStyle} onPress={ref.callSendMessageScreen.bind(ref, item)}>
                            <View >
                                <Text style={TenantScreenStyle.messageButtonTextStyle}>
                                    {Strings.SEND_MESSAGE}
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity style={TenantScreenStyle.likeImageViewStyle} onPress={() => ref.callAddFavUserClick(item._id, item.is_fav == 2 ? 1 : 2)}>
                        <Image source={(item.is_fav == 2) ? ImagePath.HEART_OUTLINE : ImagePath.BLUE_HEART} />
                    </TouchableOpacity>
                </View>
            </CardView>
        );
    }


    render() {
        let data = [{
            value: 'By best match',
        }];

        return (
            <View style={CommonStyles.listMainContainerStyle}>
                {this.navBar()}
                <TouchableOpacity onPress={() => this.onFilterClick()} >
                    <View style={TenantScreenStyle.refineResultContainerStyle}>
                        <View>
                            <Text style={TenantScreenStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                            <View style={TenantScreenStyle.refineResultBottomBarStyle} />
                        </View>
                        {this.state.isFilter ? <Image source={ImagePath.ARROW_DOWN} style={TenantScreenStyle.refineResultArrowUpStyle} />
                            : <Image source={ImagePath.ARROW_DOWN} style={TenantScreenStyle.refineResultArrowStyle} />
                        }

                    </View>
                </TouchableOpacity>
                <View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={TenantScreenStyle.tabContainerScrollViewStyle}>
                        <View style={TenantScreenStyle.tabContainerStyle}>

                            <TouchableOpacity onPress={() => this.onActiveTenantTabClick()} >
                                <View >
                                    <View style={TenantScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 1) ? TenantScreenStyle.tabLabelTextStyle : TenantScreenStyle.tabLabelDiselectTextStyle}>{Strings.ACITVE_TENANT}</Text>
                                    </View>
                                    {this.state.isTabSelected == 1 ? <View style={TenantScreenStyle.tabIndicatorStyle}></View> : <View style={TenantScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onFavTabClick()}>
                                <View>
                                    <View style={TenantScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 2) ? TenantScreenStyle.tabLabelTextStyle : TenantScreenStyle.tabLabelDiselectTextStyle}>{Strings.FAVORITES}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 2) ? <View style={TenantScreenStyle.tabIndicatorStyle}></View> : <View style={TenantScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onDatabaseTabClick()}>
                                <View>
                                    <View style={TenantScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 3) ? TenantScreenStyle.tabLabelTextStyle : TenantScreenStyle.tabLabelDiselectTextStyle}>{Strings.DATABASE}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 3) ? <View style={TenantScreenStyle.tabIndicatorStyle}></View> : <View style={TenantScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>


                        </View>
                    </ScrollView>
                </View>
                <View style={TenantScreenStyle.tabContainerStyle}>

                    <Dropdown
                        label=''
                        labelHeight={5}
                        fontSize={14}
                        baseColor={Colors.DROP_DOWN_BACKGROUND_COLOR}
                        containerStyle={TenantScreenStyle.dropDownViewStyle}
                        data={data}
                        value={data[0].value}
                    />
                </View>
                {

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={CommonStyles.flatListStyle}>
                        {this.state.isFilter ?
                            <FilterScreen /> : null
                        }

                        {this.state.responseData.length > 0 ?
                            <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.responseData}
                                renderItem={this.renderItem}
                                extraData={this.state}
                            />
                            : <View style={{ flex: 1, justifyContent: 'center',marginTop:window.height*0.25 }}>
                                <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.TENANT_NOT_FOUND}</Text>
                            </View>}
                    </ScrollView>

                }
                
                {

                    this.props.tenantScreenReducer.isScreenLoading ?
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
        tenantScreenReducer: state.tenantScreenReducer
    }
}

export default connect(
    mapStateToProps,
    {
        addUserToFav,
        getTenantList,
        showLoading,
        resetState,
        clearTenantListRes,
        callTenantListOnClearFilter
    }

)(TenantScreen);
