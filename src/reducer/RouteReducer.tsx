import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import {RouteState} from "../state/RouteState";
import {NAVIGATE} from "../action/RouteAction";

const initialRouteState: RouteState = {};

const routeReducer: Reducer<RouteState | null | undefined, PayloadAction<any>> =
    (state = initialRouteState, action: PayloadAction<any>) => {
      // The reducer normally looks at the action type field to decide what happens
      switch (action.type) {
        case NAVIGATE:
          return {navigate: action.payload}
        default:
          // If this reducer doesn't recognize the action type, or doesn't
          // care about this specific action, return the existing state unchanged
          return state;
      }
    }
export default routeReducer;
