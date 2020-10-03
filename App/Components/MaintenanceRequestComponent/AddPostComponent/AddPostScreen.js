import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    AsyncStorage,
    FlatList
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import AddPostScreenStyle from './AddPostScreenStyle';
import CheckBox from 'react-native-checkbox';
import { Dropdown } from 'react-native-material-dropdown';
import * as Progress from 'react-native-progress';

let propertyType = [{
    value: 'Andy Harrison',
},
{
    value: 'Jack Williams',
}];
let contextRef;
var amenitiesSelectedArrray = [];

class AddPostScreen extends Component {
    constructor() {
        super();
        this.state = {
            amenitiesListData: {}
        };
        contextRef = this;
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
        amenitiesSelectedArrray = [];
    }
    componentWillMount() {

    }

    closeAddProperty() {
        Actions.pop();
    }

    callBack() {
        Actions.pop();
    }

   navBar() {
        return (
            <View>
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.NEW_POST}</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView} >
                    <View>
                        <Image source={ImagePath.DRAWER_CROSS_ICON} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    prePareAmenitiesData(amenitiesData) {

        var tempArray = amenitiesData;
        tempArray.map((data, index) => {

            tempArray[index].isChecked = false;
        })
        
        return tempArray;

    }

    updateCheckBoxSelection(selectedIndex, amenitiesData) {

        var tempArray = amenitiesData;
        tempArray.map((data, index) => {


            if (tempArray[selectedIndex].isChecked) {

                tempArray[selectedIndex].isChecked = false;
            }
            else {

                tempArray[selectedIndex].isChecked = true;
            }


        })

        return tempArray;

    }

    renderItem({ item, index }) {

        return (
            <View style={AddPostScreenStyle.amenitiesListItemContainerStyle}>
                <CheckBox

                    label={item.name}
                    labelStyle={AddPostScreenStyle.amenitisListCheckboxLabelStyle}
                    checked={item.isChecked}
                    checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                    unCheckedImage={ImagePath.CHECK_BOX_OFF}

                />
            </View>
        );
    }

    onCheckBoxChangeListener(index) {
        
        var tempData = this.updateCheckBoxSelection(index, this.state.amenitiesListData);
        this.setState({ amenitiesListData: tempData });
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                {this.navBar()}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={AddPostScreenStyle.scrollViewContainerStyle}>

                    <View style={AddPostScreenStyle.headerContainer}>
                        <Text style={AddPostScreenStyle.labelStyle}>
                            {Strings.POST_TITLE}
                        </Text>
                        <TextInput style={AddPostScreenStyle.inputTextStyle}
                            multiline={false} />
                        <View style={AddPostScreenStyle.viewContainer}>
                            <Text style={AddPostScreenStyle.labelStyle}>{Strings.ADD_MEMBERS}</Text>
                            <View style={AddPostScreenStyle.amenitiesListViewStyle}>
                                <FlatList
                                    numColumns={2}
                                    data={listData}
                                    extraData={this.state}
                                    renderItem={this.renderItem}
                                />
                            </View>
                        </View>

                        <View style={AddPostScreenStyle.viewContainer}>
                            <Text style={AddPostScreenStyle.labelStyle}>
                                {Strings.PICK_CUSTOM_MEMBERS}
                            </Text>
                            <Dropdown
                                label=''
                                labelHeight={5}
                                fontSize={14}
                                baseColor={Colors.WHITE}
                                containerStyle={AddPostScreenStyle.dropDownViewStyle}
                                data={propertyType}
                                value={propertyType[0].value}
                            />
                        </View>

                        <View style={AddPostScreenStyle.viewContainer}>
                            <View style={AddPostScreenStyle.addPropertyInputContainer}>

                                <Text style={AddPostScreenStyle.labelStyle}>
                                    {Strings.AGENDA_AND_RESOLUTIONS}
                                </Text>
                                <TextInput style={AddPostScreenStyle.inputDescriptionTextStyle}
                                    multiline={true} />
                            </View>
                        </View>

                        <View style={AddPostScreenStyle.viewContainer}>
                            <View style={AddPostScreenStyle.addPropertyInputContainer}>

                                <Text style={AddPostScreenStyle.labelStyle}>
                                    {Strings.POST_DETAILS_OR_DESCRIPTIONS}
                                </Text>
                                <TextInput style={AddPostScreenStyle.inputDescriptionTextStyle}
                                    multiline={true} />
                            </View>
                        </View>

                        <View style={AddPostScreenStyle.viewContainer}>
                            <View style={AddPostScreenStyle.addPropertyInputContainer}>

                                <Text style={AddPostScreenStyle.labelStyle}>
                                    {Strings.THREAD_ENABLE_SUGGESTION}
                                </Text>

                            </View>
                        </View>
                        
                        <View style={AddPostScreenStyle.viewContainer}>

                            <CheckBox

                                label={Strings.YES_ALLOW_THREAD}
                                labelStyle={AddPostScreenStyle.amenitisListCheckboxLabelStyle}
                                checked={true}
                                checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                                unCheckedImage={ImagePath.CHECK_BOX_OFF}

                            />

                        </View>

                    </View>
                </ScrollView>
                <View style={AddPostScreenStyle.buttonContainerStyle}>

                    <TouchableOpacity >
                        <View style={AddPostScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={AddPostScreenStyle.proceedButtonTextStyle}>
                                {Strings.SAVE}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

export default AddPostScreen;

