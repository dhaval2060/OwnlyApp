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
  Modal,
  TextInput,
  ScrollView,
  AsyncStorage,
  FlatList
} from "react-native";

import { Actions } from "react-native-router-flux";
import CommonStyles from "../../CommonStyle/CommonStyle";
import Colors from "../../Constants/Colors";
import Strings from "../../Constants/Strings";
import ImagePath from "../../Constants/ImagesPath";
import ApplySyncProfileScreenStyle from "./ApplySyncProfileScreenStyle";
import CheckBox from "react-native-checkbox";
import * as Progress from "react-native-progress";
class ApplySyncProfileScreenStepThree extends Component {
  constructor() {
    super();
    this.state = {
      roleName: "",
      tncModal: false,
      propertyAddress: "",
      agent_specific: [
        { question_id: 0, status: false },
        { question_id: 1, status: false },
        { question_id: 2, status: false },
        { question_id: 3, status: false },
        { question_id: 4, status: false },
        { question_id: 5, status: false },
        { question_id: 6, status: false },
        { question_id: 7, status: false }
      ]
    };
    contextRef = this;
  }
  componentWillMount() {
    this.setState({
      propertyAddress: this.props.screenTwoDetails.propertyAddress
    });

    if (global.isEdit) {
      this.setState({
        agent_specific: global.propertyDetail.agent_specific
      });
    }
  }

  closeAddProperty() {
    Actions.popTo("Dashboard");
  }

  callBack() {
    Actions.pop();
  }

  callProceedToFourthStep() {
    let screenThreeDetails = this.props.screenTwoDetails;
    (screenThreeDetails["agent_specific"] = this.state.agent_specific),
      Actions.ApplySyncProfileScreenStepFour({
        screenThreeDetails: screenThreeDetails
      });
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

  callAddOwnerScreen() {
    Actions.AddOwnerScreen();
  }

  navBar() {
    return (
      <View>
        <Image
          source={ImagePath.HEADER_BG}
          style={CommonStyles.navBarMainView}
        />
        <Text style={CommonStyles.navBarTitleTextView}>Apply with Ownly</Text>
        <TouchableOpacity
          onPress={() => this.callBack()}
          style={CommonStyles.navBackRightImageView}
        >
          <View>
            <Image source={ImagePath.HEADER_BACK} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.closeAddProperty()}
          style={CommonStyles.navRightImageView}
        >
          <View>
            <Image source={ImagePath.DRAWER_CROSS_ICON} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  callSaveAsDraft() {
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.navBar()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            ApplySyncProfileScreenStyle.scrollViewContainerStyle
          }
        >
          <View
            style={{
              backgroundColor: "white",
              shadowColor: "#000",
              borderBottomColor: Colors.ADD_PROPERTY_INPUT_VIEW_COLOR,
              borderBottomWidth: 1,
              padding: 10,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View>
              <Text style={{ color: "#d1d1d1", padding: 5, fontSize: 16 }}>
                You are applying for the property
              </Text>
            </View>
            <View>
              <Text style={{ fontWeight: "600", fontSize: 17 }}>
                {this.state.propertyAddress}
              </Text>
            </View>
          </View>
          <View style={ApplySyncProfileScreenStyle.headerContainer}>
            <View style={ApplySyncProfileScreenStyle.dotContainer}>
              <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
              <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
              <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
              <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
              <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
              <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
              <View style={ApplySyncProfileScreenStyle.greyDotStyle} />
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#F8F9FE",
              paddingBottom: 30
            }}
          >
            <Text style={{ color: "black", fontSize: 25, fontWeight: "300" }}>
              Agent Specific
            </Text>
          </View>
          <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
            <View style={{ paddingTop: 20, paddingBottom: 20 }}>
              <Text style={{ fontSize: 22, fontWeight: "300" }}>
                Further Question
              </Text>
            </View>
            {/* //============>>>>> Question 1  <<<<<<<<=========== */}
            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
              Has your tenancy ever been terminated by a landlord or agent?
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                marginBottom: 15,
                backgroundColor: "white",
                flex: 1
              }}
            >
              <CheckBox
                label={"Yes"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={this.state.agent_specific[0].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[0].status = true;
                  this.setState({ agent_specific: arr });
                }}
              />
              <CheckBox
                label={"No"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={!this.state.agent_specific[0].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[0].status = false;
                  this.setState({ agent_specific: arr });
                }}
              />
            </View>

