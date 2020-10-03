import React, { Component } from 'react';
import { View, Dimensions, Image, ImageBackground, TouchableOpacity, ScrollView, StyleSheet, Text } from 'react-native'
import MapView from "react-native-maps";
import COLORS from '../../Constants/Colors';
import IMAGEPATH from '../../Constants/ImagesPath';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const { width, height } = Dimensions.get("window");
import { Actions } from "react-native-router-flux";
import MenuModal from './MenuModal';
class SyncittHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPropertyScreen: props.isPropertyScreen ? props.isPropertyScreen : false
        }
    }
    renderHeader() {
        return (
            <View style={{ height: 100, backgroundColor: 'white', flexDirection: 'row', width: '100%', borderBottomColor: 'lightgray', borderBottomWidth: 0.5 }}>
                <View style={{ flex: 0.8, justifyContent: 'flex-end', paddingBottom: 10 }}>
                    <TouchableOpacity>
                        <Image source={IMAGEPATH.SYNCITTLOGO} resizeMode={'contain'} style={{ tintColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, height: 38, width: 170 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.1, justifyContent: 'flex-end', paddingBottom: 15, alignItems: 'center' }}>
                    <TouchableOpacity>
                        <Image source={IMAGEPATH.FILTERICON} resizeMode={'contain'} style={{ tintColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, height: 22, width: 30 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.2, justifyContent: 'flex-end', paddingBottom: 15, alignItems: 'center' }}>
                    <TouchableOpacity>
                        <Image source={IMAGEPATH.MENUHOME} resizeMode={'contain'} style={{ tintColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, height: 23, width: 30 }} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
    renderTrader() {
        return (
            <View style={{ height: 330, backgroundColor: 'white', borderRadius: 6, justifyContent: 'center', elevation: 5, shadowOffset: { width: 0, height: 0 }, shadowColor: 'gray', shadowOpacity: 0.3, shadowRadius: 5, borderRadius: 5, marginBottom: 15 }}>
                <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
                    <ImageBackground imageStyle={{ borderRadius: 60 }} source={{ uri: 'http://portal.syncitt.world:5095/user_image/1538481800699.jpg' }} style={{ height: 120, width: 120, backgroundColor: 'red', borderRadius: 60 }}>
                        <View style={{ backgroundColor: COLORS.STATUS_GREEN_COLOR, width: 30, borderRadius: 20, bottom: 5, right: 5, position: 'absolute', height: 30 }}></View>
                    </ImageBackground>
                </View>
                <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: COLORS.SKY_BLUE_BUTTON_BACKGROUND, fontSize: 12 }}>AGENCY NAME</Text>
                    <Text style={{ fontSize: 18, color: 'gray', fontWeight: '600' }}>Matthew Oliver</Text>
                    <View style={{ padding: 10, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: 38, width: '70%', borderRadius: 30, justifyContent: 'center', alignItems: 'center', margin: 5, borderColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderWidth: 1 }}>
                            <Text style={{ color: 'gray', fontWeight: '600', fontSize: 13 }}>CALL</Text>
                        </View>
                        <View style={{ height: 38, width: '70%', justifyContent: 'center', alignItems: 'center', borderRadius: 30, margin: 5, backgroundColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND }}>
                            <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>EMAIL AGENT</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    renderPropertyCard() {
        return (
            <View style={{ height: 300, backgroundColor: 'white', borderRadius: 6, elevation: 12, shadowOffset: { width: 0, height: 0 }, shadowColor: 'gray', shadowOpacity: 0.3, shadowRadius: 5, borderRadius: 5, marginBottom: 15 }}>
                <ImageBackground imageStyle={{ borderTopRightRadius: 5, borderTopLeftRadius: 5 }} style={{ height: 180, width: '100%', }} source={{ uri: "http://portal.syncitt.world:5095/property_image/1558408615262.jpg" }} >
                    <TouchableOpacity>
                        <Image style={{ margin: 10 }} source={(true) ? IMAGEPATH.HEART : IMAGEPATH.BLUE_HEART} />
                    </TouchableOpacity>
                </ImageBackground>
                <View style={{ justifyContent: 'center', padding: 20 }}>
                    <Text style={{ lineHeight: 26 }}>LOREM IPSUM</Text>
                    <Text style={{ color: 'gray', fontSize: 15 }}>Unit 5, Qasis building, 3rd street, Brisbane</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 0.2 }}>
                        <Image source={IMAGEPATH.BEDROOM_ICON} style={{ height: 18, width: 18, tintColor: 'lightgray', marginRight: 10 }} /><Text style={{ color: 'lightgray' }}>4</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 0.2 }}>
                        <Image source={IMAGEPATH.BATHROOM_ICON} style={{ height: 18, width: 18, tintColor: 'lightgray', marginRight: 10 }} /><Text style={{ color: 'lightgray' }}>4</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 0.2 }}>
                        <Image source={IMAGEPATH.GARAGE_ICON} style={{ height: 18, width: 18, tintColor: 'lightgray', marginRight: 10 }} /><Text style={{ color: 'lightgray' }}>4</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 0.4 }}>
                        <Image source={IMAGEPATH.HOMEICON} style={{ height: 20, width: 20, tintColor: 'lightgray', marginRight: 10 }} /><Text style={{ color: 'lightgray' }}>Townhouse</Text>
                    </View>
                </View>

            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
                {this.renderHeader()}

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {/* ====== search bar section ======= */}

                    <View style={{ height: 55, alignItems: 'center', width: '100%', flexDirection: 'row' }}>
                        <View style={{ flex: 0.15, justifyContent: 'flex-end', alignItems: 'flex-end', paddingRight: 15 }}>
                            <TouchableOpacity>
                                <Image source={IMAGEPATH.SEARCH_ICON} resizeMode={'contain'} style={{ tintColor: 'lightgray', height: 18, width: 18 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 0.85 }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: 'lightgray' }}>Melbourne</Text>
                        </View>
                    </View>
                    {!this.state.isPropertyScreen ?
                        <View>
                            {/* ====== render property images ======= */}
                            <Image style={{ height: 200, width: '100%' }} source={{ uri: "http://portal.syncitt.world:5095/property_image/1558408615262.jpg" }} />


                            {/* ====== property detail section ======= */}
                            <View style={{ height: 80, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, fontWeight: '600' }}>$650,000 - $690,000</Text>
                                <Text style={{ fontSize: 15, color: 'gray', fontWeight: '400', marginTop: 5 }}>4/56 Banksia Street, Heidelberg VIC 3084</Text>
                            </View>

                            {/* ======= services section ======== */}
                            <View style={{ height: 100, justifyContent: 'center', flexDirection: 'row', width: '100%' }}>
                                <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'center', margin: 5 }}>
                                    <View style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center', margin: 10 }} >
                                        <Image source={IMAGEPATH.BEDROOM_ICON} resizeMode={'contain'} style={{ tintColor: 'lightgray', height: 25, width: 25 }} />
                                    </View>
                                    <Text>4 BEDS</Text>
                                </View>
                                <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'center', margin: 5 }}>
                                    <View style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center', margin: 10 }} >
                                        <Image source={IMAGEPATH.BATHROOM_ICON} resizeMode={'contain'} style={{ tintColor: 'lightgray', height: 25, width: 25 }} />
                                    </View>
                                    <Text>3 BATHS</Text>
                                </View>
                                <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'center', margin: 5 }}>
                                    <View style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center', margin: 10 }} >
                                        <Image source={IMAGEPATH.GARAGE_ICON} resizeMode={'contain'} style={{ tintColor: 'lightgray', height: 25, width: 30 }} />
                                    </View>
                                    <Text>1 PARKING</Text>
                                </View>
                            </View>

                            {/* ======= services section ======== */}

                            <View style={{ width: '100%', padding: 25 }}>
                                <Text style={{ fontSize: 18, marginVertical: 0, fontWeight: '600' }}>Property Description</Text>
                                <Text style={{ fontSize: 14, marginVertical: 10, fontWeight: '600' }}>Rear Property & Serenity, Seconds To Burgundy</Text>
                                <Text style={{ fontSize: 14, lineHeight: 22, marginVertical: 10, fontWeight: '300' }}>SOLD by miles Real Estate, A deceptive address belies the blissful peace and privacy enjoyed by this attractive townhouse tucked away at the near of a boutique block. Entered view paved rear lane off Hawdon Street Providing effortless in/out access, be on Burgundy Street in a matter of seconds and be right at home in the easy-living spaces of this schedule.</Text>
                                <TouchableOpacity style={{ height: 30, width: 150, backgroundColor: 'white', borderWidth: 1, borderColor: COLORS.SKY_BLUE_BUTTON_BACKGROUND, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12 }}>READ MORE</Text>
                                </TouchableOpacity>
                            </View>

                            {/* ======= services section ======== */}
                            <View style={{ width: width, justifyContent: 'center', alignItems: 'center', height: width, padding: 25 }}>
                                {/* {latitudeVal != 0 && longitudeVal != 0 ? ( */}
                                <MapView
                                    style={{
                                        position: "absolute",
                                        top: 20,
                                        borderRadius: 5,
                                        bottom: 20,
                                        left: 20,
                                        right: 20,
                                        height: width - 50
                                    }}
                                // initialRegion={{
                                //     latitude: latitudeVal,
                                //     longitude: longitudeVal,
                                //     latitudeDelta: 0.4,
                                //     longitudeDelta: 0.4
                                // }}
                                >
                                    {/* {markers.map(marker => (
                                        <MapView.Marker
                                            coordinate={marker.LatLng}
                                            title={marker.title}
                                            description={marker.description}
                                        />
                                    ))} */}
                                </MapView>
                            </View>
                            <View style={{ padding: 20, flex: 1, paddingTop: 0 }}>
                                <Text style={{ fontSize: 18, paddingBottom: 20, fontWeight: '600' }}>Similar Properties</Text>
                                {this.renderPropertyCard()}
                                {this.renderPropertyCard()}
                                {this.renderPropertyCard()}
                                {this.renderPropertyCard()}
                                {this.renderPropertyCard()}
                                {this.renderPropertyCard()}
                                {this.renderPropertyCard()}
                                {this.renderPropertyCard()}
                            </View>
                            <View style={{ padding: 20, flex: 1, paddingTop: 0 }}>
                                {this.renderTrader()}
                                {this.renderTrader()}
                                {this.renderTrader()}
                            </View>
                        </View>
                        :
                        <View style={{ padding: 20, flex: 1, paddingTop: 0 }}>
                            {this.renderPropertyCard()}
                            {this.renderPropertyCard()}
                            {this.renderPropertyCard()}
                            {this.renderPropertyCard()}
                            {this.renderPropertyCard()}
                            {this.renderPropertyCard()}
                            {this.renderPropertyCard()}
                            {this.renderPropertyCard()}
                        </View>
                    }
                </ScrollView>
                <MenuModal visible={true} onCloseRequest={() => console.log("onCloseRequest")} />
            </View>
        )
    }
}
export default SyncittHome
const style = StyleSheet.create({

})