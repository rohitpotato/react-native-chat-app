import React from 'react';
import {View, Text, StyleSheet, TextInput, Image} from 'react-native';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomTextInput from '../../components/TextInput';
import { TouchableOpacity } from 'react-native-gesture-handler';

class AuthScreen extends React.Component {

    state = {
        name: '',
        phone: '',
        otp: ''
    }

    static navigationOptions = {
        header: null
    }

    handleLoginPress = () => {
        this.props.navigation.navigate('Login')
    }

    handleSignUpPress = () => {
        this.props.navigation.navigate('Register')
    }

    render() {
        const { styles: redux, dimensions } = this.props.global;
        const {name, phone, otp} = this.state;

        return (
            <LinearGradient colors={redux.container.colors} style={styles.container}>
                    <View>
                        <Text style={{...styles.textHeader, color: 'black', fontSize: dimensions.height/13, textAlign: 'center'}}>
                            Destruct Native
                        </Text>
                    </View>
                    <Image 
                        style={{ height: dimensions.height/8 }}
                        resizeMode="center"
                        source={require('../../../assets/batman.png')}
                    />
                    <View style={{...styles.headingContainer, marginTop: dimensions.height/15}}>
                        <Text style={styles.infoText}>Chat with self-destruct messages.</Text>
                    </View>
                    <View style={{...styles.navButtonContainer, marginTop: dimensions.height/15 }}>

                        <View>
                            <TouchableOpacity 
                            onPress={this.handleLoginPress}
                            style={{...styles.buttonContainer,  width: dimensions.width*0.3}}>
                                <Text style={{...styles.buttonTextStyle, textAlign: 'center'}}>
                                    Log In
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={{ marginTop: dimensions.height/20 }}>
                            <Text style={{ textAlign: 'center' }}>Already have an account?</Text>
                        </View>

                        <View>
                            <TouchableOpacity 
                                onPress={this.handleSignUpPress}
                                style={{ ...styles.buttonContainer,  width: dimensions.width*0.3 }}>
                                <Text style={styles.buttonTextStyle}>
                                   Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
               {/* <View style={styles.card}>
                   <CustomTextInput 
                        icon={icon => (
                            <MaterialIcons name="person" size={20} color="#f2f2f2"/>
                        )}
                        placeholder="YOUR NAME"
                        textInputStyle={{color: 'white'}}
                        placeholderTextColor="white"
                        clear
                        value={name}
                        onChangeText={(text) => this.handleTextChange('name', text)}
                        handleClear={() => this.handleClearInput('name')}
                   />
                   <CustomTextInput 
                        icon={icon => (
                            <MaterialIcons name="phone" size={20} color="#f2f2f2"/>
                        )}
                        placeholder="YOUR PHONE NUMBER"
                        textInputStyle={{color: 'white'}}
                        placeholderTextColor="white"
                        onChangeText={(text) => this.handleTextChange('phone', text)}
                        keyboardType="numeric"
                        value={phone}
                        handleClear={() => this.handleClearInput('phone')}
                   />
                   <CustomTextInput 
                        icon={icon => (
                            <FontAwesome name="user-secret" size={20} color="#f2f2f2"/>
                        )}
                        placeholder="YOUR OTP"
                        textInputStyle={{color: 'white'}}
                        keyboardType="numeric"
                        placeholderTextColor="white"
                        value={otp}
                   />

               </View> */}
            </LinearGradient>
        )
    }
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

const mapStateToProps = state => ({
    global: state.global
})

export default  connect(mapStateToProps)(AuthScreen);