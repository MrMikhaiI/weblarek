import { IApi, IProduct, IOrderRequest, IOrderResponse } from '../../types'; 
import { API_URL } from '../../utils/constants';  

export class Communication {  
  private api: IApi;   

  constructor(api: IApi) {  
    this.api = api;  
  } 

  async getProductList(): Promise<IProduct[]> {  
    const response = await this.api.get(`${API_URL}/product/`);  
    return (response as any).items as IProduct[];  
  } 

  async sendOrder(orderRequest: IOrderRequest): Promise<IOrderResponse> {  
    const response = await this.api.post(`${API_URL}/order/`, orderRequest);  
    return response as IOrderResponse;  
  } 
}
