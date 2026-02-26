import './scss/styles.scss';
import { Api, EventEmitter } from './components/base/index';
import { Catalog, Cart, Buyer, Communication } from './components/models/index';
import { 
  Gallery, Header, Modal, CardCatalog, CardPreview, CardBasket,
  OrderForm, ContactsForm, Success, Basket 
} from './components/views/index';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL } from './utils/constants';
import { IOrderRequest } from './types';

// Инициализация моделей
const events = new EventEmitter();
const api = new Api(API_URL);
const communication = new Communication(api);

const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// VIEW КОМПОНЕНТЫ (статичные)
const gallery = new Gallery(ensureElement('.gallery'));
const header = new Header(ensureElement('.header'), events);
const modal = new Modal(ensureElement('#modal-container'), events);

// МОДАЛЬНЫЕ VIEW (статичные экземпляры)
const orderForm = new OrderForm(cloneTemplate('#order-form'), events);
const contactsForm = new ContactsForm(cloneTemplate('#contacts-form'), events);
const successView = new Success(cloneTemplate('#success'), () => modal.close());
const basketView = new Basket(cloneTemplate('#basket'), events);

// 1. ЗАГРУЗКА КАТАЛОГА
communication.getProductList().then(products => {
  catalog.setProducts(products);
});

// 2. СОБЫТИЯ МОДЕЛЕЙ
events.on('catalog:productsChanged', () => {
  const products = catalog.getProducts();
  const items = products.map(product => {
    const card = new CardCatalog(cloneTemplate('#card-catalog'), events, 
      (id: string) => events.emit('products:select', { id })
    );
    return card.render(product); 
  });  
  gallery.catalog = items;
});


events.on('catalog:selectedChanged', (product: IProduct) => {
  const cardPreview = new CardPreview(cloneTemplate('#card-preview'), {
    onClick: () => events.emit('product:buy:toggle')
  });
  
  cardPreview.render(product);
  const isInCart = cart.hasItem(product.id);
  cardPreview.setButtonText(isInCart ? 'Удалить из корзины' : 'Купить', product);
  
  modal.content = cardPreview.container;
  modal.open();
});

events.on('cart:itemsChanged', () => {
  header.counter = cart.getCount();
  
  basketView.render({
    items: cart.getItems().map(product => {
      const card = new CardBasket(cloneTemplate('#card-basket'), events, 
        (id: string) => events.emit('product:remove', { id })  
      );
      card.render(product);
      return card.render();
    }),
    price: cart.getTotalPrice(),
    isEmpty: cart.getCount() === 0
  });
});

events.on('buyer:dataChanged', () => {
  const errors = buyer.validate();

  orderForm.errors = Object.values(errors);
  contactsForm.errors = Object.values(errors);
  orderForm.valid = Object.keys(errors).length === 0;
  contactsForm.valid = Object.keys(errors).length === 0;
});

// 3. СОБЫТИЯ VIEW
events.on('products:select', (id: string) => {
  const product = catalog.getProductById(id);
  if (product) {
    catalog.setSelectedProduct(product);
  }
});

events.on('product:buy:toggle', () => {
  const product = catalog.getSelectedProduct();
  if (product) {
    if (cart.hasItem(product.id)) {
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
  modal.content = basketView.container;
  modal.open();
});

events.on('order:start', () => {
  orderForm.render({});
  modal.content = orderForm.container;
  modal.open();
});

events.on('order:next', () => {
  contactsForm.render({});
  modal.content = contactsForm.container;
  modal.open();
});

events.on('order:pay', async () => {
  const errors = buyer.validate();
  if (Object.keys(errors).length === 0) {
    const orderData: IOrderRequest = {
      ...buyer.getData(),
      total: cart.getTotalPrice(),
      items: cart.getItems().map(item => item.id)
    };
    
    try {
      const response = await communication.sendOrder(orderData); 
      
      cart.clear();
      buyer.clear();

      successView.render({ total: response.total }); 
      modal.content = successView.container;
      modal.open();
    } catch (error) { }
  }
});

events.on('order:changed', (data: {field: string, value: string}) => {
  buyer.setData({ [data.field]: data.value as TPayment | string });
});

events.on('contacts:changed', (data: {field: string, value: string}) => {
  buyer.setData({ [data.field]: data.value });
});
