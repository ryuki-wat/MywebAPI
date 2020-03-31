let mysql = require('promise-mysql');

let config =
{
    host:'localhost',
    port:'3306',
    user:'root',
    password:'root',
    database:'company',
    connectionLimit:100
};

let pool = mysql.createPool(config);

module.exports = pool;