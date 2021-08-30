let mysql = require("mysql");
var dbConn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_room_db",
});
// kết nối vào cơ sở dữ liệu
dbConn.connect();
const query = async (sql) => {
  return new Promise((resolve, reject) => {
    dbConn.query(sql, function (error, results, fields) {
      if (error) reject(new Error(err));
      else resolve(results);
    });
  });
};
const insert = async (data, table) => {
  return new Promise((resolve, reject) => {
    let keyname = [];
    let item = [];
    for (const key in data) {
      keyname.push(key);
      item.push(data[key]);
    }
    keyname = "(" + keyname.join(",") + ")";
    item = "('" + item.join("','") + "')";
    let sql = `INSERT INTO ${table} ${keyname} values ${item}`;
    query(sql)
      .then((res) => {
        resolve(res);
      })
      .catch((res) => {
        reject(new Error(res));
      });
  });
};
module.exports = {
  query,
  insert,
};
