import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected closeButton!: HTMLButtonElement;
  protected totalElement!: HTMLElement;

  constructor(container: HTMLElement, protected onClose: () => void) {
    super(container);
    
    this.closeButton = ensureElement('.order-success__close', container);
    this.totalElement = ensureElement('.order-success__description', container);
    
    this.closeButton.addEventListener('click', () => onClose());
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсов`;
  }
}
