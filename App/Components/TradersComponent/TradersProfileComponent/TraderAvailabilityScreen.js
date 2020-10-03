import React, { Component } from "react";
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
} from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import Colors from "../../../Constants/Colors";
import Strings from "../../../Constants/Strings";
import ImagePath from "../../../Constants/ImagesPath";
import TradersReviewAndRatingScreenStyle from "./TradersReviewAndRatingScreenStyle";
//import listData from  "../../../../data";
import CommonStyles from "../../../CommonStyle/CommonStyle";
import { Dropdown } from "react-native-material-dropdown";
import StarRating from "react-native-star-rating";
import API from "../../../Constants/APIUrls";
import { CardView } from "../../CommonComponent/CardView";
import Moment from "moment";
let ref;
var UserID = "";

import {
  getAllUserReviewsList,
  addResponse
} from "../../../Action/ActionCreators";

import { showLoading, resetState } from "../TradersAction";

class TraderAvailabilityScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 3.5,
      userReviewList: [],
      inputOn: "",
      responseInput: "",
      responses: [],
      profileData: props.profileData
    };
    ref = this;
  }

  componentWillReceiveProps(nextProps) {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  componentWillMount() {}
  render() {
    
    return (
      <View style={{backgroundColor:'white', flex:1}}>
        <View style={TradersReviewAndRatingScreenStyle.profileContainer}>
          {this.state.profileData.availability.status == 1 && (
            <View style={{ padding: 15 }}>
              <Text
                style={{
                  fontSize: 22,
                  color: Colors.SKY_BLUE_BUTTON_BACKGROUND
                }}
              >
                Available
              </Text>
            </View>
          )}
          {this.state.profileData.availability.status == 2 && (
            <View style={{ padding: 15 }}>
              <Text
                style={{
                  fontSize: 22,
                  color: Colors.SKY_BLUE_BUTTON_BACKGROUND
                }}
              >
                Not Available
              </Text>
            </View>
          )}
          {this.state.profileData.availability.option == 0 && (
            <View style={{ paddingLeft: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                7 days a week
              </Text>
            </View>
          )}
          {this.state.profileData.availability.option == 1 && (
            <View style={{ paddingLeft: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                Weekdays only
              </Text>
            </View>
          )}
          {this.state.profileData.availability.option == 2 && (
            <View style={{ paddingLeft: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                Weekends only
              </Text>
            </View>
          )}
          {this.state.profileData.availability.option == 3 && (
            <View style={{ paddingLeft: 15 }}>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                Every day except
              </Text>
            </View>
          )}
          {this.state.profileData.availability.option == 3 && (
            <View style={{ paddingLeft: 15, padding: 5 }}>
              <FlatList
                data={this.state.profileData.availability.days}
                extraData={this.state}
                renderItem={item => {
                  
                  return (
                    <View>
                      {item.item == "0" && (
                        <Text style={{ fontSize: 17 }}>Sunday</Text>
                      )}
                      {item.item == "1" && (
                        <Text style={{ fontSize: 17 }}>Monday</Text>
                      )}
                      {item.item == "2" && (
                        <Text style={{ fontSize: 17 }}>Wednesday</Text>
                      )}
                      {item.item == "3" && (
                        <Text style={{ fontSize: 17 }}>Wednesday</Text>
                      )}
                      {item.item == "4" && (
                        <Text style={{ fontSize: 17 }}>Thursday</Text>
                      )}
                      {item.item == "5" && (
                        <Text style={{ fontSize: 17 }}>Friday</Text>
                      )}
                      {item.item == "6" && (
                        <Text style={{ fontSize: 17 }}>Saturday</Text>
                      )}
                    </View>
                  );
                }}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  
  return {
    profileReducer: state.profileReducer
  };
}
const styles = StyleSheet.create({
  textAreaContainer: {
    borderColor: "#aaa",
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    margin: 5
  },
  textArea: {
    height: 70,
    justifyContent: "flex-start"
  }
});
export default connect(
  mapStateToProps,
  {
    showLoading,
    resetState,
    getAllUserReviewsList,
    addResponse
  }
)(TraderAvailabilityScreen);
