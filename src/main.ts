import './scss/styles.scss';
import { Api, EventEmitter } from './components/base';
import { Catalog, Cart, Buyer, Communication } from './components/models';
import { 
  Gallery, Header, Modal, 
  CardCatalog, CardPreview, CardBasket,
  OrderForm, ContactsForm, Success,
  Basket 
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
  const products = catalog.getProducts();
  const items = products.map(product => {
    const card = new CardCatalog(cloneTemplate('#card-catalog'), events);
    card.render(product);
    (card.container as HTMLElement).dataset.productId = product.id;
    return card.container;
  });
  gallery.catalog = items;
});

events.on('catalog:selectedChanged', (product: IProduct) => {
  const isInCart = cart.hasItem(product.id);
  const cardPreview = new CardPreview(cloneTemplate('#card-preview'), {
    onClick: () => events.emit('product:buy', product.id)
  });
  
  cardPreview.render(product);
  cardPreview.setButtonText(isInCart ? 'Удалить из корзины' : 'Купить');
  
  modal.content = cardPreview.container;
  modal.open();
});

events.on('cart:itemsChanged', () => {
  header.counter = cart.getCount();
  console.log('🛒 Корзина:', cart.getCount(), 'товаров');
});

// 3. СОБЫТИЯ VIEW 
events.on('products:select', (id: string) => {
  const product = catalog.getProductById(id);
  if (product) {
    catalog.setSelectedProduct(product);
  }
});

events.on('product:buy', (id: string) => {
  const product = catalog.getProductById(id);
  if (product) {
    if (cart.hasItem(id)) {
      cart.removeItem(product);
    } else {
      cart.addItem(product);
    }
  }
  modal.close();
});

events.on('product:remove', (id: string) => {
  const product = catalog.getProductById(id);
  if (product) {
    cart.removeItem(product);
  }
});

events.on('cart:open', () => {
  const items = cart.getItems().map(product => {
    const card = new CardBasket(cloneTemplate('#card-basket'), {
      onDelete: () => events.emit('product:remove', product.id)
    });
    card.render(product);
    return card.container;
  });

  const basket = new Basket(cloneTemplate('#basket'), events);
  basket.render({
    items,
    price: cart.getTotalPrice(),
    isEmpty: cart.getCount() === 0
  });
  
  modal.content = basket.container;
  modal.open();
});

events.on('order:start', () => {
  const orderForm = new OrderForm(cloneTemplate('#order-form'), events);
  modal.content = orderForm.container;
  modal.open();
});

events.on('order:next', () => {
  const contactsForm = new ContactsForm(cloneTemplate('#contacts-form'), events);
  modal.content = contactsForm.container;
  modal.open();
});

events.on('order:pay', () => {
  const errors = buyer.validate();
  if (Object.keys(errors).length === 0) {
    // Отправка заказа на сервер
    console.log('Заказ оформлен:', buyer.getData());
    cart.clear();
    buyer.clear();
    
    const success = new Success(cloneTemplate('#success'), () => modal.close());
    success.render({ total: cart.getTotalPrice() });
    modal.content = success.container;
    modal.open();
  }
});

events.on('order:changed', (data: {field: string, value: string}) => {
  buyer.setData({ [data.field]: data.value as any });
});

events.on('contacts:changed', (data: {field: string, value: string}) => {
  buyer.setData({ [data.field]: data.value });
});
