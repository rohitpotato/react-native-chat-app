import React from 'react';
import {View, Text} from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from  'react-navigation-tabs';

import Settings from '../src/screens/Settings';
import Profile from '../src/screens/Profile/Profile';
import CustomDrawer from '../src/components/CustomDrawer';
import AuthLoading from '../src/screens/AuthLoading';

import AuthScreen from './screens/Auth/AuthScreen';
import Login from './screens/Auth/Login';
import Register from './screens/Auth/Register';

import Home from '../src/screens/Home';
import ChatWindow from './screens/Chat/ChatWindow';
import AddChannel from './screens/AddChannel';

const ChatStack = createStackNavigator(
    {
        Home: {
            screen: Home
        },
        ChatWindow: {
            screen: ChatWindow
        },
        Channel: {
            screen: AddChannel
        }
    },
    {
        initialRouteName: 'Home'
    }
)


const DrawerNavigator = createDrawerNavigator(
    {   
        Home: {
            navigationOptions: {
                drawerLabel: 'Home',
            },
            screen: ChatStack
        },

        Settings: {
            navigationOptions: {
                drawerLabel: 'Settings'
            },
            screen: Settings
        },
        Profile: {
            navigationOptions: {
                drawerLabel: 'Profile'
            },
            screen: Profile
        }
    },
    {
        contentComponent: CustomDrawer   
    }
)


const AuthStack = createStackNavigator(
    {
        AuthScreen: {
            screen: AuthScreen,
            navigationOptions: {
                header: null
            }
        },
        Login: {
            screen: Login
        },
        Register: {
            screen: Register
        },
    }, 
    {
        initialRouteName: 'AuthScreen'
    }
)

const Router = createAppContainer(
    createSwitchNavigator(
        {   
            AuthLoading: AuthLoading,
            Drawer: DrawerNavigator,
            AuthStack: AuthStack
        },
        {
            initialRouteName: 'AuthLoading'
        }
    )
)

export default Router;