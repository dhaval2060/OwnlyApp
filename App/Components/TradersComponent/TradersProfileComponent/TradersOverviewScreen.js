import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  Button,
  AsyncStorage,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  ScrollView,
  FlatList
} from "react-native";
import { Actions } from "react-native-router-flux";
import Colors from "../../../Constants/Colors";
import Strings from "../../../Constants/Strings";
import ImagePath from "../../../Constants/ImagesPath";
import TradersOverviewScreenStyle from "./TradersOverviewScreenStyle";
//import listData from  "../../../../data";
import CommonStyles from "../../../CommonStyle/CommonStyle";
import API from "../../../Constants/APIUrls";
import Moment from "moment";
let contextRef;
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig
} from "react-native-calendars";
import APICaller from "../../../Saga/APICaller";

class TradersOverviewScreen extends Component {
  constructor(props) {
    super(props);
    const DISABLED_DAYS = ["0", "1", "5"];
    // await this.getDaysInMonth(Moment().month(), Moment().year(),  DISABLED_DAYS)
    this.state = {
      uploadImagesData: {},
      servieName: [],
      selectedImage: 0,
      serviceCategories: [],
      markedDatesObj: []
    };
    this.markedDate = contextRef = this;
  }

  componentWillReceiveProps(nextProps) { }
  componentDidMount() {
    setTimeout(() => {
      let days = [];
      if (
        this.props.overViewData.availability != undefined &&
        this.state.markedDatesObj != []
      ) {

        if (this.props.overViewData.availability.option == 0) {
          days = ["0", "1", "2", "3", "4", "5", "6"];
        } else if (this.props.overViewData.availability.option == 1) {
          days = ["1", "2", "3", "4", "5"];
        } else if (this.props.overViewData.availability.option == 2) {
          days = ["0", "6"];
        } else if (this.props.overViewData.availability.option == 3) {
          // days = this.props.overViewData.availability.days;
          days = [];
          arr = ["0", "1", "2", "3", "4", "5", "6"];
          var flag = false;
          if (arr != null) {
            arr.forEach(element => {
              if (this.props.overViewData.availability.days.includes(element)) {

              } else {
                days.push(element);
              }
            });
          }
          // for (var i = 0; i < this.props.overViewData.availability.days.length; i++) {
          //   days.splice(i, 1);
          // }

        }
        this.getDaysInMonth(Moment().month(), Moment().year(), days);
      }
    }, 1000);
    this.getServiveSkills()
  }
  componentDidUpdate() { }

