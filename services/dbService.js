import * as SQLite from "expo-sqlite";

export function getDbConnection() {
  const cx = SQLite.openDatabase("dbPizzaShop.db");
  return cx;
}

export async function dropTables(tableName) {
  return new Promise((resolve, reject) => {
    const query = `drop table ${tableName}`;

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
