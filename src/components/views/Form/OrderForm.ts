import { ensureElement } from '../../../utils/utils'; 
import { IEvents } from '../../base/Events'; 

export class OrderForm extends Form { 
  protected paymentButtons!: NodeListOf<HTMLButtonElement>; 
  protected addressInput!: HTMLInputElement; 

  constructor(container: HTMLFormElement, events: IEvents) { 
    super(container, events); 
     
    this.paymentButtons = container.querySelectorAll('.button.button_alt'); 
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container); 
     
    this.paymentButtons.forEach(btn => { 
      btn.addEventListener('click', () => { 
        events.emit('order:changed', {  
          field: 'payment',  
          value: btn.name!  
        }); 
      }); 
    }); 
     
    this.addressInput.addEventListener('input', () => { 
      events.emit('order:changed', {  
        field: 'address',  
        value: this.addressInput.value  
      }); 
    }); 

    this.formElement.addEventListener('submit', (e) => { 
      e.preventDefault(); 
      if (!this.submitButton.disabled) { 
        events.emit('order:next');   
      } 
    }); 
  } 

  set payment(value: string) { 
    this.paymentButtons.forEach(btn => { 
      btn.classList.toggle('button_alt-active', btn.name === value); 
    }); 
  } 

  set address(value: string) { 
    this.addressInput.value = value; 
  } 
}
