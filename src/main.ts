import './scss/styles.scss'; 
import { Api } from './components/base/Api'; 
import { Communication } from './components/models/Communication';  
import { Catalog } from "./components/models/Catalog";            
import { Cart } from "./components/models/Cart";                   
import { Buyer } from "./components/models/Buyer";               
import { apiProducts } from "./utils/data"; 
import { API_URL } from "./utils/constants"; 

// Создаём экземпляры классов
const api = new Api(API_URL); 
const communication = new Communication(api); 
const catalog = new Catalog(); 
const cart = new Cart(); 
const buyer = new Buyer(); 

// === 1. Получаем товары с сервера ===
communication.getProductList() 
  .then(products => { 
    catalog.setProducts(products); 
    console.log('Каталог с сервера:', catalog.getProducts()); 
  })
  .catch(err => console.error('Ошибка сервера:', err));

// === 2. Тестируем Catalog ===
catalog.setProducts(apiProducts.items.map(item => ({ 
  ...item, 
  price: item.price || 0  
})));
console.log("\n=== Тест Catalog ===");
console.log("Все товары:", catalog.getProducts()); 

const realProduct = catalog.getProductById(apiProducts.items[0].id); 
console.log(`Товар по id '${realProduct?.id}':`, realProduct); 

if (realProduct) {
  catalog.setSelectedProduct(realProduct); 
  console.log("Выбранный товар:", catalog.getSelectedProduct()); 
}

// === 3. Тестируем Cart ===
console.log("\n=== Тест Cart ===");
console.log("Начальная корзина:", cart.getItems()); 

if (realProduct) {
  cart.addItem(realProduct); 
  console.log("После добавления:", cart.getItems()); 
  console.log("Есть товар?", cart.hasItem(realProduct.id)); 
  console.log("Стоимость:", cart.getTotalPrice()); 
  console.log("Количество:", cart.getCount()); 
}

if (realProduct) {
  cart.removeItem(realProduct); 
}
console.log("После удаления:", cart.getItems()); 
cart.clear(); 
console.log("После очистки:", cart.getItems()); 

// === 4. Тестируем Buyer ===
console.log("\n=== Тест Buyer (реальный сценарий) ===");

console.log("1. Изначально (пусто):", buyer.getData()); 
console.log("1. Валидация (все ошибки):", buyer.validate()); 

buyer.setData({ payment: "card" }); 
console.log("2. Только payment:", buyer.getData()); 
console.log("2. Валидация:", buyer.validate()); 

buyer.setData({ email: "user@example.com" }); 
console.log("3. +email:", buyer.getData()); 
console.log("3. Валидация:", buyer.validate()); 

buyer.setData({ phone: "1234567890", address: "ул. Пушкина, 1" }); 
console.log("4. Полные данные:", buyer.getData()); 
console.log("4. Валидация:", buyer.validate()); 

buyer.clear(); 
console.log("5. После очистки:", buyer.getData()); 
console.log("5. Валидация (все ошибки):", buyer.validate());
