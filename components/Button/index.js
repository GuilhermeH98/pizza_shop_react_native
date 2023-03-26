import { TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";

export function Button({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}
