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

//Function to for initial prompt
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
                "Update employee role",
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
            case "Update employee role":
                updateRole();
            case "EXIT": 
                endApp();
                break;
            default:
                break;
        }
    })
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

//Function to validate user input
var validName = (input) => {   
    //ensure that name isn't empty string or contains numbers                              
    if ( input === "" || input.match(/\d+/g)!=null) {
       return "Please enter valid name";
    }
     return true;
} 

//Select Role Quieries Role Title for Add Employee function//
var roleArray = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArray.push(res[i].title);
    }

  })
  return roleArray;
}

//Select Manager Quieries The Managers for Add Employee function 
var managersArr = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}

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
                type: 'list', 
                message: "What is the employee's manager's ID? ",
                choices: selectManager
            },
            {
                name: 'role', 
                type: 'list',
                message: "What is this employee's role? ",
                choices: selectRole()
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
  
//Function to update roles
function updateRole() {
    const query = "SELECT id, first_name, last_name, role_id  FROM employee";
        connection.query(query, function(err, res) {
          if (err) throw err;
          console.table(res);
          {
            inquirer.prompt({
                type: "input",
                message: "Which employee needs to be updated? (please use number from id column only)",
                name: "employee"
            },
            {
                type: "input",
                message: "What is the new role of the employee?",
                name: "employerole"
            
            });
          }
        });
      }


//Function to delete an employee
/*const removeEmployee = () => {
    connection.query(allEmployeeQuery, (err, results) => {
        if (err) throw err;
        console.log(' ');
        console.table(chalk.yellow('All Employees'), results)
        inquirer.prompt([
            {
                name: 'IDtoRemove',
                type: 'input',
                message: 'Enter the Employee ID of the person to remove:'
            }
        ]).then((answer) => {
            connection.query(`DELETE FROM employees where ?`, { id: answer.IDtoRemove })
            startApp();
        })
    })
}*/

//Function to exit app
function endApp() {
    connection.end();
}