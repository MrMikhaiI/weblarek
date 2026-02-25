import { Form } from './Form';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';

export class OrderForm extends Form {
  protected paymentButtons!: NodeListOf<HTMLButtonElement>;
  protected addressInput!: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    
    this.paymentButtons = container.querySelectorAll('button[name]');
    this.addressInput = ensureElement('input[name="address"]', container);
    
    this.paymentButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        events.emit('order:changed', { 
          field: 'payment', 
          value: btn.name as 'online' | 'offline' 
        });
      });
    });
    
    this.addressInput.addEventListener('input', () => {
      events.emit('order:changed', { 
        field: 'address', 
        value: this.addressInput.value 
      });
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
