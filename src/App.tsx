import React, {RefObject} from 'react';
import './App.css';
import {HashRouter, Route, Switch} from "react-router-dom";
import Navigation from "./layout/Navigation";
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
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Form,
  FormControl,
  Navbar
} from "react-bootstrap";

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

  changeLanguage(lang: string) {
    this.props.i18n.changeLanguage(lang);
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
                        <div className="row h-100 mr-0">
                          <div className="col-md-2">
                            <Navigation/>
                          </div>
                          <div className="col-md-10">
                            <Navbar className="d-flex justify-content-end">
                              <Form inline>
                                <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
                                <Button variant="outline-success" onClick={() => {console.log(this.props.location.pathname);}}>Search</Button>
                              </Form>
                              {['up'].map((direction) => (
                                  <DropdownButton title={this.props.t('button.language')}
                                                  className="mx-2" as={ButtonGroup}
                                                  key={direction}
                                                  drop={direction as 'up' | 'down' | 'left' | 'right'}
                                                  variant="secondary"
                                  >
                                    <Dropdown.Item onClick={() => {
                                      this.changeLanguage('vi')
                                    }}>
                                      {this.props.t('language.vi')}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => {
                                      this.changeLanguage('en')
                                    }}>
                                      {this.props.t('language.en')}</Dropdown.Item>
                                  </DropdownButton>
                              ))}
                            </Navbar>
                            <Switch>
                              <Route path="/home" exact component={Home}/>
                              <Route path="/about" exact component={About}/>
                              <PrivateRoute path="/manufacturer" exact component={ManufacturerComponent}/>
                              <PrivateRoute path="/product" exact component={ProductComponent}/>
                              <PrivateRoute path="/login" exact component={LoginComponent}/>
                            </Switch>
                          </div>
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
