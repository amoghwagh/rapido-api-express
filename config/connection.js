require('dotenv').config();
const mysql = require('mysql');

const connectionObj = {
  host: process.env.HOST,
  user: process.env.SQLUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
};

const connection = mysql.createConnection(connectionObj);
connection.connect();

module.exports = connection;
