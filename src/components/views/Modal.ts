import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton!: HTMLButtonElement;
  protected contentElement!: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this.closeButton = ensureElement('.modal__close', container);
    this.contentElement = ensureElement('.modal__content', container);
    
    this.closeButton.addEventListener('click', () => this.close());
    container.addEventListener('click', (e) => {
      if (e.target === container) this.close();
    });
  }

  set content(element: HTMLElement) {
    this.contentElement.replaceChildren(element);
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.contentElement.innerHTML = '';
  }
}
