import { DataStore } from "aws-amplify";
import React from "react";
import { BasketDish, Dish, Restaurant } from "../models";
import { Basket } from "../models";
import { useAuthContext } from "./AuthContext";
import { BasketContextInterface } from "./types";

const initialState: BasketContextInterface = {
  restaurant: null,
  basket: null,
  basketDishes: [],
  totalPrice: 0,
  addDishToBasket: null,
  resetBasketInfo: null,
  setRestaurant: null,
};

const BasketContext = React.createContext(initialState);

const BasketProvider: React.FC = ({ children }) => {
  const { dbUser } = useAuthContext();
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null);
  const [basket, setBasket] = React.useState<Basket | null>(null);
  const [basketDishes, setBasketDishes] = React.useState<BasketDish[]>([]);

  const totalPrice =
    basketDishes.length > 0
      ? basketDishes.reduce(
          (prev, dish) => prev + (dish?.Dish?.price || 0) * dish.quantity,
          restaurant?.deliveryFee || 0
        )
      : 0;

  const createNewBasket = async () => {
    if (dbUser?.id && restaurant?.id) {
      const basket = await DataStore.save(
        new Basket({
          userID: dbUser.id,
          restaurantID: restaurant.id,
        })
      );
      setBasket(basket);
      console.log(`New basket created (${basket.id}) ✅ `);
      return basket;
    }
  };

  const addDishToBasket = async (dish: Dish, quantity: number) => {
    let theBasket = basket || (await createNewBasket());
    if (theBasket) {
      const newDish = await DataStore.save(
        new BasketDish({ quantity, Dish: dish, basketID: theBasket.id })
      );
      setBasketDishes([...basketDishes, newDish]);
    }
  };

  const resetBasketInfo = () => {
    setBasket(null);
    setBasketDishes([]);
  };

  const updateRestaurant = (restaurant: Restaurant | null) => {
    setRestaurant(restaurant);
  };

  React.useEffect(() => {
    if (dbUser?.id && restaurant?.id) {
      DataStore.query(Basket, (b) =>
        b.restaurantID("eq", restaurant.id).userID("eq", dbUser.id)
      ).then((baskets) => setBasket(baskets[0]));
    }
  }, [dbUser, restaurant]);

  React.useEffect(() => {
    if (basket) {
      DataStore.query(BasketDish, (bd) => bd.basketID("eq", basket.id)).then(setBasketDishes);
    }
  }, [basket]);

  return (
    <BasketContext.Provider
      value={{
        addDishToBasket,
        restaurant,
        setRestaurant: updateRestaurant,
        basket,
        basketDishes,
        totalPrice,
        resetBasketInfo,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasketContext = () => React.useContext(BasketContext);
export default BasketProvider;
