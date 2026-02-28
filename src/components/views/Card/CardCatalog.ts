import { Card } from './index';
import { categoryMap, CDN_URL } from '../../../utils/constants';
import { ICardCatalogCallbacks } from './types';  
import { IProduct } from '../../../types';
import { ensureElement } from '../../../utils/utils';

export class CardCatalog extends Card<IProduct> {  
  protected imageElement!: HTMLImageElement;
  protected categoryElement!: HTMLElement;

  constructor(container: HTMLElement, protected callbacks: ICardCatalogCallbacks) {  
  super(container);
  this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);  
  this.categoryElement = ensureElement('.card__category', container);

  container.addEventListener('click', () => {
    this.callbacks.onSelect();   
    });
  }

  render(product: IProduct): HTMLElement {  
    this.title = product.title;
    this.price = product.price ?? 0;
    this.image = product.image;
    this.category = product.category;
    return this.container;  
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
