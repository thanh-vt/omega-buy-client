import axios, {AxiosResponse} from "axios";
import store from "../../store/Store";
import {UserState} from "../../state/UserState";
import {REFRESH} from "../../action/UserAction";
import {logoutEffect} from "../../effect/UserEffect";
import {SHOW} from "../../action/MessageAction";
import {Message} from "../model/Message";
import i18next from "../../index";

function createSessionExpirationMsg(): Message {
  return { title: i18next.t('common:notification.sessionExpired.title'), mode: 'dark',
    text: i18next.t('common:notification.sessionExpired.message') }
}

async function refresh(refreshToken: string, originalRequest: any): Promise<any> {
  try {
    const headers = {
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: 'Basic ' + btoa(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`)
    };
    const body = `grant_type=refresh_token&refresh_token=${refreshToken}`
    const response: AxiosResponse<UserState> = await axios.post<UserState>(`${process.env.REACT_APP_AUTH_ENDPOINT}/oauth/token`,
        body, {headers: headers});
    console.log('Call api refresh token successfully: ', response, refreshToken);
    localStorage.setItem('user_token', JSON.stringify(response.data));
    store.dispatch({type: REFRESH, payload: response.data});
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;
    originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access_token;
    return axios(originalRequest);
  } catch (e) {
    console.error('Call api refresh token failed!!', refreshToken, e);
    const msg: Message = createSessionExpirationMsg();
    store.dispatch({type: SHOW, payload: msg})
    await logoutEffect(store.dispatch, false);
    return Promise.reject(e);
  }
}

axios.interceptors.request.use(request => {
  const userToken: UserState = JSON.parse(localStorage.getItem('user_token') || '{}');
  if (request.url?.startsWith(`${process.env.REACT_APP_API_ENDPOINT}/api`) &&
      userToken.access_token) {
    request.headers['Authorization'] = 'Bearer ' + userToken.access_token;
  }
  return request;
});

axios.interceptors.response.use(response => {
  return response;
}, error => {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {

    originalRequest._retry = true;

    const userToken: UserState = JSON.parse(localStorage.getItem('user_token') || '{}');
    if (userToken.refresh_token) {
      return refresh(userToken.refresh_token, originalRequest);
    } else {
      const msg: Message = createSessionExpirationMsg();
      store.dispatch({type: SHOW, payload: msg})
      logoutEffect(store.dispatch, false).finally(() => {});
      return Promise.reject(error);
    }
  }
  return Promise.reject(error);
})

function getReq<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
  return axios.get<T, AxiosResponse<T>>(url, {
    params: params,
    headers: {'Content-Type': 'application/json'}
  });
}

function postReq<T>(url: string, body: any, params?: any, headers?: any): Promise<AxiosResponse<T>> {
  const customHeaders = {'Content-Type': 'application/json', ...headers};
  return axios.post<T, AxiosResponse<T>>(url, body, {params: params, headers: customHeaders});
}

function putReq<T>(url: string, body: any, params?: any): Promise<AxiosResponse<T>> {
  return axios.put<T, AxiosResponse<T>>(url, body, {
    params: params,
    headers: {'Content-Type': 'application/json'}
  });
}

function patchReq<T>(url: string, body: any, params?: any): Promise<AxiosResponse<T>> {
  return axios.patch<T, AxiosResponse<T>>(url, body, {
    params: params,
    headers: {'Content-Type': 'application/json'}
  });
}

function deleteReq<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
  return axios.delete<T, AxiosResponse<T>>(url, {
    params: params,
    headers: {'Content-Type': 'application/json'}
  });
}

export {getReq, postReq, putReq, patchReq, deleteReq};




