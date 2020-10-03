import React,{Component} from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import ImagePath from '../../Constants/ImagesPath';
import CommonStyles from '../../CommonStyle/CommonStyle';

class HeaderComponent extends Component {
    render(){
        return(
            <View>
                <Image source={this.props.imageBG?this.props.imageBG:ImagePath.HEADER_BG} style={CommonStyles.navBarMainView} />
                <Text style={CommonStyles.navBarTitleTextView}>{this.props.textLable?this.props.textLable:''}</Text>
                {
                    this.props.otherImage !== ''&& (
                        <TouchableOpacity onPress={this.props.clickEvent} style={CommonStyles.navRightImageView}>
                            <View>
                                <Image source={this.props.otherImage}/>
                            </View>
                        </TouchableOpacity>
                    )
                }
            </View>
        )
    }
}

export default HeaderComponent;