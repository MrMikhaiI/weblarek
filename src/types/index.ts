export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';  

export type TPayment = 'online' | 'offline';   

export interface IApi {  
  get<T extends object>(uri: string): Promise<T>;  
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;  
}

export interface IProduct {  
  id: string;       
  title: string;    
  description: string; 
  image: string;    
  category: string; 
  price: number;    
}  

export interface IBuyer {  
  payment: TPayment; 
  email: string;     
  phone: string;     
  address: string;   
}  

export interface IApiProductsResponse {  
  total: number;    
  items: IProduct[]; 
}

export interface IOrderRequest { 
  payment: TPayment;       
  email: string;
  phone: string; 
  address: string;
  total: number;         
  items: string[];         
}
 
export interface IOrderResponse { 
  id: string;               
  total: number;
}
