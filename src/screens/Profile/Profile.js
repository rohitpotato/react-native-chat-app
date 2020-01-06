import React from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import Modal from 'react-native-modal';

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {connect} from 'react-redux';
import { setUser, setProfile } from '../../redux/actions/authActions'
import { setChannel, setPrivateChannel } from '../../redux/actions/channelActions'
import ImagePicker from 'react-native-image-picker';
import uuid from 'uuid';
import { withNavigation } from 'react-navigation';

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

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            photo: {},
            imageModal: false,
            storageRef: storage().ref(),
            usersRef: firestore().collection('users'),
            loading: false,
            progress: 0,
            error: ''
        }
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
                  photo: source,
                }, () => {
                    this.uploadPicture();
                });
            }   
        })
    }
 
    uploadPicture = () => {
        this.setState({ loading: true }, () => {
            const ext = this.state.photo.uri.split('.').pop(); // Extract image extension
            const filename = `users/avatar/${this.props.profile.uid}/${uuid()}.${ext}`; // Generate unique name

            this.uploadTask = this.state.storageRef.child(filename).putFile(this.state.photo.uri).on( firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
                let progress =  Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                this.setState({ progress: progress });

            }, (error) => {
                this.uploadTask();
                this.renderFlashMessage(e);
            }, () => {
                this.state.storageRef.child(filename).getDownloadURL().then(url => {
                    this.updateUser(url);
                    
                }).catch(e => {
                    this.renderFlashMessage(e); 
                })
            })
        })
    }

    updateUser = async (url) => {
        try {
            let user = firebase.auth().currentUser;
            await user.updateProfile({ photoURL: url }); //Update the firestore user records


            //Update User Record in the database.
            let databaseUser = await this.state.usersRef.where('uid', '==', this.props.profile.uid).limit(1).get();
            databaseUser.forEach(async user => {
                await this.state.usersRef.doc(user.id).update({
                    avatar: url
                });
            });

             this.props.setProfile({
                 ...this.props.profile, avatar: url
             });
             this.props.setUser({
                ...this.props.profile, avatar: url
            });
             this.renderFlashMessage('Upload Successfull!', 'info', 'Yay!')
        } catch(e) {
            console.log(e);
            this.renderFlashMessage(e);
        }
    }

    renderFlashMessage = (message, type='danger', label='Uh-oh!') => {
        this.setState({ error: message.toString(), loading: false }, () => {
        showMessage({
            message: label,
            description: this.state.error,
            type: type
            });
        })
    }

    openImageModal = () => {
        this.setState({ imageModal: !this.state.imageModal })
    }

    componentWillUnmount() {
        if(this.uploadTask) {
            this.uploadTask();
        }
    }

    handleSendMessage = () => {
        this.props.setChannel(this.props.profile);
        this.props.setPrivateChannel(true);
        this.props.navigation.navigate('ChatWindow') 
    }

    render() {
        const {styles:redux, dimensions} = this.props.global;
        const { uid, name, avatar} = this.props.profile;

        return (
           <LinearGradient style={redux.container} colors={['#000000', '#434343']} locations={[0, 1]} >
               <StatusBar hidden />
                <TouchableOpacity
                    onPress={this.openImageModal}
                    activeOpacity={0.6}
                >
                    <Image
                    source={{ uri: avatar }}
                    style={{ height: dimensions.height*0.4, borderRadius: 4 }}
                    resizeMode="cover"
                />
                </TouchableOpacity>
                <View style={{  justifyContent: 'center', marginTop: dimensions.height*0.04 }}>
                    <View style={{  alignItems: 'center',  }}>
                        <Text 
                            style={{ color: 'white', fontSize: 24, textTransform: 'capitalize' }}
                        >
                            {name}
                        </Text>
                    </View>    
                    <View style={{  flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: dimensions.height*0.05 }}>
                        {this.props.user.uid === uid ? <TouchableOpacity 
                          onPress={this.handleImagePress}
                          style={{ alignItems: 'center',  }}
                          activeOpacity={0.6}
                        >
                            <MaterialIcons name="linked-camera" color="white" size={30} />
                            <Text style={{ color: 'white' }}>Update Picture</Text>
                        </TouchableOpacity> : null}

                        {this.props.user.uid !== uid ? <TouchableOpacity 
                          onPress={this.handleSendMessage}
                          activeOpacity={0.6}
                          style={{ alignItems: 'center', }}
                        >
                            <MaterialIcons name="chat" color="white" size={30} />
                            <Text style={{ color: 'white' }}>Send a Message</Text>
                        </TouchableOpacity> : null}
                    </View>                
                </View>

                {/* Image Modal */}

                <Modal
                    animationIn="zoomInUp"
                    animationOut="zoomOutDown"
                    swipeDirection="down"
                    onSwipeComplete={this.close}
                    onSwipeComplete={this.openImageModal}
                    style={{ justifyContent: 'flex-end', margin: 0,}}
                    backdropOpacity={0}
                    onBackdropPress={this.openImageModal}
                    isVisible={this.state.imageModal}
                    onBackButtonPress={this.openImageModal}
                >
                    <View style={{ backgroundColor: 'black',flex: 1 }}>
                        <View style={{ flexDirection: 'row-reverse', margin: dimensions.height*0.01}}>
                            <TouchableOpacity onPress={this.openImageModal}>
                                <MaterialIcons color="white" name="clear" size={18} />
                            </TouchableOpacity>
                        </View>    
                        <Image 
                            style={{ height: dimensions.height*0.9, }}
                            source={{ uri: avatar }}
                            resizeMode="center"
                        />
                    </View>
                </Modal>

                {/* Upload Modal */}

                <Modal
                    isVisible={this.state.loading}
                    backdropOpacity={0.8}
                >
                    <View style={{ justifyContent: 'center', alignSelf: 'center', backgroundColor: 'white', borderRadius: 8  }}>
                        <Text style={{ padding: 20}}>Uploading ({this.state.progress} %)</Text>
                    </View>
                </Modal>

                <FlashMessage ref="myLocalFlashMessage" /> 
           </ LinearGradient>
        )
    }
}

const mapStateToProps = state => ({
    global: state.global,
    profile: state.profile.currentProfile,
    user: state.auth.user
})

export default withNavigation(connect(mapStateToProps, { setUser, setProfile, setChannel, setPrivateChannel })(Profile));