import { combineReducers } from 'redux';
import authReducer from './authReducer';
import globalReducer from './globalReducer';
import channelReducer from './channelReducer';
import profileReducer from './profileReducer';

export const rootReducer = combineReducers({
    auth: authReducer,
    global: globalReducer,
    channel: channelReducer,
    profile: profileReducer
})