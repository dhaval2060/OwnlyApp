
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
    globalSearch,
} from "../../Action/ActionCreators";

import {

    showLoading,
    resetState,
} from "./SearchScreenAction";

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import SearchScreenStyle from './SearchScreenStyle';
//import listData from  '../../../data';../../../../data
import { Dropdown } from 'react-native-material-dropdown';
import { CardView } from '../CommonComponent/CardView';
import API from '../../Constants/APIUrls';
import * as Progress from 'react-native-progress';

let ref;
class SearchScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            isTabSelected: 1,
            searchText: '',
            searchData: {},

        };
    }

    componentDidUpdate() {
        this.onGetSearchSuccess();
    }

    closeNotifications() {
        Actions.popTo('Dashboard');
    }

    callSearchGlobal() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = { text: this.state.searchText }
                this.props.showLoading();
                this.props.globalSearch(authToken, postData);
            }
        }).done();

    }

    onGetSearchSuccess() {

        if (this.props.searchScreenReducer.globalSearchRes != '') {
            if (this.props.searchScreenReducer.globalSearchRes.code == 200) {

                this.setState({ searchData: this.props.searchScreenReducer.globalSearchRes.data });

            }
            else {
                alert(this.props.searchScreenReducer.globalSearchRes.message);
            }
            this.props.resetState();
        }

    }

    onEverythingTabClick() {

        this.setState({ isTabSelected: 1 });

    }
    onPropertiesTabClick() {

        this.setState({ isTabSelected: 2 });

    }
    onTenantsTabClick() {

        this.setState({ isTabSelected: 3 });


    }
    onTradersTabClick() {

        this.setState({ isTabSelected: 4 });


    }
    onMessageTabClick() {

        this.setState({ isTabSelected: 5 });


    }

    onRequestTabClick() {

        this.setState({ isTabSelected: 6 });


    }

    onFileTabClick() {

        this.setState({ isTabSelected: 7 });


    }

    onCaseTabClick() {

        this.setState({ isTabSelected: 8 });


    }

    onOtherTabClick() {

        this.setState({ isTabSelected: 9 });


    }


    onSearchTextChange(text) {
        this.setState({ searchText: text });
    }

    navBar() {
        return (
            <View style={CommonStyles.navBarMainView}>
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <View style={SearchScreenStyle.searchViewStyle}>
                    <Image source={ImagePath.SEARCH_ICON} style={SearchScreenStyle.searchImageStyle} />

                    <TextInput
                        placeholder={Strings.SEARCH_ANYTHING}
                        underlineColorAndroid={Colors.TRANSPARENT}
                        style={[SearchScreenStyle.searchTextInputStyle, { color: 'white' }]}
                        autoCorrect={false}
                        placeholderTextColor={'#ccc'}
                        onChangeText={this.onSearchTextChange.bind(this)}
                        value={this.state.searchText}
                        returnKeyType='search'
                        onSubmitEditing={this.callSearchGlobal.bind(this)}
                    />

                    <TouchableOpacity onPress={() => this.closeNotifications()}>
                        <Image source={ImagePath.DRAWER_CROSS_ICON} style={SearchScreenStyle.navRightImageView} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    callPropertyDetailsScreen(id) {

        Actions.PropertiesDetailsScreen({ propertyId: id });
    }


    renderItem({ item, index }) {
        var imagePath = item.image.length > 0 ? API.PROPERTY_IMAGE_PATH + item.image[0].path : '';
        return (

            <CardView>
                {
                    <TouchableOpacity onPress={ref.callPropertyDetailsScreen.bind(ref, item._id)} >

                        <View style={SearchScreenStyle.listMainContainerStyle}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}>
                                {
                                    imagePath != '' ? <Image source={{ uri: imagePath }} style={SearchScreenStyle.propertyImageStyle} />
                                        :
                                        <View style={SearchScreenStyle.propertyImageEmptyStyle}></View>
                                }
                                <View style={SearchScreenStyle.propertyTitleViewStyle}>
                                    <Text style={SearchScreenStyle.propertyTitleTextStyle}>{item.address}</Text>
                                    <Text style={SearchScreenStyle.propertySubTitleTextStyle}>{item.description}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>

                }
            </CardView>

        );
    }
    callTradersProfileScreen(id, averageRate, totalReviewLength) {
        Actions.TradersProfileScreen({ user_id: id, averageRating: averageRate, totalReviewLengthrating: totalReviewLength });
    }
    renderUserItem = ({ item, index }) => {

        var imagePath = item.image ? API.USER_IMAGE_PATH + item.image : '';
        return (
            <CardView>
                {
                    <TouchableOpacity onPress={() => {
                        console.log(item, "Click//")
                        // if (item.agency_id) {
                            this.callTradersProfileScreen(item._id, 0, 0)
                        // }
                    }}>
                        <View style={SearchScreenStyle.listMainContainerStyle}>

                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 20 }}>

                                {
                                    imagePath != '' ? <Image source={{ uri: imagePath }} style={SearchScreenStyle.userImageStyle} />
                                        :
                                        <View style={SearchScreenStyle.emptyUserMessageListImageStyle}>
                                            <Text style={SearchScreenStyle.initialTextStyle}>{item.firstname.charAt(0).toUpperCase() + ' ' + item.lastname.charAt(0).toUpperCase()}</Text>
                                        </View>
                                }
                                <View style={SearchScreenStyle.propertyTitleViewStyle}>
                                    <Text style={SearchScreenStyle.propertyTitleTextStyle}>{item.firstname + ' ' + item.lastname}</Text>
                                    <Text style={SearchScreenStyle.propertySubTitleTextStyle}>{item.about_user}</Text>
                                </View>
                            </View>

                        </View>
                    </TouchableOpacity>

                }
            </CardView>
        );
    }


    render() {

        return (
            <View style={{ flex: 1 }}>
                {this.navBar()}
                <View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={SearchScreenStyle.tabContainerScrollViewStyle}>
                        <View style={SearchScreenStyle.tabContainerStyle}>

                            <TouchableOpacity onPress={() => this.onEverythingTabClick()} >
                                <View >
                                    <View style={SearchScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 1) ? SearchScreenStyle.tabLabelTextStyle : SearchScreenStyle.tabLabelDiselectTextStyle}>{Strings.EVERYTHING_TAB}</Text>
                                    </View>
                                    {this.state.isTabSelected == 1 ? <View style={SearchScreenStyle.tabIndicatorStyle}></View> : <View style={SearchScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>

                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onPropertiesTabClick()}>
                                <View>
                                    <View style={SearchScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 2) ? SearchScreenStyle.tabLabelTextStyle : SearchScreenStyle.tabLabelDiselectTextStyle}>{Strings.PROPERTIES_TAB}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 2) ? <View style={SearchScreenStyle.tabIndicatorStyle}></View> : <View style={SearchScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onTenantsTabClick()}>
                                <View>
                                    <View style={SearchScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 3) ? SearchScreenStyle.tabLabelTextStyle : SearchScreenStyle.tabLabelDiselectTextStyle}>{Strings.TENANTS_TAB}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 3) ? <View style={SearchScreenStyle.tabIndicatorStyle}></View> : <View style={SearchScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onTradersTabClick()}>
                                <View>
                                    <View style={SearchScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 4) ? SearchScreenStyle.tabLabelTextStyle : SearchScreenStyle.tabLabelDiselectTextStyle}>{Strings.TRADERS_TAB}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 4) ? <View style={SearchScreenStyle.tabIndicatorStyle}></View> : <View style={SearchScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onMessageTabClick()}>
                                <View>
                                    <View style={SearchScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 5) ? SearchScreenStyle.tabLabelTextStyle : SearchScreenStyle.tabLabelDiselectTextStyle}>{Strings.MESSAGE_TAB}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 5) ? <View style={SearchScreenStyle.tabIndicatorStyle}></View> : <View style={SearchScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onRequestTabClick()}>
                                <View>
                                    <View style={SearchScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 6) ? SearchScreenStyle.tabLabelTextStyle : SearchScreenStyle.tabLabelDiselectTextStyle}>{Strings.REQUESTS_TAB}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 6) ? <View style={SearchScreenStyle.tabIndicatorStyle}></View> : <View style={SearchScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onFileTabClick()}>
                                <View>
                                    <View style={SearchScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 7) ? SearchScreenStyle.tabLabelTextStyle : SearchScreenStyle.tabLabelDiselectTextStyle}>{Strings.FILES_TAB}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 7) ? <View style={SearchScreenStyle.tabIndicatorStyle}></View> : <View style={SearchScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onCaseTabClick()}>
                                <View>
                                    <View style={SearchScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 8) ? SearchScreenStyle.tabLabelTextStyle : SearchScreenStyle.tabLabelDiselectTextStyle}>{Strings.CASES_TAB}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 8) ? <View style={SearchScreenStyle.tabIndicatorStyle}></View> : <View style={SearchScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.onOtherTabClick()}>
                                <View>
                                    <View style={SearchScreenStyle.tabTextViewStyle}>
                                        <Text style={(this.state.isTabSelected == 9) ? SearchScreenStyle.tabLabelTextStyle : SearchScreenStyle.tabLabelDiselectTextStyle}>{Strings.OTHER_TAB}</Text>
                                    </View>
                                    {(this.state.isTabSelected == 9) ? <View style={SearchScreenStyle.tabIndicatorStyle}></View> : <View style={SearchScreenStyle.tabWhiteIndicatorStyle}></View>}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>


                {
                    JSON.stringify(this.state.searchData) != '{}' ?

                        <ScrollView >
                            {
                                (this.state.searchData.propertyData && this.state.isTabSelected == 2) || (this.state.searchData.propertyData && this.state.isTabSelected == 1) ?

                                    <View >

                                        <FlatList
                                            data={this.state.searchData.propertyData}
                                            renderItem={this.renderItem}
                                            extraData={this.state}
                                        />
                                    </View> : null
                            }

                            {
                                (this.state.searchData.userData && this.state.isTabSelected == 9) || (this.state.searchData.userData && this.state.isTabSelected == 1) ?

                                    <View >

                                        <FlatList
                                            data={this.state.searchData.userData}
                                            renderItem={this.renderUserItem}
                                            extraData={this.state}
                                        />
                                    </View> : null
                            }
                        </ScrollView> :
                        <View style={{ flex: 1, justifyContent: 'center', alignItem: 'center' }}>
                            <Text style={{ fontSize: 20, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.NO_DATA_FOUND}</Text>
                        </View>
                }

                {

                    this.props.searchScreenReducer.isScreenLoading ?
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
        searchScreenReducer: state.searchScreenReducer
    }
}

export default connect(
    mapStateToProps,
    {
        globalSearch,
        showLoading,
        resetState,
    }

)(SearchScreen);

