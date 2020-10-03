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
import DisputesScreenStyle from './DisputesScreenStyle';
//import listData from  '../../../data';
import { Dropdown } from 'react-native-material-dropdown';
import FilterScreen from '../FilterComponent/FilterScreen';
import API from '../../Constants/APIUrls';
import * as Progress from 'react-native-progress';
const window = Dimensions.get('window');
import {
    getDisputesList,
} from "../../Action/ActionCreators";
import {

    showLoading,
    resetState,
    updateDisputesList
} from "./DisputesScreenAction";

import { EventRegister } from 'react-native-event-listeners'
let ref;
class DisputesScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            isFilter: false,
            disputesListData: [],
            userInfo: {},
            isTabSelected: 1,
        };
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.disputesScreenReducer.refreshScene != '' && nextProps.disputesScreenReducer.refreshScene != undefined) {
            
            if (this.state.isTabSelected == 1) {
                this.callDisputesList(0);
            }
            else if (this.state.isTabSelected == 2) {
                this.callDisputesList(1);
            }
            else if (this.state.isTabSelected == 3) {
                this.callDisputesList(2);
            }
            this.props.updateDisputesList('');
        }
    }

    componentDidUpdate() {
        this.onDisputesListSuccess();
    }

    componentWillMount() {
        this.callDisputesList(0);

        this.listener = EventRegister.addEventListener('disputeUpdate', (data) => {
            this.callDisputesList(0);
        })
    }

    componentWillUnmount() {

    }


    onAllTabClick() {

        this.setState({ isTabSelected: 1 });
        this.callDisputesList(0);
    }

    onActiveTabClick() {

        this.setState({ isTabSelected: 2 });
        this.callDisputesList(1);
    }

    onRequestedByTenentTabClick() {

        this.setState({ isTabSelected: 3 });
        this.callDisputesList(2);
        // this.callGetMaintenanceRequestByTenant();
    }


    onDisputesListSuccess() {
        
        if (this.props.disputesScreenReducer.disputesListResponse != '') {
            if (this.props.disputesScreenReducer.disputesListResponse.code == 200) {
                
                this.setState({ disputesListData: this.props.disputesScreenReducer.disputesListResponse.data });

            }
            else {

                alert(this.props.disputesScreenReducer.disputesListResponse.message);
            }
            this.props.resetState();


        }
    }



    callDisputesList(dispute_status) {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.setState({ userInfo: userData });
                var postData = {
                    agency_id: userData.data.agency_id,
                    user_id: userData.data._id,
                    request_by_role: userData.data.role_id,
                    dispute_status: dispute_status


                }
                // this.props.showLoading();
                
                this.props.getDisputesList(authToken, postData);
            }
        }).done();
    }

    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.DISPUTES}</Text>
                <TouchableOpacity onPress={() => this.callAddDisputesScreen()} style={CommonStyles.navPlusImageView}>
                    <Image source={ImagePath.PLUS_ICON} />
                </TouchableOpacity>
            </View>
        );
    }

    onFilterClick() {

        if (this.state.isFilter) {

            this.setState({ isFilter: false });
        }
        else {

            this.setState({ isFilter: true });
        }
    }

    renderImageItem(item, index) {
        return (
            <Image source={{ uri: API.PROPERTY_IMAGE_PATH + item.path }} style={DisputesScreenStyle.userListImageStyle} />
        );
    }
    callAddDisputesScreen() {
        Actions.AddDisputesScreen();

    }

    onListItemClick(id) {

        Actions.DisputesDetailsScreen({ reqId: id });
    }


    renderStatusView(item) {

        switch (item.dispute_status) {

            case 1:
                return (
                    <View style={DisputesScreenStyle.statusSentViewStyle}>
                        <Text style={DisputesScreenStyle.statusViewTextStyle}>In Progress</Text>
                    </View>
                );
                break;
            case 2:
                return (
                    <View style={DisputesScreenStyle.statusAcceptedViewStyle}>
                        <Text style={DisputesScreenStyle.statusViewTextStyle}>Resolved</Text>
                    </View>
                );
                break;
            case 3:
                return (
                    <View style={DisputesScreenStyle.statusBookViewStyle}>
                        <Text style={DisputesScreenStyle.statusViewTextStyle}>Closed</Text>
                        {/* <Text style={DisputesScreenStyle.statusViewTextStyle}>Not made to any decision</Text> */}
                    </View>
                );
                break;
            default:

        }

    }


    renderItem({ item, index }) {

        var message = item.message ? item.message : '';
        var subject = item.subject ? item.subject : '';
        var dispute_id = item.dispute_id ? item.dispute_id : '';
        var images = item.property_id.image ? item.property_id.image : [];
        var userImage = ref.state.userInfo.data ? (ref.state.userInfo.data.image ? API.USER_IMAGE_PATH + ref.state.userInfo.data.image : '') : '';
        return (
            <View style={DisputesScreenStyle.listMainContainerStyle}>
                <TouchableOpacity onPress={ref.onListItemClick.bind(ref, item._id)}>
                    <View style={DisputesScreenStyle.disputesImageViewStyle}>
                        <Image source={{ uri: API.PROPERTY_IMAGE_PATH + images[0].path }} style={DisputesScreenStyle.disputesImageViewStyle} />
                        {/* <View style={DisputesScreenStyle.dateContainerStyle}>
                            <Image source={ImagePath.DATE_ICON} style={DisputesScreenStyle.dateImageStyle} />
                            <Text style={DisputesScreenStyle.dateTextStyle}>
                                Oct 29, 2017
                           </Text>
                        </View> */}

                        <View style={DisputesScreenStyle.statusContainerStyle}>
                            {ref.renderStatusView(item)}
                        </View>
                    </View>
                    <View style={DisputesScreenStyle.disputesTitleViewStyle}>
                        <Text numberOfLines={2} style={DisputesScreenStyle.disputesTitleTextStyle}>{subject}</Text>
                    </View>
                    <View style={DisputesScreenStyle.disputesSubTitleViewStyle}>
                        <Text numberOfLines={1} style={DisputesScreenStyle.disputesSubTitleTextStyle}>{'PID : ' + dispute_id}</Text>
                    </View>

                    <View style={DisputesScreenStyle.imageListMainContainerStyle}>
                        <View>
                            <Image source={ImagePath.USER_DEFAULT} style={DisputesScreenStyle.userImageStyle} />
                        </View>

                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={DisputesScreenStyle.imageListContainerStyle}>
                                {
                                    images.map((data, index) => {
                                        return ref.renderImageItem(data, index);
                                    })
                                }
                            </View>
                        </ScrollView>

                    </View>

                    {/*<View style={DisputesScreenStyle.disputesInfoContainerViewStyle}>

                        <View style={DisputesScreenStyle.propertyBedroomViewContainer}>
                            <Image source={ImagePath.DOLLAR_ICON} />
                            <Text style={DisputesScreenStyle.propertyValueTextStyle}>4500</Text>
                        </View>
                        <View style={DisputesScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.CALENDAR_ICON} />
                            <Text style={DisputesScreenStyle.propertyValueTextStyle}>Jul 29, 2017</Text>
                        </View>
                        <View style={DisputesScreenStyle.propertyWashrooViewContainer}>
                            <Image source={ImagePath.DRAWER_SEARCH_NAV} />
                            <Text style={DisputesScreenStyle.propertyValueTextStyle}>4 times</Text>
                        </View>

                    </View>
                     <Image source={ImagePath.HEART} style={DisputesScreenStyle.likeImageViewStyle} /> */}
                </TouchableOpacity>
            </View >
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
                    <View style={DisputesScreenStyle.refineResultContainerStyle}>
                        <View>
                            <Text style={DisputesScreenStyle.refineResultTextStyle}>{Strings.REFINE_RESULTS}</Text>
                            <View style={DisputesScreenStyle.refineResultBottomBarStyle} />
                        </View>
                        {this.state.isFilter ? <Image source={ImagePath.ARROW_DOWN} style={DisputesScreenStyle.refineResultArrowUpStyle} />
                            : <Image source={ImagePath.ARROW_DOWN} style={DisputesScreenStyle.refineResultArrowStyle} />
                        }

                    </View>
                </TouchableOpacity>
                <View style={DisputesScreenStyle.tabContainerStyle}>

                    <TouchableOpacity onPress={() => this.onAllTabClick()} >
                        <View >
                            <View style={DisputesScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 1) ? DisputesScreenStyle.tabLabelTextStyle : DisputesScreenStyle.tabLabelDiselectTextStyle}>{Strings.ALL}</Text>
                            </View>
                            {this.state.isTabSelected == 1 ? <View style={DisputesScreenStyle.tabIndicatorStyle}></View> : <View style={DisputesScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.onActiveTabClick()}>
                        <View>
                            <View style={DisputesScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 2) ? DisputesScreenStyle.tabLabelTextStyle : DisputesScreenStyle.tabLabelDiselectTextStyle}>{Strings.RAISED}</Text>
                            </View>
                            {(this.state.isTabSelected == 2) ? <View style={DisputesScreenStyle.tabIndicatorStyle}></View> : <View style={DisputesScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onRequestedByTenentTabClick()}>
                        <View>
                            <View style={DisputesScreenStyle.tabTextViewStyle}>
                                <Text style={(this.state.isTabSelected == 3) ? DisputesScreenStyle.tabLabelTextStyle : DisputesScreenStyle.tabLabelDiselectTextStyle}>{Strings.CLOSED}</Text>
                            </View>
                            {(this.state.isTabSelected == 3) ? <View style={DisputesScreenStyle.tabIndicatorStyle}></View> : <View style={DisputesScreenStyle.tabWhiteIndicatorStyle}></View>}
                        </View>
                    </TouchableOpacity>
                </View>


                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={CommonStyles.flatListStyle}>
                    {this.state.isFilter ?
                        <FilterScreen /> : null
                    }



                    {
                        this.state.disputesListData.length > 0 ?
                            <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                data={this.state.disputesListData}
                                renderItem={this.renderItem}
                                extraData={this.state}
                            />

                            :
                            <View style={{ flex: 1, justifyContent: 'center', marginTop: window.height * 0.25 }}>
                                <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>
                                    {Strings.NO_DATA_FOUND}</Text>
                            </View>


                    }

                </ScrollView>

                {

                    this.props.disputesScreenReducer.isDisputesScreenLoading ?
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
        disputesScreenReducer: state.disputesScreenReducer,
    }
}

export default connect(
    mapStateToProps,
    {
        getDisputesList,
        showLoading,
        resetState,
        updateDisputesList

    }

)(DisputesScreen);
