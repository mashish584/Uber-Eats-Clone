import React from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";
import { DataStore } from "aws-amplify";

import RestaurantItem from "../../components/RestaurantItem";
import { Restaurant } from "../../models";

const HomeScreen = () => {
  const [restaturants, setRestaurants] = React.useState<Restaurant[]>([]);

  const fetchRestaurants = async () => {
    const results = await DataStore.query(Restaurant);
    setRestaurants(results);
  };

  React.useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <View style={styles.page}>
      <FlatList
        data={restaturants}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: "center" }}>No restaurants available.</Text>
        )}
        renderItem={({ item }) => {
          const restaturant = {
            id: item.id,
            name: item.name,
            image: item.image,
            deliveryFee: item.deliveryFee,
            minDeliveryTime: item.minDeliveryTime,
            maxDeliveryTime: item.maxDeliveryTime,
            rating: item.rating,
          };

          return (
            <>
              <RestaurantItem {...restaturant} />
            </>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 10,
  },
});

export default HomeScreen;
