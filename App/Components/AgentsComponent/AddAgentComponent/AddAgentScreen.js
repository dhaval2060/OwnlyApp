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
  AsyncStorage
} from "react-native";

import { Actions } from "react-native-router-flux";
import CommonStyles from "../../../CommonStyle/CommonStyle";
import Colors from "../../../Constants/Colors";
import Strings from "../../../Constants/Strings";
import ImagePath from "../../../Constants/ImagesPath";
import AddAgentScreenStyle from "./AddAgentScreenStyle";
import { validateEmail } from "../../../Constants/CommonFunctions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { addAgentByAgency } from "../../../Action/ActionCreators";
import Mailer from "react-native-mail";
import {
  showLoading,
  resetState,
  clearAddAgentRes,
  agencyAgentFirstNameChanged,
  agencyAgentLastNameChanged,
  agencyAgentEmailChanged,
  agencyAgentMobileChanged,
  agencyAgentPassworChanged
} from "./AddAgentAction";

import { updateAgentList } from "../AgentsScreenAction";

import * as Progress from "react-native-progress";
var errorMsg = [];

class AddAgentScreen extends Component {
  constructor() {
    super();
    this.state = {
      propertyAdd: "",
      errorMsg: "",
      errorOnTextField: ""
    };
  }

  componentWillReceiveProps(nextProps) {}

  componentDidUpdate() {
    this.onAddAgentSuccess();
  }

  componentWillUnmount() {}
  componentWillMount() {}

  closeAddProperty() {
    Actions.pop();
  }
  handleEmail = () => {
    Mailer.mail(
      {
        subject: "Sign Up to become Ownly Agent",
        recipients: [""],
        ccRecipients: [""],
        bccRecipients: [""],
        body: "Hi team<br><br>Please join using the url below.<br><br><b>http://192.168.1.88:5094#!/property_manager/5bb309161ef59b3239a0da13</b><br><br>Best Regards, <br>Ownly Team",
        isHTML: true,
        attachment: {
          path: "", // The absolute path of the file from which to read data.
          type: "", // Mime Type: jpg, png, doc, ppt, html, pdf, csv
          name: "" // Optional: Custom filename for attachment
        }
      },
      (error, event) => {
          Alert.alert(
          error,
          event,
          [
            {
              text: "Ok",
              onPress: () => console.log("OK: Email Error Response")
            },
            {
              text: "Cancel",
              onPress: () => console.log("CANCEL: Email Error Response")
            }
          ],
          { cancelable: true }
        );
      }
    );
  };
  onFirstNameChanged(text) {
    this.props.agencyAgentFirstNameChanged(text);
    this.setState({ errorMsg: "" });
    this.setState({ errorOnTextField: "" });
  }
  onLastNameChanged(text) {
    this.props.agencyAgentLastNameChanged(text);
    this.setState({ errorMsg: "" });
    this.setState({ errorOnTextField: "" });
  }
  onEmailChanged(text) {
    this.props.agencyAgentEmailChanged(text);
    this.setState({ errorMsg: "" });
    this.setState({ errorOnTextField: "" });
  }
  onPhoneNumberChanged(text) {
    this.props.agencyAgentMobileChanged(text);
    this.setState({ errorMsg: "" });
    this.setState({ errorOnTextField: "" });
  }

  onPasswordChanged(text) {
    this.props.agencyAgentPassworChanged(text);
    this.setState({ errorMsg: "" });
    this.setState({ errorOnTextField: "" });
  }

  callAddAgentAPI() {
    if (this.props.addAgentReducer.agentFirstName.trim() == "") {
      //errorMsg.push(Strings.ENTER_TENANT_FIRST_NAME);
      this.setState({ errorMsg: Strings.ERROR_EMPTY_FIRST_NAME });
      this.setState({ errorOnTextField: 0 });
    } else if (this.props.addAgentReducer.agentLastName.trim() == "") {
      //errorMsg.push(Strings.ENTER_TENANT_LAST_NAME);
      this.setState({ errorMsg: Strings.ERROR_EMPTY_LAST_NAME });
      this.setState({ errorOnTextField: 1 });
    } else if (!validateEmail(this.props.addAgentReducer.agentEmail)) {
      //errorMsg.push(Strings.ERROR_INVALID_EMAIL);
      this.setState({ errorMsg: Strings.ERROR_INVALID_EMAIL });
      this.setState({ errorOnTextField: 2 });
    } else if (this.props.addAgentReducer.agentMobile.trim() == "") {
      // errorMsg.push(Strings.ENTER_TENANT_PHONE);
      this.setState({ errorMsg: Strings.ERROR_EMPTY_PHONE_NUMBER });
      this.setState({ errorOnTextField: 3 });
    } else if (this.props.addAgentReducer.agentPass.trim() == "") {
      this.setState({ errorMsg: Strings.ERROR_EMPTY_PASSWORD });
      this.setState({ errorOnTextField: 4 });
    } else {
      AsyncStorage.getItem("SyncittUserInfo")
        .then(value => {
          if (value) {
            var userData = JSON.parse(value);
            var authToken = userData.token;
            var postData = {
              agency_id: userData.data.agency_id,
              firstname: this.props.addAgentReducer.agentFirstName,
              lastname: this.props.addAgentReducer.agentLastName,
              email: this.props.addAgentReducer.agentEmail,
              mobile_no: this.props.addAgentReducer.agentMobile,
              password: this.props.addAgentReducer.agentPass
            };
            
            this.props.showLoading();
            this.props.addAgentByAgency(authToken, postData);
          }
        })
        .done();
    }
  }

