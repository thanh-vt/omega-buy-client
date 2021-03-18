import React, {RefObject} from "react";
import AppContext, {IAppContext} from "../context/AppContext";
import {Button, Table} from "react-bootstrap";
import {BsFillTrashFill, BsPencilSquare, FaPlusCircle} from "react-icons/all";
import ConfirmDialogComponent from "../shared/component/ConfirmDialogComponent";
import DialogComponent from "../shared/component/DialogComponent";
import {Product} from "../shared/model/Product";
import {withTranslation} from "react-i18next";
import ApiUtil from "../shared/util/ApiUtil";
import {ToastType} from "../shared/component/ToastComponent";
import ProductDetailComponent, {ProductCreateState} from "./ProductDetailComponent";
import {Manufacturer} from "../shared/model/Manufacturer";
import {AxiosResponse} from "axios";

export interface ProductDetailData {
  mode: 0 | 1;
  product: Product;
  manufacturerList: Manufacturer[]
}

interface ProductComponentState {
  productList: Product[],
  productDetailData: ProductDetailData;
  toastOverlay?: RefObject<any>
}

class ProductComponent extends React.Component<any, ProductComponentState>{

  detailDialog: RefObject<DialogComponent>;
  confirmDialog: RefObject<ConfirmDialogComponent>

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      productList: [],
      productDetailData: {
        mode: 0,
        product: {code: '', name: '', description: ''},
        manufacturerList: []}
    };
    this.detailDialog = React.createRef<DialogComponent>();
    this.confirmDialog = React.createRef<ConfirmDialogComponent>();
  }

  async loadDetail(id: any) {
    this.context.setLoading(true);
    try {
      let response = await this.context.productService.getProductDetail(id);
      this.setState({
        productDetailData: {
          ...this.state.productDetailData,
          mode: 1,
          product: response.data}
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
      let response1: AxiosResponse<Product[]> = await this.context.productService.getProductList();
      let response2: AxiosResponse<Manufacturer[]> = await this.context.manufacturerService.getManufacturerDroplist();
      this.setState({
        productList: response1.data,
        productDetailData: {
          mode: 0,
          product: {code: '', name: '', description: ''},
          manufacturerList: response2.data}}
      );
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

  async createOrUpdateProduct(productDetailData: ProductDetailData): Promise<void> {
    this.context.setLoading(true);
    try {
      if (productDetailData.mode === 1) {
        await this.context.productService
        .updateProduct(productDetailData.product);
      } else {
        await this.context.productService
        .createProduct(productDetailData.product);
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

  async deleteProduct(val: boolean, id: any): Promise<void> {
    if (val) {
      this.context.setLoading(true);
      try {
        await this.context.productService
        .deleteProduct(id);
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
                                          onAction={(val, data) => this.deleteProduct(val, data)} />
                  <DialogComponent ref={this.detailDialog} size={'lg'} mode={'dark'} >
                    <ProductDetailComponent {...this.state.productDetailData}
                                            onSave={(e: ProductDetailData) => this.createOrUpdateProduct(e)} />
                  </DialogComponent>
                  <Table className="table-dark" striped bordered hover>
                    <thead>
                    <tr>
                      <th>#</th>
                      <th>{this.props.t('title.code')}</th>
                      <th>{this.props.t('title.name')}</th>
                      <th>{this.props.t('title.description')}</th>
                      <th>{this.props.t('title.manufacturer')}</th>
                      <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      this.state.productList.map((product, index) => {
                        return (
                            <tr key={product.id}>
                              <td>{index + 1}</td>
                              <td>{product.code}</td>
                              <td>{product.name}</td>
                              <td>{product.description}</td>
                              <td>{product.manufacturer?.name}</td>
                              <td className="d-flex justify-content-center align-items-center">
                                <Button variant={'warning'} size={'sm'} className="mx-1"
                                        onClick={() => this.loadDetail(product.id)}>
                                  <BsPencilSquare/>
                                </Button>
                                <Button variant={'danger'} size={'sm'} className="mx-1"
                                        onClick={() => this.openDeleteDialog(product.id)}>
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

export default withTranslation(['product', 'common'])(ProductComponent);
