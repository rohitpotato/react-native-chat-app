import React from 'react';
import { View, Text, Touchable, ScrollView, Image, TextInput, StyleSheet, Button, TouchableOpacity, Dimensions } from 'react-native';
import { ListItem, TouchableScale } from 'react-native-elements'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

const availabeDurations = [0,5,7,10]

const TimerModal = ({timer_duration, onDurationSelect}) => {
    return (
        <View style={{ backgroundColor: 'white', height: ScreenHeight*0.5, borderTopLeftRadius: 17, borderTopRightRadius: 17 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', margin: 15 }}>
                <Text style={{ textAlign: 'center', fontFamily: 'RobotoMono-Bold' }}>Select a Duration (in seconds) after which your messages will disappear.</Text>
            </View>
            <ScrollView>
            {
                availabeDurations.map((dur, index) => (

                    <ListItem
                    Component={TouchableScale}
                    friction={90} //
                    onPress={() => onDurationSelect(dur)}
                    key={index.toString()}
                    activeOpacity={0.1}
                    tension={50} // These props are passed to the parent component (here TouchableScale)
                    activeScale={0.95} //
                    containerStyle={{ backgroundColor: 'transparent' }}
                    // linearGradientProps={{
                    // colors: ['#FF9800', '#F44336'],
                    // start: [1, 0],
                    // end: [0.2, 0],
                    // }}
                    // ViewComponent={LinearGradient} // Only if no expo
                    leftAvatar={< MaterialCommunityIcons name="clock-outline" size={30}  />} 
                    rightIcon={ dur === timer_duration ? <MaterialCommunityIcons name="check" size={30} /> : null }
                    title={String(dur)}
                    titleStyle={{ color: 'black', fontFamily: 'RobotoMono-Regular', fontSize: 14 }}
                    //subtitle="Vice Chairman"
            />
                ))
            }
            </ScrollView>
        </View>
    )
}

export default TimerModal;