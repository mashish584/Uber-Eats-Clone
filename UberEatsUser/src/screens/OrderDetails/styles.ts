import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
  },
  title: {
    fontSize: 35,
    fontWeight: "600",
    marginVertical: 10,
  },
  subTitle: {
    fontSize: 15,
    color: "grey",
  },
  container: {
    margin: 10,
  },
  iconContainer: {
    position: "absolute",
    top: 40,
    left: 10,
  },
  menuTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.7,
    marginLeft: 10,
    marginBottom: 15,
  },
  main: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: 0.5,
    paddingBottom: 5,
  },
});

export default styles;
