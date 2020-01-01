import * as actionTypes from './types';

export const setUser = (data) => {
    return {
        type: actionTypes.SET_USER,
        payload: data
    }
}

export const clearUser = () => {
    return {
        type: actionTypes.CLEAR_USER,
        payload: null
    }
}

export const setProfile = (data) => {
    return {
        type: actionTypes.SET_PROFILE,
        payload: data
    }
}