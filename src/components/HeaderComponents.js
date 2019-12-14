import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const BackButton = props => (
    <TouchableOpacity
        activeOpacity={0.6}
    >
        <MaterialIcons name="arrow-back" size={20} color="black"/>
    </TouchableOpacity>
)

const Center = props => (
    <View style={{ flexDirection: 'row',  }}>
        <Image 
            resizeMode="cover"
            style={{ width: 40, height: 40, borderRadius: 20 }}
            source={{ uri: props.uri }}
        />
        <View style={{ justifyContent: 'center', marginLeft: 10 }}>
            <Text
             style={{ fontFamily: 'RobotoMono-Regular', color: 'black' }}>{props.name}</Text>
        </View>
    </View>
)

const RightChatIcon = props => (
    <View>
        <MaterialIcons 
            name="info-outline"
            color="black"
            size={20}
        />
    </View>
)

export {
    BackButton,
    Center,
    RightChatIcon
}