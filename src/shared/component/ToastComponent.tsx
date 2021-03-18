import React from "react";
import {Overlay, Toast} from "react-bootstrap";

export enum ToastType {
  SUCCESS='success',
  ERROR='danger'
}

export class ToastElement {
  key: number;
  code: string;
  description: string;
  show: boolean;
  type: ToastType;

  constructor(code: string, description: string, toastType?: ToastType, key?: number) {
    this.key = 0;
    this.code = code;
    this.description = description;
    this.show = true;
    this.type = toastType ? toastType : ToastType.SUCCESS;
    this.key = key || -1;
  }
}

class ToastQueue {
  show: boolean;
  keySeq: number;
  arr: ToastElement[];

  constructor() {
    this.show = false;
    this.keySeq = 0;
    this.arr = [];
  }

  genSeq(): number {
    if (this.arr.length === 0) {
      this.keySeq = 0;
    } else {
      this.keySeq++;
    }
    return this.keySeq;
  }

  pushToQueue(e: ToastElement) {
    this.arr.unshift(e);
    this.show = this.arr.length !== 0;
  }

  removeFromQueue() {
    this.arr.pop();
    this.show = this.arr.length !== 0;
  }
}

class ToastComponent extends React.Component<any, any> {

  constructor(props: Readonly<any> | any) {
    super(props);
    this.state = {
      ...props,
      queue: new ToastQueue()
    }
  }

  push(code: string, desc: string, type?: ToastType) {
    let seqNextVal: number = this.state.queue.genSeq();
    const toast: ToastElement = new ToastElement(code, desc, type, seqNextVal)
    this.state.queue.pushToQueue(toast);
    this.forceUpdate();
    setTimeout((element, that) => {
      element.show = false;
      that.state.queue.removeFromQueue();
      this.forceUpdate();
    }, 3000, toast, this);
  }

  getTypeSpecific(type: ToastType): {style: string, title: string} {
    switch (type) {
      case ToastType.SUCCESS:
        return {style: 'success', title: 'Info'}
      case ToastType.ERROR:
        return {style: 'danger', title: 'Error'}
    }
  }

  renderBody(e: ToastElement) {
    if (e.code) {
      return (
          <div className="d-flex flex-column justify-content-center align-items-center" style={{minWidth: '20rem'}}>
            <div>{'Code: ' + e.code}</div>
            <div className="text-center">{'Description: ' + e.description}</div>
          </div>
      )
    } else {
      return (
          <div className="d-flex justify-content-center align-items-center" style={{minWidth: '20rem'}}>
            <div>{e.description}</div>
          </div>
      )
    }
  }

  render(): React.ReactNode {
    return (
        <React.Fragment>
          <Overlay target={null} show={this.state.queue.show} placement="top-end"
                   container={document.getElementById('root')}
          >
            {({ placement, arrowProps, show: _show, popper, ...props }) => (
                <div
                    {...props}
                    style={{
                      color: 'white',
                      zIndex: 3000,
                      ...props.style,
                      position: 'relative',
                      width: '20rem',
                      height: '5rem',
                    }}
                >
                  <div
                      style={{
                        position: 'absolute',
                        top: '2rem',
                        right: '2rem',
                      }}
                  >
                    {
                      this.state.queue.arr.map((e: ToastElement) => (
                          <Toast className={'bg-' + this.getTypeSpecific(e.type).style}
                                 show={e.show} key={e.key} animation={true}>
                            <Toast.Header style={{
                              backgroundColor: 'rgba(255,255,255,.01)',
                              background: 'linear-gradient(1deg, #00000040, #00000040)'}}
                                          closeButton={false}>
                              <strong className="mr-auto text-light">{this.getTypeSpecific(e.type).title}</strong>
                            </Toast.Header>
                            <Toast.Body>
                              {this.renderBody(e)}
                            </Toast.Body>
                          </Toast>
                      ))
                    }
                  </div>
                  {/*<div className="w-100 h-100 d-flex flex-column justify-content-end align-items-start">*/}
                  {/*  */}
                  {/*</div>*/}
                </div>
            )}
          </Overlay>
        </React.Fragment>
    );
  }
}

export default ToastComponent;
