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
                "View departments",
                "View roles",
                "View all employees",
                "View all by department",
                "View all by roles",
                "Add an employee",
                "Add department",
                "Add a role",
                "Update employee",
                "EXIT"
            ]
    }).then(function (data) {
        switch (data.action) {
            case "View departments":
                viewDept();
                break;
            case "View roles":
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
          name: "firstName",
          type: "input",
          message: "Enter their first name ",
          validate: validName
        },
        {
          name: "lastName",
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
          first_name: data.firstName,
          last_name: data.lastName,
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
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "lastName",
                type: "list",
                message: "What is the Employee's last name? ",
               choices: function() {
                    var lastName = [];
                    for (var i = 0; i < res.length; i++) {
                      lastName.push(res[i].last_name);
                    }
                    return lastName;
                    }
            },
            {
                name: "role",
                type: "rawlist",
                message: "What is the Employees new title? ",
                choices: selectRole()
            }
        ]).then(function(data) {
        var roleId = selectRole().indexOf(data.role) + 1
        connection.query("UPDATE employee SET WHERE ?", 
        {
          last_name: data.lastName
        }, 
        {
          role_id: roleId
        }, 
        function(err){
            if (err) throw err
            console.table(data)
            startApp()
        })
    });
});

}
/*function updateRole() {
        
    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee INNER JOIN role ON (employee.role_id = role.id) ORDER BY employee.id;"
    connection.query(query, function(err, results) {
        if (err) throw err;

        // once you have the employees, prompt the user for which employee they'd like to update
        inquirer
          .prompt([
            {
                name: "choice",
                type: "input",
                message: "Enter the Employee ID of the employee you wish to update:",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        console.log(" Error: Please enter a valid number");
                        return false;
                    }
                }
            },
            {
                name: "new_role",
                type: "input",                  
                message: "Enter a new role ID for this employee:"
            }  
          ])
          .then(function(answer) {
            
            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                  {
                    role_id: answer.new_role
                  },
                  {
                    id: answer.choice
                  }
                ],
                function(error) {
                    if (error) throw err;   

                    var i = answer.choice;
                    console.log("\nRole was successfully updated.");
                }
              );
            connection.query("SELECT * FROM employee", function(err, results){
                if (err) throw err;
                console.table(results);
                quit();
            });
          });
        });
        
}*/

              
       
     

//Function to exit app
function endApp() {
    connection.end();
}