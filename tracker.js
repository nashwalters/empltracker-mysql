const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require('console.table')

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
                    viewEmp();
                    break;
                case "View all departments":
                    //viewDepartments();
                    break;
                case "View all roles":
                    //viewRoles();
                    break;
                case "Add an employee":
                    addEmp();
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
var validName = (input) => {   
    //ensure that name isn't empty string or contains numbers                              
    if ( input === "" || input.match(/\d+/g)!=null) {
       return "Please enter valid name";
    }
     return true;
}  
function viewEmp() {
    var query = 'SELECT * FROM employee';
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(res.length + ' employees found!');
        console.table('All Employees:', res); 
        startApp();
    })
};

function addEmp() {
    connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input", 
                message: "Employee's fist name: ",
                validate: validName
            },
            {
                name: "lastName",
                type: "input", 
                message: "Employee's last name: ",
                validate: validName
            },
            {
                name: "role", 
                type: "list",
                choices: function() {
                var roleArray = [];
                for (let i = 0; i < res.length; i++) {
                    roleArray.push(res[i].title);
                }
                return roleArray;
                },
                message: "What is this employee's role? "
            }
            ]).then(function (data) {
                let roleId;
                for (let j = 0; j < res.length; j++) {
                if (res[j].title == data.role) {
                    roleId = res[j].id;
                    console.log(roleId)
                }                  
                }  
                connection.query(
                "INSERT INTO employees SET ?",
                {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    role_id: roleId,
                },
                function (err) {
                    if (err) throw err;
                    console.log("The employee has been added!");
                    startApp();
                }
                )
            })
    })
}

function endApp() {
    connection.end();
}