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
  Platform,
  TextInput,
  ScrollView,
  FlatList,
  AsyncStorage,
  Modal,
  Dimensions
} from "react-native";

import { Actions } from "react-native-router-flux";
import Colors from "../../../Constants/Colors";
import Strings from "../../../Constants/Strings";
import ImagePath from "../../../Constants/ImagesPath";
import PropertiesDetailsScreenStyle from "./PropertiesDetailsScreenStyle";
// import listData from  "../../../../data";
import CommonStyles from "../../../CommonStyle/CommonStyle";
import { CardView } from "../../CommonComponent/CardView";
import * as Progress from "react-native-progress";
import Moment from "moment";
import ImageSlider from "react-native-image-slider";
import Carousel from "react-native-snap-carousel";
import ImageZoom from "react-native-image-pan-zoom";
import {
  getUserReviewsList,
  getMaintenaceHistory,
  getAgreementOfProperty,
  getTenanciesHistory,
  getPropertyDetail,
  getUserAssociateStatus
} from "../../../Action/ActionCreators";
import { showLoading, resetState } from "./PropertyDetailAction";
import API from "../../../Constants/APIUrls";
import StarRating from "react-native-star-rating";

import MapView from "react-native-maps";
import APICaller from "../../../Saga/APICaller";
let listData = []
let ref;
const window = Dimensions.get("window");

class PropertiesDetailsScreen extends Component {
  constructor(props) {
    super(props);
    ref = this;
    this.state = {
      propertyDetailData: {},
      propertyAgreementData: "",
      tenanciesListData: [],
      // isScreenLoading:false,
      maintenanceHistoryData: [],
      starCount: 3.5,
      isShowMore: false,
      isShowPopup: false,
      isShowMoreAmenities: false,
      userReviewData: {},
      userPermission: [],
      position: 0,
      propertyImages: [],
      showCarousel: 0,
      userAssociateResData: "",
      user: {},
      is_add_property: false,
      roleName: "",
      applicantsList: [],
      userId: ""
    };

  }

  componentWillReceiveProps(nextProps) { }

  componentDidUpdate() {
    this.onGetAssociateUserStatusSuccess();
    this.onGetPropertySuccess();
    this.onGetTenanciesHistorySuccess();
    this.onGetPropertyAgreementSuccess();
    this.onGetMaintenaceHistorySuccess();
    this.onGetUserRatingSuccess();
  }

  componentWillUnmount() { }

  componentWillMount() {
    this.getRoleName();
    this.setState({ is_add_property: this.props.IS_ADD_PROPERTY });
    this.callGetAssociateUserStatus();
    this.callGetPropertyDetail();
    this.callGetPropertyAgreement();
    this.callGetMaintenanceHistory();
    this.getUsePermission();
    this.getApplicants();
  }

  CallBack() {
    if (this.state.is_add_property !== undefined) {
      if (this.state.is_add_property) {
        Actions.popTo("Dashboard");
      } else {
        Actions.pop();
      }
    } else {
      Actions.pop();
    }
  }

  getUsePermission() {
    AsyncStorage.getItem("userPermission")
      .then(value => {
        if (value) {
          var permission = JSON.parse(value);

          this.setState({ userPermission: permission.data });
        }
      })
      .done();
  }
  getApplicants() {
    AsyncStorage.getItem("SyncittUserInfo").then(value => {
      if (value) {
        var userData = JSON.parse(value);
        var authToken = userData.token;
        var postBody = {
          propertyId: this.props.propertyId
        };

        APICaller(
          "getpropertyApplicationByPropertyid",
          "POST",
          authToken,
          postBody
        ).then(data => {

          if (data.code == 200) {
            this.setState({ applicantsList: data.data });
          }
        });
      }
    });
  }
  onImageSliderClick() {

    if (this.state.propertyImages.length > 0) {
      this.setState({ showCarousel: 1 });
    }
  }
  onCloseClicked() {
    this.setState({ showCarousel: 0 });
  }

  _renderItem({ item, index }) {
    return (
      <View style={PropertiesDetailsScreenStyle.carouselItemContainer}>
        <View style={PropertiesDetailsScreenStyle.carouselInnerView}>
          <ImageZoom
            // cropWidth={Dimensions.get('window').width}
            //     cropHeight={Dimensions.get('window').height}
            imageWidth={window.width * 0.95}
            imageHeight={window.height}
          >
            <Image
              style={{
                width: window.width * 0.92,
                height: window.height,
                resizeMode: "contain"
              }}
              source={{ uri: item }}
            />
            <TouchableOpacity
              onPress={() => ref.onCloseClicked()}
              style={PropertiesDetailsScreenStyle.closeButtonContainer}
            >
              <View>
                <Text style={PropertiesDetailsScreenStyle.closeText}>
                  Close
                </Text>
              </View>
            </TouchableOpacity>
          </ImageZoom>
        </View>
      </View>
    );
  }

