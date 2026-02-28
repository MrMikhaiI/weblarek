import { Card } from './index'; 
import { ensureElement } from '../../../utils/utils'; 
import { ICardBasketCallbacks } from './types'; 
import { IProduct } from '../../../types'; 

export class CardBasket extends Card<IProduct> {   
  protected deleteButton!: HTMLButtonElement; 

  constructor(container: HTMLElement, protected callbacks: ICardBasketCallbacks) { 
    super(container); 
   
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container); 
    this.deleteButton.addEventListener('click', () => { 
    this.callbacks.onDelete();    
    }); 
  } 
}
