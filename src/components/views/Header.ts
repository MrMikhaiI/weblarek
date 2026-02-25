import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Header extends Component<{ counter: number }> {
  protected basketButton!: HTMLButtonElement;
  protected counterElement!: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.basketButton = ensureElement('.header__basket', container);
    this.counterElement = ensureElement('.header__basket-counter', container);
    
    this.basketButton.addEventListener('click', () => {
      events.emit('cart:open');
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
