import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Image,
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  ScrollView,
  AsyncStorage
} from "react-native";
var ImagePicker = require("react-native-image-picker");


import CheckBox from "react-native-checkbox";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import ActionSheet from "react-native-actionsheet";

import { Actions } from "react-native-router-flux";
import CommonStyles from "../../CommonStyle/CommonStyle";
import Colors from "../../Constants/Colors";
import Strings from "../../Constants/Strings";
import ImagePath from "../../Constants/ImagesPath";
import ApplySyncProfileScreenStyle from "./ApplySyncProfileScreenStyle";
import { Dropdown } from "react-native-material-dropdown";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Progress from "react-native-progress";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import APICaller, { documentUpload } from "../../Saga/APICaller";

let propertyType = [
  { value: "House" },
  { value: "Town house" },
  { value: "Unit" },
  { value: "Apartment" },
  { value: "Vila" },
  { value: "Land" }
];

const actionOptions = ["Upload Photo", "Take Photo", "Document", "Cancel"];
const CANCEL_INDEX = 3;
const DESTRUCTIVE_INDEX = 4;
var options = {
  title: "Select Property Image",
  quality: 0.5,
  customButtons: [{ name: "Ownly", title: "Choose Photo" }],
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};
var cameraOptions = {
  title: "Select Property Image",
  allowsEditing:true,
  quality: 0.5,
  customButtons: [{ name: "Ownly", title: "Choose Photo" }],
  storageOptions: {
    skipBackup: true,
    cameraRoll :true,
    waitUntilSaved:true,
    path: "images"
  }
};
let propertyCategory = [{ value: "Sale" }, { value: "Rental" }];

