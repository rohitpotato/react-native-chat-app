import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

const BackButton = props => (
    <TouchableOpacity
        onPress={props.onBackPress}
        style={{ padding: 5 }}
        activeOpacity={0.6}
    >
        <MaterialIcons name="arrow-back" size={20} color="white"/>
    </TouchableOpacity>
)

const Center = props => (
    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
        <Image 
            resizeMode="cover"
            style={{ width: 30, height: 30, borderRadius: 15 }}
            source={{ uri: props.uri }}
        />
        <View style={{ justifyContent: 'center', marginLeft: 10 }}>
            <Text
             style={{ fontFamily: 'RobotoMono-Regular', color: 'white' }}>{props.name}
             </Text>
            {
                props.typing && props.typing.typing ?                     
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: 'grey', fontSize: 11, letterSpacing: 0.8, fontFamily: 'RobotoMono-Italic'}}>
                        Typing...
                    </Text>
                </View> 
            : 
                props.isPrivate ?
                    <View style={{ flexDirection: 'row', }}>
                    <View style={{ marginLeft: -6  }}>
                        <Entypo name="dot-single" color={ props.status == 'online' ? 'green' : 'red' } size={20} />
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ color: 'grey', fontSize: 11, letterSpacing: 0.8}}>
                                {props.status === 'online' ? 'Online' : 'Offline'}
                        </Text>
                    </View>
                </View> : null
            }
        </View>
    </View>
)

const RightChatIcon = props => (
    <View>
        <MaterialIcons 
            name="info-outline"
            color="white"
            size={20}
        />
    </View>
)

export {
    BackButton,
    Center,
    RightChatIcon
}