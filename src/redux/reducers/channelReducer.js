import * as actionTypes from '../actions/types';

const initialState = {
    currentChannel: {},
    isPrivate: false
}

export default channelReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_CURRENT_CHANNEL: 
            return {
                ...state,
                currentChannel: action.payload 
            }
        case actionTypes.SET_PRIVATE_CHANNEL: 
            return {
                ...state,
                isPrivate: action.payload
            }
        default: 
            return state;
    }
}