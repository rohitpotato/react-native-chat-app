import React from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';

class Profile extends React.Component {
    render() {
        return (
            <View>
                <Text>Profile Screen</Text>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    user: state.auth.user
})

export default connect(mapStateToProps)(Profile)