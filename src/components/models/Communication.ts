import { IApi, IProduct, IOrderRequest, IOrderResponse } from '../../types';

export class Communication {  
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProductList(): Promise<IProduct[]> {
    const response = await this.api.get('product');
    return (response as any).items as IProduct[];
  }

  async sendOrder(orderRequest: IOrderRequest): Promise<IOrderResponse> {
    const response = await this.api.post('order', orderRequest);  
    return response as IOrderResponse;
  }
}
