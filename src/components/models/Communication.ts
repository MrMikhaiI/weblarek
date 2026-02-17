import { Api } from '../base/Api'; 
import { IApi, IProduct, IOrder, IBuyer } from '../../types';
import { API_URL } from '../../utils/constants'; 

interface IApiProductsResponse { 
  items: IProduct[]; 
} 

interface IOrderRequest {
  items: IProduct[];
  buyer: IBuyer;  
}

interface IOrderResponse {
  success?: boolean;
}

export class Communication { 
  private api: IApi;  

  /** 
   * Конструктор использует композицию: принимает IApi для запросов
   * @param api 
   */ 
  constructor(api: IApi) { 
    this.api = api; 
  } 

  /** Получение массива товаров с сервера 
   * @returns Promise<IProduct[]> 
   */ 
  async getProductList(): Promise<IProduct[]> { 
    const response = await this.api.get<IApiProductsResponse>(`${API_URL}/product/`); 
    return response.items || []; 
  } 

  /** Отправка данных заказа на сервер 
   * @param order - объект заказа {items: IProduct[], buyer: IBuyer}
   * @returns Promise<IOrderResponse> 
   */ 
  async sendOrder(order: IOrder): Promise<IOrderResponse> {  
    return await this.api.post(`${API_URL}/order/`, order); 
  } 
}
