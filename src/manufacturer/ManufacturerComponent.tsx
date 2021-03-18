import React, {RefObject} from "react";
import {Button, Table} from "react-bootstrap";
import AppContext, {IAppContext} from "../context/AppContext";
import {Manufacturer} from "../shared/model/Manufacturer";
import ManufacturerDetailComponent from "./ManufacturerDetailComponent";
import DialogComponent from "../shared/component/DialogComponent";
import {BsFillTrashFill, BsPencilSquare, FaPlusCircle} from "react-icons/all";
import ApiUtil from "../shared/util/ApiUtil";
import {ToastType} from "../shared/component/ToastComponent";
import ConfirmDialogComponent from "../shared/component/ConfirmDialogComponent";
import { withTranslation } from "react-i18next";

export interface ManufacturerDetailData {
  mode: 0 | 1;
  manufacturer: Manufacturer;
}

interface ManufacturerComponentState {
  manufacturerList: Manufacturer[],
  manufacturerDetailData: ManufacturerDetailData;
  toastOverlay?: RefObject<any>
}

class ManufacturerComponent extends React.Component<any, ManufacturerComponentState> {

  detailDialog: RefObject<DialogComponent>;
  confirmDialog: RefObject<ConfirmDialogComponent>

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      manufacturerList: [],
      manufacturerDetailData: {
        mode: 0,
        manufacturer: {code: '', name: '', description: ''}}
    };
    this.detailDialog = React.createRef<DialogComponent>();
    this.confirmDialog = React.createRef<ConfirmDialogComponent>();
  }

  async loadDetail(id: any): Promise<void> {
    this.context.setLoading(true);
    try {
      let response = await this.context.manufacturerService.getManufacturerDetail(id);
      this.setState({
        manufacturerDetailData: {mode: 1, manufacturer: response.data}
      });
      this.openDetailDialog(this.props.t('title.update'));
    } catch (error) {
      ApiUtil.handleError(error);
    } finally {
      this.context.setLoading(false);
    }
  }

  async loadData(): Promise<void> {
    this.context.setLoading(true);
    try {
      let response = await this.context.manufacturerService.getManufacturerList();
      this.setState({
        manufacturerList: response.data
      });
    } catch (error) {
      ApiUtil.handleError(error);
    } finally {
      this.context.setLoading(false);
    }
  }

  async componentDidMount(): Promise<void> {
    await this.loadData();
  }

  openDetailDialog(title: string): void {
    this.detailDialog.current?.show({title: title});
  }

  closeDetailDialog(): void {
    this.detailDialog.current?.hide();
  }

  async createOrUpdateManufacturer(manufacturerDetailData: ManufacturerDetailData): Promise<void> {
    this.context.setLoading(true);
    try {
      if (manufacturerDetailData.mode === 1) {
        await this.context.manufacturerService
        .updateManufacturer(manufacturerDetailData.manufacturer);
      } else {
        await this.context.manufacturerService
        .createManufacturer(manufacturerDetailData.manufacturer);
      }
      this.context.showToast('', 'Success', ToastType.SUCCESS);
      this.closeDetailDialog();
      await this.loadData();
    } catch (error) {
      let err = ApiUtil.handleError(error);
      this.context.showToast(err.code, err.description, ToastType.ERROR);
    } finally {
      this.context.setLoading(false);
    }
  }

  openDeleteDialog(id: any) {
    this.confirmDialog.current?.show(id);
  }

  hideDeleteDialog() {
    this.confirmDialog.current?.hide();
  }

  async deleteManufacturer(val: boolean, id: any) {
    if (val) {
      this.context.setLoading(true);
      try {
        await this.context.manufacturerService
        .deleteManufacturer(id);
        this.hideDeleteDialog();
      } catch (error) {
        let err = ApiUtil.handleError(error);
        this.context.showToast(err.code, err.description, ToastType.ERROR);
      } finally {
        this.context.setLoading(false);
      }
    }
  }

  render(): React.ReactNode {
    return (
        <AppContext.Consumer>
          {(ctxObj: IAppContext) => {
            this.context = ctxObj;
            return (
                <React.Fragment>
                  <div className="w-100 d-flex justify-content-end">
                    <Button variant="primary m-1" onClick={() => this.openDetailDialog(this.props.t('title.create'))}>
                      <FaPlusCircle/> {this.props.t('common:button.create')}
                    </Button>
                  </div>
                  <ConfirmDialogComponent mode={'dark'} ref={this.confirmDialog}
                                          title={this.props.t('common:title.confirm')}
                                          text={this.props.t('message.confirm.delete')}
                                          saveButton={this.props.t('common:button.save')}
                                          cancelButton={this.props.t('common:button.cancel')}
                                          onAction={(val, data) => this.deleteManufacturer(val, data)} />
                  <DialogComponent
                      ref={this.detailDialog}
                      size={'lg'}
                      mode={'dark'}>
                    <ManufacturerDetailComponent {...this.state.manufacturerDetailData}
                                                 onSave={(e: ManufacturerDetailData) => this.createOrUpdateManufacturer(e)} />
                  </DialogComponent>
                  <Table className="table-dark" striped bordered hover>
                    <thead>
                    <tr>
                      <th>#</th>
                      <th>{this.props.t('title.code')}</th>
                      <th>{this.props.t('title.name')}</th>
                      <th>{this.props.t('title.description')}</th>
                      <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      this.state.manufacturerList.map((manufacturer, index) => {
                        return (
                            <tr key={manufacturer.id}>
                              <td>{index + 1}</td>
                              <td>{manufacturer.code}</td>
                              <td>{manufacturer.name}</td>
                              <td>{manufacturer.description}</td>
                              <td className="d-flex justify-content-center align-items-center">
                                <Button variant={'warning'} size={'sm'} className="mx-1"
                                        onClick={() => this.loadDetail(manufacturer.id)}>
                                  <BsPencilSquare/>
                                </Button>
                                <Button variant={'danger'} size={'sm'} className="mx-1"
                                        onClick={() => this.openDeleteDialog(manufacturer.id)}>
                                  <BsFillTrashFill/>
                                </Button>
                              </td>
                            </tr>
                        )
                      })
                    }
                    </tbody>
                  </Table>
                </React.Fragment>
            )
          }}
        </AppContext.Consumer>
    );
  }
}

// ManufacturerComponent.contextType = AppContext;

export default withTranslation(['manufacturer', 'common'])(ManufacturerComponent);
