import { Form } from './Form';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';

export class ContactsForm extends Form {
  protected emailInput!: HTMLInputElement;
  protected phoneInput!: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    
    this.emailInput = ensureElement('input[name="email"]', container);
    this.phoneInput = ensureElement('input[name="phone"]', container);
    
    this.emailInput.addEventListener('input', () => {
      events.emit('contacts:changed', { 
        field: 'email', 
        value: this.emailInput.value 
      });
    });
    
    this.phoneInput.addEventListener('input', () => {
      events.emit('contacts:changed', { 
        field: 'phone', 
        value: this.phoneInput.value 
      });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