  onAddAgentSuccess() {
    if (this.props.addAgentReducer.addAgentRes != "") {
      if (this.props.addAgentReducer.addAgentRes.code == 200) {
        Actions.pop();
        this.props.updateAgentList("updateAgentList");
      } else {
        alert(this.props.addAgentReducer.addAgentRes.message);
      }
      this.props.clearAddAgentRes();
    }
  }

  navBar() {
    return (
      <View>
        <Image
          source={ImagePath.HEADER_BG}
          style={CommonStyles.navBarMainView}
        />
        <Text style={CommonStyles.navBarTitleTextView}>
          {Strings.ADD_NEW_AGENT_TITLE}
        </Text>
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

  render() {
    return (
      <View
        style={{ flex: 1, backgroundColor: Colors.SETTING_SCREEN_BG_COLOR }}
      >
        {this.navBar()}

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={AddAgentScreenStyle.scrollViewContainerStyle}
        >
          <View style={AddAgentScreenStyle.addPropertyInputContainer}>
            <Text style={AddAgentScreenStyle.labelStyle}>
              {Strings.FIRST_NAME}
            </Text>
            <TextInput
              style={AddAgentScreenStyle.inputTextStyle}
              autoCapitalize="words"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              returnKeyType="next"
              onChangeText={this.onFirstNameChanged.bind(this)}
              value={this.props.addAgentReducer.agentFirstName}
              onSubmitEditing={event => {
                this.refs.refLastName.focus();
              }}
            />
            {this.state.errorMsg != "" && this.state.errorOnTextField == 0 ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}

            <Text style={AddAgentScreenStyle.labelStyle}>
              {Strings.LAST_NAME}
            </Text>
            <TextInput
              style={AddAgentScreenStyle.inputTextStyle}
              ref="refLastName"
              autoCapitalize="words"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              returnKeyType="next"
              onChangeText={this.onLastNameChanged.bind(this)}
              value={this.props.addAgentReducer.agentLastName}
              onSubmitEditing={event => {
                this.refs.refPhone.focus();
              }}
            />
            {this.state.errorMsg != "" && this.state.errorOnTextField == 1 ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}

            <Text style={AddAgentScreenStyle.labelStyle}>
              {Strings.PHONE_NUMBER}
            </Text>

            <TextInput
              style={AddAgentScreenStyle.inputTextStyle}
              ref="refPhone"
              autoCapitalize="none"
              keyboardType="number-pad"
              autoCorrect={false}
              maxLength={10}
              underlineColorAndroid="transparent"
              returnKeyType="done"
              onChangeText={this.onPhoneNumberChanged.bind(this)}
              value={this.props.addAgentReducer.agentMobile}
              onSubmitEditing={event => {
                this.refs.refEmail.focus();
              }}
            />
            {this.state.errorMsg != "" && this.state.errorOnTextField == 2 ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}

            <Text style={AddAgentScreenStyle.labelStyle}>
              {Strings.EMAIL_ADDRESS}
            </Text>
            <TextInput
              style={AddAgentScreenStyle.inputTextStyle}
              ref="refEmail"
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              returnKeyType="next"
              keyboardType="email-address"
              onChangeText={this.onEmailChanged.bind(this)}
              value={this.props.addAgentReducer.agentEmail}
              onSubmitEditing={event => {
                this.refs.refPass.focus();
              }}
            />

            {this.state.errorMsg != "" && this.state.errorOnTextField == 3 ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}

            <Text style={AddAgentScreenStyle.labelStyle}>
              {Strings.PASSWORD}
            </Text>
            <TextInput
              style={AddAgentScreenStyle.inputTextStyle}
              ref="refPass"
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              returnKeyType="done"
              secureTextEntry={true}
              onChangeText={this.onPasswordChanged.bind(this)}
              value={this.props.addAgentReducer.agentPass}
            />

            {this.state.errorMsg != "" && this.state.errorOnTextField == 4 ? (
              <Text style={CommonStyles.errorText}>{this.state.errorMsg}</Text>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
        <View style={AddAgentScreenStyle.buttonContainerStyle}>
          <TouchableOpacity
            // onPress={() => this.callAddAgentAPI() }
            onPress={this.handleEmail}
          >
            <View style={AddAgentScreenStyle.roundedBlueProceedButtonStyle}>
              <Text style={AddAgentScreenStyle.proceedButtonTextStyle}>
                {Strings.ADD_NEW_AGENT_TITLE}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {this.props.addAgentReducer.isScreenLoading ? (
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
    addAgentReducer: state.addAgentReducer
  };
}

export default connect(
  mapStateToProps,
  {
    updateAgentList,
    addAgentByAgency,
    showLoading,
    resetState,
    clearAddAgentRes,
    agencyAgentFirstNameChanged,
    agencyAgentLastNameChanged,
    agencyAgentEmailChanged,
    agencyAgentMobileChanged,
    agencyAgentPassworChanged
  }
)(AddAgentScreen);
