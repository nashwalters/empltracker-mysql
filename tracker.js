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
    console.log("\n Welcome to the Employee Database!!\n")
    console.log("\n-----------------------------------\n")
    startApp();
})

function startApp() {
    inquirer
    .prompt({
        name: "action",
        type: "list",
        message: "Select an option below.",
        choices: [
                "View all employees",
                "View all departments",
                "View all roles",
                "Add an employee",
                "Add department",
                "Add a role",
                "EXIT"
            ]
    }).then(function (data) {
        switch (data.action) {
                case "View all employees":
                    //viewEmployees();
                    break;
                case "View all departments":
                    //viewDepartments();
                    break;
                case "View all roles":
                    //viewRoles();
                    break;
                case "Add an employee":
                    //addEmployee();
                    break;
                case "Add department":
                    //addDepartment();
                    break;
                case "Add a role":
                    //addRole();
                    break;
                case "EXIT": 
                    endApp();
                    break;
                default:
                    break;
            }
    })
}

function endApp() {
    connection.end();
}