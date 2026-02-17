export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'; 

export type TPayment = 'card' | 'cash';  

export interface IApi { 
  get<T extends object>(uri: string): Promise<T>; 
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>; 
}

export interface IProduct { 
  id: string;       // уникальный идентификатор товара 
  title: string;    // название товара 
  description: string; // описание товара 
  image: string;    // ссылка на изображение товара 
  category: string; // категория, к которой относится товар 
  price: number;    // цена товара 
} 

export interface IBuyer { 
  payment: TPayment; // выбранный способ оплаты 
  email: string;     // email покупателя 
  phone: string;     // телефон покупателя 
  address: string;   // адрес доставки 
} 

export interface IOrder { 
  items: IProduct[]; // массив товаров из корзины
  buyer: IBuyer;     // данные покупателя
} 

export interface IApiProductsResponse { 
  items: IProduct[]; 
} 

export interface IOrderResponse {}
