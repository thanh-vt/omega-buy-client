import {AxiosResponse} from "axios";
import * as HttpClient from "../shared/service/HttpClient";
import {Product} from "../shared/model/Product";

class ProductService {

  getProductList(): Promise<AxiosResponse<Product[]>> {
    return HttpClient.getReq<Product[]>(`${process.env.REACT_APP_API_ENDPOINT}/api/product/list`);
  }

  getProductDetail(id: number): Promise<AxiosResponse<Product>> {
    return HttpClient.getReq<Product>(`${process.env.REACT_APP_API_ENDPOINT}/api/product/${id}`);
  }

  createProduct(manufacturer: Product): Promise<AxiosResponse<void>> {
    return HttpClient.postReq<void>(`${process.env.REACT_APP_API_ENDPOINT}/api/product`, manufacturer);
  }

  updateProduct(manufacturer: Product): Promise<AxiosResponse<void>> {
    return HttpClient.putReq<void>(`${process.env.REACT_APP_API_ENDPOINT}/api/product`, manufacturer);
  }

  deleteProduct(id: number): Promise<AxiosResponse<void>> {
    return HttpClient.deleteReq<void>(`${process.env.REACT_APP_API_ENDPOINT}/api/product/${id}`);
  }
}

export default ProductService;
