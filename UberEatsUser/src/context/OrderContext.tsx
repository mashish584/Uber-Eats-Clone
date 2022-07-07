import { DataStore } from "aws-amplify";
import React from "react";
import { OrderDish } from "../models";
import { Order } from "../models";
import { useAuthContext } from "./AuthContext";
import { useBasketContext } from "./BasketContext";
import { OrderContextInterface } from "./types";

const initialState: OrderContextInterface = {
  orders: [],
  createOrder: null,
  getOrder: null,
};

const OrderContext = React.createContext(initialState);

const OrderProvider: React.FC = ({ children }) => {
  const { dbUser } = useAuthContext();
  const { restaurant, totalPrice, basket, basketDishes, resetBasketInfo } = useBasketContext();

  const [orders, setOrders] = React.useState<Order[]>([]);

  const createOrder = async () => {
    //create order
    const newOrder = await DataStore.save(
      new Order({
        userID: dbUser?.id as string,
        Restaurant: restaurant,
        status: "NEW",
        total: parseFloat(totalPrice.toFixed(2)),
      })
    );

    //add order dishes
    await Promise.all(
      basketDishes.map((basketDish) =>
        DataStore.save(
          new OrderDish({
            quantity: basketDish.quantity,
            orderID: newOrder.id,
            Dish: basketDish.Dish,
          })
        )
      )
    );

    //delete basket once order created
    if (basket) await DataStore.delete(basket);

    setOrders([...orders, newOrder]);
    console.log(`Order created ✅`);

    resetBasketInfo?.();

    return newOrder;
  };

  React.useEffect(() => {
    if (dbUser?.id) {
      DataStore.query(Order, (o) => o.userID("eq", dbUser.id)).then(setOrders);
    }
  }, [dbUser]);

  const getOrder = async (id: string) => {
    const order = (await DataStore.query(Order, id)) as Order;
    const orderDishes = await DataStore.query(OrderDish, (od) => od.orderID("eq", id));
    return { ...order, dishes: orderDishes };
  };

  return (
    <OrderContext.Provider value={{ createOrder, orders, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => React.useContext(OrderContext);

export default OrderProvider;
