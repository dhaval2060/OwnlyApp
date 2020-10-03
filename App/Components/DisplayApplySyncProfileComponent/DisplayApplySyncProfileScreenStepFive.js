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


import CheckBox from "react-native-checkbox";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";

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
import API from "../../Constants/APIUrls";

let propertyType = [
  { value: "House" },
  { value: "Town house" },
  { value: "Unit" },
  { value: "Apartment" },
  { value: "Vila" },
  { value: "Land" }
];

let propertyCategory = [{ value: "Sale" }, { value: "Rental" }];

class DisplayApplySyncProfileScreenStepFive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: "",
      propertyAddress: props.propertyDetail.propertyDetail.address,
      errorOnTextField: "",
      document_id: [],
      name:
        props.propertyDetail.created_by.firstname +
        " " +
        props.propertyDetail.created_by.lastname,
      documentation_status: false,
      uploadedDocumentDetails: []
    };
    
  }

  componentWillMount() {
    
    this.setState({
      propertyAddress: this.props.propertyDetail.propertyDetail.address
    });

    this.setState({
      documentation_status: this.props.propertyDetail.documentation_status,
      document_id: this.props.propertyDetail.document_id,
      uploadedDocumentDetails: this.props.propertyDetail.uploadedDocumentDetails
    });

    this.getUploadedIdentificationDocument();
  }

  closeAddProperty() {
    Actions.popTo("Dashboard");
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
    Actions.DisplayApplySyncProfileScreenStepSix({
      propertyDetail: this.props.propertyDetail
    });
  }

  callSavePropertyApi() {}

  callBack() {
    Actions.pop();
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
            this.setState({ uploadedDocumentDetails: data.data });
          }
        });
      }
    });
  }
  setAddressInputType() {}
  openFileChooser() {
    // iPhone/Android
    // DocumentPicker.show({
    //     filetype: [DocumentPickerUtil.allFiles()],
    // }, (error, res) => {
    //     // Android
    
    //         res.uri,
    //         res.type, // mime type
    //         res.fileName,
    //         res.fileSize
    //     );
    //     AsyncStorage.getItem("SyncittUserInfo").then((value) => {
    //         if (value) {
    //             var userData = JSON.parse(value);
    //             var authToken = userData.token;

    //             //this.props.showLoading();
    
    //             this.props.showLoading();
    //             this.props.uploadAgreementImage(authToken, response.uri.replace("file://", ""),res.fileName,res.type);
    //            // this.props.uploadMyFileDoc(authToken, res.uri.replace("file://", ""), userData.data._id, res.type, res.fileName);
    //         }
    //     }).done();

    // });
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        // Android
        
       
        AsyncStorage.getItem("SyncittUserInfo")
          .then(value => {
            if (value) {
              var userData = JSON.parse(value);
              var authToken = userData.token;
              var postBody = {
                created_by: userData.data._id,
                file: res.uri
                // uri: res.uri,
                // type: res.type, // mime type
                // fileName: res.fileName,
                // fileSize: res.fileSize
              };
              // uploadDocument('uploadIdentificationDocumentsFiles', 'POST', authToken, postBody).then(data => {
              
              // })
              // let formdata = new FormData();
              // fetch('http://192.168.1.88:5095/api/' + 'uploadIdentificationDocumentsFiles', {
              //     method: 'POST',
              //     headers: {
              //         // 'Content-Type': 'application/json',
              //         // 'User-Agent': 'iOS',
              //         Accept: 'application/json',
              //         'Content-Type': 'multipart/form-data',
              //         'authorization': authToken
              //     },
              //     body: formdata
              // }).then(res => res.json())
              //     .then(data => {
              
              //     })

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
                  this.setState({ document_id: arr });
                }
              });
            }
          })
          .done();
      }
    );
  }
  onRemove(item) {
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
            {!this.state.documentation_status ? (
              <Text style={{ fontSize: 16, fontWeight: "300", paddingTop: 25 }}>
                {this.state.name} prefer to give documents on-hand.
              </Text>
            ) : (
              <View style={{ paddingTop: 25, paddingBottom: 25 }}>
                <FlatList
                  data={this.state.document_id}
                  extraData={this.state}
                  renderItem={item => {
                    
                     var documentPath = API.DOCUMENTS_PATH + item.document_path;
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
                        <TouchableOpacity style={{ flex: 0.8 }} onPress={()=> Actions.LAWebView({docURL: documentPath})}>
                          <Text>{item.item.document_name}</Text>
                        </TouchableOpacity>
                        {/* <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                                                    <TouchableOpacity onPress={() => this.onRemove(item.item)}>
                                                        <Text>Remove</Text>
                                                    </TouchableOpacity>
                                                </View> */}
                      </View>
                    );
                  }}
                />
              </View>
            )}

            {/* {!this.state.documentation_status ? (
              <View style={{ paddingTop: 25, paddingBottom: 25 }}>
                <FlatList
                  data={this.state.document_id}
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
                      </View>
                    );
                  }}
                />
              </View>
            ) : (
              <View style={{ paddingTop: 25, paddingBottom: 25 }}>
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
            )} */}
          </View>
        </KeyboardAwareScrollView>

        <View style={ApplySyncProfileScreenStyle.buttonContainerStyle}>
        
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
      </View>
    );
  }
}
function mapStateToProps(state) {
  
  return {
    addPropertyReducer: state.addPropertyReducer
  };
}

export default DisplayApplySyncProfileScreenStepFive;
