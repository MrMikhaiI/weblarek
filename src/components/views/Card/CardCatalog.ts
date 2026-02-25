import { Card, TCardCatalog } from './Card';
import { categoryMap, CDN_URL } from '../../../utils/constants';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';

export type TCardCatalog = Pick<IProduct, 'image' | 'category'>;

export class CardCatalog extends Card<TCardCatalog> {
  protected imageElement!: HTMLImageElement;
  protected categoryElement!: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.imageElement = ensureElement('.card__image', container);
    this.categoryElement = ensureElement('.card__category', container);
    
    container.addEventListener('click', () => {
      events.emit('productCard:click', {}); // id через dataset
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
