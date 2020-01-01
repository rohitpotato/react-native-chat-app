import * as actionTypes from '../actions/types';

const initialState = {
   currentProfile: {}
}

export default profileReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_PROFILE: 
            return {
                ...state,
                currentProfile: action.payload 
            }
        default: 
            return state;
    }
}