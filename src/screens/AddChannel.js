import React from 'react';
import {
        View, Text, 
        ActivityIndicator, Dimensions, 
        StyleSheet, TouchableOpacity, Image,
        StatusBar
      } 
        from 'react-native';
import {connect} from 'react-redux'
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';


import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-picker';
import uuid from 'uuid';

const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

const options = {
    title: 'Select Image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    quality: 0.4,
    noData: true,
    cameraType: 'back'
  };
  
class AddChannel extends React.Component {

    state = {
        currentUser: this.props.auth.user,
        channel: '',
        channelRef: firestore().collection('channels'),
        channels: [],
        error: '',
        channelImage: {},
        loading: false,
        channelAbout: '',
        loading: false,
        storageRef: storage().ref(),
        progress: 0
    }

    static navigationOptions = {
        header: null
    }

    handleChange = (field, value) => {
        this.setState({ [field]: value })
    }

    handleImagePress = () => {
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
              } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
              } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
              } else {
                const source = { uri: response.uri };
        
                this.setState({
                  channelImage: source,
                });
            }   
        })
    }

    addChannel = () => {
        this.setState({ loading: true }, () => {
            if(!this.state.channel || this.state.channel.length < 2) {
                this.setState({ loading:false });
                 return;
            }
            const newChannel = {
                name: this.state.channel,
                createdBy: this.state.currentUser.displayName,
                createdAt: Date.now(),
                about: this.state.channelAbout,
            }
            this.state.channelRef.where('name', '==', newChannel.name).get().then((channel) => {
                if(channel.size > 0) {
                    console.log(channel);
                    this.renderError('This channel already exists.');
                } else {

                    if(this.state.channelImage.uri) {
                        const ext = this.state.channelImage.uri.split('.').pop(); // Extract image extension
                        const filename = `channel/icon/${uuid()}.${ext}`; // Generate unique name

                        this.uploadSub = this.state.storageRef.child(filename).putFile(this.state.channelImage.uri).on( firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
                            let progress =  Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                            this.setState({ progress: progress });
       
                        }, (error) => {
                            this.uploadSub();
                            this.renderError(e);
                        }, () => {
                            this.state.storageRef.child(filename).getDownloadURL().then(url => {
                                newChannel.avatar = url;
                                this.addChannel_(newChannel);
                            }).catch(e => {
                                this.renderError(e);
                            })
                        })
    
                    } else {
                        this.addChannel_(newChannel);
                    }
    
                } 
            }).catch(e => {
                this.renderError(e);
                console.log(e)
            })
        })
    }
    
    addChannel_ = (newChannel) => {
        this.state.channelRef.add(newChannel).then(() => {
            this.setState({ channel: '', channelAbout: '', channelImage: '', loading: false })
            showMessage({
                message: 'Yay!',
                description: 'Channel Added.',
                type: 'success'
            })
        }).catch(e => {
            console.log(e);
            this.renderError(e);
        })
    }
    
    renderError = (e, type='danger') => {
        this.setState({ error: e.toString(), loading: false }, () => {
            showMessage({
                message: "Uh-oh!",
                description: this.state.error,
                type: type
                });
        })
    }

    componentWillUnmount() {
       if(this.uploadSub) {
        this.uploadSub();
       }
    }

    render() {
        const {styles: redux} = this.props;
        const { loading, channel, channelImage, channelAbout } = this.state;
        return (
            <LinearGradient colors={redux.container.colors} style={{ flex: 1 }}>
                <StatusBar hidden/>
                <Header 
                    leftIcon
                    headerTextStyle={{ fontSize: 18, fontFamily: 'RobotoMono-Regular', color: 'white', }}
                    titleText="ADD A CHANNEL"
                />
                 <KeyboardAwareScrollView 
                    keyboardShouldPersistTaps="always"
                    enableOnAndroid 
                    enableAutomaticScroll
                    extraScrollHeight={150}
               >
                <View style={{ marginTop: ScreenHeight*0.05, marginLeft: ScreenWidth*0.1}}>
                    <Text style={{ fontFamily: 'RobotoMono-Regular', color: 'grey' }}>Channel Logo</Text>
                </View>
                <TouchableOpacity
                     activeOpacity={0.4}
                     onPress={this.handleImagePress}
                     style={styles.imageContainer}
                >
                    <View style={{ flex: 1, margin: 15}}>
                        {this.state.channelImage.uri ? 
                            <Image 
                                source={{ uri: channelImage.uri }}
                                style={{ width: 60, height: 60 }}
                            /> : 
                            <FontAwesome name="file-image-o" color="white" size={60}/>}
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={styles.textStyle}>Upload an image</Text>
                    </View>
                </TouchableOpacity>

                <View>
                    <Input 
                        label={ <View style={{ marginBottom: ScreenWidth*0.04 }}><Text style={styles.textStyle}>Channel Name</Text></View> }
                        containerStyle={{ marginLeft: ScreenWidth*0.07 }}
                        inputContainerStyle={styles.inputContainerStyle}
                        inputStyle={{ ...styles.textStyle, fontSize: 14 }}
                        placeholderTextColor="grey"
                        placeholder="Enter Channel Name"
                        onChangeText={(text) => this.handleChange('channel', text)}
                        value={channel}
                    />
                </View>

                <View>
                    <Input 
                        label={ <View style={{ marginBottom: ScreenWidth*0.04 }}><Text style={styles.textStyle}>Channel Description</Text></View> }
                        containerStyle={{ marginLeft: ScreenWidth*0.07, marginTop: ScreenHeight*0.05 }}
                        inputContainerStyle={styles.inputContainerStyle}
                        inputStyle={{ ...styles.textStyle, fontSize: 14 }}
                        placeholder="Enter Channel Description"
                        placeholderTextColor="grey"
                        multiline
                        onChangeText={(text) => this.handleChange('channelAbout', text)}
                        value={channelAbout}
                    />
                </View>

                </KeyboardAwareScrollView>
                <View style={{  position: 'absolute', bottom: 0 }}>
                   <TouchableOpacity 
                        style={{...styles.buttonContainer, width: ScreenWidth}}
                        activeOpacity={0.6}
                        onPress={this.addChannel}
                        disabled={loading}
                   >
                        {!loading ? <Text style={styles.headerTextStyle}>
                            CREATE CHANNEL
                        </Text> : <ActivityIndicator size="small" color="green"/>}
                   </TouchableOpacity>
               </View>
                <FlashMessage ref="myLocalFlashMessage" /> 
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    headerTextStyle: {
        //textAlign: 'center',
        fontSize: 15,
        color: 'white',
        fontFamily: 'RobotoMono-Regular'
    },
    textStyle: { 
        color: 'grey', 
        fontFamily: 'RobotoMono-Regular'
    },
    inputContainerStyle: { 
        borderWidth: 0.2, 
        borderBottomWidth:0.2, 
        width: ScreenWidth*0.835, 
        backgroundColor: 'transparent' 
    },
    buttonContainer: {
        padding: 15,
        backgroundColor: 'black',
        alignItems: 'center'
    },
    imageContainer: {
         flexDirection: 'row', 
         margin: ScreenWidth*0.07, 
         marginLeft: ScreenWidth*0.1, 
         borderWidth: 0.2
    }
})

const mapStateToProps = state => ({
    auth: state.auth,
    styles: state.global.styles
})

export default connect(mapStateToProps)(AddChannel);