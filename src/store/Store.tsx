import {createStore} from "redux";
import appReducer from "../reducer/Reducer";
import {devToolsEnhancer} from "redux-devtools-extension";

const store = createStore(appReducer, devToolsEnhancer({}));

export default store;
