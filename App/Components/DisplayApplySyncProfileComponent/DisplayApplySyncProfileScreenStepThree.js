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
class DisplayApplySyncProfileScreenStepThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleName: "",
      propertyAddress: props.propertyDetail.propertyDetail.address,
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
  async componentWillMount() {
    
    this.setState({
      propertyAddress: this.props.propertyDetail.propertyDetail.address
    });
    this.setState({
      agent_specific: this.props.propertyDetail.agent_specific
    });
    var arr = this.state.agent_specific;
    this.props.propertyDetail.agent_specific.forEach((element, index) => {
      if (element.status) {
        arr[index].status = true;
      }
    });
    await this.setState({ agent_specific: arr });
  }

  closeAddProperty() {
    Actions.popTo("Dashboard");
  }

  callBack() {
    Actions.pop();
  }

  callProceedToFourthStep() {
    Actions.DisplayApplySyncProfileScreenStepFour({
      propertyDetail: this.props.propertyDetail
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
                Applicant applying for the property
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
            {this.state.agent_specific[0] && (
              <View>
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
                  {this.state.agent_specific[0].status ? (
                    <View>
                      <Text style={{ fontSize: 18 }}>Yes</Text>
                    </View>
                  ) : (
                    <View>
                      <Text>No</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* //============>>>>> Question 2  <<<<<<<<=========== */}
            {this.state.agent_specific[1] && (
              <View>
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
                  {this.state.agent_specific[1].status ? (
                    <View>
                      <Text style={{ fontSize: 18 }}>Yes</Text>
                    </View>
                  ) : (
                    <View>
                      <Text>No</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
            {this.state.agent_specific[2] && (
              <View>
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
                  {this.state.agent_specific[2].status ? (
                    <View>
                      <Text style={{ fontSize: 18 }}>Yes</Text>
                    </View>
                  ) : (
                    <View>
                      <Text>No</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* //============>>>>> Question 4  <<<<<<<<=========== */}
            {this.state.agent_specific[3] && (
              <View>
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
                  {this.state.agent_specific[3].status ? (
                    <View>
                      <Text style={{ fontSize: 18 }}>Yes</Text>
                    </View>
                  ) : (
                    <View>
                      <Text>No</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* //============>>>>> Question 5  <<<<<<<<=========== */}
            {this.state.agent_specific[4] && (
              <View>
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
                  {this.state.agent_specific[4].status ? (
                    <View>
                      <Text style={{ fontSize: 18 }}>Yes</Text>
                    </View>
                  ) : (
                    <View>
                      <Text>No</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* //============>>>>> Question 6  <<<<<<<<=========== */}
            {this.state.agent_specific[5] && (
              <View>
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
                  {this.state.agent_specific[5].status ? (
                    <View>
                      <Text style={{ fontSize: 18 }}>Yes</Text>
                    </View>
                  ) : (
                    <View>
                      <Text>No</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* //============>>>>> Question 7  <<<<<<<<=========== */}
            {this.state.agent_specific[0] && (
              <View>
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
                  {this.state.agent_specific[6].status ? (
                    <View>
                      <Text style={{ fontSize: 18 }}>Yes</Text>
                    </View>
                  ) : (
                    <View>
                      <Text>No</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* //============>>>>> Question 8  <<<<<<<<=========== */}
            {this.state.agent_specific[6] && (
              <View>
                <Text style={ApplySyncProfileScreenStyle.labelStyle}>
                  Are you considering buying a property after this tenancy or in
                  the near future?
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
                  {this.state.agent_specific[7].status ? (
                    <View>
                      <Text style={{ fontSize: 18 }}>Yes</Text>
                    </View>
                  ) : (
                    <View>
                      <Text>No</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={ApplySyncProfileScreenStyle.buttonContainerStyle}>
         
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

export default DisplayApplySyncProfileScreenStepThree;
