import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
  private products: IProduct[] = [];    
  private selectedProduct: IProduct | null;
  private events?: IEvents;

  constructor(events?: IEvents) {
    this.events = events;
    this.products = [];                   
    this.selectedProduct = null;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events?.emit('catalog:productsChanged');  
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events?.emit('catalog:selectedChanged', product);  
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
