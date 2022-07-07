import { DataStore } from "aws-amplify";
import React, { useContext } from "react";
import { ZenObservable } from "zen-observable-ts";
import { OrderDish } from "../models";
import { User } from "../models";
import { Order } from "../models";
import { useAuthContext } from "./AuthContext";
import { OrderContextInterface, OrderInfo } from "./types";

const initalState: OrderContextInterface = {
  order: null,
  orderInfo: null,
  fetchOrder: null,
  pickupOrder: null,
  completeOrder: null,
  onAcceptOrder: null,
};

const OrderContext = React.createContext(initalState);

const OrderContextProvider: React.FC = ({ children }) => {
  const { dbCourier } = useAuthContext();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [orderInfo, setOrderInfo] = React.useState<OrderInfo>({
    user: null,
    dishes: [],
  });

  const fetchOrder = async (orderId: string) => {
    try {
      const order = await DataStore.query(Order, orderId);
      if (order) {
        const orderInfo = {} as OrderInfo;
        orderInfo.user = await DataStore.query(User, order.userID);
        orderInfo.dishes = await DataStore.query(OrderDish, (orderDish) =>
          orderDish.orderID("eq", order.id)
        );
        setOrderInfo(orderInfo);
        setOrder(order);
      }
    } catch (err: any) {
      console.warn(err.message);
    }
  };

  const onAcceptOrder = async () => {
    if (order) {
      const savedOrder = await DataStore.save(
        Order.copyOf(order, (updated) => {
          updated.status = "ACCEPTED";
          updated.Courier = dbCourier;
        })
      );
      setOrder(savedOrder);
    }
  };

  const pickupOrder = async () => {
    if (order) {
      const savedOrder = await DataStore.save(
        Order.copyOf(order, (updated) => {
          updated.status = "PICKED_UP";
        })
      );

      setOrder(savedOrder);
    }
  };

  const completeOrder = async () => {
    if (order) {
      const savedOrder = await DataStore.save(
        Order.copyOf(order, (updated) => {
          updated.status = "COMPLETED";
        })
      );
      setOrder(savedOrder);
    }
  };

  React.useEffect(() => {
    let observer: ZenObservable.Subscription;
    if (order?.id) {
      observer = DataStore.observe(Order, order.id).subscribe(({ opType, element }) => {
        if (opType === "UPDATE") {
          fetchOrder(element.id);
        }
      });
    }
    return () => observer?.unsubscribe?.();
  }, [order?.id]);

  return (
    <OrderContext.Provider
      value={{ onAcceptOrder, fetchOrder, order, orderInfo, pickupOrder, completeOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);

export default OrderContextProvider;
