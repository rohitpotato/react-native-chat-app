import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Image, Dimensions, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';

const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

const ProfileDrawer = props => {
  
    return (
        <View style={styles.container}>
           <Image source={{ uri: props.user.avatar }} 
                resizeMode="contain"
                style={{ width: 35, height: 35, borderRadius: 17.5 }}
            />
            <View style={styles.nameContainer}>
                <Text style={styles.name}>{props.user.name}</Text>
                <View>
                    <TouchableOpacity
                        onPress={props.onPress}
                    >
                       {props.loading ? <ActivityIndicator size="small" color="blue" animating/> : <Text style={{ color: 'white', fontSize: 12}}>Logout</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: ScreenHeight*0.02,
        flexDirection: 'row'
    },
    nameContainer: {
        margin: ScreenWidth*0.005,
        marginLeft: ScreenWidth*0.03
    },  
    name: {
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 1.25,
        color: 'white'
    }
})

const mapStateToProps = state => ({
    user: state.auth.user
});

export default connect(mapStateToProps)(ProfileDrawer)