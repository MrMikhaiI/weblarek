import './scss/styles.scss';
import { Api, EventEmitter } from './components/base/index';
import { Catalog, Cart, Buyer, Communication } from './components/models/index';
import { 
  Gallery, Header, Modal, CardCatalog, CardPreview, CardBasket,
  OrderForm, ContactsForm, Success, Basket 
} from './components/views/index';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL } from './utils/constants';     
import { IOrderRequest, IProduct } from './types';

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
const orderForm = new OrderForm(cloneTemplate('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate('#contacts'), events);
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
    const card = new CardCatalog(cloneTemplate('#card-catalog') as HTMLElement, { 
      onSelect: () => events.emit('products:select', { id: product.id })  
    });
    return card.render(product) as HTMLElement;  
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
  
  modal.content = cardPreview.render(product) as HTMLElement;
  modal.open();
});

events.on('cart:itemsChanged', () => {
  header.counter = cart.getCount();
  basketView.items = cart.getItems().map(product => {
    const card = new CardBasket(cloneTemplate('#card-basket') as HTMLElement, {
      onDelete: () => events.emit('product:remove', { id: product.id })
    });
    return card.render(product) as HTMLElement;
  });
  basketView.price = cart.getTotalPrice();
});

events.on('buyer:dataChanged', () => {
  const buyerData = buyer.getData();
  const errors = buyer.validate();

  orderForm.address = buyerData.address || '';
  orderForm.payment = buyerData.payment || '';   

  contactsForm.email = buyerData.email || '';
  contactsForm.phone = buyerData.phone || '';

  // Ошибки для orderForm (payment + address)
  const orderErrors: string[] = [];
  if (errors.payment) orderErrors.push(errors.payment);
  if (errors.address) orderErrors.push(errors.address);
  orderForm.errors = orderErrors;
  orderForm.valid = orderErrors.length === 0;

  // Ошибки для contactsForm (email + phone)
  const contactsErrors: string[] = [];
  if (errors.email) contactsErrors.push(errors.email);
  if (errors.phone) contactsErrors.push(errors.phone);
  contactsForm.errors = contactsErrors;
  contactsForm.valid = contactsErrors.length === 0;
});

// 3. СОБЫТИЯ VIEW
events.on('products:select', (event: { id: string }) => {
  const product = catalog.getProductById(event.id);
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

events.on('product:remove', (event: { id: string }) => {
  const product = catalog.getProductById(event.id);
  if (product) {
    cart.removeItem(product);
  }
});

events.on('cart:open', () => {
  modal.content = basketView.render(); 
  modal.open();
});

events.on('order:start', () => {
  modal.content = orderForm.render();    
  modal.open();
});

events.on('order:next', () => {
  modal.content = contactsForm.render();
  modal.open();
});

events.on('order:pay', async () => {
  const errors = buyer.validate();
  if (Object.keys(errors).length === 0) {
    const buyerData = buyer.getData();
    if (buyerData.payment === '') return;  
    
    const orderData: IOrderRequest = {
      ...buyerData,
      total: cart.getTotalPrice(),
      items: cart.getItems().map(item => item.id)
    } as IOrderRequest;  
    
    try {
      const response = await communication.sendOrder(orderData);
      cart.clear();
      buyer.clear();
      successView.render({ total: response.total });
      modal.content = successView.render({ total: response.total });
      modal.open();
    } catch (error) { }
  }
});

events.on('order:changed', (data: {field: string, value: string}) => {
  buyer.setData({ [data.field]: data.value as string });
});

events.on('contacts:changed', (data: {field: string, value: string}) => {
  buyer.setData({ [data.field]: data.value });
});
