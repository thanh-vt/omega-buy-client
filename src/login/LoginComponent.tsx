import React from "react";
import {withTranslation} from "react-i18next";
import {Button, Form} from "react-bootstrap";
import {connect} from "react-redux";
import {AppState} from "../state/AppState";
import {loginEffect} from "../effect/UserEffect";
import AppContext, {IAppContext} from "../context/AppContext";

class LoginComponent extends React.Component<any, any> {

  handleSubmit(event: any, ctx: IAppContext): void {
    let form = event.target
    const formVal: string =
        'username=' + form.elements.username.value + '&' +
        'password=' + form.elements.password.value + '&' +
        'grant_type=' + form.elements.grant_type.value
    ;
    this.props.login(formVal, form.elements.remember.checked, ctx);
  }

  render(): React.ReactNode {
    return (
        <AppContext.Consumer>
          {(ctxObj: IAppContext) => {
            let textColor = this.props.theme?.text ? this.props.theme?.text : 'text-light';
            let backgroundColor = this.props.theme?.text ? this.props.theme?.background : 'bg-dark';
            return (
                <div className={'d-flex justify-content-center ' + backgroundColor}>
                  <Form className="col-4"
                        onSubmit={(e: any) => {
                          e.preventDefault();
                          this.handleSubmit(e, ctxObj)
                        }}>
                    <Form.Group controlId="username">
                      <Form.Label className={textColor}>{this.props.t('label.username')}</Form.Label>
                      <Form.Control type="text" name="username" placeholder={this.props.t('placeholder.username')}/>
                      <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="password">
                      <Form.Label className={textColor}>{this.props.t('label.password')}</Form.Label>
                      <Form.Control type="password" name="password" placeholder={this.props.t('placeholder.password')}/>
                    </Form.Group>
                    <Form.Group controlId="remember">
                      <Form.Check className={textColor} type="checkbox"
                                  name="remember" label={this.props.t('label.remember')}/>
                    </Form.Group>
                    <Form.Group controlId="grant_type">
                      <Form.Control type="hidden" name="grant_type" value="password"/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      {this.props.t('button.login')}
                    </Button>
                  </Form>
                </div>
            )
          }}
        </AppContext.Consumer>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    theme: state.theme
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    login: (payload: any, remember: boolean, ctxObj: IAppContext) => {
      loginEffect(dispatch, payload, remember, ctxObj)
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(LoginComponent));
