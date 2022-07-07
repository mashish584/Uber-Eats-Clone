import { Basket, BasketDish, Dish, Order, OrderDish, Restaurant, User } from "../models";

export interface AuthContextInterface {
  authUser: string | null;
  dbUser: User | null;
  queryUser: (() => void) | null;
  setDbUser: ((user: User) => void) | null;
}

export interface BasketContextInterface {
  restaurant: Restaurant | null;
  basket: Basket | null;
  basketDishes: BasketDish[];
  totalPrice: number;
  addDishToBasket: ((dish: Dish, quantity: number) => void) | null;
  resetBasketInfo: (() => void) | null;
  setRestaurant: ((restaurant: Restaurant | null) => void) | null;
}

export type OrderInfoI = Order & { dishes: OrderDish[] };
export interface OrderContextInterface {
  orders: Order[];
  createOrder: (() => Promise<Order>) | null;
  getOrder: ((id: string) => Promise<OrderInfoI>) | null;
}
