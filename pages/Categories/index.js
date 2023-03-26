import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  View,
  Alert,
} from "react-native";
import globalStyles from "../../styles";
import styles from "./styles";
import { createId } from "../../utils";
import {
  addCategoryLite,
  getCategoriesLite,
  updateCategoryLite,
} from "../../services/dbCategory";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons";
import { Button } from "../../components/Button";

const defaultValues = {
  id: -1,
  description: "",
  active: "1",
};

export default function Categories({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [formCategory, setFormCategory] = useState(defaultValues);

  async function loadCategories() {
    try {
      let categoriesLite = await getCategoriesLite();
      setCategories(categoriesLite);
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function clearForm() {
    setFormCategory(defaultValues);
  }

  async function saveCategory() {
    if (validateForm()) {
      try {
        if (formCategory.id > 0) {
          let response = updateCategoryLite({
            ...formCategory,
            active: parseInt(formCategory.active),
          });

          if (response) {
            Keyboard.dismiss();
            Alert.alert("atualizado com sucesso!");
          } else Alert.alert("Falhou miseravelmente!");
        } else {
          let response = await addCategoryLite({
            ...formCategory,
            active: parseInt(formCategory.active),
            id: createId(),
          });

          if (response) {
            Keyboard.dismiss();
            Alert.alert("adicionado com sucesso!");
          } else Alert.alert("Falhou miseravelmente!");
        }

        Keyboard.dismiss();
        clearForm();
        await loadCategories();
      } catch (error) {
        Keyboard.dismiss();
        Alert.alert(error.message);
      }
    }
  }

  function validateForm() {
    if (!formCategory.description) {
      Alert.alert("Descrição é obrigatória!");
      return false;
    }

    return true;
  }

  function onEdit(category) {
    setFormCategory({ ...category, active: category.active.toString() });
  }

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.titleContainer}>
        <Text style={styles.title}>{`${
          formCategory.id > 0 ? "Editar" : "Cadastrar"
        } Categoria`}</Text>
      </View>

      <TextInput
        id="description"
        style={globalStyles.input}
        placeholder="Descrição"
        value={formCategory.description}
        onChangeText={(description) =>
          setFormCategory({ ...formCategory, description })
        }
      />

      <View style={styles.pickerContainer}>
        <Picker
          style={globalStyles.picker}
          selectedValue={formCategory.active}
          onValueChange={(active) =>
            setFormCategory({ ...formCategory, active })
          }
        >
          <Picker.Item label="Ativo" value="1" />
          <Picker.Item label="Inativo" value="0" />
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={saveCategory} title="Salvar" />
      </View>

      <ScrollView style={styles.list}>
        {categories.map((category, index) => (
          <View key={index.toString()} style={styles.cardContainer}>
            <View>
              <Text style={styles.textContainer}>
                Descrição: {category.description}
              </Text>
              <Text style={styles.textContainer}>
                Status: {category.active === 1 ? "Ativo" : "Inativo"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => onEdit(category)}
            >
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
}
