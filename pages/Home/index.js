import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import globalStyles from "../../styles";
import styles from "./styles";
import { addProductLite, getProductsLite } from "../../services/dbProduct";
import { Picker } from "@react-native-picker/picker";
import { getCategoriesLite } from "../../services/dbCategory";
import { FontAwesome5 } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { createId } from "../../utils";
import { addSaleLite } from "../../services/dbSale";
import {
  addProductSaleLite,
  getProductsSalesLite,
} from "../../services/dbProductSale";

export default function Home({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const isFocused = useIsFocused();

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
  }, [isFocused]);

  function addProductCart(product) {
    const cartProduct = {
      idProduct: product.id,
      quantity: checkProductCart(product),
    };
    const filteredCart = cart
      .filter((item) => item.idProduct !== product.id)
      .sort((a, b) => a.code - b.code);

    setCart([...filteredCart, cartProduct]);
  }

  function removeProductCart(product) {
    const cartProduct = {
      idProduct: product.id,
      quantity: checkProductCart(product, true),
    };

    if (cartProduct.quantity > 0) {
      const filteredCart = cart
        .filter((item) => item.idProduct !== product.id)
        .sort((a, b) => a.code - b.code);

      setCart([...filteredCart, cartProduct]);
    } else {
      const filteredCart = cart
        .filter((item) => item.idProduct !== product.id)
        .sort((a, b) => a.code - b.code);

      setCart([...filteredCart]);
    }
  }

  function checkProductCart(product, isRemoval = false) {
    let productOnCart = cart.find((item) => item.idProduct === product.id);
    if (productOnCart) {
      if (isRemoval) {
        return productOnCart.quantity > 0 ? productOnCart.quantity - 1 : 0;
      }
      return productOnCart.quantity + 1;
    }
    return isRemoval ? 0 : 1;
  }

  function getTodayDate() {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  }

  async function checkout() {
    let hasErrors = false;
    try {
      let newSale = {
        totalValue: getCartTotalValue(),
        date: getTodayDate(),
        id: createId(),
      };

      let response = await addSaleLite(newSale);
      if (!response) {
        Alert.alert("Falhou miseravelmente!");
        return;
      }

      cart.forEach(async (item) => {
        let response = await addProductSaleLite({
          idProduct: item.idProduct,
          quantity: item.quantity,
          idSale: newSale.id,
        });
        if (!response) {
          Alert.alert("Falha ao adicionar relação entre venda e produto!");
          hasErrors = true;
        }
      });

      if (!hasErrors) {
        Alert.alert("Compra realizada com sucesso!");
        setCart([]);
        setModalVisible(false);
        loadData();
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  function filterProducts() {
    return products.filter((p) => {
      if (categoryFilter === "") {
        return p.active === 1;
      } else {
        return p.active === 1 && p.category === parseInt(categoryFilter);
      }
    });
  }

  function getProductQuantity(id) {
    const foundProduct = cart.find((item) => item.idProduct === id);
    return foundProduct ? foundProduct.quantity : 0;
  }

  function getCartTotalValue() {
    let total = 0;
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.idProduct);
      total += product.unitPrice * item.quantity;
    });
    return Number(total.toFixed(2));
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={globalStyles.container}>
        <View style={styles.menuContainer}>
          <View style={styles.menuCard}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Produtos");
              }}
            >
              <Text style={styles.menuText}> Produtos </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuCard}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Categorias");
              }}
            >
              <Text style={styles.menuText}> Categorias </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuCard}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Vendas");
              }}
            >
              <Text style={styles.menuText}> Vendas </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            style={globalStyles.picker}
            selectedValue={categoryFilter}
            onValueChange={(category) => setCategoryFilter(category)}
          >
            <Picker.Item label="Todos os produtos" value="" />
            {categories.map((category, index) => (
              <Picker.Item
                key={index.toString()}
                label={`${category.description} ${
                  category.active === 0 ? "(Inativo)" : ""
                }`}
                value={category.id.toString()}
              />
            ))}
          </Picker>
        </View>

        <ScrollView style={styles.list} nestedScrollEnabled={true}>
          {filterProducts().map((product, index) => (
            <View key={index.toString()} style={styles.cardContainer}>
              <View>
                <Text style={styles.textContainer}>
                  Produto: {product.description}
                </Text>
                <Text style={styles.textContainer}>
                  Valor: R$ {product.unitPrice.toString().replace(".", ",")}
                </Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.minusIcon}
                  onPress={() => removeProductCart(product)}
                >
                  <AntDesign name="minus" size={24} color="red" />
                </TouchableOpacity>
                <Text> {getProductQuantity(product.id)} </Text>

                <TouchableOpacity
                  style={styles.plusIcon}
                  onPress={() => addProductCart(product)}
                >
                  <AntDesign name="plus" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome5 name="shopping-cart" size={24} color="white" />
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              Confirmar pedido: R$
              {getCartTotalValue().toString().replace(".", ",")}
            </Text>
            {cart.map((item, index) => (
              <View key={index.toString()} style={globalStyles.flexRow}>
                <Text key={`description.${index.toString()}`}>
                  {products.find((p) => p.id === item.idProduct).description}
                </Text>
                <Text>
                  &nbsp;/ Preço Unitário: R$
                  {products
                    .find((p) => p.id === item.idProduct)
                    .unitPrice.toString()
                    .replace(".", ",")}
                </Text>
                <Text>&nbsp;/ Qtd: {item.quantity}</Text>
              </View>
            ))}
            <View style={globalStyles.flexRow}>
              {cart.length > 0 && (
                <Pressable
                  style={styles.buttonClose}
                  onPress={() => checkout(!modalVisible)}
                >
                  <Text style={styles.closeText}>Finalizar</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.buttonClose}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.closeText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
