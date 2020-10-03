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
import MessageToTraderScreenStyle from "./MessageToTraderScreenStyle";
import { Dropdown } from "react-native-material-dropdown";
import CheckBox from "react-native-checkbox";
import { sendMessage } from "../../../Action/ActionCreators";
import {
  sendMessageTextChange,
  showLoading,
  resetState
} from "./SendMessageAction";

class MessageToTraderScreen extends Component {
  constructor() {
    super();
    this.state = {
      isTenantCreatePassword: false,
      isTenantPraivacyPolicy: false,
      propertyAdd: ""
    };
  }


  componentDidUpdate() {
    this.onSendMessageSuccess();
  }


  closeAddProperty() {
    if (this.props.goBackToPop) {
      Actions.pop()
    } else {
      Actions.popTo("Dashboard");
    }
  }

  onSendMessageChange(text) {
    this.props.sendMessageTextChange(text);
    //this.setState({ errorMsg: '' });
    //this.setState({ errorOnTextField: '' });
  }

  callSend() {
    if (this.props.sendMessageReducer.messageText.trim().length > 0) {
      AsyncStorage.getItem("SyncittUserInfo")
        .then(value => {
          console.log('hello',value);
          if (value) {
            var userData = JSON.parse(value);
            var authToken = userData.token;
            var postData = {
              sender_id: userData.data._id,
              receiver_id: this.props.receiverId,
              firstname: userData.data.firstname,
              lastname: userData.data.lastname,
              message: this.props.sendMessageReducer.messageText,
              time: new Date()
            };

            this.props.showLoading();
            this.props.sendMessage(authToken, postData);
          }else{
            Alert.alert(
              "Alert",
              "Please login to contact the agent",
              [
                  {
                  text: "Cancel",
                  onPress: () => Actions.pop(),
                  style: "cancel"
                  },
                  { text: "OK", onPress: () => Actions.pop() }
              ],
              { cancelable: false }
            )
          }
        })
        .done();
    } else {
      alert("enter message");
    }
  }

  onSendMessageSuccess() {

    if (this.props.sendMessageReducer.resSendMsg != "") {
      if (this.props.sendMessageReducer.resSendMsg.code == 200) {
        Actions.pop();
      } else {
        alert(this.props.sendMessageReducer.resSendMsg.message);
      }
      this.props.resetState();
    }
  }

  onTenantCreatePassword() {
    if (this.state.isTenantCreatePassword) {
      this.setState({ isTenantCreatePassword: false });
    } else {
      this.setState({ isTenantCreatePassword: true });
    }
  }

  onTenantPrivacyPolicy() {
    if (this.state.isTenantPraivacyPolicy) {
      this.setState({ isTenantPraivacyPolicy: false });
    } else {
      this.setState({ isTenantPraivacyPolicy: true });
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
          Say hi to {this.props.userFirstName}!
        </Text>
        <TouchableOpacity
          onPress={() => this.closeAddProperty()}
          style={CommonStyles.navRightImageView}
        >
          <Image source={ImagePath.DRAWER_CROSS_ICON} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.SETTING_SCREEN_BG_COLOR }}      >
        {this.navBar()}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            MessageToTraderScreenStyle.scrollViewContainerStyle
          }
        >
          <View style={MessageToTraderScreenStyle.addPropertyInputContainer}>
            <Text style={MessageToTraderScreenStyle.labelStyle}>
              {Strings.YOUR_MESSAGE}
            </Text>
            <TextInput
              style={MessageToTraderScreenStyle.inputDescriptionTextStyle}
              multiline={true}
              placeholder={Strings.TYPE_MESSAGE}
              onChangeText={this.onSendMessageChange.bind(this)}
              value={this.props.sendMessageReducer.messageText}
            />
          </View>
        </ScrollView>
        <View style={MessageToTraderScreenStyle.buttonContainerStyle}>
          <TouchableOpacity onPress={() => this.callSend()}>
            <View style={MessageToTraderScreenStyle.roundedBlueProceedButtonStyle}>
              <Text style={MessageToTraderScreenStyle.proceedButtonTextStyle}>
                {Strings.SEND}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {

  return {
    sendMessageReducer: state.sendMessageReducer
  };
}

export default connect(
  mapStateToProps,
  {
    sendMessage,
    showLoading,
    resetState,
    sendMessageTextChange
  }
)(MessageToTraderScreen);
