// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const TransportationModes = {
  "DRIVING": "DRIVING",
  "BICYCLING": "BICYCLING"
};

const OrderStatus = {
  "NEW": "NEW",
  "COOKING": "COOKING",
  "READY_FOR_PICKUP": "READY_FOR_PICKUP",
  "PICKED_UP": "PICKED_UP",
  "COMPLETED": "COMPLETED",
  "ACCEPTED": "ACCEPTED"
};

const { Courier, OrderDish, Dish, Order, Restaurant, Basket, BasketDish, User } = initSchema(schema);

export {
  Courier,
  OrderDish,
  Dish,
  Order,
  Restaurant,
  Basket,
  BasketDish,
  User,
  TransportationModes,
  OrderStatus
};