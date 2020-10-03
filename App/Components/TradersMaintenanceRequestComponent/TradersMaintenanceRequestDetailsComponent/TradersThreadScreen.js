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
import TradersThreadScreenStyle from './TradersThreadScreenStyle';
//import listData from  '../../../../data';
import CommonStyles from '../../../CommonStyle/CommonStyle';
let contextRef;

class TradersThreadScreen extends Component {
    constructor() {
        super();
        this.state = {

        };

    }

    renderItem({ item, index }) {

        return (

            <View>
                <View style={TradersThreadScreenStyle.viewLineStyle} />
                <View style={TradersThreadScreenStyle.tagViewContainer}>
                    <View style={TradersThreadScreenStyle.viewContainerStyle}>
                        <Text style={TradersThreadScreenStyle.viewtextStyle}>{Strings.BOOKED}</Text>
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
                        data={listData}
                        renderItem={this.renderItem}
                        extraData={this.state}
                    />
                </View>

                <View style={TradersThreadScreenStyle.inputContainerStyle}>
                    <View style={TradersThreadScreenStyle.searchViewStyle}>
                        <TextInput
                            placeholder={Strings.TYPE_MESSAGE}
                            underlineColorAndroid={Colors.TRANSPARENT}
                            style={TradersThreadScreenStyle.searchTextInputStyle} />
                        <Image source={ImagePath.SEARCH_ICON} style={TradersThreadScreenStyle.searchImageStyle} />
                        <Image source={ImagePath.SEARCH_ICON} style={TradersThreadScreenStyle.searchImageStyle} />
                    </View>
                    <Image source={ImagePath.SEARCH_ICON} style={TradersThreadScreenStyle.sendImageStyle} />
                </View>
            </View>
        );
    }
}

export default TradersThreadScreen;
