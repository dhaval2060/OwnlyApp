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
import AgentOverviewScreenStyle from './AgentOverviewScreenStyle';

import CommonStyles from '../../../CommonStyle/CommonStyle';
import API from '../../../Constants/APIUrls';
import StarRating from 'react-native-star-rating';
let contextRef;

class OverviewScreen extends Component {
    constructor() {
        super();
        this.state = {
            uploadImagesData: {},
            selectedImage: 0,
            overViewData: '',
            starCount: 3.5,
        };
        contextRef = this;
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.setState({ overViewData: this.props.overviewData });
    }
    componentDidMount() {
        this.uploadImageListSelection(0);
    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    uploadImageListSelection(index) {
        var overviewImagePath = this.state.overViewData.images ? (this.state.overViewData.images.length > 0 ? this.state.overViewData.images[index].url : '') : '';
        this.setState({ selectedImage: overviewImagePath });
        var tempData = this.state.overViewData.images;
        var tempArray = this.state.overViewData.images;
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


    renderItem({ item, index }) {
        var imagePath = item.url ? API.USER_IMAGE_PATH + item.url : '';
        return (
            <TouchableOpacity onPress={() => contextRef.uploadImageListSelection(index)}>
                <View style={AgentOverviewScreenStyle.overviewImageListItemStyle}>
                    <Image source={{ uri: imagePath }} style={AgentOverviewScreenStyle.overviewPropertyListImageStyle} />
                </View>
                {
                    item.isSelected == 1 ? <View style={AgentOverviewScreenStyle.selectedImageStyle}>

                    </View> : null
                }
            </TouchableOpacity>
        );
    }


    render() {
        var images = this.state.overViewData ? (this.state.overViewData.images ? this.state.overViewData.images : []) : [];
        var averagerate = this.props.ratingData ? (this.props.ratingData.data ? this.props.ratingData.data : 0) : 0;
        var totalreviews = this.props.ratingData.total_review ? this.props.ratingData.total_review : 0;

        return (
            <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>

                {
                    this.state.selectedImage != ''
                        ?
                        <Image source={{ uri: API.USER_IMAGE_PATH + this.state.selectedImage }} style={AgentOverviewScreenStyle.overviewImageStyle} />
                        :
                        <Image source={null} style={AgentOverviewScreenStyle.overviewImageStyle} />
                }
                <View style={{ marginTop: 5 }}>
                    {
                        images.length > 0 ?
                            <FlatList
                                horizontal={true}
                                data={this.state.overViewData.images}
                                renderItem={this.renderItem}
                                extraData={this.state}
                            /> : null
                    }

                </View>

                <Text style={AgentOverviewScreenStyle.titleTextStyle}>About {this.state.overViewData.firstname + ' ' + this.state.overViewData.lastname}</Text>
                <Text style={AgentOverviewScreenStyle.detailsTextStyle}>
                    {
                        this.state.overViewData.about_user
                    }
                </Text>
                <Text style={AgentOverviewScreenStyle.titleTextStyle}>Agency</Text>

                <View style={AgentOverviewScreenStyle.agencyReviewContainerStyle}>
                    <Image source={{ uri: this.state.overViewData.agency_id ? API.USER_IMAGE_PATH + this.state.overViewData.agency_id.logoImage : '' }} style={AgentOverviewScreenStyle.agencyImageStyle} />
                    <View style={OverviewScreen.reviewContainerStyle}>
                        <Text style={AgentOverviewScreenStyle.agencyTitleTextStyle}>{this.state.overViewData.agency_id ? this.state.overViewData.agency_id.name : ''}</Text>
                        <View style={{ marginLeft: 16 }}>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                starSize={20}
                                starStyle={{ paddingRight: 2, paddingLeft: 2, marginTop: 5, marginBottom: 5 }}
                                emptyStarColor={Colors.EMPTY_STAR_COLOR}
                                starColor={Colors.STAR_COLOR}
                                rating={averagerate}
                                selectedStar={(rating) => this.onStarRatingPress(rating)}
                            />
                        </View>
                        <Text style={AgentOverviewScreenStyle.reviewDetailsTextStyle}>{averagerate + ' ' + 'from' + ' ' + totalreviews + ' ' + 'reviews'}</Text>
                    </View>
                </View>

                {/* <Text style={AgentOverviewScreenStyle.detailsTextStyle}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.◊
                </Text> */}
            </ScrollView >

        );
    }
}

export default OverviewScreen;
