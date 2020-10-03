import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Image,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Alert,
  Platform,ImageBackground,
  TextInput,
  ScrollView,
  FlatList,
  AsyncStorage,Modal
} from "react-native";
import DatePicker from 'react-native-datepicker'

import IMAGEPATH from '../../../Constants/ImagesPath';

// import MenuModal from '../../../Components/SyncittHome/MenuModal';

import {
  getTraderJobHistory,
  getTradersProfile
} from "../../../Action/ActionCreators";

import { showLoading, resetState } from "../TradersAction";
import { updateRating } from "../../WriteReviewComponent/WriteReviewAction";
import TraderAvailabilityScreen from "./TraderAvailabilityScreen";
import { Actions } from "react-native-router-flux";
import Colors from "../../../Constants/Colors";
import Strings from "../../../Constants/Strings";
import ImagePath from "../../../Constants/ImagesPath";
import TradersProfileScreenStyle from "./TradersProfileScreenStyle";
//import listData from  "../../../../data";
import CommonStyles from "../../../CommonStyle/CommonStyle";
import TradersOverviewScreen from "./TradersOverviewScreen";
import TradersReviewAndRatingScreen from "./TradersReviewAndRatingScreen";
import API from "../../../Constants/APIUrls";
import StarRating from "react-native-star-rating";
import { CardView } from "../../CommonComponent/CardView";
import Moment from "moment";
import { Matrics } from "../../../CommonConfig";
import APICaller from "../../../Saga/APICaller";
import COLORS from "../../../Constants/Colors";
// import MenuModal from "../../SyncittHome/MenuModal";
let ref;

