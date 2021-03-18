import React, {ComponentType} from "react";
import { Redirect, Route, withRouter } from "react-router-dom";
import {connect} from "react-redux";
import {AppState} from "../../state/AppState";

// @ts-ignore
const PrivateRoute = ({ component: Component, path, user, ...rest }) => (
    <Route {...rest} render={(props) => {
      if (path === '/login') {
        if (user) {
          return (<Redirect to='/home' />);
        } else {
          return (<Component {...props} />);
        }
      }
      if (user) {
        return (<Component {...props} />);
      } else {
        return (<Redirect to='/login' />);
      }
    }} />
)

const mapStateToProps = (state: AppState) => {
  return {
    user: state.user
  };
}

export default withRouter<any, ComponentType<any>>(
    connect<any, any>(mapStateToProps, null)(PrivateRoute));
