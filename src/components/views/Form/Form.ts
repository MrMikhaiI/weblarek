import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';

export interface IForm {
  valid: boolean;
  errors: string[];
}

export class Form extends Component<IForm> {
  protected formElement!: HTMLFormElement;
  protected submitButton!: HTMLButtonElement;
  protected errorsElement!: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);
    
    this.formElement = container;
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errorsElement = ensureElement('.form__errors', container);
    
    this.submitButton.disabled = true;
    this.submitButton.classList.add('button_disabled');

    this.formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!this.submitButton.disabled) {
        this.events.emit(`${this.formElement.name}:submit`);
      }
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
    this.submitButton.classList.toggle('button_disabled', !value);
  }

  set errors(errors: string[]) {
    this.errorsElement.textContent = errors.join(', ');
  }
}
