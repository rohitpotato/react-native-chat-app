import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = props => {

    const {styles:redux, dimensions} = props.global;

    return (
        <View style={{...styles.container, height: dimensions.height*0.075}}>
            {/* leftIcon */}

            {props.leftIcon ? <View style={{...styles.leftIconContainer, marginLeft: dimensions.width*0.05}}>
                <Ionicons name="md-arrow-back" color="white" size={25} />           
            </View> : null}

            <View style={{...styles.headerContainer, marginLeft: dimensions.width*0.05}}>
                <Text style={props.headerTextStyle ? props.headerTextStyle : styles.headerText}>{props.titleText ? props.titleText : 'Application Title'}</Text>
            </View>

            <View styles={styles.rightIconsContaier}>
                
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
       // backgroundColor: 'red',
        alignItems: 'center',
    },
    leftIconContainer: {
        justifyContent: 'space-between',
        flex: 0.1,
    },
    headerContainer: {
        flex: 0.9,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerText: {
        color: 'black',
        fontSize: 25,
        letterSpacing: 1.5,
        fontFamily: 'RobotoMono-Regular',
    },
    rightIconsContaier: {
       // flex: 2
    }
})

const mapStateToProps = state => ({
    global: state.global,
    auth: state.auth
})

export default connect(mapStateToProps)(Header);