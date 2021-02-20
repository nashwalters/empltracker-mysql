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
    inquirer.prompt
    ({
        name: "action",
        type: "list",
        message: "Select an option below.",
        choices: [
                "View all employees",
                "View all by department",
                "View all by roles",
                "Add an employee",
                "Add department",
                "Add a role",
                "Update role",
                "EXIT"
            ]
    }).then(function (data) {
        switch (data.action) {
            case "View all employees":
                viewAllEmp();
                break;
            case "View all by department":
                viewEmpByDept();
                break;
            case "View all by roles":
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
            case "Update role":
                updateRole();
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
function viewAllEmp() {
    // Query to view all employees
    let AllEmpQuery = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id";
    connection.query(AllEmpQuery, function(err, res) {
        if(err) return err;
        console.table('All Employees:', res); 
        startApp();
    });
}

// Function to view all departments in the database
function viewEmpByDept(){
    // Query to view all employees by department
    let deptQuery = "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id";
    connection.query(deptQuery, function(err, res) {
        if (err) throw err
        console.table('All Employees and Departments:',res)
        startApp()
    })
}
  

// Function to view all roles in the database
function viewRoles() {
    let rolesQuery = "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id";
    connection.query(rolesQuery, function(err, res){
        if (err) throw err;
        console.table('All Roles:', res);
        startApp();
    })
};

// Function to add an employee to the database
function addEmp() {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        inquirer.prompt([
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
    inquirer.prompt([
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
    inquirer.prompt ([
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
                    title: data.new_role,
                    salary: data.salary,
                    department_id: department_id
                },
                function (err, res) {
                if(err)throw err;
                console.log('Your new role has been added!');
                console.table('All Roles:', res);
                startApp();
            })
        })
    })
};

/*//Function to update roles
function updateRole() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
    if (err) throw err
    console.log(res)
    inquirer.prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function() {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employees new title? ",
            choices: addRole()
          },
      ]).then(function(val) {
        var roleId = addRole().indexOf(val.role) + 1
        connection.query("UPDATE employee SET WHERE ?", 
        {
          last_name: val.lastName
           
        }, 
        {
          role_id: roleId
           
        }, 
        function(err){
            if (err) throw err
            console.table(val)
            startApp()
        })
  
    });
  });

  }*/

//Function to exit app
function endApp() {
    connection.end();
}