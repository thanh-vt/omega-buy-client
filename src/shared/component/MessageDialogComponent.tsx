import React from "react";
import {Button, Modal} from "react-bootstrap";
import {FaSave} from "react-icons/fa";
import {Message} from "../model/Message";

interface MessageDialogState {
  show?: boolean;
  message?: Message;
  size?: 'sm' | 'md' | 'lg' | 'xl' | any;
  onClose?: (message: Message) => void;
}

class MessageDialogComponent extends React.Component<MessageDialogState, MessageDialogState> {

  constructor(props: Readonly<MessageDialogState> | MessageDialogState) {
    super(props);
    this.state = {
      show: false,
      message: {
        title: 'Default title',
        text: 'Default message',
        mode: 'dark'
      },
      size: 'md'
    }
  }

  static getDerivedStateFromProps(props: MessageDialogState, state: MessageDialogState): MessageDialogState {
    return {
      ...state,
      ...props
    }
  }

  show(message: Message): void {
    this.setState({
      show: true,
      ...message
    });
  }

  hide(): void {
    this.setState({
      show: false
    });
  }

  handleClose(): void {
    if (this.props.onClose) {
      this.props.onClose({
        title: this.state.message?.title,
        text: this.state.message?.text,
        mode: this.state.message?.mode
      });
    }
  }

  render() {
    return (
        <Modal show={this.state.show}
               contentClassName={this.state.message?.mode ? 'bg-dark text-light' : 'bg-light text-dark'}
               backdrop="static"
               size={this.state.size}
               onHide={() => {
                 this.handleClose()
               }}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.message?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.state.message?.text}</p>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="secondary" type="button" onClick={() => {
              this.hide(); this.handleClose();
            }}>
              <FaSave/> Ok
            </Button>
          </Modal.Footer>
        </Modal>
    );
  }
}

export default MessageDialogComponent;
