import React from 'react';
import {View, Text, StyleSheet, ImageBackground, Image, Dimensions, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomTextInput from '../../components/TextInput';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

const AuthScreen = (props) => {

    handleLoginPress = () => {
        props.navigation.navigate('Login')
    }

    handleSignUpPress = () => {
        props.navigation.navigate('Register')
    }

    // const {styles: redux, dimensions} = props.global;

        return (
            <LinearGradient colors={['#2D3436', '#000000']} style={{ flex: 1 }}>
                <StatusBar hidden />
                <View>
                    <ImageBackground 
                        source={require('../../../assets/justice4.png')}
                        resizeMode="cover"
                        style={{ height: ScreenHeight, width: ScreenWidth }}
                        imageStyle={{ opacity: 0.5 }}
                    >
                        <View style={{ marginTop: ScreenHeight*0.25, marginLeft: ScreenHeight*0.05,  }}>
                            <Text style={{ color: 'white', fontFamily: 'RobotoMono-Bold', fontSize: 50, }}>TEMP-CHAT</Text>
                        </View>
                        <View style={{ marginTop: ScreenHeight*0.06, marginLeft: ScreenHeight*0.05,  }}>
                            <Text style={{ color: 'white', fontSize: 19 }}>
                                CHAT WITH SELF DESTRUCTING MESSAGES, GIFS AND LOCATION SHARING.
                            </Text>
                        </View>
                        <View style={{ marginTop: ScreenHeight*0.03, marginLeft: ScreenHeight*0.05,  }}>
                            <Text style={{ color: 'white', fontSize: 19  }}>
                                AN OPEN SOURCE APP MADE WITH REACT NATIVE.
                            </Text>
                        </View>
                        <View style={{ alignItems: 'center', marginTop: ScreenHeight*0.05 }}>
                            <TouchableOpacity 
                                activeOpacity={0.6}
                                onPress={this.handleSignUpPress} 
                                style={{ backgroundColor: 'black', borderRadius: 8 }}
                            > 
                                <Text style={{ color: 'white', padding: 10, fontSize: 18, letterSpacing: 1.25 }}>REGISTER</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ justifyContent: 'center', marginRight: 10 }}>
                                <Text style={{ color: 'white', fontSize: 16 }}>Already have an account?</Text>
                            </View>
                            <View>
                                <TouchableOpacity 
                                    activeOpacity={0.6}
                                    onPress={this.handleLoginPress} 
                                    style={{ backgroundColor: 'black', borderRadius: 8 }}
                                > 
                                    <Text style={{ color: 'white', padding: 10, fontSize: 18, letterSpacing: 1.25 }}>LOGIN</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },  

    textHeader: {
        fontFamily: 'RobotoMono-Bold',
        //fontSize: 30
    },
    card: {
        backgroundColor: 'grey',
        elevation: 1,
        margin: 20,
        borderRadius: 8
    },
    headingContainer: {
        justifyContent: 'center',
    },
    infoText: {
        fontFamily: 'RobotoMono-Regular',
        fontSize: 25,
        textAlign: 'center'
    },
    navButtonContainer: {
       // marginTop: 
        //flexDirection: 'row'
    },
    buttonTextStyle: {
        fontFamily: 'RobotoMono-Regular',
        fontSize: 20
    },
    buttonContainer: {
        margin: 20,
        borderRadius: 8,
        padding: 10,
        backgroundColor: 'grey', 
        justifyContent: 'center', 
        alignItems: 'center'
    }
})


export default  connect(null)(AuthScreen);