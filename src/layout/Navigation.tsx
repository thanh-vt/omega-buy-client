import React, {ReactNode} from "react";
import {Button, DropdownButton, Form, FormControl, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import {withTranslation} from "react-i18next";
import { Dropdown } from "react-bootstrap";
import {AppState} from "../state/AppState";
import {connect} from "react-redux";
import {logoutEffect} from "../effect/UserEffect";

class Navigation extends React.Component<any, any> {

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
    if (this.props.route && prevProps.route !== this.props.route) {
      console.log('navigate to', this.props.route);
      this.props.history.push(this.props.route)
    }
  }

  componentWillMount(): void {
    const lang = navigator.language;
    switch (lang) {
      case 'vi-VN':
        this.props.i18n.changeLanguage('vi');
        break;
      default:
        this.props.i18n.changeLanguage('en');
    }
  }

  handleLogout(event: React.MouseEvent<this>) {
    event.preventDefault();
    this.props.logout();
  }

  changeLanguage(lang: string) {
    this.props.i18n.changeLanguage(lang);
  }

  renderLogin() {
    if (this.props.username) {
      return (
          <NavDropdown title={
            <div className="pull-left d-inline-block">
              <img className="thumbnail-image d-inline-block mr-1"
                   src={this.props.avatarUrl} width={40} height={40}
                   alt="user pic"
              />
              <span className="d-inline-block">{this.props.username}</span>
          </div>} id="basic-nav-dropdown" className="h4" >
            <NavDropdown.Item as={Link} to="/manufacturer">{this.props.t('button.profile')}</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/about">{this.props.t('button.setting')}</NavDropdown.Item>
            <NavDropdown.Divider/>
            {/* eslint-disable-next-line no-script-url */}
            <NavDropdown.Item onClick={(e) => this.handleLogout(e)}>
              {this.props.t('button.logout')}</NavDropdown.Item>
          </NavDropdown>
      )
    } else {
      return (<Button as={Link} to={"/login"} >{this.props.t('button.login')}</Button>)
    }
  }

  render(): React.ReactNode {
    return (
        <Navbar className="bg-dark navbar-dark" style={{filter: "brightness(90%)"}} expand="lg">
          <Navbar.Brand href="#home">
            <img src={window.location.origin + '/image/omega_buy_dark_rectangle.png'}
                 style={{marginLeft: 20}} width={120} height={44} alt=""/>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link className={(this.props.location.pathname?.startsWith('/home')) ? 'active': ''}
                        as={Link} to={"/home"}><h4>{this.props.t('title.home')}</h4></Nav.Link>
              <Nav.Link className={(this.props.location.pathname?.startsWith('/about')) ? 'active': ''}
                        as={Link} to={"/about"}><h4>About</h4></Nav.Link>
              <NavDropdown title={this.props.t('title.management')} id="basic-nav-dropdown" className="h4">
                <NavDropdown.Item as={Link} to="/manufacturer">{this.props.t('title.manufacturer')}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/product">{this.props.t('title.product')}</NavDropdown.Item>
                <NavDropdown.Item>Something</NavDropdown.Item>
                <NavDropdown.Divider/>
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            {this.renderLogin()}
            <DropdownButton id="dropdown-basic-button" title={this.props.t('button.language')} className="mx-2">
              <Dropdown.Item onClick={() => {this.changeLanguage('vi')}}>
                {this.props.t('language.vi')}</Dropdown.Item>
              <Dropdown.Item onClick={() => {this.changeLanguage('en')}}>
                {this.props.t('language.en')}</Dropdown.Item>
            </DropdownButton>
            <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
              <Button variant="outline-success" onClick={() => {console.log(this.props.location.pathname);}}>Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    username: state?.user?.user_name,
    avatarUrl: state?.user?.profile?.avatarUrl,
    route: state?.route?.navigate
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    logout: () => logoutEffect(dispatch)
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation('common') (Navigation)));
