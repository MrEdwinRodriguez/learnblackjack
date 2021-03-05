import axios from 'axios';
import { setAlert } from './alert';

import { GET_PROFILE, PROFILE_ERROR} from './types';

//get current user's profiles
export const getCurrentProfile = () => async dispatch => {

    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, 
                status: error.response.status
            }
        })
    }
}

export const updateMoney = (newTotal) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        console.log('line 32', newTotal.money)
        const body = JSON.stringify({money: newTotal.money})
        const res = await axios.post('/api/profile/money', body, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, 
                status: error.response.status
            }
        }) 
    }

};
