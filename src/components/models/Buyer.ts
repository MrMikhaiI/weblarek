// src/components/Models/Buyer.ts
import { IBuyer } from "../../types";

/**
 * Класс Buyer — управляет данными покупателя.
 * Отвечает за хранение и изменение данных, их валидацию.
 */
export class Buyer {
  private payment: IBuyer["payment"]; // способ оплаты
  private email: string;              // email покупателя
  private phone: string;              // телефон покупателя
  private address: string;            // адрес доставки

  /**
   * Конструктор класса
   * @param data - объект с начальными данными покупателя (необязательно)
   */
  constructor(data?: IBuyer) {
    this.payment = data?.payment || "card"; // по умолчанию "карта"
    this.email = data?.email || "";
    this.phone = data?.phone || "";
    this.address = data?.address || "";
  }

  /**
   * Устанавливает данные покупателя. Можно передавать только поля, которые нужно изменить.
   * @param data - объект Partial<IBuyer> с полями для изменения
   */
  setData(data: Partial<IBuyer>): void {
    this.payment = data.payment ?? this.payment;
    this.email = data.email ?? this.email;
    this.phone = data.phone ?? this.phone;
    this.address = data.address ?? this.address;
  }

  /**
   * Возвращает все данные покупателя
   * @returns объект IBuyer с текущими значениями полей
   */
  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  /**
   * Очищает данные покупателя, сбрасывая их к значениям по умолчанию
   */
  clear(): void {
    this.payment = "card";
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  /**
   * Проверяет валидность каждого поля покупателя
   * @returns объект с флагами валидности каждого поля
   */
  validate(): { payment: boolean; email: boolean; phone: boolean; address: boolean } {
    return {
      payment: this.payment !== undefined,
      email: this.email.includes("@"),
      phone: this.phone.length >= 10,
      address: this.address.length > 5,
    };
  }

  /**
   * Проверяет общую валидность данных покупателя
   * @returns true, если все поля валидны
   */
  isValid(): boolean {
    const v = this.validate();
    return v.payment && v.email && v.phone && v.address;
  }
}
