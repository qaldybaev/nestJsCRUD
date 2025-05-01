
export interface ICategory {
    id: number;
    name: string;
    category_id?: number | null;
}

export interface ICreateCategory {
    name: string;
    category_id?: number;
}

export interface IUpdateCategory {
    name: string;
}

export interface IParamId {
    id: string;
}

export interface ICategoryResponse {
    message: string;
    count?: number;
    data: ICreateCategory[]
}
