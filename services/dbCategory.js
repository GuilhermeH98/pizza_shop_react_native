import { getDbConnection } from "./dbService";

export async function createCategoryTable() {
  return new Promise((resolve, reject) => {
    const query = `CREATE TABLE IF NOT EXISTS tbCategory
          (
              id integer not null primary key,
              description text not null,
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

export function getCategoriesLite() {
  return new Promise((resolve, reject) => {
    let dbCx = getDbConnection();
    dbCx.transaction(
      (tx) => {
        let query = "select * from tbCategory";
        tx.executeSql(query, [], (tx, data) => {
          var response = [];
          for (let n = 0; n < data.rows.length; n++) {
            let obj = {
              id: data.rows.item(n).id,
              description: data.rows.item(n).description,
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

export function addCategoryLite(category) {
  return new Promise((resolve, reject) => {
    let query =
      "insert into tbCategory (id, description, active ) values (?,?,?)";
    let dbCx = getDbConnection();

    dbCx.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [category.id, category.description, category.active],
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

export function updateCategoryLite(category) {
  return new Promise((resolve, reject) => {
    let query = "update tbCategory set description=? ,active=? where id=?";
    let dbCx = getDbConnection();

    dbCx.transaction(
      (tx) => {
        tx.executeSql(
          query,
          [category.description, category.active, category.id],
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
