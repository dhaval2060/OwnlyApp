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
import TradersOverviewScreenStyle from './TradersOverviewScreenStyle';
// import listData from '../../../../data';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import API from '../../../Constants/APIUrls';
let contextRef;
let listData=[]
class TradersOverviewScreen extends Component {
    constructor() {
        super();
        this.state = {
            uploadImagesData: {},
            selectedImage: 0,
            
        };
        contextRef = this;
    }
    uploadImageListSelection(index) {
        this.setState({ selectedImage: listData[index].url });
        var tempData = listData;
        var tempArray = listData;
        tempArray.map((data, position) => {

            if (index == position) {

                if (tempArray[index].isSelected == 0) {
                    tempArray[index].isSelected = 1;
                }

            }
            else {
                tempArray[position].isSelected = 0;
            }
        })
        tempData.imageArray = tempArray;
        this.setState({ uploadImagesData: tempData });

    }

    _renderTags(tags, index) {
        return (
            <View style={{ height: 36, backgroundColor: 'rgba(70,164,242,0.22)', margin: 5, borderRadius: 50, justifyContent: 'center' }}>
                <Text style={{ marginLeft: 5, marginRight: 5, textAlign: 'center', paddingLeft: 15, paddingRight: 15, color: Colors.TAG_VIEW_TEXT_COLOR, fontSize: 14, fontWeight: '500', }}>
                    {tags.name}
                </Text>
            </View>
        );
    }


    renderItem({ item, index }) {

        return (

            <Image source={{ uri: API.USER_IMAGE_PATH+item.url }} style={TradersOverviewScreenStyle.overviewPropertyListImageStyle} />

        );
    }

    render() {

       
        var servieName=this.props.overViewData.categories_id?this.props.overViewData.categories_id:[];
        var portFolioImages=this.props.overViewData.images?this.props.overViewData.images:[];
        return (
            <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>

                <Text style={TradersOverviewScreenStyle.titleTextStyle}>{Strings.OVERVIEW}</Text>
                <Text style={TradersOverviewScreenStyle.detailsTextStyle}>
                  {this.props.overViewData.groups.about_user}
                </Text>
                <Text style={TradersOverviewScreenStyle.titleTextStyle}>{Strings.SERVICES_SKILLS}</Text>

                {servieName.length>0 ?

                    <View style={{ marginLeft: 15, marginRight: 20, marginTop: 20, marginBottom: 20, alignSelf: 'stretch', width: window.width, justifyContent: 'space-between', borderTopLeftRadius: 5, borderTopRightRadius: 5,  }}>
                        <ScrollView ref="scrollView" contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {
                                servieName.map((data, index) => {
                                    return this._renderTags(data, index);
                                })
                            }
                        </ScrollView>
                    </View>

                    : <View style={{ flex: 1,marginTop: 20, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.NO_SERVICE_FOUND}</Text>
                </View>
                }

                <Text style={TradersOverviewScreenStyle.titleTextStyle}>{Strings.PORTFOLIO}</Text>

                <View style={{ marginTop: 5, alignContent: 'stretch', alignItems: 'center', justifyContent: 'space-between' }}>
                    {
                        portFolioImages.length>0 ?
                            <FlatList numColumns={2} contentContainerStyle={{
                                paddingVertical: 20, paddingHorizontal: 20
                            }}

                                data={portFolioImages}
                                renderItem={this.renderItem}
                                extraData={this.state}
                            /> : <View style={{ flex: 1,marginTop: 20, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 14, textAlign: 'center', color: Colors.LIGHT_GRAY_TEXT_COLOR, }}>{Strings.NO_PORTFOLIO_FOUND}</Text>
                            </View>
                    }

                </View>

                <Text style={TradersOverviewScreenStyle.titleTextStyle}>{Strings.AVAILABILITY}</Text>
            </ScrollView>

        );
    }
}

export default TradersOverviewScreen;
