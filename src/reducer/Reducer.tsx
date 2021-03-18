import {combineReducers, PayloadAction} from "@reduxjs/toolkit";
import {AppState} from "../state/AppState";
import userReducer from "./UserReducer";
import messageReducer from "./MessageReducer";
import routeReducer from "./RouteReducer";

const appReducer = combineReducers<AppState, PayloadAction<any>>(
    {user: userReducer, message: messageReducer, route: routeReducer});

export default appReducer;
