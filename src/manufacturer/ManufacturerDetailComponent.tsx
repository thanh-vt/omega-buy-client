import React, {RefObject} from "react";
import AppContext from "../context/AppContext";
import {Button, Form} from "react-bootstrap";
import {Formik, FormikErrors, FormikHelpers} from "formik";
import {FaSave} from "react-icons/fa";
import ToastComponent from "../shared/component/ToastComponent";
import {Manufacturer} from "../shared/model/Manufacturer";
import ConfirmDialogComponent from "../shared/component/ConfirmDialogComponent";
import * as Yup from 'yup';
import {ObjectSchema} from 'yup';
import {withTranslation} from "react-i18next";
import {ManufacturerDetailData} from "./ManufacturerComponent";

export interface ManufacturerCreateState extends ManufacturerDetailData {
  onSave: (data: ManufacturerDetailData) => Promise<any>;
}

class ManufacturerDetailComponent extends React.Component<any, ManufacturerCreateState> {

  confirmDialog: RefObject<ConfirmDialogComponent>;
  manufacturerSchema: ObjectSchema<any, any> = Yup.object().shape({
    code: Yup.string()
    .required(this.props.t('validation.code.required'))
    .min(3, this.props.t('validation.code.min', {min: 3}))
    .max(10, this.props.t('validation.code.max', {max: 10})),
    name: Yup.string()
    .required(this.props.t('validation.name.required'))
    .min(2, this.props.t('validation.name.required', {min: 2}))
    .max(30, this.props.t('validation.name.required', {max: 30})),
    description: Yup.string().nullable()
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

  confirm(data: any) {
    this.confirmDialog.current?.show(data);
  }

  save(agree: boolean, data: any) {
    if (agree) {
      this.props.onSave(data);
    }
  }

  validate(values: Manufacturer): FormikErrors<Manufacturer> {
    const errors: FormikErrors<Manufacturer> = {};

    if (!values.code) {
      errors.code = 'Code is required';
    } else if (values.code.length > 10 || values.code.length < 3) {
      errors.code = 'Code length must be from 3 to 10 characters';
    }
    return errors;
  }

  render(): React.ReactNode {
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
              initialValues={this.state.manufacturer}
              onSubmit={(values: Manufacturer,
                         {setSubmitting}: FormikHelpers<Manufacturer>) => {
                this.confirm({...this.state, manufacturer: values});
                setSubmitting(false);
              }}
              validationSchema={this.manufacturerSchema}
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
                                    defaultValue={values.code} onBlur={handleBlur}
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
                                    defaultValue={values.name}
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
                                    defaultValue={values.description} onChange={handleChange}/>
                      {errors.description && <Form.Text className="text-danger">
                        {errors.description}
                      </Form.Text>}
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

ManufacturerDetailComponent.contextType = AppContext;

export default withTranslation(['manufacturer', 'common'])(ManufacturerDetailComponent);
