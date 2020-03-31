let mysql = require('promise-mysql');

let config ={
    host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'root',

  database: 'custom',
  connectionLimit: 100
};

let pool = mysql.createPool(config); // ตัวแปรใส่ config ไว้ไปใช้งาน
module.exports = pool;
