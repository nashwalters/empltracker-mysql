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
                    viewDep();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "Add an employee":
                    addEmp();
                    break;
                case "Add department":
                    addDep();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "EXIT": 
                    endApp();
                    break;
                default:
                    break;
            }
    })
}

//Function to validate user input
var validName = (input) => {   
    //ensure that name isn't empty string or contains numbers                              
    if ( input === "" || input.match(/\d+/g)!=null) {
       return "Please enter valid name";
    }
     return true;
} 

// Function to view all employees in the database
function viewEmp() {
    var query = 'SELECT * FROM employee';
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(res.length + ' employees found!');
        console.table('All Employees:', res); 
        startApp();
    })
};

// Function to view all departments in the database
function viewDep() {
    var query = 'SELECT * FROM department';
    connection.query(query, function(err, res) {
        if(err)throw err;
        console.table('All Departments:', res);
        startApp();
    })
};

// Function to view all roles in the database
function viewRoles() {
    var query = 'SELECT * FROM role';
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table('All Roles:', res);
        startApp();
    })
};

// Function to add an employee to the database
function addEmp() {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input', 
                    message: "Employee's fist name: ",
                    validate: validName
                },
                {
                    name: 'last_name',
                    type: 'input', 
                    message: "Employee's last name: ",
                    validate: validName
                },
                {
                    name: 'manager_id',
                    type: 'input', 
                    message: "What is the employee's manager's ID? "
                },
                {
                    name: 'role', 
                    type: 'list',
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
                    let role_id;
                    for (let a = 0; a < res.length; a++) {
                        if (res[a].title == data.role) {
                            role_id = res[a].id;
                            console.log(role_id)
                        }                  
                    }  
                    connection.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: data.first_name,
                        last_name: data.last_name,
                        manager_id: data.manager_id,
                        role_id: role_id,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('Your employee has been added!');
                        startApp();
                    })
                })
        })
};

// Function to add a department to the database
function addDep() {
    inquirer
        .prompt([
            {
                name: 'newDepartment', 
                type: 'input', 
                message: 'Enter the department you want to add:'
            }
            ]).then(function (data) {
                connection.query(
                    'INSERT INTO department SET ?',
                    {
                        name: data.newDepartment
                    });
                var query = 'SELECT * FROM department';
                connection.query(query, function(err, res) {
                if(err)throw err;
                console.log('The department has been added!');
                console.table('All Departments:', res);
                startApp();
            })
    })
};

// Function to add a role to the database
function addRole() {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
    
        inquirer 
        .prompt([
            {
                name: 'new_role',
                type: 'input', 
                message: "What new role would you like to add?"
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this role? (Enter a number)'
            },
            {
                name: 'Department',
                type: 'list',
                choices: function() {
                    var deptArry = [];
                    for (let i = 0; i < res.length; i++) {
                    deptArry.push(res[i].name);
                    }
                    return deptArry;
                },
            }
        ]).then(function (data) {
            let department_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == data.Department) {
                    department_id = res[a].id;
                }
            }
    
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: department_id
                },
                function (err, res) {
                    if(err)throw err;
                    console.log('Your new role has been added!');
                    console.table('All Roles:', res);
                    options();
                })
        })
    })
};

function endApp() {
    connection.end();
}