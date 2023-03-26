import { getDbConnection } from "./dbService";

export async function createProductTable() {
  return new Promise((resolve, reject) => {
    const query = `CREATE TABLE IF NOT EXISTS tbProduct
        (
            id integer not null primary key,
            code text not null,   
            unitPrice real not null,
            description text not null,
            category integer not null,
            active integer not null
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

export function getProductsLite() {
  return new Promise((resolve, reject) => {
    let dbCx = getDbConnection();
    dbCx.transaction(
      (tx) => {
        let query = "select * from tbProduct";
        tx.executeSql(query, [], (tx, data) => {
          var response = [];
          for (let n = 0; n < data.rows.length; n++) {
            let obj = {
              id: data.rows.item(n).id,
              code: data.rows.item(n).code,
              unitPrice: data.rows.item(n).unitPrice,
              description: data.rows.item(n).description,
              category: data.rows.item(n).category,
              active: data.rows.item(n).active,
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

export function addProductLite(product) {
  return new Promise((resolve, reject) => {
    let query =
      "insert into tbProduct (id, code ,unitPrice, description,category, active ) values (?,?,?,?,?,?)";
    let dbCx = getDbConnection();

    dbCx.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [
            product.id,
            product.code,
            product.unitPrice,
            product.description,
            product.category,
            product.active,
          ],
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

export function updateProductLite(product) {
  return new Promise((resolve, reject) => {
    let query =
      "update tbProduct set code=?, unitPrice=?, description=?, category=? ,active=? where id=?";
    let dbCx = getDbConnection();

    dbCx.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [
            product.code,
            product.unitPrice,
            product.description,
            product.category,
            product.active,
            product.id,
          ],
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
