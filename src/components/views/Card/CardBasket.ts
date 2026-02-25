import { Card } from '../Card';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from '../../../types';

interface ICardBasketCallbacks {
  onDelete: (id: string) => void;
}

export class CardBasket extends Card {
  protected deleteButton!: HTMLButtonElement;

  constructor(container: HTMLElement, protected callbacks: ICardBasketCallbacks) {
    super(container);
    
    this.deleteButton = ensureElement('.cart-item__delete', container);
    this.deleteButton.addEventListener('click', () => {
      const productId = (container as HTMLElement).dataset.productId;
      this.callbacks.onDelete(productId!);
    });
  }
}
