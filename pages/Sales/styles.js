import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 6,
  },
  list: {
    width: "100%",
    margin: 6,
    marginBottom: "auto",
  },
  cardContainer: {
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    boxShadow: "0 0 5px #fffff3",
  },
  textContainer: {
    marginRight: "auto",
    marginHorizontal: 10,
  },
  titleContainer: {
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: "auto",
  },
  footerContainer: {
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: "auto",
  },
  fontLg: {
    fontSize: 16,
  },
  textList: {
    marginVertical: 2,
  },
  dateText: {
    marginTop: 5,
    fontSize: 14,
    color: "#808080",
    marginLeft: 10,
  },
});

export default styles;
