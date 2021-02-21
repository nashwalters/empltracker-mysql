const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require('console.table')

// Create connection to mysql database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "nashbryce88!",
    database: "employee_trackerDB"
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
                "View departments only",
                "View roles only",
                "View all employees",
                "View all by department",
                "View all by roles",
                "Add an employee",
                "Add department",
                "Add a role",
                "Update employee",
                "Delete employee",
                "EXIT"
            ]
    }).then(function (data) {
        switch (data.action) {
            case "View departments only":
                viewDept();
                break;
            case "View roles only":
                    viewRoles();
                    break;
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
            case "Update employee":
                updateRole(); 
            case "delete employee":
                deleteEmp()        
            case "EXIT": 
                endApp();
                break;
            default:
                break;
        }
    })
}
// Function to view all departments in the database
function viewDept() {
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

// Function to view all employees in the database
function viewAllEmp() {
    // Query to view all employees
    let AllEmpQuery = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";
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
var managersArray = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArray.push(res[i].first_name);
    }

  })
  return managersArray;
}

// Function to add an employee to the database
function addEmp() {
    inquirer.prompt([
        {
          name: "first_name",
          type: "input",
          message: "Enter their first name ",
          validate: validName
        },
        {
          name: "last_name",
          type: "input",
          message: "Enter their last name ",
          validate: validName
        },
        {
          name: "role",
          type: "list",
          message: "What is their role? ",
          choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function (data) {
      var roleId = selectRole().indexOf(data.role) + 1
      var managerId = selectManager().indexOf(data.choice) + 1
      connection.query("INSERT INTO employee SET ?", 
      {
          first_name: data.first_name,
          last_name: data.last_name,
          manager_id: managerId,
          role_id: roleId
          
      }, function(err){
          if (err) throw err
          console.table(data)
          startApp()
      })

  })
}

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
    inquirer.prompt([
        {
            type: "input",
            message: "What is the last name of the employee?",
            name: "last_name"
        },
        {
            type: "rawlist",
            message: "What is the employee's new role",
            name: "role",
            choices: selectRole()
        },
    ]).then(function(val) {
            var roleId = selectRole().indexOf(val.role) + 1
            connection.query("UPDATE employee SET WHERE ?", 
            {
                role_id: roleId
                
            },
            {
                last_name: val.last_name
               
            }, 
            function(err){
                if (err) throw err
                startPrompt()
           })
     })
}

//Function to exit app
function endApp() {
    connection.end();
}