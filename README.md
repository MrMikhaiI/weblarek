# Проектная работа "Веб-ларек"
**Стек:** HTML, SCSS, TS, Vite

**Структура проекта:**
- `src/` — исходные файлы проекта
- `src/components/` — папка с JS-компонентами  
- `src/components/base/` — папка с базовым кодом

**Важные файлы:**
- `index.html` — HTML-файл главной страницы
- `src/types/index.ts` — файл с типами
- `src/main.ts` — точка входа приложения
- `src/scss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — файл с константами
- `src/utils/utils.ts` — файл с утилитами

---

## Установка и запуск

Для установки и запуска проекта выполните команды:

```bash
npm install
npm run start
```

или

```bash
yarn
yarn start
```

## Сборка

```bash
npm run build
```

или

```bash
yarn build
```

---

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — интернет-магазин товаров для веб-разработчиков. Пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы через удобный интерфейс с модальными окнами.

## Архитектура приложения

Код разделён на слои по парадигме **MVP** (Model-View-Presenter):

- **Model** — слой данных, отвечает за хранение и изменение данных
- **View** — слой представления, отвечает за отображение данных на странице  
- **Presenter** — содержит основную логику и связывает View с Model

Взаимодействие организовано через **события**. Модели и View генерируют события, а Presenter их обрабатывает.

### Базовый код

#### Класс `Component`

Базовый класс для всех компонентов интерфейса. Дженерик с типом `T` для данных.

**Конструктор:**  
`constructor(container: HTMLElement)` — принимает DOM-элемент для отображения.

**Поля класса:**  
`container: HTMLElement` — корневой DOM-элемент компонента.

**Методы класса:**  
`render(data?: Partial<T>): HTMLElement` — главный метод рендеринга данных.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` — устанавливает изображение для `<img>`.

#### Класс `Api`

Базовая логика HTTP-запросов.

**Конструктор:**  
`constructor(baseUrl: string, options: RequestInit = {})` — базовый URL сервера и настройки запросов.

**Поля класса:**  
`baseUrl: string` — адрес сервера.  
`options: RequestInit` — заголовки запросов.

