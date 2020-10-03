import React, { Component } from 'react';
import { View, Modal, Dimensions, Image, ImageBackground, AsyncStorage, TouchableOpacity, ScrollView, StyleSheet, Text } from 'react-native'
import MapView from "react-native-maps";
import COLORS from '../../Constants/Colors';
import IMAGEPATH from '../../Constants/ImagesPath';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { connect } from 'react-redux';
const { width, height } = Dimensions.get("window");
import { Actions } from "react-native-router-flux";
import Drawer from 'react-native-drawer'
import SocketIOClient from 'socket.io-client';
import API from '../../Constants/APIUrls';
import { userLogout } from "../../Action/ActionCreators";
import {
    logout,
    showLoading,
    resetState,
} from "../LogoutComponent/LogoutAction";
import CommonStyle from '../../CommonStyle/CommonStyle';
class MenuModal extends Component {
    constructor(props) {
        super(props);
        this.socket = SocketIOClient('http://192.168.1.88:5094', { transports: ['websocket'] });
        this.state = {
            filterProperty: 'BUY',
            userInfo: {}
        }
        this.checkForLogin()
    }
    componentDidUpdate() {
        this.onLogoutSuccess();
        this.checkForLogin()
    }
    onLogout() {

        AsyncStorage.getItem("SyncittUserInfo").then((value) => {
            if (value) {
                var postdata = {};
                var userData = JSON.parse(value);
                var authToken = userData.token;
                postdata = {
                    user_id: userData.data._id,
                };
                this.props.userLogout(postdata);
            }
        }).done();


    }
    onLogoutSuccess() {

        if (this.props.logoutReducer.logoutResponse != '') {
            if (this.props.logoutReducer.logoutResponse.code == 200) {
                // Actions.WelcomeScreen({ type: "reset" });
                Actions.SyncittSearch({ type: "reset" });
                AsyncStorage.removeItem('SyncittUserInfo');

                // AsyncStorage.setItem('SyncittUserInfo','');
                AsyncStorage.clear();
            }
            else {
                //alert(this.props.logoutReducer.logoutResponse.message);
            }
            this.props.resetState();
        }
    }

