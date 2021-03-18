import {Product} from "./Product";

export interface Manufacturer {
  id?: number,
  name: string,
  code: string,
  description: string,
  products?: Product[]
}
