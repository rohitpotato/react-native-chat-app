import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import { ListItem, TouchableScale } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';

import { setChannel, setPrivateChannel } from '../redux/actions/channelActions';

const ScreenHeigth = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

class GroupList extends React.PureComponent {

    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log(nextProps.user, this.props.user)
    //     return nextProps.user.last_changed !== this.props.user.last_changed || nextProps.user.status !== this.props.user.status
    // }

    handlePress = () => {
        this.props.setPrivateChannel(false);
        this.props.setChannel(this.props.channel);
        this.props.navigation.navigate('ChatWindow');
    }

    render() {
        const { channel } = this.props;
        return (
                <ListItem
                    Component={TouchableScale}
                    friction={90} //
                    onPress={this.handlePress}
                    activeOpacity={0.1}
                    tension={50} // These props are passed to the parent component (here TouchableScale)
                    activeScale={0.95} //
                    containerStyle={{ backgroundColor: 'transparent' }}
                    // linearGradientProps={{
                    // colors: ['#FF9800', '#F44336'],
                    // start: [1, 0],
                    // end: [0.2, 0],
                    // }}
                    // ViewComponent={LinearGradient} // Only if no expo
                    leftAvatar={{ rounded: true, source: { uri: channel.iconUrl } }}
                    title={channel.name}
                    titleStyle={{ color: 'white', fontFamily: 'RobotoMono-Regular', fontSize: 14 }}
                    subtitle={channel.about}
                    subtitleStyle={{ color: 'grey', fontSize: 12 }}
                    //subtitle="Vice Chairman"
                    chevron={{ color: 'grey' }}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        margin: ScreenHeigth*0.02,
        backgroundColor: 'red',
        flex: 1
        //borderRadius: 20
        //flexDirection: 'row'
    },
    itemContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        height: ScreenHeigth*0.08
    },
    imageContainer: {
        flex: 0.1,
        marginLeft: ScreenWidth*0.04
    },  
    detailsContainer: {
        flex: 0.7,
        marginLeft: ScreenWidth*0.05
    },
    status: {
        flex: 0.2
    },
    nameText: {
        fontFamily: 'RobotoMono-Medium'
    }
})


export default withNavigation(connect(null, {setChannel, setPrivateChannel})(GroupList));