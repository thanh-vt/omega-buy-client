import React, {RefObject} from "react";
import ToastComponent from "../shared/component/ToastComponent";
import ConfirmDialogComponent from "../shared/component/ConfirmDialogComponent";
import {Formik, FormikHelpers} from "formik";
import {Button, Form} from "react-bootstrap";
import {FaSave} from "react-icons/fa";
import * as Yup from "yup";
import {ObjectSchema} from "yup";
import {Product} from "../shared/model/Product";
import {withTranslation} from "react-i18next";
import {ProductDetailData} from "./ProductComponent";

export interface ProductCreateState extends ProductDetailData {
  onSave: (data: ProductDetailData) => Promise<void>;
}

class ProductDetailComponent extends React.Component<any, ProductCreateState> {

  confirmDialog: RefObject<ConfirmDialogComponent>;
  productSchema: ObjectSchema<any, any> = Yup.object().shape({
    code: Yup.string()
    .required(this.props.t('validation.code.required'))
    .min(3, this.props.t('validation.code.min', {min: 3}))
    .max(10, this.props.t('validation.code.max', {max: 10})),
    name: Yup.string()
    .required(this.props.t('validation.name.required'))
    .min(2, this.props.t('validation.name.required', {min: 2}))
    .max(30, this.props.t('validation.name.required', {max: 30})),
    description: Yup.string().nullable(),
    manufacturer: Yup.object().nullable()
    .required(this.props.t('validation.manufacturer.required'))
  });

  constructor(props: Readonly<any> | any) {
    super(props);
    this.state = {
      ...props
    }
    this.confirmDialog = React.createRef<ConfirmDialogComponent>();
  }

  static getDerivedStateFromProps(props: any, state: any) {
    return {
      ...state,
      ...props
    }
  }

  changeManufacturer(event: any, values: Product) {
    values.manufacturer = this.state.manufacturerList
    .filter(e => e.id === Number(event.target.value))[0] || null;
    console.log(values, typeof event.target.value);
  }

  confirm(data: any) {
    this.confirmDialog.current?.show(data);
  }

  save(agree: boolean, data: any) {
    if (agree) {
      this.props.onSave(data);
    }
  }

  render() {
    return (
        <React.Fragment>
          <ToastComponent show={true}/>
          <ConfirmDialogComponent mode={'dark'} ref={this.confirmDialog}
                                  title={this.props.t('common:title.confirm')}
                                  text={this.props.t('message.confirm.save')}
                                  saveButton={this.props.t('common:button.save')}
                                  cancelButton={this.props.t('common:button.cancel')}
                                  onAction={(val, data) => this.save(val, data)}/>
          <Formik
              initialValues={this.state.product}
              onSubmit={(values: Product,
                         {setSubmitting}: FormikHelpers<Product>) => {
                this.confirm({...this.state, product: values});
                setSubmitting(false);
              }}
              validationSchema={this.productSchema}
              // validate={this.validate}
              validateOnBlur={true} validateOnChange={false}>
            {
              ({
                 values,
                 errors,
                 handleSubmit,
                 handleChange,
                 handleBlur,
                 isSubmitting,
                 setFieldError
               }) => (
                  <Form onSubmit={e => {
                    e.preventDefault();
                    handleSubmit(e)
                  }}>
                    <Form.Group controlId="code">
                      <Form.Label>{this.props.t('title.code')}</Form.Label>
                      <Form.Control name="code" type="text" placeholder={this.props.t('placeholder.code')}
                                    defaultValue={values.code || ''} onBlur={handleBlur}
                                    onChange={e => {
                                      handleChange(e);
                                      setFieldError('code', undefined);
                                    }}/>
                      {errors.code && <Form.Text className="text-danger">
                        {errors.code}
                      </Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="name">
                      <Form.Label>{this.props.t('title.name')}</Form.Label>
                      <Form.Control name="name" type="text" placeholder={this.props.t('placeholder.name')}
                                    defaultValue={values.name || ''} onBlur={handleBlur}
                                    onChange={e => {
                                      handleChange(e);
                                      setFieldError('name', undefined);
                                    }}/>
                      {errors.name && <Form.Text className="text-danger">
                        {errors.name}
                      </Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="description">
                      <Form.Label>{this.props.t('title.description')}</Form.Label>
                      <Form.Control name="description" as="textarea" rows={3}
                                    placeholder={this.props.t('placeholder.description')}
                                    defaultValue={values.description || ''}
                                    onChange={handleChange}/>
                      {errors.description && <Form.Text className="text-danger">
                        {errors.description}</Form.Text>}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>{this.props.t('title.manufacturer')}</Form.Label>
                      <Form.Control as="select" defaultValue={values.manufacturer?.id || 0}
                                    onChange={e => {handleChange(e); this.changeManufacturer(e, values)}}>
                        <option key={null} value={0}>{this.props.t('placeholder.manufacturer')}</option>
                        {this.state.manufacturerList.map((m) => {
                          return <option key={m.id} value={m.id}>{m.name}</option>
                        })}
                      </Form.Control>
                      {errors.manufacturer && <Form.Text className="text-danger">
                        {errors.manufacturer}</Form.Text>}
                    </Form.Group>
                    <div className="d-flex w-100 justify-content-end">
                      <Button variant="primary" type="submit" disabled={isSubmitting}>
                        <FaSave/> {this.props.t('common:button.save')}
                      </Button>
                    </div>
                  </Form>
              )
            }
          </Formik>
        </React.Fragment>
    );
  }
}

export default withTranslation(['product', 'common'])(ProductDetailComponent);
