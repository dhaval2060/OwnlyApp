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

import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat';
import { Actions } from 'react-native-router-flux';
import CustomActions from './CustomActions';
import CustomView from './CustomView';
import CommonStyles from '../../../../CommonStyle/CommonStyle';
import Colors from '../../../../Constants/Colors';
import Strings from '../../../../Constants/Strings';
import ImagePath from '../../../../Constants/ImagesPath';
import API from '../../../../Constants/APIUrls';
import Moment from 'moment';

import ThreadScreenStyle from '../ThreadScreenStyle';
import {
  shareImageForChat,
} from "../../../../Action/ActionCreators";
import {
  showLoading,
  updateScene,
  resetState,
} from "./ChatAction";
import { documentUpload } from '../../../../Saga/APICaller';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var imageObject = {};
var context;
var authToken = '';

var UserID = '';
var maintenanceID = '';
var userPic = '';
var counterProposalId = '';
// import SocketIOClient from 'socket.io-client';
var message = '';

class ThreadScreen extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      messageHistory: [],
      isSend: true,
      updateView: false,
    };
    // this.socket = SocketIOClient(API.CHAT_CONNECTION_URL, { transports: ['websocket'] });
    this.socket = this.props.socket
    global.socket = this.props.socket
    context = this;
    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);
    this._isAlright = null;
    this.socket.on('maintenanceUserJoined', (data) => {

      // if (this.state.messages == []) {
      this.socket.emit('maintenanceGroupChatHistory', { maintenanceId: this.props.reqDetailData._id, userId: UserID });
      // }
    });



    this.socket.on('maintenanceGroupChatResponse', (historyRes) => {

      var parsedData = [];
      var history = {};

  
      historyRes.map(function (data, i) {

        var from = historyRes[i].from !== null ? historyRes[i].from : {};
        var userImage = from.image ? API.USER_IMAGE_PATH + from.image : '';
        var firstName = from.firstname ? from.firstname : '';
        var lastName = from.lastname ? from.lastname : '';
        var id = from._id ? from._id : '';
        var proposal_id = historyRes[i].proposal_id !== null || historyRes[i].proposal_id !== undefined ? historyRes[i].proposal_id : {};
        var proposalID = proposal_id ? (proposal_id._id ? proposal_id._id : '') : '';
        userPic = userImage;
        var maintenance_id = historyRes[i].maintenance_id !== null || historyRes[i].maintenance_id !== undefined ? historyRes[i].maintenance_id : {};

        if (maintenance_id != null) {
          var job_close_confirmation = maintenance_id.job_close_confirmation ? maintenance_id.job_close_confirmation : 0
        }
        var proposalDate = proposalID !== '' ? Moment(proposal_id.proposed_date).format(Strings.DATE_FORMATE) : new Date();
        message = historyRes.length > 0 ? historyRes[i].msg : '';
        var newmessage = historyRes.length > 0 ? (proposalID !== '' ?
          historyRes[i].msg.includes('Quote Sent') ?
            'Apply For Quote\n\n' + 'Quote Price: $' + proposal_id.proposed_price + '\nQuote Delivery time: ' + proposalDate + '\n\n' + proposal_id.message:
            'Counter Proposal\n\n' + 'Proposed Price: $' + proposal_id.proposed_price + '\nProposed Delivery time: '
            + proposalDate + '\n\n' + proposal_id.message
          : (historyRes[i].msg.includes('Job completed') ? maintenance_id.req_complete_message !== undefined ? historyRes[i].msg + '\n' + maintenance_id.req_complete_message : historyRes[i].msg : historyRes[i].msg)) : '';

        var isReadData = proposal_id ? proposal_id.is_proposal_read_by_agent : '';;

        var location = {
          latitude: 37.00,
          longitude: -122.00,
          proposal_id: proposalID,
          message: message,
          proposalData: proposal_id,
          maintenanceId: maintenanceID ? maintenanceID : '',
          isRead: isReadData,
          job_confirm: job_close_confirmation
        };

        var images = ''
        var imagesArr = []
        if (historyRes[i].msg == 'Job completed') {
          newmessage = 'You marked this request as comlpeted,\n\n' + 'Hello,\n\n' + maintenance_id.req_complete_message + '\nThank you'
          if (historyRes[i].maintenance_id && historyRes[i].maintenance_id.complete_images && historyRes[i].maintenance_id.complete_images.length > 0) {
            images = (API.DOCUMENTS_PATH + historyRes[i].maintenance_id.complete_images[0].path).toString()
            if (historyRes[i].maintenance_id.complete_images.length > 1) {
              historyRes[i].maintenance_id.complete_images.forEach(element => {

                let flag = (API.DOCUMENTS_PATH + element.path).toString()
                imagesArr.push(flag)
              });
            }
          }
        }
        if (historyRes[i].is_status) {


          if (newmessage == 'Sent') {
            newmessage = "-------- Sent ---------"
          }
          if (newmessage == 'Counter Proposal Accepted') {
            newmessage = "--- Counter Proposal Accepted ---"
          }
          if (newmessage == "Counter Proposal Declined") {
            newmessage = "--- Counter Proposal Declined ---"
          }
          if (newmessage == "Confirmation Approved") {
            newmessage = "--- Confirmation Approved ---"
          }
          if (newmessage == "Confirmation Declined") {
            newmessage = "--- Confirmation Declined ---"
          }
          if (newmessage == 'Booked') {
            newmessage = "------ Booked ------"
          }
          if (newmessage == "Request Cancelled") {
            newmessage = "---- Request Cancelled ----"
          }
          if (newmessage == "maintenance_decline") {
            newmessage = "------ Request Declined ------"
          }
          if (newmessage == "maintenance_accept") {
            newmessage = "------ Request Accepted ------"
          }
        }

        history = {
          text: newmessage,
          user: {
            _id: id !== '' ? id : id,
            avatar: userImage,
            name: firstName + ' ' + lastName,
          },
          createdAt: Moment(historyRes[i].created).format(),
          _id: Math.round(Math.random() * 1000000),
          image: images != undefined && images != '' ? images : historyRes[i].document_path ? API.CHAT_URL + historyRes[i].document_path : '',
          images: imagesArr
        }
        // image: ,
        // image: historyRes[i].document_path ? API.CHAT_URL + historyRes[i].document_path : '',
        //if (message !== '' && message.toUpperCase().includes('COUNTER PROPOSAL')) {
        history.location = location;
        //}
        parsedData.unshift(history);

      })

      this.setState((previousState) => {
        previousState.messages = [];
        return {
          messages: GiftedChat.prepend(previousState.messages, parsedData),
          // loadEarlier: false,
          //  isLoadingEarlier: false,
        };
      });
      //this.setState({ messageHistory: parsedData });

    });





    this.socket.on('maintenanceGroupMessageRecieved', (message) => {


      var data = [{
        text: message.msg,
        user: { _id: this.props.nickname },
        createdAt: message.time,
        _id: message.to
      }]
      // this.setState((previousState) => {
      //   return {
      //     messages: GiftedChat.append(previousState.messages, {
      //       _id: Math.round(Math.random() * 1000000),
      //       text: message.msg,
      //       createdAt: new Date(),
      //       user: {
      //         _id: this.props.nickname,
      //         //name: firstName + ' ' + lastName,
      //         //avatar: userPic,
      //       },
      //       image: message.document_path ? API.CHAT_URL + message.document_path : '',
      //     }),
      //   };
      // });
      // this.socket.emit('maintenanceGroupChatHistory', { maintenanceId: this.props.reqDetailData._id});
    })
    this.getRole()
  }


  componentDidUpdate() {
    this.onShareImageForChatSuccess();
    this.onAcceptorDeclineSuccess();
    this.onConfirmDeclineSuccess();
  }
  getRole() {
    AsyncStorage.getItem(Strings.USER_ROLE_NAME).then((value) => {
      if (value) {
        this.setState({ roleName: value });
      }
    }).done();
  }
  componentWillMount() {
    
    AsyncStorage.getItem('counterProposalId').then((value) => {
      //debugger
      if (value) {

        this.setState({ counterProposalId: value });
      }
    }).done();

    AsyncStorage.getItem('SyncittUserInfo').then((value) => {
      //debugger
      if (value) {
        var userData = JSON.parse(value);
        authToken = userData.token;
        UserID = userData.data._id;
        maintenanceID = this.props.reqDetailData._id;
        this.socket.emit('addMaintenanceUsers', {
          id: UserID,
          maintenanceId: this.props.reqDetailData._id,
          firstName: userData.data.firstname,
          lastName: userData.data.lastname

        });
        //this.socket.emit("getAppliedUsers", UserID);
      }
    }).done();


  }

  componentWillReceiveProps(nextProps) {

    // if (nextProps.maintenanceReducer.refreshScene == 'updateMaintenanceList' && nextProps.maintenanceReducer.refreshScene != '' && nextProps.maintenanceReducer.refreshScene != undefined) {

    //}
    if (nextProps.threadReducer.refreshScene != '' && nextProps.threadReducer.refreshScene != undefined) {
      var proposalData = nextProps.threadReducer.refreshScene;
      var proposalDate = Moment(proposalData.proposal_data.proposed_date).format(Strings.DATE_FORMATE);

      // textMsg: 'Counter Proposal\n\n'+'Proposed Price: $'+proposalData.proposal_data.proposed_price+'\nProposed Delivery time: '
      var objMessage = {
        from: UserID,
        to: this.props.reqDetailData._id,
        textMsg: 'Counter proposal',
        time: new Date(),
        maintenanceId: this.props.reqDetailData._id,
        proposal_id: proposalData.proposal_data._id
      }

      this.socket.emit('maintenanceGroupMessageSent', objMessage)

      // this.props.updateScene('');
    }
  }


  onAcceptorDeclineSuccess() {

    if (this.props.threadReducer.acceptDeclineProposalRes != '') {
      if (this.props.threadReducer.acceptDeclineProposalRes.code == 200) {


        this.socket.emit('maintenanceGroupChatHistory', { maintenanceId: this.props.reqDetailData._id });
      }
      else {

        //alert(this.props.threadReducer.acceptDeclineProposalRes.message);
      }
    }
    this.props.resetState();
  }

  onConfirmDeclineSuccess() {

    if (this.props.threadReducer.confirmDeclineRes != '') {
      if (this.props.threadReducer.confirmDeclineRes.code == 200) {


        this.socket.emit('maintenanceGroupChatHistory', { maintenanceId: this.props.reqDetailData._id });
        Actions.WriteReviewScreen({ reviewToId: this.props.reqDetailData.trader_id._id });
      }
      else {

        //alert(this.props.threadReducer.acceptDeclineProposalRes.message);
      }
    }
    this.props.resetState();
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
            messages: GiftedChat.prepend(previousState.messages, messageHistory),
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

        // toId = maintenanceID;
        // toTime = messages[i].createdAt;
        // toMessage = messages[i].filename;

        // imageObject = {

        //   from: UserID,
        //   to: maintenanceID,
        //   textMsg: messages[i].filename,
        //   time: new Date(),
        //   maintenanceId: maintenanceID,

        // }

        // context.shareImageForChat(messages[i].image.replace("file://", ""), imageObject);


        const file = {
          uri: messages[i].image.replace("file://", ""), // e.g. 'file:///path/to/file/image123.jpg'
          name: "user_portfolio.png",// e.g. 'image123.jpg',
          type: 'image/jpeg' // e.g. 'image/jpg'
        };
        let formdata = new FormData()
        formdata.append('from', context.props.emitter)
        formdata.append('to', messages[i].user._id)
        formdata.append('textMsg', messages[i].filename)
        formdata.append('time', new Date())
        formdata.append('file', file)
        documentUpload("uploadDocumentForChat", authToken, formdata, "").then(
          data => {
            console.log(data, "datadatadata123")
            AsyncStorage.getItem('SyncittUserInfo').then((value) => {
              //debugger
              if (value) {
                var userData = JSON.parse(value);
                authToken = userData.token;
                UserID = userData.data._id;
                var postData = {

                  from: UserID,
                  to: maintenanceID,
                  textMsg: 'File uploaded ' + data.data.document_name,
                  time: new Date(),
                  is_file: true,
                  document_name: data.data.document_name,
                  picture_path: data.data.picture_path,
                  document_path: data.data.document_path + data.data.picture_path,
                  size: data.data.size,
                  msg: data.data.msg,
                  propertyId: maintenanceID,
                  maintenanceId: maintenanceID,
                }
                context.socket.emit('maintenanceGroupMessageSentWithFile', postData)
              }
            })
            context.props.updateScene('');
          },
          err => {
            console.log(err, "datadatadatadata")
          }
        );

      })

    } else if (messages[0].location) {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });


      var objMessage = {
        from: UserID,
        to: this.props.reqDetailData._id,
        textMsg: messages[0].location,
        time: messages[0].createdAt,
        maintenanceId: this.props.reqDetailData._id,
        proposal_id: counterProposalId
      }

      this.socket.emit('maintenanceGroupMessageSent', objMessage)

    } else {

      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });

      var objMessage = {

        from: UserID,
        to: this.props.reqDetailData._id,
        textMsg: messages[0].text,
        time: messages[0].createdAt,
        maintenanceId: this.props.reqDetailData._id,
      }

      this.socket.emit('maintenanceGroupMessageSent', objMessage)
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
    //   <Actions

    //     {...props}
    //     options={options}
    //   />
    // );
  }

  renderBubble(props) {
    if (props.currentMessage.location) {
      return (
        <View >
          <Bubble
            {...props}
            // containerStyle={{backgroundColor:'red'}}
            wrapperStyle={{
              left: {
                backgroundColor: Colors.RECEIVER_BG_COLOR,
                paddingBottom: 30

              },
              right: {
                backgroundColor: Colors.SENDER_BG_COLOR,

              },
            }}
          />
          <View></View>
        </View>
      );
    }
    else {
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
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
          backgroundColor: 'green'
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
        socket={global.socket}
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



  onShareImageForChatSuccess() {
    if (this.props.threadReducer.shareImageForChatResponse != '' || this.props.threadReducer.shareImageForChatResponse != undefined) {

      if (this.props.threadReducer.shareImageForChatResponse.code == 200) {
        var postData = {

          from: UserID,
          to: maintenanceID,
          textMsg: 'File uploaded ' + this.props.threadReducer.shareImageForChatResponse.data.document_name,
          time: toTime,
          is_file: true,
          document_name: this.props.threadReducer.shareImageForChatResponse.data.document_name,
          picture_path: this.props.threadReducer.shareImageForChatResponse.data.picture_path,
          document_path: this.props.threadReducer.shareImageForChatResponse.data.document_path + this.props.threadReducer.shareImageForChatResponse.data.picture_path,
          size: this.props.threadReducer.shareImageForChatResponse.data.size,
          msg: this.props.threadReducer.shareImageForChatResponse.data.msg,
          propertyId: maintenanceID,
          maintenanceId: maintenanceID,
        }




        this.socket.emit('maintenanceGroupMessageSentWithFile', postData)
      }
      else {
        // alert(this.props.threadReducer.shareImageForChatResponse.message);
      }
      this.props.resetState();
    }
  }


  closeMessage() {
    //Actions.pop();
  }

  navBar() {
    return (
      <View >
        <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
        <Text style={CommonStyles.navBarTitleTextView}>{Strings.MESSAGES}</Text>
        <TouchableOpacity onPress={() => this.closeMessage()} style={CommonStyles.navRightImageView}>
          <View >
            <Image source={ImagePath.DRAWER_CROSS_ICON} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  callTradersProfileScreen = (id, averageRate, totalReviewLength) => {
    // alert(totalReviewLength)
    Actions.TradersProfileScreen({ user_id: id, averageRating: '0', totalReviewLengthrating: '0' });
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
            _id: UserID, // sent messages should have same user._id
          }}
          createdBy={this.props.reqDetailData.created_by}
          renderActions={this.renderCustomActions}
          renderBubble={this.renderBubble}
          renderSystemMessage={this.renderSystemMessage}
          renderCustomView={this.renderCustomView}
          renderFooter={this.renderFooter}
          renderHeader={this.navBar}
          onPressAvatar={(res)=>this.callTradersProfileScreen(res._id, '3.5', '7')}
        />
      </View>
    );
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
    updateScene
  }

)(ThreadScreen);


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
});
