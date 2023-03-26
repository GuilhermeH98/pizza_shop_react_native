import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, Alert } from "react-native";
import { getProductsLite } from "../../services/dbProduct";
import { getProductsSalesLite } from "../../services/dbProductSale";
import { getSalesLite } from "../../services/dbSale";
import globalStyles from "../../styles";
import styles from "./styles";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsSales, setProductsSales] = useState([]);

  async function loadSales() {
    try {
      let salesLite = await getSalesLite();
      let productsLite = await getProductsLite();
      let productsSalesLite = await getProductsSalesLite();
      setProductsSales(productsSalesLite);
      setProducts(productsLite);
      setSales(salesLite);
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  useEffect(() => {
    loadSales();
  }, []);

  function getProductsSale(saleId) {
    return productsSales.filter((productSale) => productSale.idSale === saleId);
  }

  function getProductDescription(productId) {
    const foundProduct = products.find((product) => product.id === productId);
    return foundProduct ? foundProduct.description : "";
  }

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.titleContainer}>
        <Text style={styles.title}>Histórico de Vendas</Text>
      </View>

      <ScrollView style={styles.list}>
        {sales.map((sale, index) => (
          <View key={index.toString()}>
            <Text style={styles.dateText}> {sale.date}</Text>
            <View style={styles.cardContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.fontLg}>
                  <Text style={globalStyles.bold}>Código da venda:</Text>{" "}
                  {sale.id}
                </Text>
              </View>
              <View style={styles.textContainer}>
                {getProductsSale(sale.id).map((productSale, index) => (
                  <Text key={index.toString()} style={styles.textList}>
                    {getProductDescription(productSale.idProduct)} /
                    Quantidade:&nbsp;
                    {productSale.quantity}
                  </Text>
                ))}
              </View>
              <View style={styles.footerContainer}>
                <Text>
                  <Text style={globalStyles.bold}>Valor total: </Text>
                  R$ {sale.totalValue.toString().replace(".", ",")}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
}
