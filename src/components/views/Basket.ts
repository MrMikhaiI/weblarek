import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IBasket {
  items: HTMLElement[];
  price: number;
  isEmpty: boolean;
}

export class Basket extends Component<IBasket> {
  protected listElement!: HTMLElement;
  protected orderButton!: HTMLButtonElement;
  protected priceElement!: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.listElement = ensureElement('.basket__list', container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);
    this.priceElement = ensureElement('.basket__price', container);
    
    this.orderButton.addEventListener('click', () => {
      events.emit('order:start');
    });
  }

  render(data: Partial<IBasket> = {}): HTMLElement {
  const { items = [], price = 0, isEmpty = true } = data as IBasket;
    this.listElement.innerHTML = '';
    if (isEmpty) {
      this.listElement.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
    } else {
      this.listElement.append(...items);
    }
    
    this.priceElement.textContent = `${price} синапсов`;
    this.orderButton.disabled = isEmpty;
    this.orderButton.classList.toggle('button_disabled', isEmpty);

    return this.container;
  }
}
