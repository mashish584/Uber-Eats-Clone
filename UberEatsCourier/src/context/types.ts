import { Courier, Dish, Order, OrderDish, User } from "../models";

export type OrderInfo = {
  user: User | null | undefined;
  dishes: OrderDish[];
};

export interface AuthContextInterface {
  authUser: string | null;
  dbCourier: Courier | null;
  queryUser: (() => void) | null;
  setDbCourier: ((user: Courier) => void) | null;
}

export interface OrderContextInterface {
  order: Order | null;
  orderInfo: OrderInfo | null;
  fetchOrder: ((orderId: string) => void) | null;
  pickupOrder: (() => void) | null;
  completeOrder: (() => void) | null;
  onAcceptOrder: (() => void) | null;
}
