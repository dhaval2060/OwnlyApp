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
  Picker,
  FlatList,
  AsyncStorage,
  Modal
} from "react-native";

import { completeJob } from "../../../Action/ActionCreators";

import { showLoading, resetState } from "./MarkAsCompleteAction";
import { EventRegister } from 'react-native-event-listeners'

import { Actions } from "react-native-router-flux";
import CommonStyles from "../../../CommonStyle/CommonStyle";
import Colors from "../../../Constants/Colors";
import API from "../../../Constants/APIUrls";
import Strings from "../../../Constants/Strings";
import ImagePath from "../../../Constants/ImagesPath";
import MarkAsCompleteStyle from "./MarkAsCompleteStyle";
import ImagePicker from "react-native-image-picker";
import DatePicker from "react-native-datepicker";
import ActionSheet from "react-native-actionsheet";
import * as Progress from "react-native-progress";
import Moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import SocketIOClient from "socket.io-client";
import { documentUpload } from "../../../Saga/APICaller";

var options = {
  title: "Select Property Image",
  quality: 0.2,
  customButtons: [{ name: "Ownly", title: "Choose Photo" }],
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};

const CANCEL_INDEX = 2;
const DESTRUCTIVE_INDEX = 3;
const actionOptions = ["Upload Photo", "Take Photo", "Cancel"];

var uploadImagesArray = [];
var uploadedImagesPath = [];
let contextRef;

class MarkAsCompleteScreen extends Component {
  constructor() {
    super();
    this.state = {
      uploadImagesData: {},
      selectedImage: "",
      uploadedImageArr: [],
      budget: "",
      detail: "",
      minDate: Moment().format("MMM DD YYYY")
    };
    this.handlePress = this.handlePress.bind(this);
    contextRef = this;
    this.socket = SocketIOClient(API.CHAT_CONNECTION_URL, {
      transports: ["websocket"]
    });
    this.socket.on("maintenanceUserJoined", data => {
      this.socket.emit("maintenanceGroupChatHistory", {
        maintenanceId: this.props.maintenanceId,
        userId: UserID
      });
    });

    this.socket.on("maintenanceGroupChatResponse", historyRes => {
      
    });
  }


  componentDidUpdate() {
    //this.onUploadImageSuccess();
    this.onMarkAsCompleteReqSuccess();
  }


