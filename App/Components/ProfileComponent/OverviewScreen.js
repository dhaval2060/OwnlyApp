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
import { Actions } from 'react-native-router-flux';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import OverviewScreenStyle from './OverviewScreenStyle';
//import listData from  '../../../data';
import CommonStyles from '../../CommonStyle/CommonStyle';
import ProfileScreenStyle from './ProfileScreenStyle';
import API from '../../Constants/APIUrls';
import StarRating from 'react-native-star-rating';
let contextRef;

import {

    getAllAgentListWithiInAgency,
    getAgencyProfile,
    getUserReviewsList,
} from "../../Action/ActionCreators";

import {
    showLoading,
    resetState,
} from "../AgentsComponent/AgentsScreenAction";
let ref;
class OverviewScreen extends Component {
    constructor() {
        super();
        ref = this;
        this.state = {
            uploadImagesData: {},
            selectedImage: 0,
            overViewData: '',
            starCount: 3.5,
            roleName: '',
            agencyId: '',
            agentListData: [],
            infoData: '',
            userReviewData: {}
        };
        contextRef = this;


    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {
        this.onAgentListWithiInAgencySuccess();
        this.onGetAgencyProfileSuccess();
        this.onGetUserRatingSuccess();

    }

    componentWillUnmount() {

    }



    componentWillMount() {


        this.setState({ overViewData: this.props.overviewData });
        this.getRoleName();
        this.getAgencyId();
        this.callGetAgentListWithiInAgency();
        this.callGetUserRating();
        this.callGetAgencyProfile();
    }


    callGetUserRating() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                this.props.showLoading();
                this.props.getUserReviewsList(authToken, userData.data._id);
            }
        }).done();

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


    callGetAgencyProfile() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {

                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {
                    agency_id: userData.data.agency_id,
                }
                this.props.showLoading();
                this.props.getAgencyProfile(authToken, postData);
            }
        }).done();

    }


    onGetAgencyProfileSuccess() {
        if (this.props.profileReducer.agencyProfileRes != '') {
            if (this.props.profileReducer.agencyProfileRes.code == 200) {

                this.setState({ infoData: this.props.profileReducer.agencyProfileRes });
            }
            else {

                //alert(this.props.profileReducer.agencyProfileRes.message);
            }
            this.props.resetState();
        }
    }


    callGetAgentListWithiInAgency() {
        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                var postData = {

                    agency_id: userData.data.agency_id,
                    user_id: userData.data._id,
                }
                this.props.showLoading();

                this.props.getAllAgentListWithiInAgency(authToken, postData);
            }
        }).done();
    }


    onAgentListWithiInAgencySuccess() {
        if (this.props.agentsScreenReducer.agentListWithInAgencyResponse != '') {
            if (this.props.agentsScreenReducer.agentListWithInAgencyResponse.code == 200) {

                this.setState({ agentListData: this.props.agentsScreenReducer.agentListWithInAgencyResponse.data });

            }
            else {

                //alert(this.props.agentsScreenReducer.agentListWithInAgencyResponse.message);
            }
            this.props.resetState();
        }
    }


    componentDidMount() {
        this.uploadImageListSelection(0);
    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }


    getRoleName() {

        AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
            if (value) {

                this.setState({ roleName: value });

            }
        }).done();
    }
    getAgencyId() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;

                agencyId = userData.data.agency_id ? userData.data.agency_id : '';
            }
        }).done();
    }

    uploadImageListSelection(index) {



        var overviewImagePath = this.state.overViewData.images ? (this.state.overViewData.images.length > 0 ? this.state.overViewData.images[index].url : '') : '';

        this.setState({ selectedImage: overviewImagePath });
        var tempData = this.state.overViewData.images;
        var tempArray = this.state.overViewData.images;
        tempArray.map((data, position) => {

            if (index == position) {

                if (tempArray[index].isSelected == 0) {
                    tempArray[index].isSelected = 1;
                }

            }
            else {
                tempArray[position].isSelected = 0;
            }


        })
        tempData.imageArray = tempArray;
        this.setState({ uploadImagesData: tempData });

    }


    renderItem({ item, index }) {
        var imagePath = item.url ? API.USER_IMAGE_PATH + item.url : '';
        return (
            <TouchableOpacity onPress={() => contextRef.uploadImageListSelection(index)}>
                <View style={OverviewScreenStyle.overviewImageListItemStyle}>
                    <Image source={{ uri: imagePath }} style={OverviewScreenStyle.overviewPropertyListImageStyle} />
                </View>
                {
                    item.isSelected == 1 ? <View style={OverviewScreenStyle.selectedImageStyle}>

                    </View> : null
                }
            </TouchableOpacity>
        );
    }

    agentRenderItem({ item, index }) {
        var userImage = item.image ? (item.image ? API.USER_IMAGE_PATH + item.image : '') : '';
        var agencyLogoImage = item.agency_id ? (item.agency_id.logoImage ? API.USER_IMAGE_PATH + item.agency_id.logoImage : '') : '';
        var firstName = item.firstname ? item.firstname : '';
        var lastName = item.lastname ? item.lastname : '';
        var address = item.address ? item.address : '';
        var teamCount = item.team_cnt ? item.team_cnt : 0;
        var propertyCount = item.property_cnt ? item.property_cnt : 0;
        var averageRate = item.averageRate ? item.averageRate : 0;
        var totalReviewLength = item.totalReviewLength ? item.totalReviewLength : 0;
        return (
            <View style={OverviewScreenStyle.listItemContainer}>
                <View style={OverviewScreenStyle.listImageContainerStyle}>
                    <TouchableOpacity onPress={ref.callAgentProfileScreen.bind(ref, item._id, averageRate, totalReviewLength)} >
                        {
                            userImage != '' ? <Image source={{ uri: userImage }} style={OverviewScreenStyle.listImageStyle} />
                                :
                                <View style={OverviewScreenStyle.emptyMaintenaceUserImageStyle}>
                                    <Text style={OverviewScreenStyle.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                </View>
                        }
                    </TouchableOpacity>


                    {item.is_online ?
                        <View style={OverviewScreenStyle.onLineStatusViewStyle} />
                        :
                        <View style={OverviewScreenStyle.statusViewStyle} />
                    }
                </View>

                <Text style={OverviewScreenStyle.listTitleTextStyle}>{firstName + ' ' + lastName}</Text>
                <View>
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
                </View>
                <Text style={OverviewScreenStyle.listReviewTextStyle}>{averageRate + ' ' + 'from' + ' ' + totalReviewLength + ' ' + 'reviews'}</Text>
                <Text style={OverviewScreenStyle.listReviewTextStyle}>{address}</Text>

                <TouchableOpacity onPress={ref.callSendMessageScreen.bind(ref, firstName, lastName, item._id)} >
                    <View style={OverviewScreenStyle.roundedBlueMessageButtonStyle}>
                        <Text style={OverviewScreenStyle.messageButtonTextStyle}>
                            {Strings.CONTACT_AGENT}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* <View style={OverviewScreenStyle.userInfoContainerStyle}>
                    <View style={OverviewScreenStyle.userInfoTextContainerStyle}>
                        <Text style={OverviewScreenStyle.labelTextStyle}>Team members</Text>
                        <Text style={OverviewScreenStyle.infoTextStyle}>{teamCount}</Text>
                    </View>
                    <View style={OverviewScreenStyle.userInfoTextContainerStyle}>
                        <Text style={OverviewScreenStyle.labelTextStyle}>Inspection frequency</Text>
                        <Text style={OverviewScreenStyle.infoTextStyle}>6 /mo</Text>
                    </View>
                    <View style={OverviewScreenStyle.userInfoTextContainerStyle}>
                        <Text style={OverviewScreenStyle.labelTextStyle}>No. of properties\n managed</Text>
                        <Text style={OverviewScreenStyle.infoTextStyle}>{propertyCount}</Text>
                    </View>
                </View>
                {
                    agencyLogoImage != '' ? <Image source={{ uri: agencyLogoImage }} style={OverviewScreenStyle.likeImageViewStyle} />
                        :
                        <View style={OverviewScreenStyle.emptyLogoImageStyle}>

                        </View>
                } */}

            </View>
        );
    }


    callSendMessageScreen(firstname, lastname, id) {
        Actions.MessageToTraderScreen({ userFirstName: firstname, userLastName: lastname, receiverId: id });
    }

    callAgentProfileScreen(id, averageRate, totalReviewLength) {
        Actions.AgentProfileScreen({ user_id: id, averageRating: averageRate, totalReviewLengthrating: totalReviewLength });
    }

    render() {

        var total_manager = this.state.infoData ? this.state.infoData.total_manager : 0;
        var total_property = ''
        // var total_property = this.state.infoData ? (this.state.infoData.data.length > 0 ? this.state.infoData.data[1].value : 0) : 0;

        var averagerate = this.state.userReviewData ? (this.state.userReviewData.data ? this.state.userReviewData.data : 0) : 0;
        var totalreviews = this.state.userReviewData.total_review ? this.state.userReviewData.total_review : 0;
        var agencyImage = this.state.overViewData.agency_id ? (this.state.overViewData.agency_id.logoImage
            ? API.USER_IMAGE_PATH + this.state.overViewData.agency_id.logoImage : '') : ''
        return (
            <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>

                {
                    this.state.selectedImage != ''
                        ?
                        <Image source={{ uri: API.USER_IMAGE_PATH + this.state.selectedImage }} style={OverviewScreenStyle.overviewImageStyle} />
                        :
                        null
                }
                <View style={{ marginTop: 5 }}>
                    {
                        this.state.overViewData.images.length > 0 ?
                            <FlatList
                                horizontal={true}
                                data={this.state.overViewData.images}
                                renderItem={this.renderItem}
                                extraData={this.state}
                            /> : null
                    }

                </View>

                <View>

                    <Text style={OverviewScreenStyle.titleTextStyle}>About {this.state.overViewData.firstname ? this.state.overViewData.firstname : "" + ' ' + this.state.overViewData.lastname ? this.state.overViewData.lastname : ""}</Text>
                    <Text style={OverviewScreenStyle.detailsTextStyle}>
                        {
                            this.state.overViewData.groups ? this.state.overViewData.groups.about_user : 'No data found'
                        }
                    </Text>
                </View>

                {/* {
                    this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER
                        ?
                        <View>
                            <View style={OverviewScreenStyle.userInfoTextContainerStyle}>
                                <Text style={OverviewScreenStyle.labelTextStyle}>Properties being managed</Text>
                                <Text style={OverviewScreenStyle.valueTextStyle}>{total_property}</Text>
                            </View>

                            <View style={OverviewScreenStyle.userInfoTextContainerStyle}>
                                <Text style={OverviewScreenStyle.labelTextStyle}>Property Managers</Text>
                                <Text style={OverviewScreenStyle.valueTextStyle}>{total_manager}</Text>
                            </View>
                        </View>

                        : null
                } */}

                {
                    this.state.roleName == Strings.USER_ROLE_AGENT
                        ?

                        <View style={OverviewScreenStyle.userInfoTextContainerStyle}>
                            <Text style={OverviewScreenStyle.labelTextStyle}>Properties being managed</Text>
                            <Text style={OverviewScreenStyle.valueTextStyle}>{total_property}</Text>
                        </View>

                        : null
                }


                {
                    this.state.roleName == Strings.USER_ROLE_AGENCY_OWNER ?
                        <View>
                            <Text style={OverviewScreenStyle.titleTextStyle}>Agents</Text>

                            {this.state.agentListData.length > 0 ?
                                <FlatList contentContainerStyle={CommonStyles.flatListStyle}
                                    horizontal={true}
                                    data={this.state.agentListData}
                                    renderItem={this.agentRenderItem}
                                    extraData={this.state}
                                />
                                :
                                this.props.agentsScreenReducer.isScreenLoading ?
                                    null
                                    :
                                    <View style={{ flex: 1, justifyContent: 'center', marginTop: window.height * 0.25 }}>
                                        <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>
                                            {Strings.NO_AGENT_FOUND}</Text>
                                    </View>
                            }
                        </View>
                        : null
                }

                {this.state.roleName == Strings.USER_ROLE_AGENT
                    ?


                    this.state.overViewData.agency_id != ''
                        ?
                        <View>
                            <Text style={OverviewScreenStyle.titleTextStyle}>Agency</Text>

                            <View style={OverviewScreenStyle.agencyReviewContainerStyle}>
                                {agencyImage == '' ? <Image source={ImagePath.USER_DEFAULT} style={OverviewScreenStyle.agencyImageStyle} />
                                    :
                                    <Image source={{ uri: agencyImage }} style={OverviewScreenStyle.agencyImageStyle} />
                                }
                                <View style={OverviewScreen.reviewContainerStyle}>
                                    <Text style={OverviewScreenStyle.agencyTitleTextStyle}>{this.state.overViewData.agency_id ? this.state.overViewData.agency_id.name : ''}</Text>
                                    <View style={{ marginLeft: 16 }}>
                                        <StarRating
                                            disabled={true}
                                            maxStars={5}
                                            starSize={20}
                                            starStyle={{ paddingRight: 2, paddingLeft: 2, marginTop: 5, marginBottom: 5 }}
                                            emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                            starColor={Colors.STAR_COLOR}
                                            rating={averagerate}
                                            selectedStar={(rating) => this.onStarRatingPress(rating)}
                                        />
                                    </View>

                                    <Text style={OverviewScreenStyle.reviewDetailsTextStyle}>{averagerate + ' ' + 'from' + ' ' + totalreviews + ' ' + 'reviews'}</Text>
                                </View>
                            </View>

                        </View>
                        : <View style={{ marginTop: 10, marginLeft: 5 }}><Text style={OverviewScreenStyle.reviewDetailsTextStyle}>Not associate with agency</Text></View>
                    : null
                }



            </ScrollView >

        );
    }
}

function mapStateToProps(state) {

    return {
        agentsScreenReducer: state.agentsScreenReducer,
        profileReducer: state.profileReducer,
    }
}

export default connect(
    mapStateToProps,
    {

        getAllAgentListWithiInAgency,
        showLoading,
        resetState,
        getAgencyProfile,
        getUserReviewsList
    }

)(OverviewScreen);
