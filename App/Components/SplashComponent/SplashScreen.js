import React, { Component } from 'react';

import {
    Image,
    AsyncStorage
} from 'react-native';

import * as Progress from 'react-native-progress';
import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../CommonStyle/CommonStyle';
import Colors from '../../Constants/Colors';
import Strings from '../../Constants/Strings';
import ImagePath from '../../Constants/ImagesPath';
import APICaller, { GETAPICaller } from '../../Saga/APICaller';

class SplashScreen extends Component {

    constructor() {
        super();
        this.state = {
            accessToken: '',
        };
    }

    componentWillMount() {

        setTimeout(() => {
            AsyncStorage.getItem("SyncittUserInfo").then((data) => {
                if (data) {
                    var userData = JSON.parse(data);
                    global.userInfo = userData
                    global.token = userData.token
                    global.userId = userData.data._id

                    if (userData.token) {
                        AsyncStorage.getItem("KeepSignedIn").then((value) => {

                            if (value) {
                                var keepLoginData = JSON.parse(value);
                                if (keepLoginData) {
                                    Actions.Dashboard({ type: "reset" });
                                } else {
                                    Actions.WelcomeScreen({ type: "reset" });
                                }
                            } else {
                                Actions.WelcomeScreen({ type: "reset" });
                            }
                        }).done();
                    } else {
                        Actions.WelcomeScreen({ type: "reset" });
                    }
                } else {
                    Actions.WelcomeScreen({ type: "reset" });
                }
            }).done();
        }, 2000);

        AsyncStorage.getItem("SyncittUserInfo").then(value => {
            if (value) {
                var userData = JSON.parse(value);
                var authToken = userData.token;
                GETAPICaller(
                    "subscription_plan_list",
                    "GET",
                    authToken,
                    ""
                ).then(data => {
                    console.log(data, "subscription_plan_list")
                },
                    err => {

                    }
                );
            }
        })
    }

    render() {
        return (
            <Image source={ImagePath.SPLASH_BG} style={CommonStyles.mainContainer}>
            </Image>
        );
    }

}

export default SplashScreen;
