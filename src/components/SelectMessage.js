import React from 'react';
import { View, Text, Touchable, ScrollView, Image, TextInput, StyleSheet, Button, TouchableOpacity, Dimensions } from 'react-native';
import { ListItem, TouchableScale } from 'react-native-elements'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

const SelectMessage = ({onCopyPress, onCancelPress}) => {
    return (
        <View style={{ backgroundColor: 'white', height: ScreenHeight*0.2, borderTopLeftRadius: 17, borderTopRightRadius: 17 }}>
            
            <ListItem
                    onPress={onCopyPress}
                    activeOpacity={0.6}
                    key={12312}
                    containerStyle={{ backgroundColor: 'transparent' }}
                    title="Copy Text"
                    titleStyle={{ color: 'black', fontFamily: 'RobotoMono-Regular', fontSize: 14 }}
            />

            <ListItem
                    onPress={onCancelPress}
                    activeOpacity={0.6}
                    key={45352}
                    containerStyle={{ backgroundColor: 'transparent' }}
                    title="Cancel"
                    titleStyle={{ color: 'black', fontFamily: 'RobotoMono-Regular', fontSize: 14 }}
            />
            
        </View>
    )
}

export default SelectMessage;