import React, { Component } from 'react';
import {
    Animated
} from 'react-native';

//For Listview row item
class DynamicListRow extends Component {

    // these values will need to be fixed either within the component or sent through props
    _defaultTransition = 500;

    state = {
        _rowOpacity: new Animated.Value(0)
    };

    componentDidMount() {
        Animated.timing(this.state._rowOpacity, {
            toValue: 1,
            duration: this._defaultTransition
        }).start()
    }

    render() {
        return (
            <Animated.View>
                {this.props.children}
            </Animated.View>
        );
    }
}

export default DynamicListRow;