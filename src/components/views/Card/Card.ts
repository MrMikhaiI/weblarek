import { Component } from '../../base/Component';
import { IProduct } from '../../../types';
import { ensureElement } from '../../../utils/utils';

export type TCard = Pick<IProduct, 'title' | 'price'>;

export abstract class Card<T> extends Component<TCard & T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement('.card__title', container);
    this.priceElement = ensureElement('.card__price', container);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }
}