  componentWillMount() {
    uploadImagesArray = [];
    uploadedImagesPath = [];
    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        //debugger
        if (value) {
          var userData = JSON.parse(value);
          authToken = userData.token;
          UserID = userData.data._id;
          this.socket.emit("addMaintenanceUsers", {
            id: UserID,
            maintenanceId: this.props.maintenanceId,
            firstName: userData.data.firstname,
            lastName: userData.data.lastname
          });
          //this.socket.emit("getAppliedUsers", UserID);
        }
      })
      .done();

    //this.callGetAgencyProperty();
  }

  callBack() {
    Actions.pop();
  }

  onBudgetChange(text) {
    this.setState({ budget: text });
  }

  onReqDetailChange(text) {
    this.setState({ detail: text });
  }

  callMarkAsCompleteReqApi() {
    

    AsyncStorage.getItem("SyncittUserInfo")
      .then(value => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;
          var message = {
            from: userData.data._id,
            to: this.props.maintenanceId,
            textMsg: "Job completed",
            time: new Date(),
            maintenanceId: this.props.maintenanceId,
          };
          this.socket.emit("maintenanceGroupMessageSent", message);
        }
      })
      .done();

    if (this.state.detail.trim() == '') {

    }
    else {

      
      AsyncStorage.getItem("SyncittUserInfo").then((value) => {
        if (value) {
          var userData = JSON.parse(value);
          var authToken = userData.token;

          var postData = {

            maintenance_id: this.props.maintenanceId,
            message: this.state.detail,

          };
          
          this.props.showLoading();
          this.props.completeJob(authToken, postData);
        }
      }).done();
    }
  }

  showCamera() {
    // Launch Camera:
    ImagePicker.launchCamera(options, response => {
      
      if (response.didCancel) {
        
      } else if (response.error) {
        
      } else if (response.customButton) {
        
      } else {
        let source = { uri: response.uri };
        let imagePath = Platform.OS == "ios" ? response.origURL : response.path;
        var imageItem = {
          url: source,
          path: imagePath,
          isSelected: 0
        };
        const file = {
          uri: response.uri, // e.g. 'file:///path/to/file/image123.jpg'
          name: 'image123.jpg',
          type: response.type // e.g. 'image/jpg'
        };
        let arr = this.state.uploadedImageArr
        arr.push(file)
        this.setState({ uploadedImageArr: arr })
        if (uploadImagesArray.length < 20) {
          uploadImagesArray.push(imageItem);
          var imagagesData = {
            imageArray: uploadImagesArray
          };
          this.setState({ uploadImagesData: imagagesData });
        } else {
          alert(Strings.MAX_IMAGE_LIMIT);
        }

        if (uploadImagesArray.length == 1) {
          this.uploadImageListSelection(0);
        }
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
        let source = { uri: response.uri };
        let imagePath = Platform.OS == "ios" ? response.origURL : response.path;
        var imageItem = {
          url: source,
          path: imagePath,
          isSelected: 0
        };
        const file = {
          uri: response.uri, // e.g. 'file:///path/to/file/image123.jpg'
          name: response.fileName, // e.g. 'image123.jpg',
          type: response.type // e.g. 'image/jpg'
        };
        let arr = this.state.uploadedImageArr
        arr.push(file)
        this.setState({ uploadedImageArr: arr })
        if (uploadImagesArray.length < 20) {
          uploadImagesArray.push(imageItem);
          var imagagesData = {
            imageArray: uploadImagesArray
          };
          this.setState({ uploadImagesData: imagagesData });
        } else {
          alert(Strings.MAX_IMAGE_LIMIT);
        }

        if (uploadImagesArray.length == 1) {
          this.uploadImageListSelection(0);
        }
      }
    });
  }

  onUploadImageSuccess() {
    if (this.props.newMaintenanceRequestReducer.imageUploadRes != "") {
      if (this.props.newMaintenanceRequestReducer.imageUploadRes.code == 200) {
        var imagePath = {
          path: this.props.newMaintenanceRequestReducer.imageUploadRes.data
        };
        uploadedImagesPath.push(imagePath);
      } else {
        alert(this.props.newMaintenanceRequestReducer.imageUploadRes.message);
      }
      this.props.clearUploadedImageRes();
    }
  }

  onMarkAsCompleteReqSuccess() {
    
    if (this.props.markAsCompleteReducer.markAsCompleteRes != "") {
      if (this.props.markAsCompleteReducer.markAsCompleteRes.code == 200) {
        
        this.state.uploadedImageArr.forEach(element => {
          AsyncStorage.getItem("SyncittUserInfo")
            .then(value => {
              if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                const body = new FormData();
                body.append("file", element);
                body.append("_id", this.props.maintenanceId);
                documentUpload(
                  "uploadCompleteJobImages",
                  authToken,
                  body,
                  userData.data._id
                ).then(
                  async data => {
                    
                  },
                  err => {
                    
                    
                    this.setState({ isScreenLoading: false });
                  }
                );
              }
            })
            .done();
        });
        EventRegister.emit('updateCounter')
        Actions.pop();
        Actions.pop();
      } else {
        alert(this.props.markAsCompleteReducer.counterProposalRes.message);
      }
      this.props.resetState();
    }
  }

  showActionSheet() {
    this.ActionSheet.show();
  }

  handlePress(i) {
    if (i == 0) {
      this.showImageLibrary();
    } else if (i == 1) {
      this.showCamera();
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
          {Strings.NEW_REQUEST}
        </Text>
        <TouchableOpacity
          onPress={() => this.callBack()}
          style={CommonStyles.navRightImageView}
        >
          <View>
            <Image source={ImagePath.DRAWER_CROSS_ICON} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  uploadImageListSelection(index) {
    
    
    this.setState({
      selectedImage: this.state.uploadImagesData.imageArray[index].url
    });
    var tempData = this.state.uploadImagesData;
    var tempArray = this.state.uploadImagesData.imageArray;
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

  renderItem({ item, index }) {
    return (
      <TouchableOpacity onPress={() => contextRef.uploadImageListSelection(index)}>
        <View style={MarkAsCompleteStyle.uploadImageListItemStyle}>
          <Image
            source={item.url}
            style={MarkAsCompleteStyle.uploadPropertyListImageStyle}
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={MarkAsCompleteStyle.mainContainer}>
        {this.navBar()}

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={MarkAsCompleteStyle.scrollViewContainerStyle}
        >
          <View style={MarkAsCompleteStyle.addPropertyInputContainer}>
            <Text style={MarkAsCompleteStyle.labelStyle}>
              {Strings.MARK_AS_COMPLETE_TEXT}
            </Text>
            <TextInput
              ref="refReqDetail"
              style={MarkAsCompleteStyle.inputDescriptionTextStyle}
              multiline={true}
              onChangeText={this.onReqDetailChange.bind(this)}
              value={this.state.detail}
            />
          </View>

          <View>

            <View style={MarkAsCompleteStyle.uploadImageListContainerView}>
              <Text style={MarkAsCompleteStyle.maxImageTextStyle}>{Strings.MAX_IMAGE_LIMIT}</Text>
              {
                this.state.selectedImage != ''
                  ?
                  <Image source={this.state.selectedImage} style={MarkAsCompleteStyle.uploadPropertyImageStyle} />
                  :
                  null
              }
              <View style={{ marginTop: 10 }}>
                {
                  this.state.uploadImagesData.imageArray ?
                    <FlatList
                      horizontal={true}
                      data={this.state.uploadImagesData.imageArray}
                      renderItem={this.renderItem}
                      extraData={this.state}
                    /> : null
                }

              </View>
              <TouchableOpacity style={MarkAsCompleteStyle.uploadImageButtonStyle} onPress={() => this.showActionSheet()}  >
                <View >
                  <Text style={MarkAsCompleteStyle.uploadButtonTextStyle}>
                    {Strings.UPLOAD_IMAGE}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>

        <View style={MarkAsCompleteStyle.buttonContainerStyle}>
          <TouchableOpacity onPress={() => this.callMarkAsCompleteReqApi()}>
            <View style={MarkAsCompleteStyle.roundedBlueProceedButtonStyle}>
              <Text style={MarkAsCompleteStyle.proceedButtonTextStyle}>
                {Strings.MARK_AS_COMPLETE}
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

        {this.props.markAsCompleteReducer.isScreenLoading ? (
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
    markAsCompleteReducer: state.markAsCompleteReducer
  };
}

export default connect(
  mapStateToProps,
  {
    showLoading,
    resetState,
    completeJob
  }
)(MarkAsCompleteScreen);
