import { Card } from './index';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from '../../../types';
import { ICardPreviewCallbacks } from './types';  

export class CardPreview extends Card<IProduct> {  
  protected descriptionElement!: HTMLElement;
  protected button!: HTMLButtonElement;

  constructor(container: HTMLElement, protected callbacks: ICardPreviewCallbacks) {
    super(container);
    
    this.descriptionElement = ensureElement('.card__text', container);
    this.button = ensureElement<HTMLButtonElement>('.card__button', container);  
    
    this.button.addEventListener('click', () => callbacks.onClick());
  }

  render(product: IProduct): HTMLElement { 
    super.render(product);
    this.descriptionElement.textContent = product.description || '';
    return this.container;  
  }

  setButtonText(text: string, product?: IProduct) { 
    this.button.textContent = text;
    if (product && !product.price) {  
      this.button.disabled = true;
      this.button.textContent = 'Недоступно';
    } else {
      this.button.disabled = false;
    }
  }  
}   
