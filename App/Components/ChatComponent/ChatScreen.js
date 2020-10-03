import React from 'react';
import { connect } from 'react-redux';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
} from 'react-native';

import { GiftedChat, Actionss, Bubble, SystemMessage } from 'react-native-gifted-chat';
import { Actions } from 'react-native-router-flux';
import CustomActions from './CustomActions';
import CustomView from './CustomView';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import API from '../../Constants/APIUrls';
import Moment from 'moment';

import {
  shareImageForChat,
  getUnreadMessageList,
  readUnreadMessage
} from "../../Action/ActionCreators";
import {
  showLoading,
  resetState,
} from "./ChatAction";
import { documentUpload } from '../../Saga/APICaller';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var imageObject = {};
var context;
var authToken = '';
class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      messageHistory: [],
    };
    context = this,
      this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;

    this.socket.on('received', (message) => {
      this.socket.open();

      var data = [{
        text: message.textMsg,
        user: { _id: this.props.nickname },
        createdAt: message.time,
        _id: message.to
      }]
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, {
            _id: Math.round(Math.random() * 1000000),
            text: message.textMsg,
            createdAt: new Date(),
            user: {
              _id: this.props.nickname,
              name: this.props.userName,
              avatar: this.props.userPic,
            },
            image: message.document_path ? API.CHAT_URL + message.document_path : '',
          }),
        };
      });

    })

    this.socket.on('privateChatHistoryRes', (historyRes) => {
      var parsedData = [];
      console.log(historyRes, "historyReshistoryRes")
    //   let sortedData = historyRes.sort((a, b) => {

    //     return a.createdAt > b.createdAt
    // });
    // console.log(sortedData, "historyReshistoryRes")


    historyRes.map(function (data, i) {
        var from = historyRes[i].from !== null ? historyRes[i].from : {};
        var userImage = from.image ? API.USER_IMAGE_PATH + from.image : '';
        var firstName = from.firstname ? from.firstname : '';
        var lastName = from.lastname ? from.lastname : '';

        var id = historyRes[i].to !== null ? historyRes[i].to._id : '';

        var timeInMillis = new Date(historyRes[i].time).getTime()
        var history = {
          text: historyRes[i].msg,
          user: {
            _id: id !== '' ? id : id,
            avatar: userImage,
            name: firstName + ' ' + lastName,
          },
          createdAt: Moment(historyRes[i].created).format(),
          _id: Math.round(Math.random() * 1000000),
          image: historyRes[i].document_path ? API.CHAT_URL + historyRes[i].document_path : '',
        }

        parsedData.unshift(history);
      })

      console.log("parsed data "+ JSON.stringify(parsedData))

         let sortedData = parsedData.sort((a, b) => {
        return a.createdAt < b.createdAt
    });

      this.setState((previousState) => {
        return {
          messages: GiftedChat.prepend(previousState.messages, sortedData),
          // loadEarlier: false,
          //  isLoadingEarlier: false,
        };
      });
      this.setState({ messageHistory: sortedData });
      setTimeout(() => {
        console.log(this.state.messages,parsedData, "historyReshistoryRes")
      }, 1000);
    });
    this.callGetUnreadMessage();

  }

  callGetUnreadMessage() {
    AsyncStorage.getItem("SyncittUserInfo").then((value) => {
      if (value) {
        var userData = JSON.parse(value);
        var authToken = userData.token;
        this.props.showLoading();
        this.props.getUnreadMessageList(authToken, userData.data._id);
      }
    }).done();
  }
  
  componentDidUpdate() {
    this.onShareImageForChatSuccess();
    this.onUnreadMessageSuccess()

  }
  onUnreadMessageSuccess() {
    if (this.props.homeScreenReducer.unreadMsgListResponse != '') {
      if (this.props.homeScreenReducer.unreadMsgListResponse.code == 200) {

        this.setState({ unReadCount: this.props.homeScreenReducer.unreadMsgListResponse.data.length });
        global.unRead = this.props.homeScreenReducer.unreadMsgListResponse.data.length
      }
      else {

        // alert(this.props.homeScreenReducer.unreadMsgListResponse.message);
      }
      this.props.resetState();

    }
  }
  componentWillMount() {
    AsyncStorage.getItem('SyncittUserInfo').then((value) => {
      if (value) {
        var userData = JSON.parse(value);


        authToken = userData.token;
        this.props.readUnreadMessage(authToken, {
          "from": this.props.receiver,
          "to": this.props.emitter
        })
      }
    }).done();


    var objMessage = {

      from: this.props.emitter,
      to: this.props.receiver,
    }
    console.log(this.socket, objMessage, "objMessageobjMessage")
    this.socket.open();
    AsyncStorage.getItem("SyncittUserInfo").then((value) => {
      if (value) {
          var userData = JSON.parse(value);
          let UserID = userData.data._id;

          this.socket.emit('addUser', { id: UserID });
          this.socket.emit("getAppliedUsers", UserID);
      }
  }).done();
    this.socket.emit('privateChatHistory', objMessage)


    this._isMounted = true;
    this.setState(() => {
      return {
        messages: [],//require('./data/messages.js'),
      };
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,

      };
    });


    setTimeout(() => {
      if (this._isMounted === true) {

        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, this.state.messageHistory),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }

  onSend(messages = []) {

    if (messages.length > 0 && messages[0].image) {



      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });
      messages.map(function (data, i) {


        let toId = messages[i].user._id;
        let toTime = messages[i].createdAt;
        let toMessage = messages[i].filename;
        imageObject = {
          from: context.props.emitter,
          to: messages[i].user._id,
          textMsg: messages[i].filename,
          time: messages[i].createdAt,
        }
        const file = {
          uri: messages[i].image.replace("file://", ""), // e.g. 'file:///path/to/file/image123.jpg'
          name: "user_portfolio.png",// e.g. 'image123.jpg',
          type: 'image/jpeg' // e.g. 'image/jpg'
        };
        let formdata = new FormData()
        formdata.append('from', context.props.emitter)
        formdata.append('to', messages[i].user._id)
        formdata.append('textMsg', messages[i].filename)
        formdata.append('time', messages[i].createdAt)
        formdata.append('file', file)
        console.log(formdata, messages[i], "messages[i].image, imageObject")
        // context.shareImageForChat(messages[i].image, formdata);
        documentUpload("uploadDocumentForChat", authToken, formdata, "").then(
          data => {
            var postData = {
              from: context.props.emitter,
              to: toId,
              textMsg: toMessage,
              time: toTime,
              is_file: true,
              document_name: data.data.document_name,
              picture_path: data.data.picture_path,
              document_path: data.data.document_path + data.data.picture_path,
              size: data.data.size,
              msg: data.data.msg
            }
            context.socket.emit('private message', postData)
          },
          err => {
            console.log(err, "datadatadatadata")
          }
        );
      })

    } else if (messages.length > 0 && messages[0].location) {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });


      var objMessage = {

        from: this.props.emitter,
        to: messages[0].user._id,
        textMsg: messages[0].location,
        time: messages[0].createdAt,
      }

      this.socket.emit('private message', objMessage)

    } else {

      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });
      if (messages.length > 0) {
        var objMessage = {

          from: this.props.emitter,
          to: messages[0].user._id,
          textMsg: messages[0].text,
          time: messages[0].createdAt,
        }
        this.socket.emit('private message', objMessage)
        if (this.props.onSend) {
          this.props.onSend()
        }
        if (this.props.onSendHomeScreen) {
          this.props.onSendHomeScreen()
        }
      }
    }
  }


  answerDemo(messages) {
    if (messages.length > 0) {
      if ((messages[0].image || messages[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          return {
            typingText: 'typing...'
          };
        });
      }
    }

    setTimeout(() => {
      if (this._isMounted === true) {
        if (messages.length > 0) {
          if (messages[0].image) {
            this.onReceive('Nice picture!');
          } else if (messages[0].location) {
            this.onReceive('My favorite place');
          } else {
            if (!this._isAlright) {
              this._isAlright = true;
              this.onReceive('Alright');
            }
          }
        }
      }

      this.setState((previousState) => {
        return {
          typingText: null,
        };
      });
    }, 1000);
  }

  renderCustomActions(props) {
    //if (Platform.OS === 'ios') {
    return (
      <CustomActions
        {...props}
      />
    );
    //}
    // const options = {
    //   'Action 1': (props) => {
    //     alert('option 1');
    //   },
    //   'Action 2': (props) => {
    //     alert('option 2');
    //   },
    //   'Cancel': () => { },
    // };
    // return (
    //   <Actionss
    //     {...props}
    //     options={options}
    //   />
    // );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: Colors.RECEIVER_BG_COLOR,

          },
          right: {
            backgroundColor: Colors.SENDER_BG_COLOR,

          },
        }}
      />
    );
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  shareImageForChat(uri, data) {
    this.props.showLoading();
    let url = uri.replace('ph:/', '')
    console.log(data, "datadatadata", url)
    this.props.shareImageForChat(authToken, url.replace('file://', ''), data);
  }



  onShareImageForChatSuccess() {
    if (this.props.chatReducer.shareImageForChatResponse != '' || this.props.chatReducer.shareImageForChatResponse != undefined) {
      if (this.props.chatReducer.shareImageForChatResponse.code == 200) {
        var postData = {

          from: this.props.emitter,
          to: toId,
          textMsg: toMessage,
          time: toTime,
          is_file: true,
          document_name: this.props.chatReducer.shareImageForChatResponse.data.document_name,
          picture_path: this.props.chatReducer.shareImageForChatResponse.data.picture_path,
          document_path: this.props.chatReducer.shareImageForChatResponse.data.document_path + this.props.chatReducer.shareImageForChatResponse.data.picture_path,
          size: this.props.chatReducer.shareImageForChatResponse.data.size,
          msg: this.props.chatReducer.shareImageForChatResponse.data.msg
        }




        this.socket.emit('private message', postData)
      }
      else {
        // alert(this.props.chatReducer.shareImageForChatResponse.message);
      }
      this.props.resetState();
    }
  }


  closeMessage() {
    Actions.pop();
    if (this.props.onSendHomeScreen) {
      this.props.onSendHomeScreen();

    }
  }

  navBar() {
    return (
      <View>
        <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
        <Text style={CommonStyles.navBarTitleTextView}>{this.props.userName}</Text>
        <TouchableOpacity onPress={() => this.closeMessage()} style={CommonStyles.navRightImageView}>
          <View>
            <Image source={ImagePath.DRAWER_CROSS_ICON} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }


  render() {
    return (
      <View style={styles.chatWrap}>
        {this.navBar()}
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          //loadEarlier={this.state.loadEarlier}
          // onLoadEarlier={this.onLoadEarlier}
          //isLoadingEarlier={this.state.isLoadingEarlier}

          user={{
            _id: this.props.receiver, // sent messages should have same user._id
          }}

          renderActions={this.renderCustomActions}
          renderBubble={this.renderBubble}
          renderSystemMessage={this.renderSystemMessage}
          renderCustomView={this.renderCustomView}
          renderFooter={this.renderFooter}
          renderHeader={this.navBar}
        />
      </View>
    );
  }
}



function mapStateToProps(state) {

  return {
    chatReducer: state.chatReducer,
    homeScreenReducer: state.homeScreenReducer
  }
}

export default connect(
  mapStateToProps,
  {
    shareImageForChat,
    readUnreadMessage,
    showLoading,
    getUnreadMessageList,
    resetState,
  }

)(ChatScreen);


const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  chatWrap: {
    width: width,
    height: height
  },
});
