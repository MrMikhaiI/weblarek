import { Card } from '../Card';
import { categoryMap, CDN_URL } from '../../../utils/constants';
import { IEvents } from '../../base/Events';
import { IProduct } from '../../../types';
import { ensureElement } from '../../../utils/utils';

export class CardCatalog extends Card {
  protected imageElement!: HTMLImageElement;
  protected categoryElement!: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.imageElement = ensureElement('.card__image', container);
    this.categoryElement = ensureElement('.card__category', container);

    container.addEventListener('click', () => {
      const productId = (container as HTMLElement).dataset.productId;
      this.events.emit('products:select', productId);
    });
  }

  set image(value: string) {
    this.setImage(this.imageElement, `${CDN_URL}${value.slice(0, -3)}png`);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    Object.values(categoryMap).forEach(cls => {
      this.categoryElement.classList.remove(cls);
    });
    this.categoryElement.classList.add(categoryMap[value as keyof typeof categoryMap]);
  }
}
