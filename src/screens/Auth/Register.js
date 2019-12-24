import React from 'react';
import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView,ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import CustomTextInput from '../../components/TextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import md5 from 'md5';
import {setUser} from '../../redux/actions/authActions';

class Register extends React.Component {

    state = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        errors: [],
        secureTextEntry: true,
        loading: false,
        userRef: firestore().collection('users')
    }

    static navigationOptions = {
        header: null
    }

    handleTextInput = (key, text) => {
        this.setState({[key]: text})
    }

    handleClearInput = (key) => {
        this.setState({[key]: ''})
    }

    handleSignUp = async () => {
        this.setState({ errors: [] });
        const {name, email, password, confirmPassword, errors, userRef} = this.state;
        if(!this.validation()) {
            return;
        }
        this.setState({ loading: true }, () => {
            auth().createUserWithEmailAndPassword(email, password).then((createdUser) => {
                createdUser.user.updateProfile({
                    displayName: this.state.name,
                    photoURL: `http://gravatar.com/avatar/${md5(this.state.email)}?d=identicon`
                }).then(async () => {
                    let authUser = await firebase.auth().currentUser;
                    console.log(authUser);
                    userRef.add({
                        uid: authUser.uid,
                        name: authUser.displayName,
                        avatar: authUser.photoURL
                    }).then(() => {
                        this.props.setUser({
                            name: authUser._user.providerData[0].displayName,
                            avatar: authUser._user.providerData[0].photoURL,
                            email: authUser._user.providerData[0].email,
                            uid: authUser._user.uid,
                        })
                        this.setState({ loading: false, name: '', email: '', password: '', confirmPassword: '' }, () => {
                            this.props.navigation.navigate('Home');
                        });
                        console.log('DONE')
                    }).catch(e => {
                        this.setState({ 
                            errors: this.state.errors.concat([e].toString()), loading: false,
                        })
                        console.log(e);
                    })
                }).catch(e => {
                    this.setState({ 
                        errors: this.state.errors.concat([e].toString()), loading: false,
                    })
                })
            }).catch(e => {
                this.setState({ 
                    errors: this.state.errors.concat([e].toString()), loading: false,
                })
            })
        })
    }

    handleShowPassword = () => {
        this.setState((prevState) => ({
            secureTextEntry: !prevState.secureTextEntry
        }));
    }

    validation = () => {
            const {name, email, password, confirmPassword, errors} = this.state;
            if(!name.length || !email.length || !password.length || !confirmPassword.length) {
                let errors_ = [...errors];
                errors_.push('All Fields are required.');
                errors_ = [...new Set(errors_)];
                this.setState({ errors: errors_ })
                return false;
            }  
            if(password !== confirmPassword) {
                let errors_ = [...errors];
                errors_.push('Password fields should match.');
                errors_ = [...new Set(errors_)];
                this.setState({ errors: errors_ })
                return false;
            }

            return true;
    }

    render() {
        const { styles: redux, dimensions } = this.props.global;
        const {name, email, password, confirmPassword, errors, loading} = this.state;
        //console.log(this.state.userRef);
        return (
           <LinearGradient colors={redux.container.colors}  style={{ flex: 1 }}>
               <KeyboardAwareScrollView 
                    keyboardShouldPersistTaps="always"
                    enableOnAndroid 
                    enableAutomaticScroll
                    extraScrollHeight={150}
               >
               <View style={{...styles.headerContainer, marginTop: dimensions.height*0.05, alignItems: 'center'}}>
                   <Text style={styles.headerTextStyle}>
                       Signup with your email to get started.
                   </Text>
               </View>
               <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: dimensions.height*0.05, marginBottom: dimensions.height*0.02}}>
                    <Image 
                        style={{ height: dimensions.height/8 }}
                        resizeMode="center"
                        source={require('../../../assets/flash.png')}
                    />
               </View>
               {<View style={{...styles.card, backgroundColor: '#FF3333', borderRadius: 2, }}>
                    {errors.map((error, index) => {
                        return (
                            <View key={index} style={{ margin: 10, justifyContent: 'center' }}>
                                <Text style={{...styles.headerTextStyle, color: 'white',ontSize: 15}}>
                                   {error}
                                </Text>
                            </View>
                        )
                    })}
               </View>}
               {/* AREA FOR SHOWING ERRORS */}
                <View style={styles.card}>
                   <CustomTextInput 
                        icon={icon => (
                            <MaterialIcons name="person" size={20} color="grey"/>
                        )}
                        placeholder="YOUR NAME"
                        textInputStyle={{color: 'white'}}
                        placeholderTextColor="white"
                        clear
                        value={name}
                        onChangeText={(text) => this.handleTextInput('name', text)}
                        handleClear={() => this.handleClearInput('name')}
                   />
                   <CustomTextInput 
                        icon={icon => (
                            <MaterialIcons name="email" size={20} color="grey"/>
                        )}
                        placeholder="EMAIL ADDRESS"
                        clear
                        textInputStyle={{color: 'white'}}
                        //container={{ borderBottomColor: 'red' }}
                        placeholderTextColor="white"
                        onChangeText={(text) => this.handleTextInput('email', text)}
                        value={email}
                        handleClear={() => this.handleClearInput('email')}
                   />
                   <CustomTextInput 
                        icon={icon => (
                            <FontAwesome name="user-secret" size={20} color="grey"/>
                        )}
                        placeholder="PASSWORD"
                        //clear
                        textInputStyle={{color: 'white'}}
                        show
                        placeholderTextColor="white"
                        onChangeText={(text) => this.handleTextInput('password', text)}
                        value={password}
                        handleClear={() => this.handleClearInput('password')}
                        secureTextEntry={this.state.secureTextEntry}
                        handleShowPassword={this.handleShowPassword}
                   />
                   <CustomTextInput 
                        icon={icon => (
                            <FontAwesome name="user-secret" size={20} color="grey"/>
                        )}
                        placeholder="CONFIRM PASSWORD"
                        //clear
                        textInputStyle={{color: 'white'}}
                        show
                        placeholderTextColor="white"
                        onChangeText={(text) => this.handleTextInput('confirmPassword', text)}
                        value={confirmPassword}
                        handleClear={() => this.handleClearInput('confirmPassword')}
                        secureTextEntry={this.state.secureTextEntry}
                        handleShowPassword={this.handleShowPassword}
                   />
               </View>
               </KeyboardAwareScrollView>
               <View style={{  position: 'absolute', bottom: 0 }}>
                   <TouchableOpacity 
                        style={{...styles.buttonContainer, width: dimensions.width}}
                        onPress={this.handleSignUp}
                        disabled={loading}
                   >
                        {!loading ? <Text style={styles.headerTextStyle}>
                            SIGN UP
                        </Text> : <ActivityIndicator size="small" color="green"/>}
                   </TouchableOpacity>
               </View>
           </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerContainer: {
        // flex: 1,
        // backgroundColor: 'red'
    },  
    card: {
        //backgroundColor: '#b2b2b2',
        // flex: 2,
        // elevation: 0.1,
        margin: 10,
        borderRadius: 8
    },
    headerTextStyle: {
        //textAlign: 'center',
        fontSize: 15,
        color: 'white',
        fontFamily: 'RobotoMono-Regular'
    },
    buttonContainer: {
        padding: 15,
        backgroundColor: 'black',
        alignItems: 'center'
    }
})

const mapStateToProps = state => ({
    global: state.global
})

export default connect(mapStateToProps, {setUser})(Register);