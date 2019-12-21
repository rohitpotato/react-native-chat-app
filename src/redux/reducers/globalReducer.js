import * as actionTypes from '../actions/types';
import { Dimensions } from 'react-native';

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

const initialState = {
    appTheme: 'dark',
    styles: {
        container: {
            colors: ['#363940', '#363940'],
            //backgroundColor: 'black',
            flex: 1
        },
        text: {
            color: 'green',
            fontFamily: 'RobotoMono-Regular'
        }
    },
    dimensions: {
        height,
        width
    }
}

export default globalReducer = (state = initialState, action) => {
    switch(action.type) {
        
        default:
            return state;
    }
}