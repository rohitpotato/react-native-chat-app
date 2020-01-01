import * as actionTypes from '../actions/types';

const initialState = {
    user: null,
}

export default authReducer = (state = initialState, action) => {
    switch(action.type) {
        
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.payload
            }
        case actionTypes.CLEAR_USER:
            return {
                ...state,
                user: action.payload
            }
        default:
            return state;
    }
}