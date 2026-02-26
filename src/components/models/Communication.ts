import { IApi, IProduct, IApiProductsResponse, IOrderRequest, IOrderResponse } from '../../types';
import { API_URL } from '../../utils/constants';  

export class Communication {  
  private api: IApi;   

  constructor(api: IApi) {  
    this.api = api;  
  } 

  async getProductList(): Promise<IProduct[]> {  
    const response = await this.api.get<IApiProductsResponse>(`${API_URL}/product/`);  
    return response.items;  
  } 

  async sendOrder(orderRequest: IOrderRequest): Promise<IOrderResponse> {  
    return await this.api.post<IOrderResponse>(`${API_URL}/order/`, orderRequest);  
  } 
}