    checkForLogin() {
        AsyncStorage.getItem("SyncittUserInfo")
            .then(value => {
                if (value) {
                    let data = JSON.parse(value)
                    if (JSON.stringify(data.data) != JSON.stringify(this.state.userInfo)) {
                        console.log(data.data)
                        this.setState({ userInfo: data.data })
                    }
                }
                else {
                    this.setState({ userInfo: null })
                }
            })
            .done();
    }
    render() {
        var firstName = this.state.userInfo && this.state.userInfo.firstname ? this.state.userInfo.firstname : '';
        var lastName = this.state.userInfo && this.state.userInfo.lastname ? this.state.userInfo.lastname : '';
        return (
            <Modal swipeDirection={'right'} transparent visible={this.props.visible} onCloseRequest={() => this.props.onCloseRequest()} style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: COLORS.TRANSLUCENT_BLUE }}>
                    <TouchableOpacity onPress={() => this.props.onCloseRequest()} style={{ height: height, width: 80 }}></TouchableOpacity>
                    <ScrollView style={{ flex: 1, backgroundColor: 'white' }} showsVerticalScrollIndicator={false} >
                        <View style={{ height: 30, width: width }}></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
                            <Text style={{ fontSize: 20, fontWeight: '600' }}></Text>
                            {/* <Text style={{ fontSize: 20, fontWeight: '600' }}>Filter</Text> */}
                            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.props.onCloseRequest()}>
                                <Image source={IMAGEPATH.DRAWER_CROSS_ICON} style={{ height: 17, width: 17, tintColor: 'black' }} />
                            </TouchableOpacity>

                        </View>
                        {/* <View style={{ flexDirection: 'row', marginBottom: 60, marginTop: 20, justifyContent: 'space-evenly' }}>
                    <TouchableOpacity onPress={() => { this.setState({ filterProperty: 'BUY' }) }} style={[style.tabButtonStyle, this.state.filterProperty == 'BUY' ? {} : { backgroundColor: 'white' }]}>
                        <Text style={[style.tabButtonTextStyle, this.state.filterProperty == 'BUY' ? {} : { color: 'gray' }]}>BUY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ filterProperty: 'RENT' }) }} style={[style.tabButtonStyle, this.state.filterProperty == 'RENT' ? {} : { backgroundColor: 'white' }]}>
                        <Text style={[style.tabButtonTextStyle, this.state.filterProperty == 'RENT' ? {} : { color: 'gray' }]}>RENT</Text>
                    </TouchableOpacity>
                </View> */}

                        <View style={{ padding: 20 }}>
                            {this.state.userInfo ?
                                <View>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        {this.state.userInfo.image ?
                                            <Image source={{ uri: API.USER_IMAGE_PATH + this.state.userInfo.image }} style={{ height: 110, width: 110, borderRadius: 75 }} />
                                            :
                                            <View style={CommonStyle.emptyUserImageStyle}>
                                                <Text style={CommonStyle.initialTextStyle}>{firstName.charAt(0).toUpperCase() + ' ' + lastName.charAt(0).toUpperCase()}</Text>
                                            </View>
                                        }
                                    </View>
                                    <View style={{ height: 45, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 20, color: 'gray', fontWeight: '600' }}>{this.state.userInfo && this.state.userInfo.name}</Text>
                                    </View>
                                    {/* <TouchableOpacity style={style.tabButonsStyle}>
                                        <Text style={[style.tabButtonTextStyle, { color: 'gray', fontSize: 13 }]}>Features</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={style.tabButonsStyle}>
                                        <Text style={[style.tabButtonTextStyle, { color: 'gray', fontSize: 13 }]}>About</Text>
                                    </TouchableOpacity> */}
                                    <TouchableOpacity onPress={() => { this.onLogout() }} style={style.tabButonsStyle}>
                                        <Text style={[style.tabButtonTextStyle, { color: 'gray', fontSize: 13 }]}>Log Out</Text>
                                    </TouchableOpacity>
                                </View>
                                : <View>
                                    <TouchableOpacity onPress={() => Actions.RegistrationScreen({ registrationType: 'login', type: 'reset', socket: this.socket })} style={style.tabButonsStyle}>
                                        <Text style={[style.tabButtonTextStyle, { color: 'gray', fontSize: 13 }]}>Login</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => Actions.RegistrationScreen({ registrationType: 'registration', type: 'reset', socket: this.socket })} style={style.tabButonsStyle}>
                                        <Text style={[style.tabButtonTextStyle, { color: 'gray', fontSize: 13 }]}>Sign Up</Text>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity style={style.tabButonsStyle}>
                                        <Text style={[style.tabButtonTextStyle, { color: 'gray', fontSize: 13 }]}>Features</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={style.tabButonsStyle}>
                                        <Text style={[style.tabButtonTextStyle, { color: 'gray', fontSize: 13 }]}>About</Text>
                                    </TouchableOpacity> */}
                                </View>

                            }
                            {/* <TouchableOpacity style={style.tabButonsStyle}>
                        <Text style={[style.tabButtonTextStyle, { color: 'gray', fontSize: 13 }]}>Price</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.tabButonsStyle}>
                        <Text style={[style.tabButtonTextStyle, { color: 'gray', fontSize: 13 }]}>Property Types</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.tabButonsStyle}>
                        <Text style={[style.tabButtonTextStyle, { color: 'gray', fontSize: 13 }]}>Bedrooms</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.tabButonsStyle}>
                        <Text style={[style.tabButtonTextStyle, { color: 'gray', fontSize: 13 }]}>Bathroom</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.tabButonsStyle}>
                        <Text style={[style.tabButtonTextStyle, { color: 'gray', fontSize: 13 }]}>Parkings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.tabButonsStyle}>
                        <Text style={[style.tabButtonTextStyle, { color: 'gray', fontSize: 13 }]}>More Options</Text>
                    </TouchableOpacity> */}
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        )
    }
}
const style = StyleSheet.create({
    tabButtonStyle: {
        height: 25, borderRadius: 15, justifyContent: 'center', alignItems: 'center', width: 100, backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND
    },
    tabButtonTextStyle: {
        color: 'white', fontSize: 12, fontWeight: '600'
    },
    tabButonsStyle: {
        height: 40, width: '100%', borderRadius: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'lightgray', marginBottom: 15
    }
})

function mapStateToProps(state) {

    return {
        accountSecurityReducer: state.accountSecurityReducer,
        logoutReducer: state.logoutReducer
    }
}

export default connect(
    mapStateToProps,
    {
        resetState,
        userLogout
    }

)(MenuModal);
