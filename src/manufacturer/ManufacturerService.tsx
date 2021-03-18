
import {Manufacturer} from "../shared/model/Manufacturer";
import {AxiosResponse} from "axios";
import * as HttpClient from "../shared/service/HttpClient";

class ManufacturerService {

  getManufacturerList(): Promise<AxiosResponse<Manufacturer[]>> {
    return HttpClient.getReq<Manufacturer[]>(`${process.env.REACT_APP_API_ENDPOINT}/api/manufacturer/list`);
  }

  getManufacturerDroplist(): Promise<AxiosResponse<Manufacturer[]>> {
    return HttpClient.getReq<Manufacturer[]>(`${process.env.REACT_APP_API_ENDPOINT}/api/manufacturer/drop-list`);
  }

  getManufacturerDetail(id: number): Promise<AxiosResponse<Manufacturer>> {
    return HttpClient.getReq<Manufacturer>(`${process.env.REACT_APP_API_ENDPOINT}/api/manufacturer/${id}`);
  }

  createManufacturer(manufacturer: Manufacturer): Promise<AxiosResponse<void>> {
    return HttpClient.postReq<void>(`${process.env.REACT_APP_API_ENDPOINT}/api/manufacturer`, manufacturer);
  }

  updateManufacturer(manufacturer: Manufacturer): Promise<AxiosResponse<void>> {
    return HttpClient.putReq<void>(`${process.env.REACT_APP_API_ENDPOINT}/api/manufacturer`, manufacturer);
  }

  deleteManufacturer(id: number): Promise<AxiosResponse<void>> {
    return HttpClient.deleteReq<void>(`${process.env.REACT_APP_API_ENDPOINT}/api/manufacturer/${id}`);
  }
}

export default ManufacturerService;
