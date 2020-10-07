const inquirer = require("inquirer");
const mysql = require("mysql");

let roleList = [
  "Sales Lead",
  "Salesperson",
  "Lead Engineer",
  "Software Engineer",
  "Account Manager",
  "Accountant",
  "Legal Team Lead",
  "Lawyer",
];

const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "Pass2020",
  database: "employee_trackerDB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  init();
  connection.end;
});

function init() {
  console.log(`-------------------------------------`);
  console.log("Welcome! Here you can edit your employee's database.");
  console.log(`-------------------------------------`);
  inquirer
    .prompt([
      {
        name: "startingQuestion",
        message: "What would you like to do?",
        type: "list",
        choices: [
          "View All Employees",
          "View All Employees by Department",
          "View All Employees by Manager",
          "View All Roles",
          "Add An Employee",
          "Remove An Employee",
          "Update An Employee's Role",
          "Update An Employee's Manager",
          "Exit",
        ],
      },
    ])
    .then((selection) => {
      console.log(selection);
      if (selection.startingQuestion === "View All Employees") {
        viewEmployees();
      } else if (
        selection.startingQuestion === "View All Employees by Department"
      ) {
        viewEmployeeByDepartment();
      } else if (
        selection.startingQuestion === "View All Employees by Manager"
      ) {
        viewEmployeeByManager();
      } else if (selection.startingQuestion === "View All Roles") {
        viewAllRoles();
      } else if (selection.startingQuestion === "Add An Employee") {
        addAnEmployee();
      } else if (selection.startingQuestion === "Remove An Employee") {
        removeAnEmployee();
      } else if (selection.startingQuestion === "Update An Employee's Role") {
        updateEmployeeRole();
      } else if (
        selection.startingQuestion === "Update An Employee's Manager"
      ) {
        updateEmployeeManager();
      } else if (selection.startingQuestion === "Exit") {
        endScreen();
      }
    });
}

function viewEmployees() {
  console.log(`-------------------------------------`);
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, department.dept_name, role.title, employee.manager_id, role.salary FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.dept_id = department.id;`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      console.log(`-------------------------------------`);
      console.log("Veiwed Employees");
      console.log(`-------------------------------------`);
      init();
    }
  );
}

function viewEmployeeByDepartment() {
  console.log(`-------------------------------------`);
  connection.query(
    `SELECT department.dept_name, employee.first_name, employee.last_name FROM employee
  INNER JOIN role ON employee.role_id = role.id
  INNER JOIN department ON role.dept_id = department.id;`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      console.log(`-------------------------------------`);
      console.log("Viewed Employees By Department");
      console.log(`-------------------------------------`);
      init();
    }
  );
}

function viewEmployeeByManager() {
  console.log(`-------------------------------------`);
  connection.query(
    `SELECT employee.manager_id, employee.first_name, employee.last_name FROM employee WHERE employee.manager_id IS NOT NULL;`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      console.log(`-------------------------------------`);
      console.log("Viewed Employees By Manager");
      console.log(`-------------------------------------`);
      init();
    }
  );
}

function viewAllRoles() {
  console.log(`-------------------------------------`);
  connection.query(
    `SELECT role.title FROM role WHERE role.title IS NOT NULL;`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      console.log(`-------------------------------------`);
      console.log("Veiwed All Roles");
      console.log(`-------------------------------------`);
      init();
    }
  );
}

function addAnEmployee() {
  inquirer
    .prompt([
      {
        name: "employeeFirstName",
        message: "What is the employee's first name?",
        type: "input",
      },
      {
        name: "employeeLastName",
        message: "What is the employee's last name?",
        type: "input",
      },
      {
        name: "employeeRole",
        message: "What is the employee's role?",
        type: "list",
        choices: roleList,
      },
      {
        name: "employeeSalary",
        message: "What is the employee's salary?",
        type: "input",
        choices: roleList,
      },
    ])
    .then((response) => {
        console.log(response);
      connection.query(
        `INSERT INTO employee (first_name, last_name) VALUES` +
          `("${response.employeeFirstName}", "${response.employeeLastName}")`
      ),
        
      (err, data) => {
        if (err) throw err;
      };
      console.log("Added An Employee");
      init();
    });
}

function removeAnEmployee() {
  console.log("Removed an Employee");
}

function updateEmployeeRole() {
  console.log("Updated Employee Role");
}

function updateEmployeeManager() {
  console.log("Updated Employee Manager");
}

function endScreen() {
  console.log(`-------------------------------------`);
  console.log("Application Ended! Have a nice day!");
  console.log(`-------------------------------------`);
  connection.end();
}
