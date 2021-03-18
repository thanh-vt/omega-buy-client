import * as HttpClient from "../shared/service/HttpClient";
import {UserState} from "../state/UserState";
import {LOGIN, LOGIN_FAILED, LOGIN_SUCCESS, LOGOUT} from "../action/UserAction";
import {IAppContext} from "../context/AppContext";
import store from "../store/Store";
import {NAVIGATE} from "../action/RouteAction";

export async function loginEffect(dispatch: any, payload: string, remember: boolean, ctxObj: IAppContext): Promise<void> {
  if (ctxObj.setLoading) {
    ctxObj.setLoading(true);
  }
  dispatch({type: LOGIN});
  try {
    const headers = {
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: 'Basic ' + btoa(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`)
    };
    const response = await HttpClient.postReq<UserState>
    (`${process.env.REACT_APP_AUTH_ENDPOINT}/oauth/token`, payload, {}, headers);
    if (!remember) {
      delete response.data.refresh_token;
    }
    const token = JSON.stringify(response.data);
    localStorage.setItem('user_token', token);
    dispatch({type: LOGIN_SUCCESS, payload: response.data});
  } catch (e) {
    dispatch({type: LOGIN_FAILED, payload: e});
  } finally {
    if (ctxObj.setLoading) {
      ctxObj.setLoading(false);
    }
  }
}

export async function logoutEffect(dispatch: any, removeToken = true) {
  try {
    const userToken = JSON.parse(localStorage.getItem('user_token') || '{}');
    if (userToken.access_token && removeToken) {
      const response = await HttpClient
      .deleteReq<UserState>(`${process.env.REACT_APP_AUTH_ENDPOINT}/oauth/token/revoke/${userToken.access_token}`);
      console.log('Call api remove token successfully: ', response);
    }
  } catch (e) {
    console.error('Call api remove token failed!!', e);
  } finally {
    localStorage.removeItem('user_token');
    dispatch({type: LOGOUT});
    // window.history.pushState({}, '', '/login');
    store.dispatch({type: NAVIGATE, payload: '/login'});
  }
}
