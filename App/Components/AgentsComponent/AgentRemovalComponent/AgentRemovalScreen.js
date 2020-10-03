import React, { Component } from 'react';
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    FlatList
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import CommonStyles from '../../../CommonStyle/CommonStyle';
import Colors from '../../../Constants/Colors';
import Strings from '../../../Constants/Strings';
import ImagePath from '../../../Constants/ImagesPath';
import AgentRemovalScreenStyle from './AgentRemovalScreenStyle';
import CheckBox from 'react-native-checkbox';
import { Dropdown } from 'react-native-material-dropdown';
let propertyType = [{
    value: '1002944 : Apartment 901, Building 4, R',
}, {
    value: 'Rental',
}];
let contextRef;
var amenitiesSelectedArrray = [];
class AgentRemovalScreen extends Component {
    constructor() {
        super();
        this.state = {
            amenitiesListData: {}
        };
        contextRef = this;
    }


    componentWillUnmount() {
        amenitiesSelectedArrray = [];
    }
    closeAddProperty() {
        Actions.pop();
    }

    callBack() {
        Actions.pop();
    }

    navBar() {
        return (
            <View >
                <Image source={ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{Strings.REQUEST_AGENT_REMOVAL}</Text>
                <TouchableOpacity onPress={() => this.closeAddProperty()} style={CommonStyles.navRightImageView} >
                    <Image source={ImagePath.DRAWER_CROSS_ICON} />
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
            <View style={AgentRemovalScreenStyle.amenitiesListItemContainerStyle}>
                <CheckBox

                    label={item.name}
                    labelStyle={AgentRemovalScreenStyle.amenitisListCheckboxLabelStyle}
                    checked={item.isChecked}
                    checkedImage={ImagePath.CHECK_BOX_ACTIVE}
                    unCheckedImage={ImagePath.CHECK_BOX_OFF}
                    onChange={contextRef.onCheckBoxChangeListener.bind(contextRef, index)}
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
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={AgentRemovalScreenStyle.scrollViewContainerStyle}>
                    <View style={AgentRemovalScreenStyle.headerContainer}>
                        <Text style={AgentRemovalScreenStyle.labelStyle}>
                            {Strings.SELECT_PROPERTY}
                        </Text>
                        <Dropdown
                            label=''
                            labelHeight={5}
                            fontSize={14}
                            baseColor={Colors.WHITE}
                            containerStyle={AgentRemovalScreenStyle.dropDownViewStyle}
                            data={propertyType}
                        />
                    </View>

                    <View style={AgentRemovalScreenStyle.addPropertyInputContainer}>
                        <Text style={AgentRemovalScreenStyle.labelStyle}>{Strings.PICK_AGENTS_TO_REMOVE}</Text>
                        <View style={AgentRemovalScreenStyle.amenitiesListViewStyle}>
                            <FlatList
                                data={this.state.amenitiesListData}
                                extraData={this.state}
                                renderItem={this.renderItem}
                            />
                        </View>
                    </View>

                    <View style={AgentRemovalScreenStyle.addPropertyInputContainer}>

                        <Text style={AgentRemovalScreenStyle.labelStyle}>
                            {Strings.REASON_FOR_THE_REMOVAL_REQUEST}
                        </Text>
                        <TextInput style={AgentRemovalScreenStyle.inputDescriptionTextStyle}
                            multiline={true} />

                    </View>

                </ScrollView>
                <View style={AgentRemovalScreenStyle.buttonContainerStyle}>

                    <TouchableOpacity >
                        <View style={AgentRemovalScreenStyle.roundedBlueProceedButtonStyle}>
                            <Text style={AgentRemovalScreenStyle.proceedButtonTextStyle}>
                                {Strings.SUBMIT_REQUEST}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

export default AgentRemovalScreen;

