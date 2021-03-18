import React from "react";
import {Button, Modal} from "react-bootstrap";
import {FaSave} from "react-icons/fa";

export interface ConfirmDialogConfig {
  mode: 'dark' | 'light'
  show?: boolean;
  title?: string;
  text?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | any;
  onAction?: (val: boolean, data: any) => void;
  data?: any;
  saveButton?: string;
  cancelButton?: string;
}

class ConfirmDialogComponent extends React.Component<ConfirmDialogConfig, ConfirmDialogConfig>{

  constructor(props: Readonly<ConfirmDialogConfig> | ConfirmDialogConfig) {
    super(props);
    this.state = {
      mode: 'light',
      show: false,
      title: 'Confirm',
      text: 'Default message',
      size: 'md',
      saveButton: 'Save',
      cancelButton: 'Cancel'
    }
  }

  static getDerivedStateFromProps(props: any, state: any) {
    return {
      ...state,
      ...props
    }
  }

  show(data: any): void {
    this.setState({
      show: true,
      data: data
    })
  }

  hide(): void {
    this.setState({
      show: false
    })
  }

  handleAction(val: boolean) {
    if (this.props.onAction) {
      this.props.onAction(val, this.state.data);
    }
    this.hide();
  }

  render(): React.ReactNode {
    return (
        <Modal show={this.state.show}
               contentClassName={this.state.mode === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}
               backdrop="static"
               size={this.state.size}
               onHide={() => this.handleAction(false)}>
          <Modal.Header closeButton >
            <Modal.Title>{this.state.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.state.text}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" type="button" onClick={() => this.handleAction(false)}>
              <FaSave /> {this.state.cancelButton}
            </Button>
            <Button variant="primary" type="button" onClick={() => this.handleAction(true)}>
              <FaSave /> {this.state.saveButton}
            </Button>
          </Modal.Footer>
        </Modal>
    )
  }
}

export default ConfirmDialogComponent;
