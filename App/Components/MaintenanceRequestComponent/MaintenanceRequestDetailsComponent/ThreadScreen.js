import React, { Component } from 'react';
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
    FlatList,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import ThreadScreenStyle from './ThreadScreenStyle';

import CommonStyles from '../../../CommonStyle/CommonStyle';
let contextRef;

class ThreadScreen extends Component {
    constructor() {
        super();
        this.state = {
            threadList: [],
        };

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }


    renderItem({ item, index }) {

        return (

            <View>
                <View style={ThreadScreenStyle.viewLineStyle} />
                <View style={ThreadScreenStyle.tagViewContainer}>
                    <View style={ThreadScreenStyle.viewContainerStyle}>
                        <Text style={ThreadScreenStyle.viewtextStyle}>{Strings.BOOKED}</Text>
                    </View>
                </View>
            </View>
        );
    }


    render() {

        return (
            <View style={{ flex: 1 }}>
                <View>
                    <FlatList
                        horizontal={false}
                        data={this.state.threadList}
                        renderItem={this.renderItem}
                        extraData={this.state}
                    />
                </View>

                <View style={ThreadScreenStyle.inputContainerStyle}>
                    <View style={ThreadScreenStyle.searchViewStyle}>
                        <TextInput
                            placeholder={Strings.TYPE_MESSAGE}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            style={ThreadScreenStyle.searchTextInputStyle} />
                        <Image source={ImagePath.SEARCH_ICON} style={ThreadScreenStyle.searchImageStyle} />
                        <Image source={ImagePath.SEARCH_ICON} style={ThreadScreenStyle.searchImageStyle} />
                    </View>
                    <Image source={ImagePath.SEARCH_ICON} style={ThreadScreenStyle.sendImageStyle} />
                </View>
            </View>
        );
    }
}

export default ThreadScreen;
