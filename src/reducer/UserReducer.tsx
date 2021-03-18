import {PayloadAction} from "@reduxjs/toolkit";
import {LOGIN, LOGIN_FAILED, LOGIN_SUCCESS, LOGOUT, REFRESH} from "../action/UserAction";
import {UserState} from "../state/UserState";
import {Reducer} from "react";

const initialUserState: UserState | null | undefined = (localStorage.getItem('user_token') ?
    JSON.parse(localStorage.getItem('user_token') as string) : null);

const userReducer: Reducer<UserState | null | undefined, PayloadAction<any>> =
    (state = initialUserState, action: PayloadAction<any>) => {
  // The reducer normally looks at the action type field to decide what happens
  switch (action.type) {
    case LOGIN:
      return state;
    case LOGIN_SUCCESS:
      return {...state, ...action.payload};
      // Do something here based on the different types of actions
    case LOGIN_FAILED:
      return state;
    case LOGOUT:
      return null;
    case REFRESH:
      return {...state, ...action.payload};
    default:
      // If this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state;
  }
}

export default userReducer;
