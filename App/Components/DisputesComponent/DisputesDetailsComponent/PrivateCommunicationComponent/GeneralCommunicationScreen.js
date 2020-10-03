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
import CommonStyles from '../../../../CommonStyle/CommonStyle';
import Colors from '../../../../Constants/Colors';
import Strings from '../../../../Constants/Strings';
import ImagePath from '../../../../Constants/ImagesPath';
import API from '../../../../Constants/APIUrls';
import Moment from 'moment';

import {
  shareImageForChat,
} from "../../../../Action/ActionCreators";
import {
  showLoading,
  resetState,
} from "./ChatAction";
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var imageObject = {};
var msgData = {}
var context;
var authToken = '';
var UserID = '';
var disputeId = '';
var userPic = '';
import SocketIOClient from 'socket.io-client';


class GeneralCommunicationScreen extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.socket = this.props.socket
  //   this.state = {
  //     messages: [
  //       {
  //         _id: 1,
  //         text: 'Hello developer',
  //         createdAt: new Date(),
  //         user: {
  //           _id: 2,
  //           name: 'React Native',
  //           avatar: 'https://placeimg.com/140/140/any',
  //         },
  //       },
  //     ],
  //     loadEarlier: true,
  //     typingText: null,
  //     isLoadingEarlier: false,
  //     messageHistory: [],
  //     isSend: true,
  //   };
  //   this.socket = SocketIOClient(API.CHAT_CONNECTION_URL, { transports: ['websocket'] });
  //   // this.onSend = this.onSend.bind(this);
  //   // this.renderCustomActions = this.renderCustomActions.bind(this);
  //   // this.renderBubble = this.renderBubble.bind(this);
  //   // this.renderSystemMessage = this.renderSystemMessage.bind(this);
  //   // this.renderFooter = this.renderFooter.bind(this);
  //   // this.onLoadEarlier = this.onLoadEarlier.bind(this);
  //   var objMessage = {
  //     from: this.props.emitter,
  //     to: this.props.receiver,
  //   }
  
  //   this.socket.emit('privateChatHistory', objMessage)

  // }
  // componentDidMount() {
  //   AsyncStorage.getItem('SyncittUserInfo').then((value) => {
  //     if (value) {
  //       var userData = JSON.parse(value);
  //       UserID = userData.data._id;
  //       this.socket.emit('addUser', { id: UserID });
  //       this.socket.emit("getAppliedUsers", UserID);
  //     }
  //   }).done();
  // }
  // render() {
  
  //   return (
  //     <View style={styles.chatWrap}>
  //       <GiftedChat
  //         messages={this.state.mesa}
  //         onSend={messages => this.onSend(messages)}
  //         user={{
  //           _id: 1,
  //         }}
  //       />
  //     </View>
  //   );
  // }


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
      this.setState((previousState) => {
        return {
          messages: GiftedChat.prepend(previousState.messages, parsedData),
          // loadEarlier: false,
          //  isLoadingEarlier: false,
        };
      });
      this.setState({ messageHistory: parsedData });
    });
  }


  componentDidUpdate() {
    
  }

  componentWillMount() {
    AsyncStorage.getItem('SyncittUserInfo').then((value) => {
      if (value) {
        var userData = JSON.parse(value);
        UserID = userData.data._id;
        this.socket.emit('addUser', { id: UserID });
        this.socket.emit("getAppliedUsers", UserID);
      }
    }).done();
    var objMessage = {
      from: this.props.emitter,
      to: this.props.receiver,
    }
    
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

    if (messages[0].image) {
      


      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });
      messages.map(function (data, i) {


        toId = messages[i].user._id;
        toTime = messages[i].createdAt;
        toMessage = messages[i].filename;

        imageObject = {

          from: context.props.emitter,
          to: messages[i].user._id,
          textMsg: messages[i].filename,
          time: messages[i].createdAt,
        }
        
        context.shareImageForChat(messages[i].image, imageObject);
      })

    } else if (messages[0].location) {
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

      var objMessage = {

        from: this.props.emitter,
        to: messages[0].user._id,
        textMsg: messages[0].text,
        time: messages[0].createdAt,
      }
      
      this.socket.emit('private message', objMessage)
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
    
    this.props.shareImageForChat(authToken, uri.replace('file://', ''), data);
  }



  
  render() {
    return (
      <View style={styles.chatWrap}>
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

  closeMessage() {
    Actions.pop();
  }
}
function mapStateToProps(state) {
  
  return {
    threadReducer: state.threadReducer
  }
}
export default connect(
  mapStateToProps,
  {
    shareImageForChat,
    showLoading,
    resetState,
  }

)(GeneralCommunicationScreen);
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
    flex: 1,
    width: width,
    height: height
  },
  name: {
    fontSize: 13,
    color: '#0084ff'
  }
});
