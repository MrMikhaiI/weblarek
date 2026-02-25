import { Card } from '../Card';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from '../../../types';

interface ICardPreviewCallbacks {
  onClick: () => void;
}

export class CardPreview extends Card {
  protected descriptionElement!: HTMLElement;
  protected button!: HTMLButtonElement;

  constructor(container: HTMLElement, protected callbacks: ICardPreviewCallbacks) {
    super(container);
    
    this.descriptionElement = ensureElement('.card__text', container);
    this.button = ensureElement('.card__button', container);
    
    this.button.addEventListener('click', () => callbacks.onClick());
  }

  render(product: IProduct) {
    super.render(product);
    this.descriptionElement.textContent = product.description || '';
  }

  setButtonText(text: string) {
    this.button.textContent = text;
    this.button.disabled = !product.price; 
    if (!product.price) {
      this.button.textContent = 'Недоступно';
    }
  }
}