**Методы:**  
`get(uri: string): Promise<object>` — GET-запрос.  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` — POST-запрос.  
`handleResponse(response: Response): Promise<object>` — обработка ответа сервера.

#### Класс `EventEmitter`

Брокер событий (паттерн «Наблюдатель») для связи слоёв данных и представления.

**Конструктор:** не принимает параметров.

**Поля класса:**  
`_events: Map<string | RegExp, Set<Function>>` — коллекция подписок на события.

**Методы класса:**  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` — подписка на событие.  
`emit<T extends object>(event: string, data?: T): void` — генерация события.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` — создание обработчика события.

## Данные 

Используются две сущности: **товар** и **покупатель**. 

#### Интерфейс `IProduct` 
Определяет структуру товара **из реального API**. 
**Поля интерфейса:**   
- `id: string` — уникальный идентификатор товара   
- `title: string` — название товара  
- `description: string` — подробное описание товара   
- `image: string` — путь к изображению товара   
- `category: string` — категория товара   
- `price: number | null` — **цена товара (может отсутствовать)** 

#### Интерфейс `IOrderRequest` 
**Реальные данные для POST `/order/`**:
**Поля интерфейса:**   
- `payment: TPayment` — способ оплаты (`'online' | 'offline'`)  
- `address: string` — адрес доставки   
- `email: string` — email покупателя   
- `phone: string` — телефон покупателя
- `total: number` — общая сумма заказа
- `items: string[]` — **массив ID товаров**

**Тип `TPayment`:** `type TPayment = 'online' | 'offline'`

### Модели данных 

#### Класс `Catalog` 

**Конструктор:** `constructor()` — инициализирует пустые списки товаров. 
**Поля класса:**   
- `private products: IProduct[]` — массив всех товаров.   
- `private selectedProduct: IProduct | null` — выбранный товар. 
**Методы:**   
- `setProducts(products: IProduct[]): void` — сохраняет массив товаров.   
- `getProducts(): IProduct[]` — возвращает все товары.   
- `getProductById(id: string): IProduct | undefined` — товар по ID.   
- `setSelectedProduct(product: IProduct): void` — сохраняет выбранный товар.   
- `getSelectedProduct(): IProduct | null` — возвращает выбранный товар. 

#### Класс `Cart` 

**Конструктор:** `constructor()` — инициализирует пустую корзину. 
**Поля класса:**   
- `private items: IProduct[]` — товары в корзине. 
**Методы:**   
- `getItems(): IProduct[]` — товары корзины.   
- `addItem(product: IProduct): void` — добавляет товар.   
- `removeItem(product: IProduct): void` — удаляет товар.   
- `clear(): void` — очищает корзину.   
- `getTotalPrice(): number` — общая стоимость.   
- `getCount(): number` — количество товаров.   
- `hasItem(id: string): boolean` — проверка наличия товара. 

#### Класс `Buyer` 

**Конструктор:** `constructor()` — **пустой конструктор**. 
**Поля класса:**   
- `private payment: TPayment | ""` — способ оплаты  
- `private email: string` — email покупателя
- `private phone: string` — телефон покупателя
- `private address: string` — адрес доставки
**Методы:**   
- `setData(data: Partial<IBuyer>): void` — обновляет данные (по частям).   
- `getData(): {payment: TPayment | '', email: string, phone: string, address: string}` — **честный тип без cast'ов**.   
- `clear(): void` — очищает данные.   
- `validate(): Partial<Record<keyof IBuyer, string>>` — возвращает ошибки валидации. 

### Слой коммуникации 

#### Класс `Communication` 
Работа с **реальным Postman API** через композицию с `Api`. 
**Конструктор:** `constructor(api: IApi)` — принимает экземпляр `IApi`. 
**Поля класса:**   
- `private api: IApi` — объект для запросов. 
**Методы:**   
- `getProductList(): Promise<IProduct[]>` — загрузка товаров (`GET /product/`).   
- `sendOrder(orderRequest: IOrderRequest): Promise<IOrderResponse>` — **отправка заказа** (`POST /order/`).

## Слой Представления (View)

### Класс `Gallery`
**Конструктор:** `constructor(container: HTMLElement)`  
**Поля:** `container: HTMLElement`  
**Методы:** `set catalog(items: HTMLElement[])` — заменяет содержимое каталога.

### Класс `Header`  
**Конструктор:** `constructor(container: HTMLElement, events: IEvents)`  
**Поля:** `basketButton: HTMLButtonElement`, `counterElement: HTMLElement`  
**Методы:** `set counter(value: number)` — обновляет счётчик корзины.

### Класс `Modal`
**Конструктор:** `constructor(container: HTMLElement, events: IEvents)`  
**Поля:** `closeButton: HTMLButtonElement`, `contentElement: HTMLElement`  
**Методы:** 
- `set content(element: HTMLElement)` — заменяет содержимое модалки
- `open(): void` — открывает модалку
- `close(): void` — закрывает модалку

### Класс `Basket`
**Конструктор:** `constructor(container: HTMLElement, events: IEvents)`  
**Интерфейс:** `IBasket { items: HTMLElement[], price: number, isEmpty: boolean }`  
**Поля:** `listElement: HTMLElement`, `orderButton: HTMLButtonElement`, `priceElement: HTMLElement`  
**Методы:** `render(data: IBasket): void` — рендерит корзину.

### Класс `Success`
**Конструктор:** `constructor(container: HTMLElement, onClose: () => void)`  
**Интерфейс:** `ISuccess { total: number }`  
**Методы:** `render(data: ISuccess): void` — показывает успешную оплату.

### Иерархия классов Card
**Card** (абстрактный базовый класс)
- **CardCatalog** — каталог товаров
  - **Конструктор:** `constructor(container: HTMLElement, events: IEvents, onSelect: (id: string) => void)`
  - **Методы:** `render(product: IProduct): HTMLElement`
- **CardPreview** — модальное окно товара
  - **Конструктор:** `constructor(container: HTMLElement, callbacks: { onClick: () => void })`
  - **Методы:** `render(product: IProduct): void`, `setButtonText(text: string, product?: IProduct)`
- **CardBasket** — карточка в корзине
  - **Конструктор:** `constructor(container: HTMLElement, events: IEvents, onDelete: (id: string) => void)`
  - **Методы:** `render(product: IProduct): HTMLElement`

### Иерархия Form
**Form** (абстрактный базовый класс)
- **OrderForm** — форма оплаты и адреса
  - **Конструктор:** `constructor(container: HTMLFormElement, events: IEvents)`
  - **Поля:** `paymentButtons: NodeListOf<HTMLButtonElement>`, `addressInput: HTMLInputElement`
  - **Методы:** `set payment(value: string)`, `set address(value: string)`
- **ContactsForm** — форма контактов
  - **Конструктор:** `constructor(container: HTMLFormElement, events: IEvents)`
  - **Поля:** `emailInput: HTMLInputElement`, `phoneInput: HTMLInputElement`
  - **Методы:** `set email(value: string)`, `set phone(value: string)`
