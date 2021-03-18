import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import {HIDE, SHOW} from "../action/MessageAction";
import {MessageState} from "../state/MessageState";

const initialMessageState: MessageState = {
  show: false
}

const messageReducer: Reducer<MessageState | null | undefined, PayloadAction<any>> =
    (state = initialMessageState, action: PayloadAction<any>) => {
      // The reducer normally looks at the action type field to decide what happens
      switch (action.type) {
        case SHOW:
          return {...state, message: action.payload, show: true}
        case HIDE:
          return {...state, message: action.payload, show: false};
        default:
          // If this reducer doesn't recognize the action type, or doesn't
          // care about this specific action, return the existing state unchanged
          return state;
      }
    }
export default messageReducer;
