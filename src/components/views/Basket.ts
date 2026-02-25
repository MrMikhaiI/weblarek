import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IBasket {
  items: HTMLElement[];
  price: number;
}

export class Basket extends Component<IBasket> {
  protected listElement!: HTMLElement;
  protected orderButton!: HTMLButtonElement;
  protected priceElement!: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.listElement = ensureElement('.basket__list', container);
    this.orderButton = ensureElement('.basket__button', container);
    this.priceElement = ensureElement('.basket__price', container);
    
    this.orderButton.addEventListener('click', () => {
      events.emit('order:open');
    });
  }

  set items(items: HTMLElement[]) {
    this.listElement.innerHTML = '';
    if (items.length === 0) {
      this.listElement.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
    } else {
      this.listElement.append(...items);
    }
  }

  set price(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }
}
