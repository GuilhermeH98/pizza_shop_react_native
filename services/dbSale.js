import { getDbConnection } from "./dbService";

export async function createSaleTable() {
  return new Promise((resolve, reject) => {
    const query = `CREATE TABLE IF NOT EXISTS tbSale
            (
                id integer not null primary key,
                date text not null,
                totalValue real not null
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

export function getSalesLite() {
  return new Promise((resolve, reject) => {
    let dbCx = getDbConnection();
    dbCx.transaction(
      (tx) => {
        let query = "select * from tbSale";
        tx.executeSql(query, [], (tx, data) => {
          var response = [];
          for (let n = 0; n < data.rows.length; n++) {
            let obj = {
              id: data.rows.item(n).id,
              date: data.rows.item(n).date,
              totalValue: data.rows.item(n).totalValue,
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

export function addSaleLite(sale) {
  return new Promise((resolve, reject) => {
    let query = "insert into tbSale (id, date,totalValue ) values (?,?,?)";
    let dbCx = getDbConnection();

    dbCx.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [sale.id, sale.date, sale.totalValue],
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
