import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import firebase from '@react-native-firebase/app';
import {withNavigation} from 'react-navigation';
import {setUser, clearUser, clearProfile} from '../redux/actions/authActions';

 class AuthLoading extends React.Component {

    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                const u = user._user.providerData[0];
                const userObj = {
                    name: u.displayName,
                    avatar: u.photoURL,
                    email: u.email,
                    uid: user._user.uid,
                }

                this.props.setUser(userObj);
                this.props.navigation.navigate('Drawer')
            } else {
                this.props.clearUser();
                this.props.clearProfile();
                this.props.navigation.navigate('AuthStack')
            }
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {

        const { styles: redux, dimensions } = this.props.global;
        return (
            <LinearGradient colors={redux.container.colors} style={styles.conatiner}>
                <StatusBar backgroundColor="transparent" />
                <ImageBackground
                    source={require('../../assets/flash4.png')}
                    resizeMode="cover"
                    style={{ height: dimensions.height, width: dimensions.width }}
                    imageStyle={{ opacity: 0.5 }}
                >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1}}>
                    <View style={{ }}>
                        <Text style={{ color: 'white', fontSize: 15, fontFamily: 'RobotoMono-Medium' }}>WE ARE FETCHING YOUR DATA...HOLD ON!</Text>
                    </View>
                    <View style={{ }}>
                        <ActivityIndicator size="small" color="red" />
                    </View>
                </View>
                </ImageBackground>

                {/* <View>
                    <Image 
                        resizeMode="center"
                        style={{ height: dimensions.height/3,  }}
                        source={require('../../assets/batman.png')}
                    />
                </View>
                <ActivityIndicator 
                    color="rgb(0,205,0)"
                    size="large"
                />
                <Text style={redux.text}>PLEASE WAIT WHILE WE FETCH YOUR DATA...</Text> */}
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const mapStateToProps = state => ({
    global: state.global
})

export default withNavigation(connect(mapStateToProps, { setUser, clearUser, clearProfile })(AuthLoading));