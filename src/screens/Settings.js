import React from 'react';
import {View, Text} from 'react-native';
import {withNavigation} from 'react-navigation';
class Settings extends React.Component {
    render() {
        return (
            <View>
                <Text onPress={() => this.props.navigation.openDrawer()}>
                    Settings Screen
                </Text>
            </View>
        )
    }
}

export default withNavigation(Settings);