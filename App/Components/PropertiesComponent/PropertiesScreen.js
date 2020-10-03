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
import PropertiesScreenStyle from './PropertiesScreenStyle';
//import listData from  '../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import API from '../../Constants/APIUrls';
import * as Progress from 'react-native-progress';
const window = Dimensions.get('window');
import {
    getAllPropertyList,
    likeProperty,
    getUnreadMessageList
} from "../../Action/ActionCreators";
import {
    updateScene,
    showLoading,
    resetState,
} from "./PropertiesScreenAction";
import {

    clearFilterRes,
    callResetPropertyList
} from "../FilterComponent/FilterAction";

import FilterScreen from '../FilterComponent/FilterScreen';

let listData = []
let ref;
class PropertiesScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: true,
            propertyListData: [],
            isFilter: false,
            userPermission: [],
        };
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.filterReducer.isFilterClear == 'Yes') {

            this.callGetProperty(API.GET_PROPERTY_LIST);
            this.props.callResetPropertyList('');
        }
        if (nextProps.propertiesScreenReducer.refreshScene == 'updateProperty' && nextProps.propertiesScreenReducer.refreshScene != '' && nextProps.propertiesScreenReducer.refreshScene != undefined) {
            this.props.updateScene('');
            this.callGetProperty(API.GET_PROPERTY_LIST);
        }
    }

    componentDidUpdate() {
        this.onPropertyListSuccess();
        this.onFilterPropertyListSuccess();
        this.onLikePropertySuccess();

    }

    componentWillUnmount() {

    }
    callGetUnreadMessage() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.getUnreadMessageList(authToken, userData.data._id);
            }
        }).done();
    }
    onUnreadMessageSuccess() {
        if (this.props.homeScreenReducer.unreadMsgListResponse != '') {
            if (this.props.homeScreenReducer.unreadMsgListResponse.code == 200) {

                this.setState({ unReadCount: this.props.homeScreenReducer.unreadMsgListResponse.data.length });
                global.unRead = this.props.homeScreenReducer.unreadMsgListResponse.data.length
            }
            else {

                // alert(this.props.homeScreenReducer.unreadMsgListResponse.message);
            }
            this.props.resetState();

        }
    }

    componentWillMount() {

        this.getRoleName();
        this.getUsePermission();
        this.callGetUnreadMessage();
        this.callGetProperty(API.GET_PROPERTY_LIST);
    }
    getUsePermission() {

        AsyncStorage.getItem("userPermission").then((value) => {
            if (value) {

                var permission = JSON.parse(value);

                this.setState({ userPermission: permission.data });

            }
        }).done();
    }

    likePropertyRequest(item, index) {

        var tempArray = this.state.propertyListData;
        var currentItem = tempArray[index];
        currentItem.is_fav = (item.is_fav == 2) ? 1 : 2;
        tempArray[index] = currentItem;
        this.setState({ propertyListData: tempArray });


        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    fav_by: userData.data._id,
                    fav_to_property: item._id,
                    fav_status: (item.is_fav == 2) ? 2 : 1,
                }
                this.props.showLoading();

                this.props.likeProperty(authToken, postData);
            }
        }).done();
    }


    onLikePropertySuccess() {

        if (this.props.propertiesScreenReducer.likePropertyResponse != '') {
            if (this.props.propertiesScreenReducer.likePropertyResponse.code == 200) {

                //this.setState({ noticeBoardListData: this.props.propertiesScreenReducer.likePropertyResponse.data });

            }
            else {

                alert(this.props.propertiesScreenReducer.likePropertyResponse.message);
            }
            this.props.resetState();
        }
    }

    callAddPropertyScreen() {
        Actions.AddPropertyScreenStepOne();
    }

    callPropertyDetailsScreen(id) {
        Actions.PropertiesDetailsScreen({ propertyId: id });
    }

    onFilterClick() {

        if (this.state.isFilter) {

            this.setState({ isFilter: false });
        }
        else {

            this.setState({ isFilter: true });
        }
    }

    callGetProperty(APIName) {
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
        
                        this.props.getAllPropertyList(authToken, postData, APIName);
                    }
                }).done();
            }
        }).done();
    }

    onPropertyListSuccess() {

        if (this.props.propertiesScreenReducer.propertyListResponse != '') {
            if (this.props.propertiesScreenReducer.propertyListResponse.code == 200) {

                this.setState({ propertyListData: this.props.propertiesScreenReducer.propertyListResponse.data });
            }
            else {

                alert(this.props.propertiesScreenReducer.propertyListResponse.message);
            }
            this.props.resetState();

        }
    }
    onFilterPropertyListSuccess() {
        if (this.props.filterReducer.filterRes != '') {
            if (this.props.filterReducer.filterRes.code == 200) {

                this.setState({ propertyListData: this.props.filterReducer.filterRes.data });
            }
            else {

                //alert(this.props.filterReducer.filterRes.message);
            }
            this.props.clearFilterRes();
        }
    }

    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {

                this.setState({ roleName: value });
            }
        }).done();
    }

    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NAV_PROPERTIES_TITLE}</Text>
                {

                    this.state.userPermission.includes('create_property') ? <TouchableOpacity onPress={() => this.callAddPropertyScreen()} style={CommonStyles.navPlusImageView}>
                        <View>
                            <Image source={ImagePath.PLUS_ICON} />
                        </View>
                    </TouchableOpacity> : null

                }

            </View>
        );
    }

    renderImageItem(item, index) {
        return (
            <Image source={{ uri: item.url }} style={PropertiesScreenStyle.userListImageStyle} />
        );
    }
    renderStatusView() {

        return (
            <View style={PropertiesScreenStyle.statusSentViewStyle}>
                <Text style={PropertiesScreenStyle.statusViewTextStyle}>Draft</Text>
            </View>
        );
    }

    renderItem({ item, index }) {
        var propertyImagePath = ''
        item.image.map((data, index) => {
            if (data.isFeatured) {
                propertyImagePath = API.PROPERTY_IMAGE_PATH + data.path
            }
        });
        var userImage = item.owned_by ? (item.owned_by.image ? API.USER_IMAGE_PATH + item.owned_by.image : '') : '';
        return (
            <View style={PropertiesScreenStyle.listMainContainerStyle}>

                <TouchableOpacity onPress={ref.callPropertyDetailsScreen.bind(ref, item._id)} >
                    <View style={PropertiesScreenStyle.propertyImageViewStyle}>
                        {
                            propertyImagePath != '' ?
                                <Image source={{ uri: propertyImagePath }} style={PropertiesScreenStyle.propertyImageStyle} />
                                :
                                <View style={PropertiesScreenStyle.topCoverImageContainer} />
                        }
                        <TouchableOpacity style={PropertiesScreenStyle.likeImageViewStyle} onPress={ref.likePropertyRequest.bind(ref, item, index)} >

                            <Image source={(item.is_fav == 2) ? ImagePath.HEART : ImagePath.BLUE_HEART} />

                        </TouchableOpacity>

                        {item.save_as_draft ?
                            <View style={PropertiesScreenStyle.statusContainerStyle}>
                                {ref.renderStatusView(item)}
                            </View>
                            : null
                        }
                    </View>
                    <View style={PropertiesScreenStyle.propertyTitleViewStyle}>
                        <Text numberOfLines={2} style={PropertiesScreenStyle.propertyTitleTextStyle}>{item.address}</Text>
                    </View>
                    <View style={PropertiesScreenStyle.propetySubTitleViewStyle}>
                        <Text numberOfLines={2} style={PropertiesScreenStyle.propertySubTitleTextStyle}>{item.description}</Text>
                    </View>
                </TouchableOpacity>

                <View style={PropertiesScreenStyle.imageListMainContainerStyle}>
                    <View>
                        {userImage != '' ?
                            <Image source={{ uri: userImage }} style={PropertiesScreenStyle.userImageStyle} />
                            :
                            <Image source={ImagePath.USER_DEFAULT} style={PropertiesScreenStyle.userImageStyle} />
                        }
                    </View>

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={PropertiesScreenStyle.imageListContainerStyle}>
                            {
                                listData.map((data, index) => {

                                    return ref.renderImageItem(data, index);
                                })
                            }
                        </View>
                    </ScrollView>

                </View>

                <View style={PropertiesScreenStyle.propertyInfoContainerViewStyle}>
                    <View style={PropertiesScreenStyle.propertyInfoSubViewContainer}>
                        <View style={PropertiesScreenStyle.propertyBedroomViewContainer}>
                            <Image source={ImagePath.BEDROOM_ICON} />
                            <Text style={PropertiesScreenStyle.propertyValueTextStyle}>{item.number_bedroom ? item.number_bedroom : '0'}</Text>
                        </View>

                        <View style={PropertiesScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.BATHROOM_ICON} />
                            <Text style={PropertiesScreenStyle.propertyValueTextStyle}>{item.number_of_bathroom ? item.number_of_bathroom : '0'}</Text>
                        </View>

                        <View style={PropertiesScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.GARAGE_ICON} />
                            <Text style={PropertiesScreenStyle.propertyValueTextStyle}>{item.number_of_parking ? item.number_of_parking : '0'}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }


    onAllTabClick() {

        this.setState({ isTabSelected: 1 });
        this.callGetProperty(API.GET_PROPERTY_LIST);
    }
    onFavTabClick() {

        this.setState({ isTabSelected: 2 });
        this.callGetProperty(API.GET_FAV_PROPERTY_LIST);
    }
    onListingTabClick() {

        this.setState({ isTabSelected: 3 });
        this.callGetProperty(API.GET_PROPERTY_LISTINGS);

    }
    onTenantedTabClick() {

        this.setState({ isTabSelected: 4 });
        this.callGetProperty(API.GET_TENANTED_PROPERTY_LIST);

    }
    onDatabaseTabClick() {

        this.setState({ isTabSelected: 5 });
        this.callGetProperty(API.GET_ALL_PROPERTY_LIST);

    }


    render() {

        let data = [{
            value: 'By Property ID',
        }, {
            value: 'By Property Name',
        }];

        return (
            <View style={CommonStyles.listMainContainerStyle}>
                {this.navBar()}
                <TouchableOpacity onPress={() => this.onFilterClick()} >
                    <View style={PropertiesScreenStyle.refineResultContainerStyle}>
                        <View>
                            <Text style={PropertiesScreenStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                            <View style={PropertiesScreenStyle.refineResultBottomBarStyle} />
                        </View>
                        {this.state.isFilter ? <Image source={ImagePath.ARROW_DOWN} style={PropertiesScreenStyle.refineResultArrowUpStyle} />
                            : <Image source={ImagePath.ARROW_DOWN} style={PropertiesScreenStyle.refineResultArrowStyle} />
                        }
                    </View>
                </TouchableOpacity>
                <View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={PropertiesScreenStyle.tabContainerScrollViewStyle}>
                        <View style={PropertiesScreenStyle.tabContainerStyle}>

                            <TouchableOpacity onPress={() => this.onAllTabClick()} >
                                <View >
                                    <View style={PropertiesScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 1) ? PropertiesScreenStyle.tabLabelTextStyle : PropertiesScreenStyle.tabLabelDiselectTextStyle}>{Strings.MINE}</Text>
                                    </View>
                                    {this.state.isTabSelected == 1 ? <View style={PropertiesScreenStyle.tabIndicatorStyle}></View> : <View style={PropertiesScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onFavTabClick()}>
                                <View>
                                    <View style={PropertiesScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 2) ? PropertiesScreenStyle.tabLabelTextStyle : PropertiesScreenStyle.tabLabelDiselectTextStyle}>{Strings.FAVORITES}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 2) ? <View style={PropertiesScreenStyle.tabIndicatorStyle}></View> : <View style={PropertiesScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onListingTabClick()}>
                                <View>
                                    <View style={PropertiesScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 3) ? PropertiesScreenStyle.tabLabelTextStyle : PropertiesScreenStyle.tabLabelDiselectTextStyle}>{Strings.LISTINGS}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 3) ? <View style={PropertiesScreenStyle.tabIndicatorStyle}></View> : <View style={PropertiesScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onTenantedTabClick()}>
                                <View>
                                    <View style={PropertiesScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 4) ? PropertiesScreenStyle.tabLabelTextStyle : PropertiesScreenStyle.tabLabelDiselectTextStyle}>{Strings.TENANTED}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 4) ? <View style={PropertiesScreenStyle.tabIndicatorStyle}></View> : <View style={PropertiesScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onDatabaseTabClick()}>
                                <View>
                                    <View style={PropertiesScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 5) ? PropertiesScreenStyle.tabLabelTextStyle : PropertiesScreenStyle.tabLabelDiselectTextStyle}>{Strings.ALL}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 5) ? <View style={PropertiesScreenStyle.tabIndicatorStyle}></View> : <View style={PropertiesScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={CommonStyles.flatListStyle}>
                    {this.state.isFilter ?
                        <FilterScreen /> : null
                    }
                    {this.state.propertyListData.length > 0 ?

                        <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                            data={this.state.propertyListData}
                            renderItem={this.renderItem}
                            extraData={this.state}
                        />
                        :
                        this.props.propertiesScreenReducer.isScreenLoading ?
                            null
                            : <View style={{ flex: 1, justifyContent: 'center', alignItem: 'center', marginTop: window.height * 0.25 }}>
                                <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{'Coming soon'}</Text>
                            </View>
                    }
                </ScrollView>

                {

                    this.props.propertiesScreenReducer.isScreenLoading ?
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
        propertiesScreenReducer: state.propertiesScreenReducer,
        homeScreenReducer: state.homeScreenReducer,
        filterReducer: state.filterReducer
    }
}

export default connect(
    mapStateToProps,
    {
        getAllPropertyList,
        likeProperty,
        showLoading,
        resetState,
        clearFilterRes,
        getUnreadMessageList,
        callResetPropertyList,
        updateScene

    }

)(PropertiesScreen);



