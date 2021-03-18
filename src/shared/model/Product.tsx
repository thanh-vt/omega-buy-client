import {Manufacturer} from "./Manufacturer";

export interface Product {
  id?: number | null;
  code?: string | null;
  name?: string | null;
  categories?: any[] | null;
  price?: number | null;
  description?: string | null;
  manufacturer?: Manufacturer | null;
  inventories?: any[] | null;
}
