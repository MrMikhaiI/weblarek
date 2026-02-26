// Основные типы данных
export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

export type TPayment = 'online' | 'offline';

export interface IOrderRequest {
  payment: TPayment;
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

// EventEmitter типы
export type EventName = string | RegExp;

export interface IEvents {
  on<T>(event: EventName, callback: (data: T) => void): void;
  emit<T>(event: string, data?: T): void;
  trigger<T>(event: string, context?: Partial<T>): (data: T) => void;
}

// Api интерфейсы
export interface IApi {
  get(uri: string): Promise<object>;
  post(uri: string, data: object, method?: 'POST' | 'PUT'): Promise<object>;
}

// View интерфейсы
export interface IBasket {
  items: HTMLElement[];
  price: number;
  isEmpty: boolean;
}

export interface ISuccess {
  total: number;
}

// Базовый Component
export interface IComponent<T = any> {
  container: HTMLElement;
  render(data?: Partial<T>): HTMLElement;
}

// Buyer данные
export interface IBuyer {
  payment: TPayment | '';
  email: string;
  phone: string;
  address: string;
}
