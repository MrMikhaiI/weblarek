import { IProduct } from '../../types'; 
import { IEvents } from "../base/Events";

export class Cart {
  private items: IProduct[] = [];  
  private events?: IEvents;

  constructor(events?: IEvents) {  
    this.events = events;
    this.items = [];  
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events?.emit('cart:itemsChanged');
  }

  removeItem(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
    this.events?.emit('cart:itemsChanged');
  }

  clear(): void {
    this.items = [];
    this.events?.emit('cart:itemsChanged');
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);  
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}
