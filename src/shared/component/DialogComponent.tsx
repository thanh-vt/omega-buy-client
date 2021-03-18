import React from "react";
import {Modal} from "react-bootstrap";

export interface DialogConfig {
  show?: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | any;
  mode?: 'light' | 'dark';
  type?: React.ElementType | undefined;
  data?: any;
  onAction?: (data?: any) => void;
}

class DialogComponent extends React.Component<DialogConfig, DialogConfig> {

  constructor(props: Readonly<any> | any) {
    super(props);
    this.state = {
      show: false,
      title: 'Default Title',
      mode: 'light',
      size: 'sm',
      ...props
    }
  }

  componentDidMount(): void {
    if (this.props) {
      this.setState({...this.state, ...this.props});
    }
  }

  static getDerivedStateFromProps(props: any, state: any) {
    return {
      ...state,
      ...props
    }
  }

  show(data?: any): void {
    this.setState({
      show: true,
      ...data
    });
  }

  hide(): void {
    this.setState({
      show: false
    })
  }

  handleAction(data?: any) {
    if (this.state.onAction) {
      this.state.onAction(data);
    }
  }

  renderBody() {
    if (this.state.type) {
      return <Modal.Body onAction={(e: any) => this.handleAction(e)}
                         as={this.state.type} data={this.state.data}/>;
    } else {
      return 'No Content';
    }
  }

  render(): React.ReactNode {
    return (
        <Modal show={this.state.show}
               contentClassName={this.state.mode === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}
               backdrop="static"
               size={this.state.size}
               onHide={() => this.hide()}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.children}
            {/*{this.renderBody()}*/}
          </Modal.Body>
        </Modal>
    );
  }
}

export default DialogComponent;
