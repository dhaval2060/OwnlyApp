import React, { Component } from "react";
import { connect } from "react-redux";

import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  View,
  Platform,
  Text,
  TouchableOpacity,
  Image
} from "react-native";

import { WebView } from 'react-native-webview';
import { Actions } from "react-native-router-flux";
import styles from "./LAWebViewStyle";
import Colors from "../../Constants/Colors";
import Strings from "../../Constants/Strings";
import CommonStyles from "../../CommonStyle/CommonStyle";
import { BASE_URL } from "../../Constants/APIUrls";
import * as Progress from "react-native-progress";
import APIUrls from "../../Constants/APIUrls";
import ImagePath from '../../Constants/ImagesPath';
export default class LAWebView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      webviewLoaded: false
      ,
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() { }

  _onLoadEnd() {
    this.setState({ webviewLoaded: true });
  }

  CallBack() {
    Actions.pop();
  }



  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && (this.props.docURL.endsWith('.heic') || this.props.docURL.endsWith('.HEIC')) ?

          <Image
            onLoadEnd={() => this.setState({ webviewLoaded: true })}
            style={{ height: '70%', left: 0, right: 0, top: 0, position: 'absolute' }} source={{ uri: this.props.docURL }} />
          :
          <WebView
            source={{ uri: this.props.docURL }}
            scalesPageToFit={true}
            onLoadEnd={this._onLoadEnd.bind(this)}
          />
        }

        {this.state.webviewLoaded ? null : (
          <View style={styles.circles}>
            <Progress.CircleSnail color={["#000000", "#000000", "#000000"]} />
          </View>
        )}
      </View>
    );
  }
}
