import React from "react";
import {Overlay, Spinner} from "react-bootstrap";

class LoadingScreen extends React.Component<{ show: boolean }, any>{

  constructor(props: Readonly<any> | any) {
    super(props);
    this.state = {
      target: React.createRef<any>()
    }
  }

  render(): React.ReactNode {
    return (
        <React.Fragment>
          <Overlay target={null} show={this.props.show} container={document.getElementById('root')}
                   >
            {({ placement, arrowProps, show: _show, popper, ...props }) => (
                <div
                    {...props}
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.70)',
                      color: 'white',
                      zIndex: 2000,
                      ...props.style,
                      position: 'relative',
                      marginTop: 0,
                      height: '100%',
                    }}
                >
                  <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                    <Spinner animation="grow" size="sm" variant="primary" className="mx-2"/>
                    <Spinner animation="grow" size="sm" variant="secondary" className="mx-2"/>
                    <Spinner animation="grow" size="sm" variant="success" className="mx-2"/>
                    <Spinner animation="grow" size="sm" variant="danger" className="mx-2"/>
                    <Spinner animation="grow" size="sm" variant="warning" className="mx-2"/>
                    <Spinner animation="grow" size="sm" variant="info" className="mx-2"/>
                    <Spinner animation="grow" size="sm" variant="light" className="mx-2"/>
                    <Spinner animation="grow" size="sm" variant="dark" className="mx-2"/>
                  </div>
                </div>
            )}
          </Overlay>
        </React.Fragment>
    );
  }
}

export default LoadingScreen;
