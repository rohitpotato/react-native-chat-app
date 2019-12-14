import * as actionTypes from '../actions/types';

export const setChannel = (data) => {
    return  {
        type: actionTypes.SET_CURRENT_CHANNEL,
        payload: data
    }
}

export const setPrivateChannel = (data) => {
    return {
        type: actionTypes.SET_PRIVATE_CHANNEL,
        payload: data
    }
}   