  async componentWillMount() {

    this.getServiceCategory()
  }
  getServiveSkills() {
    console.log(this.props, this.state, "this.props, this.state")
    // let arr = []
    // if (this.props.overViewData.categories_id != null) {
    //   this.props.overViewData.categories_id.forEach(element => {
    //     if (this.state.serviceCategories != null) {
    //       this.state.serviceCategories.forEach(item => {
    //         if (element == item._id) {
    //           arr.push(item)
    //         }
    //       });
    //     }
    //   });
    // }
    if (this.props.overViewData && this.props.overViewData.categoriesDetails) {
      this.setState({ servieName: this.props.overViewData.categoriesDetails })
    }
  }
  getServiceCategory() {

    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;
          APICaller(
            "getServiceCategory",
            "GET",
            authToken
          ).then(data => {
            if (data.code == '200') {
              this.setState({ serviceCategories: data.data })

            }
          });
        }
      })
  }
  componentWillUnmount() { }
  uploadImageListSelection(index) {


    this.setState({ selectedImage: listData[index].url });
    var tempData = listData;
    var tempArray = listData;
    tempArray.map((data, position) => {
      if (index == position) {
        if (tempArray[index].isSelected == 0) {
          tempArray[index].isSelected = 1;
        }
      } else {
        tempArray[position].isSelected = 0;
      }
    });
    tempData.imageArray = tempArray;
    this.setState({ uploadImagesData: tempData });
  }
  async getDaysInMonth(month, year, days) {

    let pivot = Moment()
      .month(month)
      .year(year)
      .startOf("month");
    const end = Moment()
      .month(month)
      .year(year + 10)
      .endOf("month");
    let dates = {};
    const DISABLED_DAYS = ["0", "2"];
    const disabled = { selected: true };
    while (await pivot.isBefore(end)) {
      if (days != null) {
        days.forEach(day => {
          dates[pivot.day(day).format("YYYY-MM-DD")] = disabled;
        });
      }
      pivot.add(7, "days");
    }

    setTimeout(() => {
      this.setState({ markedDatesObj: dates });
    }, 2000);
  }
  _renderTags(tags, index) {
    return (
      <View
        style={{
          height: 36,
          backgroundColor: "rgba(70,164,242,0.22)",
          margin: 5,
          borderRadius: 50,
          justifyContent: "center"
        }}
      >
        <Text
          style={{
            marginLeft: 5,
            marginRight: 5,
            textAlign: "center",
            paddingLeft: 15,
            paddingRight: 15,
            color: Colors.TAG_VIEW_TEXT_COLOR,
            fontSize: 14,
            fontWeight: "500"
          }}
        >
          {tags.name}
        </Text>
      </View>
    );
  }

  renderItem({ item, index }) {
    return (
      <Image
        source={{ uri: API.USER_IMAGE_PATH + item.url }}
        style={TradersOverviewScreenStyle.overviewPropertyListImageStyle}
      />
    );
  }

  render() {
    var servieName = this.props.overViewData.categories_id
      ? this.props.overViewData.categories_id
      : [];
    var portFolioImages = this.props.overViewData.images
      ? this.props.overViewData.images
      : [];
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
        <Text style={TradersOverviewScreenStyle.titleTextStyle}>
          {Strings.OVERVIEW}
        </Text>
        <Text style={TradersOverviewScreenStyle.detailsTextStyle}>
          {/* {this.props.overViewData.about_user} */}

          {this.props.overViewData.groups
            ? this.props.overViewData.groups.about_user
            : "No data found"}
        </Text>
        <Text style={TradersOverviewScreenStyle.titleTextStyle}>
          {Strings.SERVICES_SKILLS}
        </Text>

        {this.props.overViewData && this.props.overViewData.categoriesDetails && this.props.overViewData.categoriesDetails.length > 0 ? (
          <View
            style={{
              marginLeft: 15,
              marginRight: 20,
              marginTop: 20,
              marginBottom: 20,
              alignSelf: "stretch",
              width: window.width,
              justifyContent: "space-between",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }}
          >
            <ScrollView
              ref="scrollView"
              contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
            >
              {this.props.overViewData.categoriesDetails.map((data, index) => {
                return this._renderTags(data, index);
              })}
            </ScrollView>
          </View>
        ) : (
            <View style={{ flex: 1, marginTop: 20, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: "center",
                  color: Colors.LIGHT_GRAY_TEXT_COLOR
                }}
              >
                {Strings.NO_SERVICE_FOUND}
              </Text>
            </View>
          )}

        <Text style={TradersOverviewScreenStyle.titleTextStyle}>
          {Strings.PORTFOLIO}
        </Text>

        <View
          style={{
            marginTop: 5,
            alignContent: "stretch",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          {portFolioImages.length > 0 ? (
            <FlatList
              numColumns={2}
              contentContainerStyle={{
                paddingVertical: 20,
                paddingHorizontal: 20
              }}
              data={portFolioImages}
              renderItem={this.renderItem}
              extraData={this.state}
            />
          ) : (
              <View style={{ flex: 1, marginTop: 20, justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: "center",
                    color: Colors.LIGHT_GRAY_TEXT_COLOR
                  }}
                >
                  {Strings.NO_PORTFOLIO_FOUND}
                </Text>
              </View>
            )}
        </View>
        {this.props.overViewData.availability != undefined ?
          <View>
            {this.props.overViewData.availability.status == 1 ? (
              <Text style={TradersOverviewScreenStyle.titleTextStyle}>
                {Strings.AVAILABILITY}
              </Text>
            ) : (
                <Text style={TradersOverviewScreenStyle.titleTextStyle}>
                  {Strings.NOTAVAILABILITY}
                </Text>
              )}

            <View style={TradersOverviewScreenStyle.noticeBoardContainerViewStyle}>

              <Calendar
                style={{
                  borderTopWidth: 1,
                  paddingTop: 5,
                  borderBottomWidth: 1,
                  borderColor: "#eee",
                  height: 350,
                  marginTop: 20
                  // backgroundColor:'red'
                }}
                hideExtraDays={true}
                current={Moment().format("YYYY-MM-DD")}
                firstDay={0}
                markedDates={this.state.markedDatesObj}
                // disabledByDefault={true}
                hideArrows={false}
              />
            </View>
          </View>
          : null
        }
      </ScrollView>
    );
  }
}
const customStyle = {
  day: {
    color: "blue"
  }
};
export default TradersOverviewScreen;
