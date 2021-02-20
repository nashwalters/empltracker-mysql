const mysql = require("mysql");
const inquirer = require("inquirer");

// Create connection to mysql database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "nashbryce88!",
    database: "employee_DB"
})

// Connect to the mysql server and sql database
connection.connect(function(err){
    if (err) throw err;
    //startApp();
})
