import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  pickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    borderRadius: 5,
    margin: 6,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 6,
  },
  list: {
    maxHeight: 300,
    width: "100%",
    margin: 6,
  },
  cardContainer: {
    flexDirection: "row",
    height: 80,
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    boxShadow: "0 0 5px #fffff3",
  },
  editIcon: {
    marginLeft: "auto",
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  textContainer: {
    marginLeft: 5,
    margin: 2,
  },
});

export default styles;
