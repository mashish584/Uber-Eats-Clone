import React, { useState } from "react";
import { Text, TextInput, StyleSheet, Button, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth, DataStore } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";

import { User } from "../../models";
import { useAuthContext } from "../../context/AuthContext";
import { ScreenNavigationProp } from "../../navigation/types";

const Profile = () => {
  const { authUser, setDbUser, dbUser } = useAuthContext();

  const [name, setName] = useState(dbUser?.name || "");
  const [address, setAddress] = useState(dbUser?.address || "");
  const [lat, setLat] = useState(dbUser?.lat ? dbUser.lat + "" : "0");
  const [lng, setLng] = useState(dbUser?.lng ? dbUser.lng + "" : "0");

  const navigation = useNavigation<ScreenNavigationProp>();

  const createUser = async () => {
    try {
      const user = await DataStore.save(
        new User({
          name,
          address,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          sub: authUser || "",
        })
      );
      console.log(`Creating user ✅`);
      setDbUser?.(user);
    } catch (err: any) {
      Alert.alert("Error", err ? err.message : "Something went wrong.");
    }
  };

  const updateUser = async () => {
    try {
      if (dbUser) {
        const user = await DataStore.save(
          User.copyOf(dbUser, (updated) => {
            updated.name = name;
            updated.address = address;
            updated.lat = parseFloat(lat);
            updated.lng = parseFloat(lng);
          })
        );
        console.log(`Updating user ✅`);
        setDbUser?.(user);
      }
    } catch (err: any) {
      Alert.alert("Error", err ? err.message : "Something went wrong.");
    }
  };

  const onSave = async () => {
    if (dbUser) {
      await updateUser();
      navigation.goBack();
    } else {
      await createUser();
    }
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        style={styles.input}
      />
      <TextInput
        value={lat}
        onChangeText={setLat}
        placeholder="Latitude"
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        value={lng}
        onChangeText={setLng}
        placeholder="Longitude"
        style={styles.input}
      />
      <Button onPress={onSave} title="Save" />
      <Button onPress={() => Auth.signOut()} title="Sign Out" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
});

export default Profile;
