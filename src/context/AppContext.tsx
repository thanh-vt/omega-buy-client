import React, {Context} from "react";
import ManufacturerService from "../manufacturer/ManufacturerService";
import {ToastType} from "../shared/component/ToastComponent";
import ProductService from "../product/ProductService";

export interface IAppContext {
  manufacturerService: ManufacturerService;
  productService: ProductService;
  loading?: boolean;
  setLoading?: (show: boolean) => void
  showToast?: (code: string, desc: string, type: ToastType) => void
}

const AppContext: Context<IAppContext> = React.createContext<IAppContext>({
  manufacturerService: new ManufacturerService(),
  productService: new ProductService()
});

export default AppContext;
