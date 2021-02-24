import { SET_OUTCOME, REMOVE_OUTCOME } from './types';
import {v4 as uuid} from "uuid"; 

export const setOutcome = (msg, outcomeType, timeout = 5000) => dispatch =>  {
    const id = uuid();
    dispatch({
        type: SET_OUTCOME,
        payload: { msg, outcomeType, id}
    });

    setTimeout(() => dispatch({ type: REMOVE_OUTCOME, payload: id}), timeout);


}