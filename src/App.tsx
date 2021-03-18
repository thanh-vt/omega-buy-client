import React, {RefObject} from 'react';
import './App.css';
import {HashRouter, Route, Switch} from "react-router-dom";
import Routing from "./layout/Navigation";
import ManufacturerComponent from "./manufacturer/ManufacturerComponent";
import AppContext, {IAppContext} from "./context/AppContext";
import ManufacturerService from "./manufacturer/ManufacturerService";
import LoadingScreen from "./shared/component/LoadingScreen";
import ToastComponent, {ToastType} from "./shared/component/ToastComponent";
import {withTranslation} from 'react-i18next';
import Home from "./Home";
import About from "./About";
import LoginComponent from "./login/LoginComponent";
import {connect} from "react-redux";
import PrivateRoute from "./shared/component/PrivateRoute";
import ProductService from "./product/ProductService";
import ProductComponent from "./product/ProductComponent";
import MessageDialogComponent from "./shared/component/MessageDialogComponent";
import {AppState} from "./state/AppState";
import {HIDE} from "./action/MessageAction";

class App extends React.Component<any, IAppContext> {

  toastRef: RefObject<ToastComponent> = React.createRef<ToastComponent>();
  messageDialogRef: RefObject<MessageDialogComponent> = React.createRef<MessageDialogComponent>();

  constructor(props: Readonly<any> | any) {
    super(props);
    this.state = {
      manufacturerService: new ManufacturerService(),
      productService: new ProductService(),
      loading: false,
      setLoading: (val: boolean) => {
        this.setState({
          loading: val
        })
      },
      showToast: (code: string, desc: string, type?: ToastType) => {
        if (this.toastRef.current) {
          this.toastRef.current.push(code, desc, type);
        }
      }
    }
  }

  render(): React.ReactNode {
    return (
        <AppContext.Provider value={this.state}>
          <AppContext.Consumer>
            {
              (ctxObj: IAppContext) => {
                this.context = ctxObj;
                return (
                    <HashRouter>
                      <div className="bg-dark h-100" style={{overflowY: 'scroll'}}>
                        <ToastComponent ref={this.toastRef}/>
                        <MessageDialogComponent ref={this.messageDialogRef} show={this.props.messageState?.show}
                                                message={this.props.messageState?.message}
                                                onClose={e => {this.props.dispatch({type: HIDE, payload: e})}}/>
                        <LoadingScreen show={ctxObj.loading || false}/>
                        <Routing/>
                        <div className="container-sm pt-2">
                          <Switch>
                            <Route path="/home" exact component={Home}/>
                            <Route path="/about" exact component={About}/>
                            <PrivateRoute path="/manufacturer" exact component={ManufacturerComponent}/>
                            <PrivateRoute path="/product" exact component={ProductComponent}/>
                            <PrivateRoute path="/login" exact component={LoginComponent}/>
                          </Switch>
                        </div>
                      </div>
                    </HashRouter>
                )
              }
            }
          </AppContext.Consumer>
        </AppContext.Provider>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    messageState: state?.message
  };
}

export default connect(mapStateToProps, null) (withTranslation('common')(App));
