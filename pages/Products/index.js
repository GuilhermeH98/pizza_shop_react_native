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
  addProductLite,
  getProductsLite,
  updateProductLite,
} from "../../services/dbProduct";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons";
import { Button } from "../../components/Button";
import { getCategoriesLite } from "../../services/dbCategory";
import { Entypo } from "@expo/vector-icons";

const defaultValues = {
  id: -1,
  code: "",
  unitPrice: 0,
  description: "",
  category: "",
  active: "1",
};

export default function Products({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formProduct, setFormProduct] = useState(defaultValues);

  async function loadData() {
    try {
      let categoriesLite = await getCategoriesLite();
      let productsLite = await getProductsLite();
      setCategories(categoriesLite);
      setProducts(productsLite);
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function clearForm() {
    setFormProduct(defaultValues);
  }

  async function saveProduct() {
    if (validateForm()) {
      try {
        if (formProduct.id > 0) {
          let response = updateProductLite({
            ...formProduct,
            unitPrice: parseFloat(formProduct.unitPrice.replace(",", ".")),
            category: parseInt(formProduct.category),
            active: parseInt(formProduct.active),
          });

          if (response) {
            Alert.alert("atualizado com sucesso!");
          } else Alert.alert("Falhou miseravelmente!");
        } else {
          let response = await addProductLite({
            ...formProduct,
            active: parseInt(formProduct.active),
            unitPrice: parseFloat(formProduct.unitPrice.replace(",", ".")),
            category: parseInt(formProduct.category),
            id: createId(),
          });

          if (response) {
            Alert.alert("adicionado com sucesso!");
          } else Alert.alert("Falhou miseravelmente!");
        }

        clearForm();
        await loadData();
      } catch (error) {
        Alert.alert(error.message);
      }
    }
  }

  function validateForm() {
    if (!formProduct.code) {
      Alert.alert("Código é obrigatório!");
      return false;
    }
    if (!formProduct.description) {
      Alert.alert("Descrição é obrigatória!");
      return false;
    }
    if (!formProduct.category) {
      Alert.alert("Categoria é obrigatória!");
      return false;
    }
    if (
      !formProduct.unitPrice ||
      isNaN(formProduct.unitPrice.toString().replace(",", "."))
    ) {
      Alert.alert("Preencha o preço com o valor númerico do produto!");
      return false;
    }

    return true;
  }

  async function onEdit(product) {
    setFormProduct({
      ...product,
      active: product.active.toString(),
      category: product.category.toString(),
      unitPrice: product.unitPrice.toString().replace(".", ","),
    });
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={globalStyles.container}>
        <View style={globalStyles.titleContainer}>
          <Text style={styles.title}>{`${
            formProduct.id > 0 ? "Editar" : "Cadastrar"
          } Produto`}</Text>
        </View>

        <TextInput
          id="code"
          style={globalStyles.input}
          placeholder="Código"
          value={formProduct.code}
          onChangeText={(code) => setFormProduct({ ...formProduct, code })}
        />
        <TextInput
          id="description"
          style={globalStyles.input}
          placeholder="Descrição"
          value={formProduct.description}
          onChangeText={(description) =>
            setFormProduct({ ...formProduct, description })
          }
        />
        <TextInput
          id="unitPrice"
          style={globalStyles.input}
          placeholder="Preço Unitário"
          value={formProduct.unitPrice}
          onChangeText={(unitPrice) =>
            setFormProduct({ ...formProduct, unitPrice })
          }
        />
        <View style={styles.pickerContainer}>
          <Picker
            style={globalStyles.picker}
            selectedValue={formProduct.category}
            onValueChange={(category) =>
              setFormProduct({ ...formProduct, category })
            }
          >
            <Picker.Item label="Selecione uma categoria" value="" />
            {categories.map((category, index) => (
              <Picker.Item
                key={index.toString()}
                label={`${category.description} ${
                  category.active === 0 ? "(Inativo)" : ""
                }`}
                value={category.id.toString()}
                enabled={category.active === 1}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            style={{
              width: "100%",
              height: 40,
            }}
            selectedValue={formProduct.active}
            onValueChange={(active) =>
              setFormProduct({ ...formProduct, active })
            }
          >
            <Picker.Item label="Ativo" value="1" />
            <Picker.Item label="Inativo" value="0" />
          </Picker>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={saveProduct} title="Salvar" />
        </View>
        <ScrollView style={styles.list} nestedScrollEnabled={true}>
          {products.map((product, index) => (
            <View key={index.toString()} style={styles.cardContainer}>
              <View>
                <Text style={styles.textContainer}>Código: {product.code}</Text>
                <Text style={styles.textContainer}>
                  Descrição: {product.description}
                </Text>
              </View>

              <View>
                <Text style={styles.textContainer}>
                  Preço Unitário: R$ {product.unitPrice}
                </Text>
                <Text style={styles.textContainer}>
                  Categoria:
                  {categories.find((c) => c.id === parseInt(product.category))
                    ? categories.find(
                        (c) => c.id === parseInt(product.category)
                      ).description
                    : "Desconhecido"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => onEdit(product)}
              >
                <AntDesign name="edit" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}
