import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Categories from "./pages/Categories";
import { createCategoryTable } from "./services/dbCategory";
import { createProductTable } from "./services/dbProduct";
import { createSaleTable } from "./services/dbSale";
import { createProductSaleTable } from "./services/dbProductSale";
import Products from "./pages/Products";
import { dropTables } from "./services/dbService";
import Home from "./pages/Home";
import Sales from "./pages/Sales";

export default function App() {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    createCategoryTable();
    createSaleTable();
    createProductTable();
    createProductSaleTable();

    // Clean Database
    // dropTables("tbCategory");z
    // dropTables("tbProduct");
    // dropTables("tbSale");
    // dropTables("tbProductSale");
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "Bem-vindo",
            headerStyle: {
              backgroundColor: "#EA0033",
            },
            headerTitleStyle: {
              color: "white",
            },
          }}
        />
        <Stack.Screen
          name="Produtos"
          component={Products}
          options={{
            title: "Produtos",
            headerStyle: {
              backgroundColor: "#EA0033",
            },
            headerTitleStyle: {
              color: "white",
            },
          }}
        />
        <Stack.Screen
          name="Categorias"
          component={Categories}
          options={{
            title: "Categorias",
            headerStyle: {
              backgroundColor: "#EA0033",
            },
            headerTitleStyle: {
              color: "white",
            },
          }}
        />
        <Stack.Screen
          name="Vendas"
          component={Sales}
          options={{
            title: "Vendas",
            headerStyle: {
              backgroundColor: "#EA0033",
            },
            headerTitleStyle: {
              color: "white",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