class TradersProfileScreen extends Component {
  constructor() {
    super();
    ref = this;
    this.state = {
      starCount: 0,
      isTabSelected: 1,
      tradersId: "",
      jobHistoryData: "",
      profileData: {},
      averageRate: 0,
      totalreviews: 0,
      renderSlide:0
    };
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.writeReviewReducer.isRatingUpdate != "") {

      this.callGetTradersProfile();
      this.props.updateRating("");
    }
  }

  componentDidUpdate() {
    this.onGetProfileSuccess();
    this.onGetTraderJobHistorySuccess();
  }

  componentWillUnmount() { }
  componentWillMount() {
    this.setState({ tradersId: this.props.user_id });
    this.setState({ averageRate: this.props.averageRating });
    this.setState({ totalreviews: this.props.totalReviewLengthrating });
    this.callGetTradersProfile();
  }

  closeNotifications() {
    Actions.pop();
    // Actions.popTo('Dashboard');
  }

  onOverviewTabClick() {
    this.setState({ isTabSelected: 1 });
  }
  onJobHistoryTabClick() {
    this.setState({ isTabSelected: 2 });
  }
  onReviewAndRatingsTabClick() {
    this.setState({ isTabSelected: 3 });
  }
  onAvailabilityTabClick() {
    this.setState({ isTabSelected: 4 });
  }
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }
  renderImageItem(item, index) {
    return (
      <Image
        source={{ uri: item.url }}
        style={TradersProfileScreenStyle.userListImageStyle}
      />
    );
  }

  callSendMessageScreen() {
    Actions.MessageToTraderScreen({
      userFirstName: this.state.profileData.firstname,
      userLastName: this.state.profileData.lastname,
      receiverId: this.state.profileData._id
    });
  }

  callGetTradersJobHistory() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;

          var postData = {
            trader_id: this.props.user_id,
            page_number: 0,
            number_of_pages: 0
          };
          this.props.showLoading();
          this.props.getTraderJobHistory(authToken, postData);
        }
      })
      .done();
  }

  onGetTraderJobHistorySuccess() {
    if (this.props.tradersReducer.jobHistoryRes != "") {
      if (this.props.tradersReducer.jobHistoryRes.code == 200) {
        this.setState({
          jobHistoryData: this.props.tradersReducer.jobHistoryRes.data
        });
      } else {
        alert(this.props.tradersReducer.jobHistoryRes.message);
      }
      this.props.resetState();
    }
  }

  callGetTradersProfile() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;
          var postData = {
            userId: this.props.user_id
          };
          this.props.showLoading();
          this.props.getTradersProfile(authToken, postData);
        }
      })
      .done();
  }

  onGetProfileSuccess() {
    if (this.props.tradersReducer.tradersProfileRes != "") {
      if (this.props.tradersReducer.tradersProfileRes.code == 200) {

        this.setState({
          profileData: this.props.tradersReducer.tradersProfileRes.data
        });
        this.callGetTradersJobHistory();
      } else {
        alert(this.props.tradersReducer.tradersProfileRes.message);
      }
      this.props.resetState();
    }
  }

  renderJobHistory({ item, index }) {
    return (
      <CardView>
        <View style={TradersProfileScreenStyle.listMainContainerStyle}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={TradersProfileScreenStyle.propertyTitleViewStyle}>
              <Text style={TradersProfileScreenStyle.propertyTitleTextStyle}>
                {item.request_overview}
              </Text>
              {item.reviews && item.reviews.length > 0 && item.reviews[0].avg_total &&
                <View style={{ width: 150 }}>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    starSize={25}
                    starStyle={{ paddingRight: 5, marginTop: 8 }}
                    starColor={Colors.STAR_COLOR}
                    emptyStarColor={Colors.EMPTY_STAR_COLOR}
                    rating={item.reviews && item.reviews.length > 0 && item.reviews[0].avg_total ? item.reviews[0].avg_total : 0}
                    selectedStar={rating => ref.onStarRatingPress(rating)}
                  />
                </View>
              }
            </View>
            <View style={TradersProfileScreenStyle.propetySubTitleViewStyle}>
              <Text style={TradersProfileScreenStyle.propertySubTitleTextStyle}>
                ${item.budget}
              </Text>
              <Text style={TradersProfileScreenStyle.dateTextStyle}>
                {Moment(item.due_date).fromNow()}
              </Text>
            </View>

          </View>
        </View>
      </CardView>
    );
  }
  showMobileNumber(id) {
    // 

    let requestParams = { "reveal_contact_number": 1, "user_id": id }
    APICaller('updateRevealContactNumber', 'POST', "", requestParams).then(data => {
      if (data.code == 200) {
        console.log(data, "updateRevealContactNumber")
      }
    })
    this.setState({ showMobileNumber: true })
  }
  /*renderItem({ item, index }) {

        return (
            <View style={TradersProfileScreenStyle.listMainContainerStyle}>

                <View style={TradersProfileScreenStyle.propertyImageViewStyle}>
                    <Image source={{ uri: item.url }} style={TradersProfileScreenStyle.propertyImageStyle} />
                    <Image source={ImagePath.HEART} style={TradersProfileScreenStyle.likeImageViewStyle} />
                </View>
                <View style={TradersProfileScreenStyle.propertyTitleViewStyle}>
                    <Text style={TradersProfileScreenStyle.propertyTitleTextStyle}>{item.category}</Text>
                </View>
                <View style={TradersProfileScreenStyle.propetySubTitleViewStyle}>
                    <Text style={TradersProfileScreenStyle.propertySubTitleTextStyle}>{item.category}</Text>
                </View>

                <View style={TradersProfileScreenStyle.imageListMainContainerStyle}>
                    <View>
                        <Image source={ImagePath.USER_DEFAULT} style={TradersProfileScreenStyle.userImageStyle} />
                    </View>


                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={TradersProfileScreenStyle.imageListContainerStyle}>
                            {
                                listData.map((data, index) => {
                                    return ref.renderImageItem(data, index);
                                })
                            }
                        </View>
                    </ScrollView>

                </View>

                <View style={TradersProfileScreenStyle.propertyInfoContainerViewStyle}>

                    <View style={TradersProfileScreenStyle.propertyBedroomViewContainer}>
                        <Image source={ImagePath.DOLLAR_ICON} />
                        <Text style={TradersProfileScreenStyle.propertyValueTextStyle}>4500</Text>
                    </View>
                    <View style={TradersProfileScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.CALENDAR_ICON} />
                        <Text style={TradersProfileScreenStyle.propertyValueTextStyle}>Jul 29, 2017</Text>
                    </View>
                    <View style={TradersProfileScreenStyle.propertyWashrooViewContainer}>
                        <Image source={ImagePath.SEARCH_ICON} />
                        <Text style={TradersProfileScreenStyle.propertyValueTextStyle}>4 times</Text>
                    </View>

                </View>
            </View>
        );
    }*/
 
                  
  navBar() {
    return (
      <View style={TradersProfileScreenStyle.profileHeaderContainer}>
        <TouchableOpacity
          onPress={() => this.closeNotifications()}
          style={{ marginLeft: 10, marginTop: 10 }}
        >
          <View style={{ padding: 20, paddingLeft: 20 }}>
            <Image source={ImagePath.BACK_WHITE} />
          </View>
        </TouchableOpacity>

        {/*<TouchableOpacity style={{ marginRight: 20 }}>
                    <Image source={ImagePath.HEART} />
                </TouchableOpacity>*/}
      </View>
    );
  }

  render() {

    var userImagePath = this.state.profileData.image
      ? API.USER_IMAGE_PATH + this.state.profileData.image
      : "";
    var bannerImage = this.state.profileData.bannerImage
      ? API.USER_IMAGE_PATH + this.state.profileData.bannerImage
      : "";
    var firstName = this.state.profileData.firstname
      ? this.state.profileData.firstname
      : "";
    var lastName = this.state.profileData.lastname
      ? this.state.profileData.lastname
      : "";
    var averageRate = this.state.averageRate ? this.state.averageRate : 0;
    var totalreviews = this.state.totalreviews ? this.state.totalreviews : 0;

    return (
      <View>
    {/* {this.state.renderSlide == 3 && this.renderFormRequest()} */}

        <ScrollView
          contentContainerStyle={{
            paddingBottom: 70,
            backgroundColor: Colors.SETTING_SCREEN_BG_COLOR
          }}
        >
          <View style={TradersProfileScreenStyle.profileContainer}>
            <View style={TradersProfileScreenStyle.topCoverImageContainer}>
              {bannerImage != "" ? (
                <Image
                  source={{ uri: bannerImage }}
                  style={TradersProfileScreenStyle.topCoverImageContainer}
                />
              ) : (
                  <View
                    style={TradersProfileScreenStyle.topCoverImageContainer}
                  />
                )}
            </View>

            <View style={TradersProfileScreenStyle.bottomCoverImageContainer}>
              <Image
                source={ImagePath.HEADER_BG}
                style={TradersProfileScreenStyle.bottomCoverImageContainer}
              />
            </View>
            <View style={TradersProfileScreenStyle.profileDataContainer}>
              <View
                style={TradersProfileScreenStyle.profileNameAndReviewContainer}
              >
                {userImagePath != "" ? (
                  <Image
                    source={{ uri: userImagePath }}
                    style={TradersProfileScreenStyle.profileImageStyle}
                  />
                ) : (
                    <View style={CommonStyles.emptyUserImageStyle}>
                      <Text style={CommonStyles.initialTextStyle}>
                        {firstName.charAt(0).toUpperCase() +
                          " " +
                          lastName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                <Text style={TradersProfileScreenStyle.userNameTextStyle}>
                  {firstName + " " + lastName}
                </Text>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  starSize={20}
                  starStyle={{ paddingRight: 2, paddingLeft: 2, marginTop: 8 }}
                  fullStarColor={Colors.STAR_COLOR}
                  starColor={Colors.STAR_COLOR}
                  halfStarColor={Colors.STAR_COLOR}
                  rating={averageRate}
                  selectedStar={rating => ref.onStarRatingPress(rating)}
                />
                <Text style={TradersProfileScreenStyle.userReviewtextStyle}>
                  {averageRate +
                    " " +
                    "from" +
                    " " +
                    totalreviews +
                    " " +
                    "reviews"}
                </Text>

<TouchableOpacity onPress={() => {
  
  AsyncStorage.getItem("SyncittUserInfo")
  .then(value => {
    if (value) {
      var userData = JSON.parse(value);
      this.props.navigation.navigate('SyncittSearch',{_id:this.state.profileData._id,fromTraderProfile:'true',userData:userData})

    }})
  
  }} style={{ height: Matrics.ScaleValue(40), width: '50%', backgroundColor: COLORS.ORANGE_BUTTON_BACKGROUND, borderRadius: Matrics.ScaleValue(50), marginTop: Matrics.ScaleValue(20), justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: Matrics.ScaleValue(12), fontWeight: '600', lineHeight: Matrics.ScaleValue(18) }}>REQUEST MAINTENANCE</Text>
                            </TouchableOpacity>

                <TouchableOpacity
                  onPress={this.callSendMessageScreen.bind(this)}
                >
                  <View style={TradersProfileScreenStyle.contactAgentView}>
                    <Text style={TradersProfileScreenStyle.buttonTextStyle}>
                      {Strings.SEND_MESSAGE}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={TradersProfileScreenStyle.userInfoContainerStyle}>
                <View
                  style={TradersProfileScreenStyle.userInfoTextContainerStyle}
                >
                  <Text style={TradersProfileScreenStyle.labelTextStyle}>
                    Location
                  </Text>
                  <Text style={TradersProfileScreenStyle.infoTextStyle}>
                    {/* {this.state.profileData.address} */}
                    {this.state.profileData.city}, {this.state.profileData.state}
                  </Text>
                </View>
                <View
                  style={TradersProfileScreenStyle.userInfoTextContainerStyle}
                >
                  <Text style={TradersProfileScreenStyle.labelTextStyle}>
                    Phone number
                  </Text>
                  {!this.state.showMobileNumber &&
                    <TouchableOpacity onPress={() => this.showMobileNumber(this.state.profileData._id)}><Text style={{ color: Colors.SKY_BLUE_BUTTON_BACKGROUND, fontSize: Matrics.ScaleValue(12), fontWeight: '600' }}>SHOW NUMBER</Text></TouchableOpacity>
                  }
                  {this.state.profileData.mobile_no && this.state.showMobileNumber ?
                    <Text style={TradersProfileScreenStyle.infoTextStyle}>
                      {this.state.profileData.mobile_no}
                    </Text>
                    :
                    <Text style={TradersProfileScreenStyle.infoTextStyle}>
                      {this.state.profileData.mobile_no ? this.state.profileData.mobile_no.replace(/.(?=.{4})/g, '*') : ""}
                    </Text>

                  }
                </View>
                {/* <View
                  style={TradersProfileScreenStyle.userInfoTextContainerStyle}
                >
                  <Text style={TradersProfileScreenStyle.labelTextStyle}>
                    Email address
                  </Text>
                  <Text style={TradersProfileScreenStyle.infoTextStyle}>
                    {this.state.profileData.email}
                  </Text>
                </View> */}
              </View>
            </View>
            <View style={TradersProfileScreenStyle.profileImageContainer}>
              {this.state.profileData.is_online ? (
                <View style={TradersProfileScreenStyle.onLineStatusViewStyle} />
              ) : (
                  <View style={TradersProfileScreenStyle.statusViewStyle} />
                )}
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={
                TradersProfileScreenStyle.tabContainerScrollViewStyle
              }
            >
              <View style={TradersProfileScreenStyle.tabContainerStyle}>
                <TouchableOpacity onPress={() => this.onOverviewTabClick()}>
                  <View>
                    <View style={TradersProfileScreenStyle.tabTextViewStyle}>
                      <Text
                        style={
                          this.state.isTabSelected == 1
                            ? TradersProfileScreenStyle.tabLabelTextStyle
                            : TradersProfileScreenStyle.tabLabelDiselectTextStyle
                        }
                      >
                        {Strings.OVERVIEW}
                      </Text>
                    </View>
                    {this.state.isTabSelected == 1 ? (
                      <View
                        style={TradersProfileScreenStyle.tabIndicatorStyle}
                      />
                    ) : (
                        <View
                          style={TradersProfileScreenStyle.tabWhiteIndicatorStyle}
                        />
                      )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.onJobHistoryTabClick()}>
                  <View>
                    <View style={TradersProfileScreenStyle.tabTextViewStyle}>
                      <Text
                        style={
                          this.state.isTabSelected == 2
                            ? TradersProfileScreenStyle.tabLabelTextStyle
                            : TradersProfileScreenStyle.tabLabelDiselectTextStyle
                        }
                      >
                        {Strings.JOB_HISTORY}
                      </Text>
                    </View>
                    {this.state.isTabSelected == 2 ? (
                      <View
                        style={TradersProfileScreenStyle.tabIndicatorStyle}
                      />
                    ) : (
                        <View
                          style={TradersProfileScreenStyle.tabWhiteIndicatorStyle}
                        />
                      )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.onReviewAndRatingsTabClick()}
                >
                  <View>
                    <View style={TradersProfileScreenStyle.tabTextViewStyle}>
                      <Text
                        style={
                          this.state.isTabSelected == 3
                            ? TradersProfileScreenStyle.tabLabelTextStyle
                            : TradersProfileScreenStyle.tabLabelDiselectTextStyle
                        }
                      >
                        {Strings.REVIEWS_AND_RATINGS}
                      </Text>
                    </View>
                    {this.state.isTabSelected == 3 ? (
                      <View
                        style={TradersProfileScreenStyle.tabIndicatorStyle}
                      />
                    ) : (
                        <View
                          style={TradersProfileScreenStyle.tabWhiteIndicatorStyle}
                        />
                      )}
                  </View>
                </TouchableOpacity>

              </View>
            </ScrollView>
            {this.state.isTabSelected == 1 ? (
              <TradersOverviewScreen overViewData={this.state.profileData} />
            ) : null}
            {this.state.isTabSelected == 2 ? (
              <FlatList
                data={this.state.jobHistoryData && this.state.jobHistoryData.reverse()}
                renderItem={this.renderJobHistory}
                extraData={this.state}
              />
            ) : null}
            {this.state.isTabSelected == 3 ? (
              <TradersReviewAndRatingScreen
                reviewToId={this.state.tradersId}
                reviewToName={
                  this.state.profileData.firstname +
                  " " +
                  this.state.profileData.lastname
                }
                averageRate={averageRate}
                totalreviews={totalreviews}
                isUserProfile={false}
              />
            ) : null}


          </View>
        </ScrollView>

        {this.navBar()}
      </View>
    );
  }
}

function mapStateToProps(state) {

  return {
    tradersReducer: state.tradersReducer,
    writeReviewReducer: state.writeReviewReducer
  };
}

export default connect(
  mapStateToProps,
  {
    getTraderJobHistory,
    getTradersProfile,
    showLoading,
    resetState,
    updateRating
  }
)(TradersProfileScreen);


const style = StyleSheet.create({
  syncittBackgroundContainer: {
      flex: 1, alignItems: 'center',
      // backgroundColor: 'black'
  },
  tabContainer: {
      height: Matrics.ScaleValue(65), backgroundColor: 'white', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%', borderTopWidth: Matrics.ScaleValue(1), borderTopColor: COLORS.GRAY
  },
  tabContainerInner: {
      flex: 0.2, justifyContent: 'center', alignItems: 'center'
  },
  imageStyle: {
      height: Matrics.ScaleValue(30), width: Matrics.ScaleValue(30), tintColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND
  },
  renderTraderContainer: {
      flex: 1, alignItems: 'center'
  },
  traderContainerScrollview: {
      flex: 1, width: '100%'
  },
  traderTransparentContainer: {
      // backgroundColor: COLORS.TRANSLUCENT,
      width: '100%', flex: 1
  },
  traderSubContainer: {
      margin: Matrics.ScaleValue(10), marginBottom: 0, borderTopLeftRadius: Matrics.ScaleValue(5), borderTopRightRadius: Matrics.ScaleValue(5), padding: Matrics.ScaleValue(25)
  },
  syncittLogoContainer: {
      height: Matrics.ScaleValue(120), justifyContent: 'center', alignItems: 'center'
  },
  logoImageStyle: {
      height: Matrics.ScaleValue(75)
  },
  backToSearchContainer: {
      height: Matrics.ScaleValue(38), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '55%', margin: Matrics.ScaleValue(15), backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: Matrics.ScaleValue(60)
  },
  backToSearchTextStyle: {
      color: COLORS.WHITE, fontSize: Matrics.ScaleValue(12), fontWeight: '600'
  },
  renderTraderContainerStyle: {
      height: Matrics.ScaleValue(385), backgroundColor: 'white', borderRadius: Matrics.ScaleValue(6), justifyContent: 'center', elevation: 2, shadowOffset: { width: 0, height: 0 }, shadowColor: 'gray', shadowOpacity: 0.3, shadowRadius: Matrics.ScaleValue(5), borderRadius: Matrics.ScaleValue(5), marginBottom: Matrics.ScaleValue(20),
  },
  logoContainer: {
      justifyContent: 'center', alignItems: 'center', margin: Matrics.ScaleValue(20)
  },
  greenDotStyle: {
      backgroundColor: COLORS.STATUS_GREEN_COLOR, width: Matrics.ScaleValue(25), borderRadius: Matrics.ScaleValue(20), bottom: Matrics.ScaleValue(5), right: Matrics.ScaleValue(5), position: 'absolute', height: Matrics.ScaleValue(25)
  },
  profileImageStyle: {
      height: Matrics.ScaleValue(120), width: Matrics.ScaleValue(120), borderRadius: Matrics.ScaleValue(60)
  },
  profileDataContainer: {
      justifyContent: 'center', alignItems: 'center'
  },
  traderNameTextStyle: {
      fontSize: Matrics.ScaleValue(18), color: 'gray', fontWeight: '600'
  },
  reviewsStyle: {
      fontSize: Matrics.ScaleValue(12), lineHeight: Matrics.ScaleValue(25), color: 'gray', fontWeight: '600'
  },
  servicesContainer: {
      flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
  },
  serviceTextContainer: {
      height: Matrics.ScaleValue(20), margin: Matrics.ScaleValue(5), paddingHorizontal: Matrics.ScaleValue(15), borderRadius: Matrics.ScaleValue(5), justifyContent: 'center', alignItems: 'center', backgroundColor: 'skyblue'
  },
  extServiceTextContainer: {
      height: Matrics.ScaleValue(20), margin: Matrics.ScaleValue(5), width: Matrics.ScaleValue(50), borderRadius: Matrics.ScaleValue(5), justifyContent: 'center', alignItems: 'center', backgroundColor: 'skyblue'
  },
  serviceTextStyle: {
      color: 'white', fontWeight: '600', fontSize: Matrics.ScaleValue(12)
  },
  footerButtonContainer: {
      padding: Matrics.ScaleValue(10), width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center'
  },
  viewProfileButtonStyle: {
      height: Matrics.ScaleValue(30), width: Matrics.ScaleValue(120), borderRadius: Matrics.ScaleValue(30), justifyContent: 'center', alignItems: 'center', margin: Matrics.ScaleValue(5), borderColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderWidth: Matrics.ScaleValue(1)
  },
  viewProfileButtonTextStyle: {
      color: 'gray', fontWeight: '600', fontSize: 11
  },
  getQuotesButtonStyle: {
      height: 30, width: 120, justifyContent: 'center', alignItems: 'center', borderRadius: 30, margin: 5, backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND
  },
  getQuotesButtonTextStyle: {
      color: 'white', fontWeight: '600', fontSize: 11
  },
  renderIntialSearchContainer: {
      // backgroundColor: COLORS.TRANSLUCENT,
      width: '100%',
      flex: 1
  },
  syncittLogoContainer1: {
      height: Matrics.ScaleValue(250), justifyContent: 'center', alignItems: 'center'
  },
  headerTitleStyle: {
      justifyContent: 'center', margin: Matrics.ScaleValue(15), alignItems: 'center'
  },
  headerTextStyle: {
      fontSize: Matrics.ScaleValue(30), textAlign: 'center', color: 'white'
  },
  textbox1Conatiner: {
      height: Matrics.ScaleValue(55), borderRadius: Matrics.ScaleValue(5), justifyContent: 'center', paddingLeft: Matrics.ScaleValue(20), paddingRight: Matrics.ScaleValue(10), alignSelf: 'center', width: '85%', backgroundColor: 'white', margin: Matrics.ScaleValue(10)

  },
  textbox2Conatiner: {
      height: Matrics.ScaleValue(55), borderRadius: Matrics.ScaleValue(5), flexDirection: 'row', alignSelf: 'center', paddingLeft: Matrics.ScaleValue(20), paddingRight: Matrics.ScaleValue(0), alignItems: 'center', width: '85%', backgroundColor: 'white', margin: Matrics.ScaleValue(10)
  },
  locationMarkerStyle: {
      margin: 0
  },
  searchButtonContainer: {
      height: Matrics.ScaleValue(50), flexDirection: 'row', alignSelf: 'center', width: '60%', margin: Matrics.ScaleValue(20), backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: Matrics.ScaleValue(60)
  },
  searchImageContainer: {
      flex: 0.2, justifyContent: 'center', alignItems: 'center'
  },
  searchTextContainer: {
      flex: 0.6, justifyContent: 'center', alignItems: 'center'
  },
  searchTextStyle: {
      color: 'white',
      fontSize: Matrics.ScaleValue(15),
      fontWeight: '600'
  },
  scrollViewContainer: {
      backgroundColor: COLORS.DROP_DOWN_BACKGROUND_COLOR,
      width: '100%', flex: 1
  },
  transparentFormContainer: {
      backgroundColor: COLORS.TRANSLUCENT, width: '100%', flex: 1
  },
  syncittLogoContainer2: {
      height: Matrics.ScaleValue(180), justifyContent: 'center', alignItems: 'center'
  },
  syncittLogoStyle: {
      height: Matrics.ScaleValue(75), bottom: Matrics.ScaleValue(-20)
  },
  formHeaderTextContainer: {
      margin: Matrics.ScaleValue(25), marginBottom: 0, borderTopLeftRadius: Matrics.ScaleValue(5), borderTopRightRadius: Matrics.ScaleValue(5), backgroundColor: 'white', padding: Matrics.ScaleValue(25)
  },
  searchResultTextStyle: {
      color: COLORS.SKY_BLUE_BUTTON_BACKGROUND, height: Matrics.ScaleValue(16), fontSize: Matrics.ScaleValue(12)
  },
  serviceRequestTextStyle: {
      color: COLORS.GRAY_COLOR, fontSize: Matrics.ScaleValue(23), fontWeight: '600'
  },
  textInputConatiner1: {
      marginTop: Matrics.ScaleValue(30)
  },
  textInputContainer1Text: {
      color: COLORS.GRAY_COLOR, fontSize: Matrics.ScaleValue(14)
  },
  inputBoxContainer1: {
      height: Matrics.ScaleValue(40), borderWidth: Matrics.ScaleValue(1), flexDirection: 'row', borderColor: COLORS.GRAY, borderRadius: Matrics.ScaleValue(5), justifyContent: 'space-between', paddingLeft: Matrics.ScaleValue(20), alignSelf: 'center', width: '100%', backgroundColor: 'white', margin: Matrics.ScaleValue(10)
  },
  input1Style: {
      height: Matrics.ScaleValue(40), flex: 1, color: 'black'
  },
  searchIconStyle: {
      justifyContent: 'center', paddingRight: Matrics.ScaleValue(10)
  },
  textInputConatiner2: {
      marginTop: Matrics.ScaleValue(10)
  },
  textInputContainer2Text: {
      color: COLORS.GRAY_COLOR, fontSize: Matrics.ScaleValue(14)
  },
  inputBoxContainer2: {
      height: Matrics.ScaleValue(40),
      borderWidth: 1,
      flexDirection: 'row',
      borderColor: COLORS.GRAY,
      borderRadius: Matrics.ScaleValue(5),
      justifyContent: 'space-between',
      paddingLeft: Matrics.ScaleValue(20),
      alignSelf: 'center',
      width: '100%',
      backgroundColor: 'white',
      margin: Matrics.ScaleValue(10)
  },
  input2Style: {
      height: Matrics.ScaleValue(40), flex: 1, color: 'black'
  },
  calenderIconStyle: {
      justifyContent: 'center', paddingRight: Matrics.ScaleValue(10)
  },
  whiteBackgroundContainer: {
      margin: Matrics.ScaleValue(25), marginTop: 0, borderRadius: Matrics.ScaleValue(5), backgroundColor: 'white', padding: Matrics.ScaleValue(25), paddingTop: 0
  },
  addressMessageStyle: {
      fontSize: Matrics.ScaleValue(10), textAlign: 'center', color: COLORS.GRAY_COLOR
  },
  uploadFileButtonContainer: {
      height: Matrics.ScaleValue(38), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '70%', margin: Matrics.ScaleValue(20), borderColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderWidth: 1, borderRadius: Matrics.ScaleValue(60)
  },
  uploadFileTextStyle: {
      color: COLORS.GRAY_COLOR, fontSize: Matrics.ScaleValue(12), fontWeight: '600'
  },
  submitButtonContainer: {
      height: Matrics.ScaleValue(38), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '95%', margin: Matrics.ScaleValue(15), backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: Matrics.ScaleValue(60)
  },
  submitTextStyle: {
      color: COLORS.WHITE, fontSize: Matrics.ScaleValue(12), fontWeight: '600'
  },
  footerStepsConatiner: {
      margin: Matrics.ScaleValue(25), borderRadius: Matrics.ScaleValue(5)
  },
  stepsContainer: {
      height: Matrics.ScaleValue(50), justifyContent: 'center', alignSelf: 'flex-start', borderTopWidth: Matrics.ScaleValue(2), borderTopColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND
  },
  stepsTextStyle: {
      color: 'gray', fontWeight: '600', fontSize: Matrics.ScaleValue(25)
  },
  stepsDescriptionTextStyle: {
      color: COLORS.GRAY_COLOR
  },
  backToHomeStyle: {
      height: Matrics.ScaleValue(38), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '55%', margin: Matrics.ScaleValue(15), backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: Matrics.ScaleValue(60)
  },
  backToHomeTextStyle: {
      color: COLORS.WHITE, fontSize: Matrics.ScaleValue(12), fontWeight: '600'
  }
})