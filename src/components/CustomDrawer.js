import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Dimensions, Modal} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {withNavigation} from 'react-navigation';
import { DrawerItems } from 'react-navigation-drawer'
import {connect} from 'react-redux'
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {clearUser} from '../redux/actions/authActions';

import DrawerProfile from './DrawerProfile'

const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

class CustomDrawer extends React.Component {

    state = {
        statusFirebase: firebase.database().ref('/status/'),
        loading: false,
        addGroupModal: false,
        uid: firebase.auth().currentUser.uid
    };

    componentDidMount() {
        //this.getChannels();
    }

    // getChannels = () => {
    //     this.getAllChannels = this.state.channelRef.onSnapshot(querySnapShot => {
    //         let allChannels = [];
    //         querySnapShot.forEach((query) => {
    //             allChannels.push(query);
    //         })
    //         this.setState({ channels: allChannels.slice(0, 4) });
    //     })
    // }

    handlePress = () => { 
       this.setState({ loading: true }, async () => {
            await this.state.statusFirebase.child(this.state.uid).set({
                state: 'offline',
                last_changed: firebase.database.ServerValue.TIMESTAMP,
            })
            firebase.auth().signOut().then(() => {
                this.setState({ loading: false }, () => {
                    this.props.navigation.navigate('AuthLoading');
                })
            })
       })
    }

    render() {
        return (
            <LinearGradient locations={[1, 0]} colors={['#363940', '#363940']} style={{ flex: 1 }}>
                <View style={styles.header}>
                  <DrawerProfile
                        onPress={this.handlePress}
                        loading={this.state.loading} 
                    /> 
                </View>
                <View style={styles.groupHeader}>
                   <View style={{ marginLeft: ScreenWidth*0.05, flex: 1 }}> 
                       <Text style={{ fontFamily: 'RobotoMono-Regular', fontSize: 18 }}>GROUPS</Text>
                   </View>
                    <TouchableOpacity style={styles.groupAdd}
                        onPress={() => this.props.navigation.navigate('Channel')}
                    >
                        <MaterialIcons name="group-add" size={25} color="black"/>
                    </TouchableOpacity>
                </View>
                <View styles={this.props.styles}>
                    <DrawerItems 
                        activeBackgroundColor="black"
                        activeTintColor="white"
                        {...this.props}
                    />
                </View>
            </LinearGradient>
        )
    }
} 
   
const styles = StyleSheet.create({

    signOut: {
        justifyContent: 'center',
        alignItems: 'center'
    },  
    groupAdd: {
        paddingLeft: ScreenWidth*0.03, 
        flex: 1, alignItems: 
        'flex-end', 
        paddingRight: ScreenWidth*0.1 
    },
    groupHeader: {
        flexDirection: 'row'
    },
    header: {
        // padding: 20
    }
})

const mapStateToProps = state => ({
    auth: state.auth,
    styles: state.global.styles
})

export default withNavigation(connect(mapStateToProps, { clearUser })(CustomDrawer));