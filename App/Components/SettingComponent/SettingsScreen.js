import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  AsyncStorage,
  View,
  Text,
  Button,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  ScrollView
} from "react-native";
import { Actions } from "react-native-router-flux";
import CommonStyles from "../../CommonStyle/CommonStyle";
import Colors from "../../Constants/Colors";
import Strings from "../../Constants/Strings";
import ImagePath from "../../Constants/ImagesPath";
import SettingsScreenStyle from "./SettingsScreenStyle";

import ProfileSettingScreen from "./ProfileSettingComponent/ProfileSettingScreen";
import AccountSecurityScreen from "./AccountSecurityComponent/AccountSecurityScreen";
import NotificationSettingScreen from "./NotificationSettingComponent/NotificationSettingScreen";
import UserRoleScreen from "./UserRoleComponent/UserRoleScreen";
import UserImageScreen from "./UserImagesComponent/UserImageScreen";
import OccupancyScreen from "./OccuopancyComponent/OccupancyScreen";
import IdentificationScreen from "./IdentificationComponent/IdentificationScreen";
import AvailabilityScreen from "./AvailabilityComponent/AvailabilityScreen";
import SubscriptionScreen from "./SubscriptionComponent/SubscriptionScreen";

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTabSelected: props.isOpenSettingTab ? 9 : 1,
      roleName: ""
    };
    AsyncStorage.getItem(Strings.USER_ROLE_NAME)
      .then(value => {
        if (value) {

          this.setState({ roleName: value });
        }
      })
      .done();
  }

  onProfileSettingTabClick() {


    this.setState({ isTabSelected: 1 });
  }
  onAccountSecurityTabClick() {


    this.setState({ isTabSelected: 2 });
  }

  onNotificationSettingTabClick() {

    this.setState({ isTabSelected: 3 });
  }

  onUserRoleTabClick() {
    this.setState({ isTabSelected: 4 });
  }

  onUserImageTabClick() {
    this.setState({ isTabSelected: 5 });
  }
  onOccupancyTabClick() {

    this.setState({ isTabSelected: 6 });
  }
  onIdentificationTabClick() {

    this.setState({ isTabSelected: 7 });
  }
  onAvailablityTabClick() {
    this.setState({ isTabSelected: 8 });
  }
  onSubscriptionTabClick() {
    this.setState({ isTabSelected: 9 });
  }
  navBar() {
    return (
      <View>
        <Image
          source={ImagePath.HEADER_BG}
          style={CommonStyles.navBarMainView}
        />
        <Text style={CommonStyles.navBarTitleTextView}>
          {Strings.ACCOUNT_SETTINGS}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={SettingsScreenStyle.settingContainerStyle}>
        {this.navBar()}
        <View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              SettingsScreenStyle.tabContainerScrollViewStyle
            }
          >
            <View style={SettingsScreenStyle.tabContainerStyle}>
              <TouchableOpacity onPress={() => this.onProfileSettingTabClick()}>
                <View>
                  <View style={[SettingsScreenStyle.tabTextViewStyle, this.state.isTabSelected == 1 ? { borderBottomColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, borderBottomWidth: 2 } : null]}>
                    <Text
                      style={
                        this.state.isTabSelected == 1
                          ? SettingsScreenStyle.tabLabelTextStyle
                          : SettingsScreenStyle.tabLabelDiselectTextStyle
                      }
                    >
                      PROFILE
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.onAccountSecurityTabClick()}
              >
                <View>
                  <View style={[SettingsScreenStyle.tabTextViewStyle, this.state.isTabSelected == 2 ? { borderBottomColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, borderBottomWidth: 2 } : null]}>
                    <Text
                      style={
                        this.state.isTabSelected == 2
                          ? SettingsScreenStyle.tabLabelTextStyle
                          : SettingsScreenStyle.tabLabelDiselectTextStyle
                      }
                    >
                      ACCOUNT SECURITY
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.onNotificationSettingTabClick()}
              >
                <View>
                  <View style={[SettingsScreenStyle.tabTextViewStyle, this.state.isTabSelected == 3 ? { borderBottomColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, borderBottomWidth: 2 } : null]}>
                    <Text
                      style={
                        this.state.isTabSelected == 3
                          ? SettingsScreenStyle.tabLabelTextStyle
                          : SettingsScreenStyle.tabLabelDiselectTextStyle
                      }
                    >
                      NOTIFICATIONS
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.onUserRoleTabClick()}>
                <View>
                  <View style={[SettingsScreenStyle.tabTextViewStyle, this.state.isTabSelected == 4 ? { borderBottomColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, borderBottomWidth: 2 } : null]}>
                    <Text
                      style={
                        this.state.isTabSelected == 4
                          ? SettingsScreenStyle.tabLabelTextStyle
                          : SettingsScreenStyle.tabLabelDiselectTextStyle
                      }
                    >
                      USER ROLE
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onUserImageTabClick()}>
                <View>
                  <View style={[SettingsScreenStyle.tabTextViewStyle, this.state.isTabSelected == 5 ? { borderBottomColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, borderBottomWidth: 2 } : null]}>
                    <Text
                      style={
                        this.state.isTabSelected == 5
                          ? SettingsScreenStyle.tabLabelTextStyle
                          : SettingsScreenStyle.tabLabelDiselectTextStyle
                      }
                    >
                      USER IMAGES
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {this.state.roleName == Strings.USER_ROLE_TENANT && (
                <TouchableOpacity onPress={() => this.onOccupancyTabClick()}>
                  <View>
                    <View style={[SettingsScreenStyle.tabTextViewStyle, this.state.isTabSelected == 6 ? { borderBottomColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, borderBottomWidth: 2 } : null]}>
                      <Text
                        style={
                          this.state.isTabSelected == 6
                            ? SettingsScreenStyle.tabLabelTextStyle
                            : SettingsScreenStyle.tabLabelDiselectTextStyle
                        }
                      >
                        OCCUPANCY
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              {this.state.roleName == Strings.USER_ROLE_TENANT && (
                <TouchableOpacity
                  onPress={() => this.onIdentificationTabClick()}
                >
                  <View>
                    <View style={[SettingsScreenStyle.tabTextViewStyle, this.state.isTabSelected == 7 ? { borderBottomColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, borderBottomWidth: 2 } : null]}>
                      <Text
                        style={
                          this.state.isTabSelected == 7
                            ? SettingsScreenStyle.tabLabelTextStyle
                            : SettingsScreenStyle.tabLabelDiselectTextStyle
                        }
                      >
                        IDENTIFICATION
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              {this.state.roleName == Strings.USER_ROLE_TRADER && (
                <TouchableOpacity onPress={() => this.onAvailablityTabClick()}>
                  <View>
                    <View style={[SettingsScreenStyle.tabTextViewStyle, this.state.isTabSelected == 8 ? { borderBottomColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, borderBottomWidth: 2 } : null]}>
                      <Text
                        style={
                          this.state.isTabSelected == 8
                            ? SettingsScreenStyle.tabLabelTextStyle
                            : SettingsScreenStyle.tabLabelDiselectTextStyle
                        }
                      >
                        AVAILABILITY
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              {this.state.roleName == Strings.USER_ROLE_TRADER && (
                <TouchableOpacity onPress={() => this.onSubscriptionTabClick()}>
                  <View>
                    <View style={[SettingsScreenStyle.tabTextViewStyle, this.state.isTabSelected == 9 ? { borderBottomColor: Colors.SKY_BLUE_BUTTON_BACKGROUND, borderBottomWidth: 2 } : null]}>
                      <Text
                        style={
                          this.state.isTabSelected == 9
                            ? SettingsScreenStyle.tabLabelTextStyle
                            : SettingsScreenStyle.tabLabelDiselectTextStyle
                        }
                      >
                        SUBSCRIPTION
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
        {this.state.isTabSelected == 1 ? <ProfileSettingScreen /> : null}
        {this.state.isTabSelected == 2 ? <AccountSecurityScreen /> : null}
        {this.state.isTabSelected == 3 ? <NotificationSettingScreen /> : null}
        {this.state.isTabSelected == 4 ? <UserRoleScreen /> : null}
        {this.state.isTabSelected == 5 ? <UserImageScreen /> : null}

        {this.state.isTabSelected == 6 ? <OccupancyScreen /> : null}
        {this.state.isTabSelected == 7 ? <IdentificationScreen /> : null}
        {this.state.isTabSelected == 8 ? <AvailabilityScreen /> : null}
        {this.state.isTabSelected == 9 ? <SubscriptionScreen /> : null}
      </View>
    );
  }
}

export default SettingsScreen;
