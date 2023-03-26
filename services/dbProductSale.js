import { getDbConnection } from "./dbService";

export async function createProductSaleTable() {
  return new Promise((resolve, reject) => {
    const query = `CREATE TABLE IF NOT EXISTS tbProductSale
        (
            idProduct integer not null,      
            idSale integer not null,
            quantity integer not null
        )`;

    let dbCx = getDbConnection();

    dbCx.transaction(
      (tx) => {
        tx.executeSql(query);
        resolve(true);
      },
      (error) => {
        console.log(error.message);
        resolve(false);
      }
    );
  });
}

export function getProductsSalesLite() {
  return new Promise((resolve, reject) => {
    let dbCx = getDbConnection();
    dbCx.transaction(
      (tx) => {
        let query = "select * from tbProductSale";
        tx.executeSql(query, [], (tx, data) => {
          var response = [];
          for (let n = 0; n < data.rows.length; n++) {
            let obj = {
              idProduct: data.rows.item(n).idProduct,
              idSale: data.rows.item(n).idSale,
              quantity: data.rows.item(n).quantity,
            };
            response.push(obj);
          }
          resolve(response);
        });
      },
      (error) => {
        console.log(error.message);
        resolve([]);
      }
    );
  });
}

export function addProductSaleLite(productSale) {
  return new Promise((resolve, reject) => {
    let query =
      "insert into tbProductSale (idProduct, idSale,quantity) values (?,?,?)";
    let dbCx = getDbConnection();

    dbCx.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [productSale.idProduct, productSale.idSale, productSale.quantity],
          (tx, response) => {
            resolve(response.rowsAffected > 0);
          }
        );
      },
      (error) => {
        console.log(error.message);
        resolve(false);
      }
    );
  });
}
