export interface IProductCreate {
  name: string;
  price: number;
  category_id: number;
}

export interface IProductUpdate {
  name?: string;
  price?: number;
  category_id?: number;
}

export interface IProductResponse {
  id: number;
  name: string;
  price: number;
  category_id: number;
}
export interface IParamId {
  id: string
}

export interface IGetAllProductsResponse {
  message: string;
  count: number;
  data: Array<{
    category_id: number;
    category_name: string;
    products: Array<{
      id: number;
      name: string;
      price: number;
    }>;
  }>;
}
