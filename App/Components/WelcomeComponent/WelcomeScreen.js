import React, { Component } from 'react';
import {
    Image,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import SocketIOClient from 'socket.io-client';


class WelcomeScreen extends Component {

    constructor() {
        super();
        this.socket = SocketIOClient('http://192.168.1.88:5094', { transports: ['websocket'] });
        console.warn(this.socket.connected)
        this.state = {
        };
    }


    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

    }


    componentDidMount() {

    }

    componentWillUnmount() {

    }

    navigateRegistrationScreen(type) {
        Actions.RegistrationScreen({ registrationType: type, socket: this.socket });
    }




    render() {

        return (
            <View style={CommonStyles.mainContainer}>
                <Image source={ImagePath.INTRO_BG} style={CommonStyles.mainContainer} />

                <View style={CommonStyles.container}>
                    <View style={CommonStyles.logoViewStyle}>
                        <Image resizeMode={'contain'} style={{ height: 100, width: 200 }} source={ImagePath.LOGO} />
                    </View>
                    <Text style={CommonStyles.welcomeTitleStyle}>{Strings.WELCOME_TITLE}</Text>
                    <Text style={CommonStyles.welcomeMessageStyle}>{Strings.WELCOME_MESSAGE}</Text>
                    <TouchableOpacity onPress={() => this.navigateRegistrationScreen('login')}>
                        <View style={CommonStyles.roundedTransparentButtonStyle}>
                            <Text style={CommonStyles.buttonTextStyle}>{Strings.SIGNIN}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.navigateRegistrationScreen('registration')}>
                        <View style={CommonStyles.roundedBlueButtonStyle}>
                            <Text style={CommonStyles.buttonTextStyle}>{Strings.CREATE_ACCOUNT}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={CommonStyles.allRightReservedViewStyle}>
                        <Text style={CommonStyles.allRightReservedTextStyle}>{Strings.ALL_RIGHT_RESERVED}</Text>
                    </View>
                </View>

            </View>
        );
    }

}


export default WelcomeScreen;
