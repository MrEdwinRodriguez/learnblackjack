import {SET_OUTCOME, REMOVE_OUTCOME } from "../actions/types";
const initialState = [];

export default function (state=initialState, action) {
    const { type, payload } = action;
    console.log(action)
    switch(type) {
        case SET_OUTCOME:
            return [...state, payload];
        case REMOVE_OUTCOME:
            return state.filter(outcome => outcome.id !== payload);
        default: 
            return state;

    }

}