  callGetUserRating(userId) {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;


          this.props.showLoading();
          this.props.getUserReviewsList(authToken, userId);
        }
      })
      .done();
  }

  onGetUserRatingSuccess() {
    if (this.props.propertyDetailReducer.userReviewRes != "") {
      if (this.props.propertyDetailReducer.userReviewRes.code == 200) {
        this.setState({
          userReviewData: this.props.propertyDetailReducer.userReviewRes
        });
        this.callGetTenanciesHistory();
      } else {
        // alert(this.props.profileReducer.userReviewRes.message);
      }
      this.props.resetState();
    }
  }

  callGetAssociateUserStatus() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;
          this.setState({ userId: userData.data._id });

          AsyncStorage.getItem("roleId").then((role) => {
            if (role) {              
              var postData = {
                agency_id: userData.data.agency_id,
                property_id: this.props.propertyId,
                request_by_role: role,
                user_id: userData.data._id
              };
    
              this.props.showLoading();
              this.props.getUserAssociateStatus(authToken, postData);
            }
        }).done();
        }
      })
      .done();
  }

  getRoleName() {
    AsyncStorage.getItem(Strings.USER_ROLE_NAME)
      .then(value => {
        if (value) {

          this.setState({ roleName: value });
        }
      })
      .done();
  }
  onGetAssociateUserStatusSuccess() {
    if (this.props.propertyDetailReducer.userAssociateStatus != "") {
      if (this.props.propertyDetailReducer.userAssociateStatus.code == 200) {
        this.setState({
          userAssociateResData: this.props.propertyDetailReducer
            .userAssociateStatus.data
        });
      } else {
        // alert(this.props.profileReducer.userReviewRes.message);
      }
      this.props.resetState();
    }
  }

  callGetPropertyDetail() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          this.setState({ user: userData });
          var authToken = userData.token;
          var postData = {
            propertyId: this.props.propertyId
          };
          this.props.showLoading();
          console.log('postData',postData);
          this.props.getPropertyDetail(authToken, postData);
        }
      })
      .done();
  }

  callGetMaintenanceHistory() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;
          this.props.showLoading();
          this.props.getMaintenaceHistory(authToken, this.props.propertyId);
        }
      })
      .done();
  }

  onGetMaintenaceHistorySuccess() {
    if (this.props.propertyDetailReducer.maintenanceHistoryRes != "") {
      if (this.props.propertyDetailReducer.maintenanceHistoryRes.code == 200) {
        this.setState({
          maintenanceHistoryData: this.props.propertyDetailReducer
            .maintenanceHistoryRes.data
        });
      } else {
        alert(this.props.propertyDetailReducer.maintenanceHistoryRes.message);
      }
      this.props.resetState();
    }
  }

  callGetPropertyAgreement() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;
          this.props.showLoading();
          this.props.getAgreementOfProperty(authToken, this.props.propertyId);
        }
      })
      .done();
  }

  onGetPropertyAgreementSuccess() {
    if (
      this.props.propertyDetailReducer.propertyAgreementRes != "" &&
      this.props.propertyDetailReducer.propertyAgreementRes != null
    ) {
      if (this.props.propertyDetailReducer.propertyAgreementRes.code == 200) {
        if (
          this.props.propertyDetailReducer.propertyAgreementRes.data != null
        ) {
          this.setState({
            propertyAgreementData: this.props.propertyDetailReducer
              .propertyAgreementRes.data
          });
        }
      } else {
        alert(this.props.propertyDetailReducer.propertyAgreementRes.message);
      }
      this.props.resetState();
    }
  }

  callGetTenanciesHistory() {
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;
          this.props.showLoading();
          this.props.getTenanciesHistory(authToken, this.props.propertyId);
        }
      })
      .done();
  }

  onGetTenanciesHistorySuccess() {
    if (this.props.propertyDetailReducer.tenanciesHistoryRes != "") {
      if (this.props.propertyDetailReducer.tenanciesHistoryRes.code == 200) {
        this.setState({
          tenanciesListData: this.props.propertyDetailReducer
            .tenanciesHistoryRes.data
        });
      } else {
        alert(this.props.propertyDetailReducer.tenanciesHistoryRes.message);
      }
      this.props.resetState();
    }
  }

  onGetPropertySuccess() {
    if (this.props.propertyDetailReducer.propertyDetailResponse != "") {
      if (this.props.propertyDetailReducer.propertyDetailResponse.code == 200) {
        this.setState({
          propertyDetailData: this.props.propertyDetailReducer
            .propertyDetailResponse
        });
        var proertyRes = this.props.propertyDetailReducer.propertyDetailResponse
          .data;

        this.callGetUserRating(proertyRes[0].created_by._id);
        this.preparePropertyImagesArray(
          this.props.propertyDetailReducer.propertyDetailResponse
        );
      } else {
        alert(this.props.propertyDetailReducer.propertyDetailResponse.message);
      }
      this.props.resetState();
    }
  }

  renderImageItem(item, index) {
    return (
      <Image
        source={{ uri: item.url }}
        style={PropertiesDetailsScreenStyle.userListImageStyle}
      />
    );
  }

  preparePropertyImagesArray(propertyDetailData) {
    var imagesArray = propertyDetailData.data
      ? propertyDetailData.data.length > 0
        ? propertyDetailData.data[0].image
        : []
      : [];
    if (imagesArray.length > 0) {
      var imageArray = [];
      imagesArray.map((data, index) => {
        var imageUrl = API.PROPERTY_IMAGE_PATH + data.path;
        imageArray.push(imageUrl);
      });

      this.setState({ propertyImages: imageArray });
    }

    // if(imagesArray.length != 1){
    //     this.setState({interval: setInterval(() => {
    //         this.setState({position: this.state.position === 2 ? 0 : this.state.position + 1});
    //     }, 2000)});
    // }
  }

  amenitiesRenderItem({ item, index }) {
    if (ref.state.isShowMoreAmenities == true) {
      if (item.is_checked) {
        return (
          <View style={PropertiesDetailsScreenStyle.amentiesListItemContainer}>
            <Image source={ImagePath.AMENITIES_CHECK_ICON} />
            <Text style={PropertiesDetailsScreenStyle.amenitiesTextStyle}>
              {item.amenity_name}
            </Text>
          </View>
        );
      } else {
        return null;
      }
    } else {
      if (index < 5) {
        if (item.is_checked) {
          return (
            <View
              style={PropertiesDetailsScreenStyle.amentiesListItemContainer}
            >
              <Image source={ImagePath.AMENITIES_CHECK_ICON} />
              <Text style={PropertiesDetailsScreenStyle.amenitiesTextStyle}>
                {item.amenity_name}
              </Text>
            </View>
          );
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  }

  tenanciesHistoryRenderItem({ item, index }) {
    return (
      <View>
        <CardView>
          <View style={PropertiesDetailsScreenStyle.dateContainerStyle}>
            <Image
              source={ImagePath.DATE_ICON}
              style={PropertiesDetailsScreenStyle.dateImageStyle}
            />
            <Text style={PropertiesDetailsScreenStyle.dateTextStyle}>
              {Moment(item.case_validity).format(Strings.DATE_FORMATE)}
            </Text>
          </View>

          <View style={PropertiesDetailsScreenStyle.tenantsTitleViewStyle}>
            <Text style={PropertiesDetailsScreenStyle.tenantsTitleTextStyle}>
              {(item.property_id ? item.property_id.address : "") +
                " : " +
                "Agreement #" +
                item.agreement_id}
            </Text>
          </View>
          <View style={PropertiesDetailsScreenStyle.tenantsSubTitleViewStyle}>
            <Text style={PropertiesDetailsScreenStyle.tenantsSubTitleTextStyle}>
              {item.address_service_notice1}
            </Text>
          </View>

          <View
            style={PropertiesDetailsScreenStyle.imageListMainContainerStyle}
          >
            <View>
              <Image
                source={ImagePath.USER_DEFAULT}
                style={PropertiesDetailsScreenStyle.apartmentUserImageStyle}
              />
            </View>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View
                style={PropertiesDetailsScreenStyle.imageListContainerStyle}
              >
                {listData.map((data, index) => {
                  return ref.renderImageItem(data, index);
                })}
              </View>
            </ScrollView>
          </View>

          <View
            style={PropertiesDetailsScreenStyle.tenantsInfoContainerViewStyle}
          >
            <View
              style={PropertiesDetailsScreenStyle.propertyBedroomViewContainer}
            >
              <Image source={ImagePath.DOLLAR_ICON} />
              <Text style={PropertiesDetailsScreenStyle.propertyValueTextStyle}>
                {item.rent_price}
              </Text>
            </View>
            <View
              style={PropertiesDetailsScreenStyle.propertyWashrooViewContainer}
            >
              <Image source={ImagePath.CALENDAR_ICON} />
              <Text style={PropertiesDetailsScreenStyle.propertyValueTextStyle}>
                {Moment(item.tenancy_start_date).format(Strings.DATE_FORMATE)}
              </Text>
            </View>
            <View
              style={PropertiesDetailsScreenStyle.propertyWashrooViewContainer}
            >
              <Image source={ImagePath.SEARCH_ICON} />
              <Text style={PropertiesDetailsScreenStyle.propertyValueTextStyle}>
                {item.terms} times
              </Text>
            </View>
          </View>
        </CardView>
      </View>
    );
  }

  maintenanceHistoryRenderItem({ item, index }) {
    var userImage = item.created_by
      ? item.created_by.image
        ? API.USER_IMAGE_PATH + item.created_by.image
        : ""
      : "";
    return (
      <View
        style={
          PropertiesDetailsScreenStyle.maintenanceHistoryListContainerStyle
        }
      >
        <CardView>
          <View
            style={PropertiesDetailsScreenStyle.propertiesTitleContainerStyle}
          >
            <View
              style={PropertiesDetailsScreenStyle.propertyRatingContainerStyle}
            >
              <View
                style={PropertiesDetailsScreenStyle.userImageContainerStyle}
              >
                {userImage != "" ? (
                  <Image
                    source={{ uri: userImage }}
                    style={PropertiesDetailsScreenStyle.userImageStyle}
                  />
                ) : (
                    <Image
                      source={ImagePath.USER_DEFAULT}
                      style={PropertiesDetailsScreenStyle.userImageStyle}
                    />
                  )}
              </View>

              <View>
                <Text
                  style={
                    PropertiesDetailsScreenStyle.maintenanceHistoryListTitleTextStyle
                  }
                >
                  {item.request_overview}
                </Text>
                <View
                  style={
                    PropertiesDetailsScreenStyle.maintenanceHistoryListInfoContainerStyle
                  }
                >
                  <Image
                    source={ImagePath.PROPERTY_ID_ICON}
                    style={PropertiesDetailsScreenStyle.propertyIdImageStyle}
                  />
                  <Text
                    style={PropertiesDetailsScreenStyle.propertyIdTextStyle}
                  >
                    Property Id : {item.request_id}
                  </Text>
                </View>
                <View
                  style={
                    PropertiesDetailsScreenStyle.maintenanceHistoryListInfoContainerStyle
                  }
                >
                  <Image
                    source={ImagePath.HASHTAG_ICON}
                    style={PropertiesDetailsScreenStyle.propertyIdImageStyle}
                  />
                  <Text
                    style={PropertiesDetailsScreenStyle.propertyIdTextStyle}
                  >
                    {item.created_by
                      ? item.created_by.firstname +
                      " " +
                      item.created_by.lastname
                      : ""}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </CardView>
      </View>
    );
  }

  navBar() {
    return (
      <View style={PropertiesDetailsScreenStyle.profileHeaderContainer}>
        <TouchableOpacity
          onPress={() => this.CallBack()}
          style={{ marginLeft: 10, marginTop: 10 }}
        >
          <View style={{ padding: 20, paddingLeft: 20 }}>
            <Image source={ImagePath.BACK_WHITE} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  showHidePropertyDetailText() {
    if (this.state.isShowMore == false) {
      this.setState({ isShowMore: true });
    } else {
      this.setState({ isShowMore: false });
    }
  }

  showHideAmenities() {
    // if(this.state.isShowMoreAmenities==false){
    //     this.setState({isShowMoreAmenities:true});
    // }
    // else{
    //     this.setState({isShowMoreAmenities:false});
    // }

    this.setState({ isShowMoreAmenities: !this.state.isShowMoreAmenities });
  }
  renderApplicants() {
    if (this.state.propertyDetailData.code == 200) {
      if (
        this.state.roleName == Strings.USER_ROLE_AGENT ||
        this.state.propertyDetailData.data[0].created_by._id ==
        this.state.userId
      ) {
        return (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
            {/* <CardView> */}
            <Text style={PropertiesDetailsScreenStyle.amentiesTitleTextStyle}>
              Applicants
            </Text>

            <FlatList
              contentContainerStyle={
                PropertiesDetailsScreenStyle.maintenanceHistoryListStyle
              }
              data={this.state.applicantsList}
              // contentContainerStyle={{ flex: 1 }}
              // style={{ flex: 1 }}
              renderItem={this.renderApplicantitem}
              extraData={this.state}
            />
            {/* </CardView> */}

          </ScrollView>
        );
      }
    }
  }
  callSendMessageScreen() {
    var userData = this.state.propertyDetailData.data
      ? this.state.propertyDetailData.data[0].created_by
      : {};
    Actions.MessageToTraderScreen({
      userFirstName: userData.firstname,
      userLastName: userData.lastname,
      receiverId: userData._id
    });
  }

  callApplSyncProfileScreen() {
    if (
      this.state.propertyDetailData.data != null ||
      this.state.propertyDetailData.data != undefined
    ) {

      Actions.ApplySyncProfileScreenStepOne({
        propertyDetail: this.state.propertyDetailData.data[0]
      });
    }
  }
  renderToViewApplicantData(data) {
    data["propertyDetail"] = this.state.propertyDetailData.data[0];

    Actions.DisplayApplySyncProfileScreenStepOne({ propertyDetail: data });
    // global.isEdit = true;
    // global.propertyDetail = data
    // Actions.ApplySyncProfileScreenStepOne({ propertyDetail: data });
  }
  showPopup() {
    if (this.state.isShowPopup == false) {
      this.setState({ isShowPopup: true });
    } else {
      this.setState({ isShowPopup: false });
    }
  }
  onEditPropertyClick() {
    this.setState({ isShowPopup: false });

    Actions.EditPropertyScreenStepOne({
      propertyData: this.state.propertyDetailData
    });

  }
  renderApplicantitem = item => {
    var averageRate = item.item.averageRate ? item.item.averageRate : 0;
    var userImage = item.item.created_by
      ? item.item.created_by.image
        ? API.USER_IMAGE_PATH + item.item.created_by.image
        : ""
      : "";

    return (
      <View
        style={
          PropertiesDetailsScreenStyle.maintenanceHistoryListContainerStyle
        }
      >
        <CardView>
          <View
            style={PropertiesDetailsScreenStyle.propertiesTitleContainerStyle}
          >
            <View style={{ flexDirection: "row", flex: 1 }}>
              <TouchableOpacity
                style={PropertiesDetailsScreenStyle.userImageContainerStyle}
                onPress={() => {
                  Actions.TenantsProfile({ user_id: item.item.created_by._id, averageRating: item.item.averageRate, totalReviewLengthrating: item.item.totalReviewLength });

                }}
              >
                {userImage != "" ? (
                  <Image
                    source={{ uri: userImage }}
                    style={PropertiesDetailsScreenStyle.userImageStyle}
                  />
                ) : (
                    <Image
                      source={ImagePath.USER_DEFAULT}
                      style={PropertiesDetailsScreenStyle.userImageStyle}
                    />
                  )}
              </TouchableOpacity>

              <View style={{ paddingLeft: 15, flex: 1 }}>
                <Text
                  style={[
                    PropertiesDetailsScreenStyle.maintenanceHistoryListTitleTextStyle,
                    { paddingLeft: 5 }
                  ]}
                >
                  {item.item.created_by.firstname}{" "}
                  {item.item.created_by.lastname}
                </Text>
                <View style={{ flexDirection: "row", paddingLeft: 5 }}>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    starSize={20}
                    starStyle={{ paddingRight: 4, marginTop: 8 }}
                    fullStarColor={Colors.STAR_COLOR}
                    starColor={Colors.STAR_COLOR}
                    halfStarColor={Colors.STAR_COLOR}
                    rating={averageRate}
                  />
                </View>
                <Text
                  style={PropertiesDetailsScreenStyle.propertyIdTextStyle}
                />

                <View style={{ paddingLeft: 5, marginTop: 5 }}>
                  {item.item.status == 0 ? (
                    <TouchableOpacity
                      onPress={() => this.renderToViewApplicantData(item.item)}
                      style={{
                        backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 15,
                        padding: 5
                      }}
                    >
                      <Text style={{ color: Colors.WHITE }}>
                        View Application
                      </Text>
                    </TouchableOpacity>
                  ) : (
                      <View style={{
                        backgroundColor: Colors.SKY_BLUE_BUTTON_BACKGROUND,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 15,
                        padding: 5
                      }}>
                        {item.item.status == 1 ? (
                          <Text style={{ color: Colors.WHITE }}>
                            Application Approved
                          </Text>
                        ) : (
                            <Text style={{ color: Colors.WHITE }}>
                              Application Declined
                            </Text>
                          )}
                      </View>
                    )}
                </View>
              </View>
            </View>
          </View>
        </CardView>
      </View>
    );
  };
  render() {
    var imagesArray = this.state.propertyDetailData.data
      ? this.state.propertyDetailData.data.length > 0
        ? this.state.propertyDetailData.data[0].image
        : []
      : [];
    var propertyImage =
      imagesArray.length > 0
        ? API.PROPERTY_IMAGE_PATH + imagesArray[0].path
        : "";
    var propertyDesc = this.state.propertyDetailData.data
      ? this.state.propertyDetailData.data.length > 0
        ? this.state.propertyDetailData.data[0].description
        : ""
      : "";
    var amenitiesData = this.state.propertyDetailData.data
      ? this.state.propertyDetailData.data.length > 0
        ? this.state.propertyDetailData.data[0].amenities
        : []
      : [];
    var isTownHouse = this.state.propertyDetailData.data
      ? this.state.propertyDetailData.data[0].isTownHouse
      : false;
    var latitudeVal = this.state.propertyDetailData.data
      ? this.state.propertyDetailData.data[0].latitude
      : parseFloat("0.000000");
    var longitudeVal = this.state.propertyDetailData.data
      ? this.state.propertyDetailData.data[0].longitude
      : parseFloat("0.000000");
    var averagerate = this.state.userReviewData.data
      ? this.state.userReviewData.data
      : 0;
    var totalreviews = this.state.userReviewData.total_review
      ? this.state.userReviewData.total_review
      : 0;
    var userData = this.state.propertyDetailData.data
      ? this.state.propertyDetailData.data[0].created_by
      : {};
    var propertyIds = this.state.propertyDetailData.data
      ? this.state.propertyDetailData.data[0].property_id
      : "";
    var userImg = userData.image ? API.USER_IMAGE_PATH + userData.image : "";
    var firstName = userData.firstname ? userData.firstname : "";
    var lastName = userData.lastname ? userData.lastname : "";
    var is_online = userData.is_online ? userData.is_online : false;

    var markers = [];
    var LatLng = {
      latitude: parseFloat(latitudeVal),
      longitude: parseFloat(longitudeVal)
    };
    var marker = {
      LatLng: LatLng,
      title: this.state.propertyDetailData.data
        ? this.state.propertyDetailData.data[0].address
        : "",
      description: propertyDesc
    };
    markers.push(marker);


    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {this.state.showCarousel ? (
            <Modal onRequestClose={() => { }} transparent>
              <Carousel
                ref={c => {
                  this._carousel = c;
                }}
                data={this.state.propertyImages}
                renderItem={this._renderItem}
                sliderWidth={window.width}
                itemWidth={window.width}
              />
            </Modal>
          ) : null}

          <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={PropertiesDetailsScreenStyle.topCoverImageContainer}>
                {this.state.propertyImages != undefined && (
                  <TouchableOpacity
                    style={PropertiesDetailsScreenStyle.topCoverImageContainer}
                    onPress={() => this.onImageSliderClick()}
                  >
                    <ImageSlider
                      loopBothSides
                      images={this.state.propertyImages}
                      autoPlayWithInterval={3000}
                    />

                  </TouchableOpacity>
                )}
                {/* <Image source={{uri:this.state.propertyImages[0]}} style={PropertiesDetailsScreenStyle.topCoverImageContainer} /> */}
              </View>

              <View
                style={
                  PropertiesDetailsScreenStyle.propertiesTitleContainerStyle
                }
              >
                <Text
                  style={PropertiesDetailsScreenStyle.propertyTitleTextStyle}
                >
                  {this.state.propertyDetailData.data
                    ? this.state.propertyDetailData.data.length > 0
                      ? this.state.propertyDetailData.data[0].address
                      : ""
                    : ""}
                </Text>

                {this.state.userAssociateResData.status ? (
                  <View
                    style={
                      PropertiesDetailsScreenStyle.propertyIdContainerStyle
                    }
                  >
                    <View
                      style={
                        PropertiesDetailsScreenStyle.propertyInofoContainerStyle
                      }
                    >
                      <Image
                        source={ImagePath.PROPERTY_ID_ICON}
                        style={
                          PropertiesDetailsScreenStyle.propertyIdImageStyle
                        }
                      />
                      <Text
                        style={PropertiesDetailsScreenStyle.propertyIdTextStyle}
                      >
                        Property Id : {propertyIds}
                      </Text>
                    </View>
                    <View
                      style={
                        PropertiesDetailsScreenStyle.propertyInofoContainerStyle
                      }
                    >
                      <Image
                        source={ImagePath.USE_USER_ICON}
                        style={
                          PropertiesDetailsScreenStyle.propertyIdImageStyle
                        }
                      />
                      <Text
                        style={PropertiesDetailsScreenStyle.propertyIdTextStyle}
                      >
                        {this.state.propertyDetailData.data
                          ? this.state.propertyDetailData.data.length > 0
                            ? this.state.propertyDetailData.data[0].created_by.firstname +
                            " " +
                            this.state.propertyDetailData.data[0].created_by.lastname
                            : ""
                          : ""}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>

              <View
                style={PropertiesDetailsScreenStyle.propertyInfoContainerStyle}
              >
                <View
                  style={
                    PropertiesDetailsScreenStyle.propertyInforRowContainerStyle
                  }
                >
                  <Image source={ImagePath.MAP_MARKER} />
                  <Text
                    style={PropertiesDetailsScreenStyle.propertyInfoTextstyle}
                  >
                    {this.state.propertyDetailData.data
                      ? this.state.propertyDetailData.data[0].address
                      : ""}
                  </Text>
                </View>
                <View
                  style={
                    PropertiesDetailsScreenStyle.propertyInforRowContainerStyle
                  }
                >
                  <Image
                    source={ImagePath.BEDROOM_ICON}
                    style={PropertiesDetailsScreenStyle.propertyImageStyle}
                  />
                  <Text
                    style={PropertiesDetailsScreenStyle.propertyInfoTextstyle}
                  >
                    {this.state.propertyDetailData.data
                      ? this.state.propertyDetailData.data[0].number_bedroom
                      : 0}{" "}
                    Bedrooms
                  </Text>
                </View>
                <View
                  style={
                    PropertiesDetailsScreenStyle.propertyInforRowContainerStyle
                  }
                >
                  <Image
                    source={ImagePath.BATHROOM_ICON}
                    style={PropertiesDetailsScreenStyle.propertyImageStyle}
                  />
                  <Text
                    style={PropertiesDetailsScreenStyle.propertyInfoTextstyle}
                  >
                    {this.state.propertyDetailData.data
                      ? this.state.propertyDetailData.data[0].number_of_bathroom
                      : 0}{" "}
                    Bathrooms
                  </Text>
                </View>
                <View
                  style={
                    PropertiesDetailsScreenStyle.propertyInforRowContainerStyle
                  }
                >
                  <Image
                    source={ImagePath.GARAGE_ICON}
                    style={PropertiesDetailsScreenStyle.propertyImageStyle}
                  />
                  <Text
                    style={PropertiesDetailsScreenStyle.propertyInfoTextstyle}
                  >
                    {this.state.propertyDetailData.data
                      ? this.state.propertyDetailData.data[0].number_of_parking
                      : 0}{" "}
                    Carports
                  </Text>
                </View>
                <View
                  style={
                    PropertiesDetailsScreenStyle.propertyInforRowContainerStyle
                  }
                >
                  <Image
                    source={ImagePath.BATHROOM_ICON}
                    style={PropertiesDetailsScreenStyle.propertyImageStyle}
                  />
                  <Text
                    style={PropertiesDetailsScreenStyle.propertyInfoTextstyle}
                  >
                    {this.state.propertyDetailData.data
                      ? this.state.propertyDetailData.data[0].property_type
                      : ""}
                  </Text>
                </View>
              </View>

              <View
                style={
                  PropertiesDetailsScreenStyle.propertiesTitleContainerStyle
                }
              >
                <View
                  style={
                    PropertiesDetailsScreenStyle.propertyRatingContainerStyle
                  }
                >
                  <View>
                    <Text
                      style={
                        PropertiesDetailsScreenStyle.propertyTitleTextStyle
                      }
                    >
                      {firstName + " " + lastName}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <StarRating
                        disabled={true}
                        maxStars={5}
                        starSize={20}
                        starStyle={{ paddingRight: 4, marginTop: 8 }}
                        fullStarColor={Colors.STAR_COLOR}
                        starColor={Colors.STAR_COLOR}
                        halfStarColor={Colors.STAR_COLOR}
                        rating={averagerate}
                      />
                    </View>
                    <Text
                      style={PropertiesDetailsScreenStyle.propertyIdTextStyle}
                    >
                      {averagerate +
                        " " +
                        "from" +
                        " " +
                        totalreviews +
                        " " +
                        "reviews"}
                    </Text>
                  </View>
                  <View
                    style={PropertiesDetailsScreenStyle.userImageContainerStyle}
                  >
                    {userImg != "" ? (
                      <Image
                        source={{ uri: userImg }}
                        style={PropertiesDetailsScreenStyle.userImageStyle}
                      />
                    ) : (
                        <View
                          style={
                            PropertiesDetailsScreenStyle.emptyUserListImageStyle
                          }
                        >
                          <Text
                            style={PropertiesDetailsScreenStyle.initialTextStyle}
                          >
                            {(firstName != ""
                              ? firstName.charAt(0).toUpperCase()
                              : "") +
                              " " +
                              (lastName != ""
                                ? lastName.charAt(0).toUpperCase()
                                : "")}
                          </Text>
                        </View>
                      )}

                    {is_online ? (
                      <View
                        style={PropertiesDetailsScreenStyle.userStausView}
                      />
                    ) : (
                        <View
                          style={
                            PropertiesDetailsScreenStyle.userOfflineStausView
                          }
                        />
                      )}
                  </View>
                </View>
              </View>
              {this.state.userPermission.includes("edit_property") ? (
                <View style={PropertiesDetailsScreenStyle.optionViewContainer}>
                  <TouchableOpacity onPress={this.showPopup.bind(this)}>
                    <View style={PropertiesDetailsScreenStyle.optionViewStyle}>
                      <Image source={ImagePath.THREE_DOTS_ICON} />
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}

              {this.state.isShowPopup && (
                <Modal onRequestClose={() => { }} transparent>
                  <TouchableOpacity
                    onPress={this.showPopup.bind(this)}
                    style={PropertiesDetailsScreenStyle.modalContainer}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <View
                        style={
                          PropertiesDetailsScreenStyle.modalContainerStyles
                        }
                      >
                        {this.state.propertyDetailData.data && (
                          <View>
                            {this.state.propertyDetailData.data[0].created_by
                              ._id == this.state.user.data._id && (
                                <TouchableOpacity
                                  onPress={() => this.onEditPropertyClick()}
                                  style={{ marginTop: 10, marginBottom: 20 }}
                                >
                                  <View
                                    style={
                                      PropertiesDetailsScreenStyle.roundedBlueEditPropertyButtonStyle
                                    }
                                  >
                                    <Text
                                      style={
                                        PropertiesDetailsScreenStyle.editPropertyButtonTextStyle
                                      }
                                    >
                                      {Strings.EDIT_PROPERTY}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              )}
                          </View>
                        )}
                        {/*<TouchableOpacity >
                                                            <View style={PropertiesDetailsScreenStyle.roundedTransparentButtonStyle}>
                                                                <Text style={PropertiesDetailsScreenStyle.editPropertyButtonSkyBlueTextStyle}>
                                                                    {Strings.UPLOAD_DOCUMENTS}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>*/}
                        {/*<TouchableOpacity style={{marginBottom:20}}>
                                                            <View style={PropertiesDetailsScreenStyle.roundedTransparentButtonStyle}>
                                                                <Text style={PropertiesDetailsScreenStyle.editPropertyButtonSkyBlueTextStyle}>
                                                                    {Strings.GENERATE_REPORTS}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>*/}
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>
              )}
              {

              }
              {this.state.propertyAgreementData != "" && (
                <View>
                  <CardView>
                    <View
                      style={PropertiesDetailsScreenStyle.dateContainerStyle}
                    >
                      <Image
                        source={ImagePath.DATE_ICON}
                        style={PropertiesDetailsScreenStyle.dateImageStyle}
                      />
                      <Text style={PropertiesDetailsScreenStyle.dateTextStyle}>
                        {Moment(
                          this.state.propertyAgreementData.case_validity
                        ).format(Strings.DATE_FORMATE)}
                      </Text>
                    </View>

                    <View
                      style={PropertiesDetailsScreenStyle.tenantsTitleViewStyle}
                    >
                      <Text
                        style={
                          PropertiesDetailsScreenStyle.tenantsTitleTextStyle
                        }
                      >
                        {(this.state.propertyAgreementData.property_id
                          ? this.state.propertyAgreementData.property_id.address
                          : "") +
                          " : " +
                          "Agreement #" +
                          this.state.propertyAgreementData.agreement_id}
                      </Text>
                    </View>
                    <View
                      style={
                        PropertiesDetailsScreenStyle.tenantsSubTitleViewStyle
                      }
                    >
                      <Text
                        style={
                          PropertiesDetailsScreenStyle.tenantsSubTitleTextStyle
                        }
                      >
                        {
                          this.state.propertyAgreementData
                            .address_service_notice1
                        }
                      </Text>
                    </View>

                    <View
                      style={
                        PropertiesDetailsScreenStyle.imageListMainContainerStyle
                      }
                    >
                      <View>
                        <Image
                          source={ImagePath.USER_DEFAULT}
                          style={
                            PropertiesDetailsScreenStyle.apartmentUserImageStyle
                          }
                        />
                      </View>

                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      >
                        <View
                          style={
                            PropertiesDetailsScreenStyle.imageListContainerStyle
                          }
                        >
                          {listData.map((data, index) => {
                            return ref.renderImageItem(data, index);
                          })}
                        </View>
                      </ScrollView>
                    </View>

                    <View
                      style={
                        PropertiesDetailsScreenStyle.tenantsInfoContainerViewStyle
                      }
                    >
                      <View
                        style={
                          PropertiesDetailsScreenStyle.propertyBedroomViewContainer
                        }
                      >
                        <Image source={ImagePath.DOLLAR_ICON} />
                        <Text
                          style={
                            PropertiesDetailsScreenStyle.propertyValueTextStyle
                          }
                        >
                          {this.state.propertyAgreementData.rent_price}
                        </Text>
                      </View>
                      <View
                        style={
                          PropertiesDetailsScreenStyle.propertyWashrooViewContainer
                        }
                      >
                        <Image source={ImagePath.CALENDAR_ICON} />
                        <Text
                          style={
                            PropertiesDetailsScreenStyle.propertyValueTextStyle
                          }
                        >
                          {Moment(
                            this.state.propertyAgreementData.tenancy_start_date
                          ).format(Strings.DATE_FORMATE)}
                        </Text>
                      </View>
                      <View
                        style={
                          PropertiesDetailsScreenStyle.propertyWashrooViewContainer
                        }
                      >
                        <Image source={ImagePath.SEARCH_ICON} />
                        <Text
                          style={
                            PropertiesDetailsScreenStyle.propertyValueTextStyle
                          }
                        >
                          {this.state.propertyAgreementData.terms} times
                        </Text>
                      </View>
                    </View>
                  </CardView>
                </View>
              )}
              <View>
                <CardView>
                  <Text
                    style={PropertiesDetailsScreenStyle.amentiesTitleTextStyle}
                  >
                    About this property
                  </Text>
                  <Text
                    numberOfLines={this.state.isShowMore == false ? 6 : null}
                    style={
                      PropertiesDetailsScreenStyle.aboutPropertyDetailTextStyle
                    }
                  >
                    {propertyDesc}
                  </Text>
                  <TouchableOpacity
                    onPress={this.showHidePropertyDetailText.bind(this)}
                  >
                    <Text
                      style={
                        PropertiesDetailsScreenStyle.loadMoreAmenitiesTextStyle
                      }
                    >
                      {propertyDesc.length > 150
                        ? this.state.isShowMore == false
                          ? "Show more"
                          : "Show less"
                        : null}
                    </Text>
                  </TouchableOpacity>
                </CardView>
              </View>

              <View style={{ flex: 1 }}>
                <CardView>
                  <Text
                    style={PropertiesDetailsScreenStyle.amentiesTitleTextStyle}
                  >
                    Amenities
                  </Text>

                  <FlatList
                    data={amenitiesData}
                    renderItem={this.amenitiesRenderItem}
                    extraData={this.state}
                  />
                  {amenitiesData.length <= 5 ? null : (
                    <TouchableOpacity
                      onPress={this.showHideAmenities.bind(this)}
                    >
                      <Text
                        style={
                          PropertiesDetailsScreenStyle.loadMoreAmenitiesTextStyle
                        }
                      >
                        {this.state.isShowMoreAmenities == false
                          ? "Show more"
                          : "Show less"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <Text
                    style={
                      PropertiesDetailsScreenStyle.loadMoreAmenitiesTextStyle
                    }
                  />
                </CardView>
              </View>

              <View style={{ flex: 1 }}>
                <View
                  style={{ backgroundColor: Colors.WHITE, width: window.width }}
                >
                  <Text
                    style={[
                      PropertiesDetailsScreenStyle.amentiesTitleTextStyle,
                      { paddingBottom: 20 }
                    ]}
                  >
                    Map and location
                  </Text>
                </View>

                <View
                  style={{ width: window.width, height: window.height * 0.4 }}
                >
                  {latitudeVal != 0 && longitudeVal != 0 ? (
                    <MapView
                      style={{
                        position: "absolute",
                        top: 20,
                        bottom: 20,
                        left: 0,
                        right: 0,
                        width: window.width,
                        height: window.height * 0.4
                      }}
                      initialRegion={{
                        latitude: latitudeVal,
                        longitude: longitudeVal,
                        latitudeDelta: 0.4,
                        longitudeDelta: 0.4
                      }}
                    >
                      {markers.map(marker => (
                        <MapView.Marker
                          coordinate={marker.LatLng}
                          title={marker.title}
                          description={marker.description}
                        />
                      ))}
                    </MapView>
                  ) : null}
                </View>
              </View>

              {this.state.userAssociateResData.status ? (
                <View style={{ flex: 1 }}>
                  <View style={{ marginTop: 20 }}>
                    <CardView>
                      <Text
                        style={
                          PropertiesDetailsScreenStyle.amentiesTitleTextStyle
                        }
                      >History of tenancies</Text>
                      <FlatList
                        data={this.state.tenanciesListData}
                        renderItem={this.tenanciesHistoryRenderItem}
                        extraData={this.state}
                      />
                    </CardView>
                  </View>

                  <View>
                    <CardView>
                      <Text
                        style={
                          PropertiesDetailsScreenStyle.amentiesTitleTextStyle
                        }
                      >
                        History of maintenance
                      </Text>

                      <FlatList
                        contentContainerStyle={
                          PropertiesDetailsScreenStyle.maintenanceHistoryListStyle
                        }
                        data={this.state.maintenanceHistoryData}
                        renderItem={this.maintenanceHistoryRenderItem}
                        extraData={this.state}
                      />
                    </CardView>
                  </View>

                  {/* this.state.propertyDetailData,
                  this.state.userId
                )} */}
                </View>
              ) : (
                  <View />
                )}
              <View style={{ backgroundColor: Colors.WHITE, flex: 1 }}>
                {this.renderApplicants()}
              </View>
            </View>
          </ScrollView>
          {this.navBar()}
        </View>
        <View style={PropertiesDetailsScreenStyle.buttonContainerStyle}>
          <TouchableOpacity onPress={this.callSendMessageScreen.bind(this)}>
            <View
              style={PropertiesDetailsScreenStyle.roundedBlueProceedButtonStyle}
            >
              <Text style={PropertiesDetailsScreenStyle.proceedButtonTextStyle}>
                {Strings.CONTACT_AGENT}
              </Text>
            </View>
          </TouchableOpacity>
          {this.state.roleName == Strings.USER_ROLE_TENANT && (
            <TouchableOpacity
              onPress={this.callApplSyncProfileScreen.bind(this)}
            >
              <View
                style={
                  PropertiesDetailsScreenStyle.roundedBlueProceedButtonStyle
                }
              >
                <Text
                  style={PropertiesDetailsScreenStyle.proceedButtonTextStyle}
                >
                  {Strings.APPLY_WITH_YOUR_SYNCPROFILE}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {this.props.propertyDetailReducer.isScreenLoading ? (
          <View style={CommonStyles.circles}>
            <Progress.CircleSnail
              color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {

  return {
    propertyDetailReducer: state.propertyDetailReducer
  };
}

export default connect(
  mapStateToProps,
  {
    getUserReviewsList,
    getMaintenaceHistory,
    getAgreementOfProperty,
    getPropertyDetail,
    showLoading,
    resetState,
    getTenanciesHistory,
    getUserAssociateStatus
  }
)(PropertiesDetailsScreen);
