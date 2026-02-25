import './scss/styles.scss';
import { Api, EventEmitter } from './components/base';
import { Catalog, Cart, Buyer, Communication } from './components/models';
import { 
  Gallery, Header, Modal, Basket,
  CardCatalog, CardPreview, CardBasket,
  OrderForm, ContactsForm, Success 
} from './components/views';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL } from './utils/constants';
import { IProduct } from './types';

console.log('Web-Larek запускается...');

// Инициализация
const events = new EventEmitter();
const api = new Api(API_URL);
const communication = new Communication(api);

const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// VIEW КОМПОНЕНТЫ
const gallery = new Gallery(ensureElement('.gallery'));
const header = new Header(ensureElement('.header'), events);
const modal = new Modal(ensureElement('#modal-container'), events);

// 1. ЗАГРУЗКА КАТАЛОГА
communication.getProductList().then(products => {
  console.log('Загружен каталог:', products.length, 'товаров');
  catalog.setProducts(products);
});

// 2. СОБЫТИЯ МОДЕЛЕЙ
events.on('catalog:productsChanged', () => {
  console.log('Рендер каталога...');
  const items = catalog.getProducts().map(product => {
    const card = new CardCatalog(cloneTemplate('#card-catalog'), events);
    card.render({ 
      title: product.title, 
      price: product.price,
      image: product.image, 
      category: product.category 
    });
    (card.container as HTMLElement).dataset.productId = product.id;
    return card.container;
  });
  gallery.catalog = items;
});

events.on('cart:itemsChanged', () => {
  header.counter = cart.getCount();
  
  console.log('🛒 Корзина:', cart.getCount(), 'товаров');
});

// 3. КЛИК ПО КАРТОЧКЕ ТОВАРА
events.on('productCard:click', (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const productId = target.closest('.gallery__item')?.dataset.productId;
  const product = catalog.getProductById(productId!);
  
  if (product) {
    catalog.setSelectedProduct(product);
  }
});

events.on('catalog:selectedChanged', (product: IProduct) => {
  const isInCart = cart.hasItem(product.id);
  const cardPreview = new CardPreview(cloneTemplate('#card-preview'), {
    onClick: () => {
      if (isInCart) {
        cart.removeItem(product);
      } else {
        cart.addItem(product);
      }
      modal.close();
    }
  });
  
  cardPreview.render({
    title: product.title,
    price: product.price,
    image: product.image,
    category: product.category,
    description: product.description
  });
  
  cardPreview.setButtonText(isInCart ? 'Удалить из корзины' : 'В корзину');
  
  modal.content = cardPreview.container;
  modal.open();
});

// 4. ОТКРЫТИЕ КОРЗИНЫ
events.on('cart:open', () => {
  const items = cart.getItems().map((product, index) => {
    const cardBasket = new CardBasket(cloneTemplate('#card-basket'), events);
    cardBasket.render({
      title: product.title,
      price: product.price,
      index: index + 1
    });
    cardBasket.id = product.id;
    return cardBasket.container;
  });

  const basketView = new Basket(cloneTemplate('#basket'), events);
  basketView.render({
    items,
    price: cart.getTotalPrice()
  });
  
  basketView.setButtonDisabled(cart.getCount() === 0);
  
  modal.content = basketView.container;
  modal.open();
});

