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
import GeneralCommunicationScreenStyle from './GeneralCommunicationScreenStyle';

import CommonStyles from '../../../CommonStyle/CommonStyle';
import { CardViewWithLowMargin } from '../../CommonComponent/CardViewWithLowMargin';
let contextRef;

class GeneralCommunicationScreen extends Component {
    constructor() {
        super();
        this.state = {

        };
    }

    renderItem({ item, index }) {

        return (
            <CardViewWithLowMargin>

                <View style={GeneralCommunicationScreenStyle.listContainerStyle}>

                    <View style={GeneralCommunicationScreenStyle.imageContainerStyle}>
                        <Image source={{ uri: item.url }} style={GeneralCommunicationScreenStyle.watcherImageStyle} />
                    </View>

                    <View style={GeneralCommunicationScreenStyle.detailTitleContainerStyle}>
                        <Text style={GeneralCommunicationScreenStyle.watcherTitleTextStyle}>{item.name}</Text>
                        <View>
                            <Image source={ImagePath.HEADER_BG} style={GeneralCommunicationScreenStyle.mesageImageBGStyle} />
                        </View>
                        <Text style={GeneralCommunicationScreenStyle.watcherTitleTextStyle}>{item.name}</Text>
                    </View>


                </View>

            </CardViewWithLowMargin>
        );
    }


    render() {

        return (
            <View style={{ flex: 1 }}>
                <View>
                    <FlatList
                        horizontal={false}
                        data={listData}
                        renderItem={this.renderItem}
                        extraData={this.state}
                    />
                </View>

                <View style={GeneralCommunicationScreenStyle.inputContainerStyle}>
                    <View style={GeneralCommunicationScreenStyle.searchViewStyle}>
                        <TextInput
                            placeholder={Strings.TYPE_MESSAGE}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            style={GeneralCommunicationScreenStyle.searchTextInputStyle} />
                        <Image source={ImagePath.SEARCH_ICON} style={GeneralCommunicationScreenStyle.searchImageStyle} />
                        <Image source={ImagePath.SEARCH_ICON} style={GeneralCommunicationScreenStyle.searchImageStyle} />
                    </View>
                    <Image source={ImagePath.SEARCH_ICON} style={GeneralCommunicationScreenStyle.sendImageStyle} />
                </View>
            </View>
        );
    }
}

export default GeneralCommunicationScreen;
