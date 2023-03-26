import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#f5f5f5",
    width: "80%",
    margin: 10,
    height: 40,
    padding: 10,
    borderRadius: 5,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  homeIcon: {
    paddingTop: 10,
    marginRight: 10,
  },
  picker: {
    width: "100%",
    height: 40,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default globalStyles;