class ApplySyncProfileScreenStepFive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: "",
      propertyAddress: "",
      isScreenLoading:false,
      errorOnTextField: "",
      document_id: [],
      documentation_status: false,
      uploadedDocumentDetails: []
    };
    this.handlePress = this.handlePress.bind(this);
  }

  componentWillReceiveProps(nextProps) {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  componentWillMount() {
    this.setState({ isScreenLoading: true });
    this.setState({
      propertyAddress: this.props.screenFourDetails.propertyAddress
    });
    if (global.isEdit) {
      this.setState({
        documentation_status: !global.propertyDetail.documentation_status,
        document_id: global.propertyDetail.document_id,
        uploadedDocumentDetails: global.propertyDetail.uploadedDocumentDetails
      });
    }

    this.getUploadedIdentificationDocument();
  }

  closeAddProperty() {
    Actions.popTo("Dashboard");
  }
  handlePress(i) {
    if (i == 0) {
      this.showImageLibrary();
    } else if (i == 1) {
      this.showCamera();
    } else if (i == 2) {
      this.openFileChooser();
    }
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
  callProceedToStepSix() {
    let screenFourDetails = this.props.screenFourDetails;
    screenFourDetails["documentation_status"] = !this.state
      .documentation_status;

    let arr = [];
    if (this.state.documentation_status) {
      screenFourDetails["document_id"] = [];
    } else {
      this.state.uploadedDocumentDetails.forEach(element => {
        arr.push(element._id);
      });
      screenFourDetails["document_id"] = arr;
      screenFourDetails[
        "uploadedDocumentDetails"
      ] = this.state.uploadedDocumentDetails;
    }

    Actions.ApplySyncProfileScreenStepSix({
      screenFiveDetails: screenFourDetails
    });
  }

  callSavePropertyApi() {}

  callBack() {
    Actions.pop();
  }
  showActionSheet() {
    this.ActionSheet.show();
  }
  showCamera() {
    // Launch Camera:
    ImagePicker.launchCamera(cameraOptions, response => {
      
      if (response.didCancel) {
        
      } else if (response.error) {
        
      } else if (response.customButton) {
        
      } else {
        this.setState({ isScreenLoading: true });
        AsyncStorage.getItem("SyncittUserInfo")
          .then(value => {
            if (value) {
              var userData = JSON.parse(value);
              var authToken = userData.token;
              var postBody = {
                created_by: userData.data._id,
                file: response.uri
              };

              const file = {
                uri: response.uri, // e.g. 'file:///path/to/file/image123.jpg'
                name: response.fileName, // e.g. 'image123.jpg',
                type: response.type // e.g. 'image/jpg'
              };
              const body = new FormData();
              body.append("file", file);
              body.append("created_by", userData.data._id);
              documentUpload(
                "uploadIdentificationDocumentsFiles",
                authToken,
                body,
                userData.data._id
              ).then(data => {
                
                if (data.code == 200) {
                  var arr = this.state.document_id;
                  this.getUploadedIdentificationDocument();
                  this.setState({ isScreenLoading: false, document_id: arr });
                }
              });
            }
          })
          .done();
      }
    });
  }

  showImageLibrary() {
    // Open Image Library:
    ImagePicker.launchImageLibrary(options, response => {
      
      if (response.didCancel) {
        
      } else if (response.error) {
        
      } else if (response.customButton) {
        
      } else {
        this.setState({ isScreenLoading: true });
        AsyncStorage.getItem("SyncittUserInfo")
          .then(value => {
            if (value) {
              var userData = JSON.parse(value);
              var authToken = userData.token;
              var postBody = {
                created_by: userData.data._id,
                file: response.uri
              };

              const file = {
                uri: response.uri, // e.g. 'file:///path/to/file/image123.jpg'
                name: response.fileName, // e.g. 'image123.jpg',
                type: response.type // e.g. 'image/jpg'
              };
              const body = new FormData();
              body.append("file", file);
              body.append("created_by", userData.data._id);
              documentUpload(
                "uploadIdentificationDocumentsFiles",
                authToken,
                body,
                userData.data._id
              ).then(data => {
                
                if (data.code == 200) {
                  var arr = this.state.document_id;
                  this.getUploadedIdentificationDocument();
                  this.setState({ isScreenLoading: false, document_id: arr });
                }
              });
            }
          })
          .done();
      }
    });
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
    this.callSavePropertyApi();
  }
  getUploadedIdentificationDocument() {
    AsyncStorage.getItem("SyncittUserInfo").then(value => {
      if (value) {
        var userData = JSON.parse(value);
        var authToken = userData.token;
        var postBody = {
          created_by: userData.data._id
        };
        
        APICaller(
          "getUploadedIdentificationDocument",
          "POST",
          authToken,
          postBody
        ).then(data => {
          if (data.code == 200) {
            this.setState({
              uploadedDocumentDetails: data.data,
              isScreenLoading: false
            });
          }
        });
      }
    });
  }
  setAddressInputType() {}
  openFileChooser() {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        // Android
        
          
        this.setState({ isScreenLoading: true });
        AsyncStorage.getItem("SyncittUserInfo")
          .then(value => {
            if (value) {
              var userData = JSON.parse(value);
              var authToken = userData.token;
              var postBody = {
                created_by: userData.data._id,
                file: res.uri
              };

              const file = {
                uri: res.uri, // e.g. 'file:///path/to/file/image123.jpg'
                name: res.fileName, // e.g. 'image123.jpg',
                type: res.type // e.g. 'image/jpg'
              };
              const body = new FormData();
              body.append("file", file);
              body.append("created_by", userData.data._id);
              documentUpload(
                "uploadIdentificationDocumentsFiles",
                authToken,
                body,
                userData.data._id
              ).then(data => {
                if (data.code == 200) {
                  var arr = this.state.document_id;
                  this.getUploadedIdentificationDocument();
                  this.setState({ isScreenLoading: false, document_id: arr });
                }
              });
            }
          })
          .done();
      }
    );
  }
  onRemove(item) {
    this.setState({ isScreenLoading: true });
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;
          // this.props.showLoading();
          var body = {
            created_by: userData.data._id,
            _id: item._id
          };
          APICaller(
            "deleteIdentificationDocument",
            "POST",
            authToken,
            body
          ).then(data => {
            if (data.code == 200) {
              this.getUploadedIdentificationDocument();
            }
          });
        }
      })
      .done();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.navBar()}

        <KeyboardAwareScrollView
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
              <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
              <View style={ApplySyncProfileScreenStyle.blueDotStyle} />
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
              Identification
            </Text>
          </View>

          {/* ============>>>>>>> Checkboxe Yes <<<<<<<================= */}
          <View style={ApplySyncProfileScreenStyle.addPropertyInputContainer}>
            <Text style={{ fontSize: 22, fontWeight: "300" }}>
              Identification & Supporting Documentation
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "300", paddingTop: 25 }}>
              To access your application, this property manager requires the
              following copies of you identification and supporting
              documentation.
            </Text>

            <Text style={{ fontSize: 16, fontWeight: "300", paddingTop: 25 }}>
              100 Points of identification - You must upload at least one from
              of photo identification*
            </Text>

            <Text style={{ fontSize: 16, fontWeight: "300", paddingTop: 25 }}>
              <Text style={{ fontWeight: "600" }}>50 points* - </Text>
              Primary/Photo ID (Eg. Drivers License, password, keypass, proof of
              age)
            </Text>

            <Text style={{ fontSize: 16, fontWeight: "300", paddingTop: 25 }}>
              <Text style={{ fontWeight: "600" }}>30 points* - </Text>
              Secondary ID (Eg. Birth Certificate, Student Card, Medicare Card,
              Vehicle Registration)
            </Text>

            <Text style={{ fontSize: 16, fontWeight: "300", paddingTop: 25 }}>
              <Text style={{ fontWeight: "600" }}>30 points* - </Text>
              Rental history / Proof of Address (Eg.Rental Receipts, Signed
              Lease, Utitility Bill. Bank Statements, Rental References)
            </Text>

            <Text style={{ fontSize: 16, fontWeight: "300", paddingTop: 25 }}>
              <Text style={{ fontWeight: "600" }}>20 points* - </Text>
              Employment/Proof of Income (Eg. Payslips, Letter of Employment,
              Employment Reference )
            </Text>
            {!this.state.documentation_status ? (
              <TouchableOpacity
                // onPress={() => this.openFileChooser()}
                onPress={() => this.showActionSheet()}
                style={{
                  height: 250,
                  borderWidth: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  borderStyle: "dashed",
                  borderColor: "#cccc",
                  margin: 15,
                  marginLeft: 0,
                  marginRight: 0
                }}
              >
                <Image
                  source={ImagePath.UPLOAD}
                  style={{ width: 45, height: 45, margin: 20 }}
                />
                <Text style={{ fontSize: 20 }}>Drag and drop file here</Text>
              </TouchableOpacity>
            ) : null}
            {!this.state.documentation_status ? (
              <View>
                <FlatList
                  data={this.state.uploadedDocumentDetails}
                  extraData={this.state}
                  renderItem={item => {
                    return (
                      <View
                        style={{
                          borderRadius: 5,
                          borderColor: "grey",
                          margin: 5,
                          borderWidth: 1,
                          padding: 5,
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}
                      >
                        <View style={{ flex: 0.8 }}>
                          <Text>{item.item.document_name}</Text>
                        </View>
                        <View
                          style={{
                            flex: 0.2,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => this.onRemove(item.item)}
                          >
                            <Text>Remove</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            ) : null}
            <View
              style={{
                flexDirection: "row",
                paddingLeft: 4,
                padding: 15,
                backgroundColor: "white",
                flex: 1
              }}
            >
              <View style={{ flex: 0.15, padding: 10 }}>
                <CheckBox
                  label={""}
                  labelStyle={[
                    ApplySyncProfileScreenStyle.amenitisListCheckboxLabelStyle,
                    { padding: 10, fontSize: 16 }
                  ]}
                  checked={this.state.documentation_status}
                  checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                  uncheckedImage={ImagePath.UNCHECK}
                  onChange={val => {
                    if (this.state.documentation_status) {
                      this.setState({ documentation_status: false });
                    } else {
                      this.setState({ documentation_status: true });
                    }
                  }}
                />
              </View>
              <View style={{ flex: 0.9 }}>
                <Text
                  style={[
                    ApplySyncProfileScreenStyle.labelStylem,
                    { fontSize: 16, fontWeight: "300" }
                  ]}
                >
                  I've changed my mind, I'd prefer to deliver my documentation
                  in person
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>

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
          <TouchableOpacity onPress={() => this.callProceedToStepSix()}>
            <View
              style={ApplySyncProfileScreenStyle.roundedBlueProceedButtonStyle}
            >
              <Text style={ApplySyncProfileScreenStyle.proceedButtonTextStyle}>
                {Strings.PROCEED}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          options={actionOptions}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this.handlePress}
        />
        {this.state.isScreenLoading ? (
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
    addPropertyReducer: state.addPropertyReducer
  };
}

export default ApplySyncProfileScreenStepFive;
