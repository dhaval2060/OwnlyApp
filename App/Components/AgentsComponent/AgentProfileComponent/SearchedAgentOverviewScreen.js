import React, { Component } from 'react';
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
} from 'react-native';
import Colors from '../../../Constants/Colors';
import AgentOverviewScreenStyle from './AgentOverviewScreenStyle';
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
                <View style={{height:0.5,backgroundColor:'gray',marginTop:30,marginHorizontal:20}}/>
                <Text style={AgentOverviewScreenStyle.titleTextStyle}>About</Text>
                <Text style={[AgentOverviewScreenStyle.detailsTextStyle,{fontWeight:'500'}]}>
                    {
                        this.state.overViewData.about_user
                    }
                </Text>
                <View style={{height:0.5,backgroundColor:'gray',marginTop:30,marginHorizontal:20}}/>
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

                <Text style={[AgentOverviewScreenStyle.detailsTextStyle,{fontWeight:'500'}]}>
                    {this.state.overViewData.agency_id.principle_id.about_user}
                </Text>
            </ScrollView >

        );
    }
}

export default OverviewScreen;
