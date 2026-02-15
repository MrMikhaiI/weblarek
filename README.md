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

### Данные

Используются две сущности: **товар** и **покупатель**.

#### Интерфейс `IProduct`

Определяет структуру товара.

**Поля интерфейса:**  
- `id: string` — уникальный идентификатор товара  
- `title: string` — название товара (в карточках и корзине)  
- `description: string` — подробное описание товара  
- `image: string` — путь к изображению товара  
- `category: string` — категория товара  
- `price: number | null` — цена товара (может отсутствовать)

#### Интерфейс `IBuyer`

Определяет структуру данных покупателя для оформления заказа.

**Поля интерфейса:**  
- `payment: TPayment` — способ оплаты  
- `address: string` — адрес доставки  
- `email: string` — email покупателя  
- `phone: string` — телефон покупателя

**Тип `TPayment`:**  
`type TPayment = 'card' | 'cash' | ''` — ограниченный набор способов оплаты.

### Модели данных

#### Класс `ProductCatalog`

Хранит каталог товаров и выбранный товар.

**Конструктор:**  
`constructor()` — инициализирует пустые списки товаров.

**Поля класса:**  
`protected products: IProduct[]` — массив всех товаров.  
`protected selectedProduct: IProduct | null` — выбранный товар.

**Методы:**  
`saveProducts(products: IProduct[]): void` — сохраняет массив товаров.  
`getProducts(): IProduct[]` — возвращает все товары.  
`getProductByID(id: string): IProduct | undefined` — товар по ID.  
`saveProduct(product: IProduct | null): void` — сохраняет выбранный товар.  
`getProduct(): IProduct | null` — возвращает выбранный товар.

#### Класс `ShoppingCart`

Управляет корзиной покупок.

**Конструктор:**  
`constructor()` — инициализирует пустую корзину.

**Поля класса:**  
`protected selectedProducts: IProduct[]` — товары в корзине.

**Методы:**  
`getSelectedProducts(): IProduct[]` — товары корзины.  
`addSelectedProduct(product: IProduct): void` — добавляет товар.  
`deleteSelectedProduct(id: string): void` — удаляет товар по ID.  
`clearShoppingCart(): void` — очищает корзину.  
`getTotal(): number` — общая стоимость.  
`getSelectedProductsAmount(): number` — количество товаров.  
`checkSelectedProduct(id: string): boolean` — проверка наличия товара.

#### Класс `Buyer`

Хранит и валидирует данные покупателя.

**Конструктор:**  
`constructor()` — инициализирует пустые данные.

**Поля класса:**  
`protected buyerData: IBuyer` — данные покупателя.

**Методы:**  
`savePaymentType(payment: TPayment): void` — сохраняет способ оплаты.  
`saveAddress(address: string): void` — сохраняет адрес.  
`saveEmail(email: string): void` — сохраняет email.  
`savePhone(phone: string): void` — сохраняет телефон.  
`getData(): IBuyer` — возвращает все данные.  
`clearBuyerData(): void` — очищает данные.  
`validate(): {payment: string, address: string, email: string, phone: string}` — валидация полей.

### Слой коммуникации

#### Класс `ServerApi`

Работа с сервером через композицию с `Api`.

**Конструктор:**  
`constructor(api: IApi)` — принимает экземпляр `Api`.

**Поля класса:**  
`protected api: IApi` — объект для запросов.

**Методы:**  
`getProducts(): Promise<IResult>` — загрузка товаров (`/product/`).  
`postOrder(orderRequest: IOrderRequest): Promise<IOrderResponse>` — отправка заказа (`/order/`).
