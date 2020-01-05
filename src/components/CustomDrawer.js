import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Dimensions, Modal, ImageBackground} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {withNavigation} from 'react-navigation';
import { DrawerItems } from 'react-navigation-drawer'
import {connect} from 'react-redux'
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {clearUser, setProfile} from '../redux/actions/authActions';

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
                        <Text style={{ fontFamily: 'RobotoMono-Regular', fontSize: 18, color: 'white' }}>GROUPS</Text>
                    </View>
                        <TouchableOpacity style={styles.groupAdd}
                            onPress={() => this.props.navigation.navigate('Channel')}
                        >
                            <MaterialIcons name="group-add" size={25} color="white"/>
                        </TouchableOpacity>
                    </View>
                    <View styles={{...this.props.styles, marginTop: ScreenHeight*0.1}}>
                       <View style={{ marginLeft: ScreenWidth*0.05, marginBottom: ScreenHeight*0.03 }}>
                           <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Home')}
                           >
                               <Text style={{ color: 'white', fontWeight: 'bold' }}>Home</Text>
                           </TouchableOpacity>
                       </View>
                       <View style={{ marginLeft: ScreenWidth*0.05, marginBottom: ScreenHeight*0.03 }}>
                           <TouchableOpacity
                                onPress={() => {
                                    this.props.setProfile({
                                        uid: this.props.auth.user.uid,
                                        name: this.props.auth.user.name,
                                        avatar: this.props.auth.user.avatar
                                      });
                                      this.props.navigation.navigate('Profile');
                                }}
                           >
                               <Text style={{ color: 'white', fontWeight: 'bold' }}>Profile</Text>
                           </TouchableOpacity>
                       </View>
                       <View style={{ marginLeft: ScreenWidth*0.05, marginBottom: ScreenHeight*0.03 }}>
                           <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Settings')}
                           >
                               <Text style={{ color: 'white', fontWeight: 'bold' }}>Settings</Text>
                           </TouchableOpacity>
                       </View>
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

export default withNavigation(connect(mapStateToProps, { clearUser, setProfile })(CustomDrawer));