            {/* //============>>>>> Question 2  <<<<<<<<=========== */}
            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
              Has you ever been refused a property by any landlord agent?
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                marginBottom: 15,
                backgroundColor: "white",
                flex: 1
              }}
            >
              <CheckBox
                label={"Yes"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={this.state.agent_specific[1].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[1].status = true;
                  this.setState({ agent_specific: arr });
                }}
              />
              <CheckBox
                label={"No"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={!this.state.agent_specific[1].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[1].status = false;
                  this.setState({ agent_specific: arr });
                }}
              />
            </View>

            {/* //============>>>>> Question 3  <<<<<<<<=========== */}
            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
              Are you debt to another landlord agent?
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                marginBottom: 15,
                backgroundColor: "white",
                flex: 1
              }}
            >
              <CheckBox
                label={"Yes"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={this.state.agent_specific[2].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[2].status = true;
                  this.setState({ agent_specific: arr });
                }}
              />
              <CheckBox
                label={"No"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={!this.state.agent_specific[2].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                    checkboxStyle={{borderWidth:0.5,borderColor:'grey', borderRadius:13}}
                    uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[2].status = false;
                  this.setState({ agent_specific: arr });
                }}
              />
            </View>

            {/* //============>>>>> Question 4  <<<<<<<<=========== */}
            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
              Have any deductions ever been made from your rental bond?
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                marginBottom: 15,
                backgroundColor: "white",
                flex: 1
              }}
            >
              <CheckBox
                label={"Yes"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={this.state.agent_specific[3].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[3].status = true;
                  this.setState({ agent_specific: arr });
                }}
              />
              <CheckBox
                label={"No"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={!this.state.agent_specific[3].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[3].status = false;
                  this.setState({ agent_specific: arr });
                }}
              />
            </View>

            {/* //============>>>>> Question 5  <<<<<<<<=========== */}
            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
              Is there any reason known to you that would affect your future
              rental payments?
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                marginBottom: 15,
                backgroundColor: "white",
                flex: 1
              }}
            >
              <CheckBox
                label={"Yes"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={this.state.agent_specific[4].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[4].status = true;
                  this.setState({ agent_specific: arr });
                }}
              />
              <CheckBox
                label={"No"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={!this.state.agent_specific[4].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[4].status = false;
                  this.setState({ agent_specific: arr });
                }}
              />
            </View>

            {/* //============>>>>> Question 6  <<<<<<<<=========== */}
            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
              Do you have any other applications pending on the other
              properties?
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                marginBottom: 15,
                backgroundColor: "white",
                flex: 1
              }}
            >
              <CheckBox
                label={"Yes"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={this.state.agent_specific[5].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[5].status = true;
                  this.setState({ agent_specific: arr });
                }}
              />
              <CheckBox
                label={"No"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={!this.state.agent_specific[5].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[5].status = false;
                  this.setState({ agent_specific: arr });
                }}
              />
            </View>

            {/* //============>>>>> Question 7  <<<<<<<<=========== */}
            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
              Do you currently own a property?
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                marginBottom: 15,
                backgroundColor: "white",
                flex: 1
              }}
            >
              <CheckBox
                label={"Yes"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={this.state.agent_specific[6].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[6].status = true;
                  this.setState({ agent_specific: arr });
                }}
              />
              <CheckBox
                label={"No"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={!this.state.agent_specific[6].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[6].status = false;
                  this.setState({ agent_specific: arr });
                }}
              />
            </View>

            {/* //============>>>>> Question 8  <<<<<<<<=========== */}
            <Text style={ApplySyncProfileScreenStyle.labelStyle}>
              Are you considering buying a property after this tenancy or in the
              near future?
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                marginBottom: 15,
                backgroundColor: "white",
                flex: 1
              }}
            >
              <CheckBox
                label={"Yes"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={this.state.agent_specific[7].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[7].status = true;
                  this.setState({ agent_specific: arr });
                }}
              />
              <CheckBox
                label={"No"}
                labelStyle={[
                  ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                  { padding: 10, fontSize: 16 }
                ]}
                checked={!this.state.agent_specific[7].status}
                checkedImage={ImagePath.AMENITIES_CHECK_ICON}
                checkboxStyle={{ borderWidth: 0.5, borderColor: 'grey', borderRadius: 13 }}
                uncheckedImage={ImagePath.TRACKER_BG_WHITE}
                onChange={val => {
                  let arr = this.state.agent_specific;
                  arr[7].status = false;
                  this.setState({ agent_specific: arr });
                }}
              />
            </View>
          </View>
        </ScrollView>

        <View style={ApplySyncProfileScreenStyle.buttonContainerStyle}>
          <TouchableOpacity onPress={() => this.callSaveAsDraft()}>
            <View
              style={
                ApplySyncProfileScreenStyle.roundedTransparentDraftButtonStyle
              }
            >
              <Text style={ApplySyncProfileScreenStyle.draftButtonTextStyle}>
                {Strings.SAVE_AS_DRAFT}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.callProceedToFourthStep()}>
            <View
              style={ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle}
            >
              <Text style={ApplySyncProfileScreenStyle.proceedButtonTextStyle}>
                {Strings.PROCEED}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {//23 Nov
          false ? (
            <View style={CommonStyles.circles}>
              <Progress.CircleSnail
                color={[Colors.BLACK, Colors.BLACK, Colors.BLACK]}
              />
            </View>
          ) : null
          //
        }


      </View>
    );
  }
}

export default ApplySyncProfileScreenStepThree;
