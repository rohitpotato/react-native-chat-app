import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import {connect} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomTextInput = props => {
    return (
        <View style={props.container ? { width: props.global.dimensions.width/1.1, ...styles.container, ...props.container} : {  ...styles.container,  }}>
            {props.icon ? <View style={props.iconContainer ? props.iconContainer : { justifyContent: 'center', marginLeft: 10, }}>
                {props.icon ? (props.icon()) : <MaterialIcons name="person" size={25} /> }
            </View> : null}
            <View style={{  }}>
                <TextInput
                    style={{...props.textInputStyle, width: props.global.dimensions.width/1.5, fontFamily: 'RobotoMono-Regular' }} 
                    placeholder={props.placeholder}
                    {...props}
                />
            </View>
            {props.clear && props.value.length>0 &&
            <View style={{ justifyContent: 'center', padding: 10 }}>
                <TouchableOpacity onPress={props.handleClear}>
                    {props.clearIcon ? props.clearIcon() : <MaterialIcons color="white" name="clear" size={18} />}
                </TouchableOpacity>
            </View>}
            {props.show && props.value.length>0 &&
            <View style={{ justifyContent: 'center', padding: 10 }}>
                <TouchableOpacity onPress={props.handleShowPassword}>
                    {props.showPasswordIcon ? props.showPasswordIcon() : <MaterialIcons name="remove-red-eye" color="white" size={18} />}
                </TouchableOpacity>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        marginBottom: 10, 
        borderTopColor: 'black', 
        borderBottomWidth: 0.3,
    }
})

const mapStateToProps = state => ({
    global: state.global
})

export default  connect(mapStateToProps)(CustomTextInput);