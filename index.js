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
          "View All Departments",
          "Add An Employee",
          "Add A Role",
          "Add A Department",
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
      } else if (selection.startingQuestion === "View All Departments") {
        viewAllDepartments();
      } else if (selection.startingQuestion === "Add An Employee") {
        addAnEmployee();
      } else if (selection.startingQuestion === "Add A Role") {
        addNewRole();
      } else if (selection.startingQuestion === "Add A Department") {
        addNewDepartment();
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
    `SELECT employee.id, employee.first_name, employee.last_name, department.dept_name, role.title FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.dept_id = department.id;`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      console.log(`-------------------------------------`);
      console.log("Viewed Employees");
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

      console.log(`-------------------------------------`);
      console.log("Veiwed All Roles");
      console.log(`-------------------------------------`);
      console.table(res);
      init();
    }
  );
}

function viewAllDepartments() {
  console.log(`-------------------------------------`);
  connection.query(
    `SELECT department.dept_name FROM department WHERE department.dept_name IS NOT NULL;`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      console.log(`-------------------------------------`);
      console.log("Veiwed All Departments");
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
        choices: ["Manager", "Employee"],
      },
      {
        name: "employeeDept",
        message: "What is the employee's Department?",
        type: "list",
        choices: [1, 2],
      },
      //   {
      //     name: "employeeSalary",
      //     message: "What is the employee's salary?",
      //     type: "list",
      //     choices: ["40k", "50k", "60k", "70k", "80k", "90k", "100k", "110k", "120k",],
      //   },
    ])
    .then((res) => {
      const firstName = res.employeeFirstName;
      const lastName = res.employeeLastName;
      let employeeRole;
      //   const employeeSalary = res.employeeSalary;
      if (res.employeeRole === "Manager") {
        employeeRole = 1;
      } else if (res.employeeRole === "Employee") {
        employeeRole = 2;
      }
      connection.query(
        "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)",
        [firstName, lastName, employeeRole],
        (err, result) => {
          if (err) throw err;
          console.log(`-------------------------------------`);
          console.log("Added An Employee!");
          console.log(`-------------------------------------`);
          init();
        }
      );
    })
    .catch((err) => {
      if (err) throw err;
    });
}

function addNewDepartment() {
  inquirer
    .prompt({
      name: "newDepartment",
      type: "input",
      message: "What would you like the name the Department?",
    })
    .then((res) => {
      const newDept = res.newDepartment;
      connection.query(
        "INSERT INTO department (dept_name) VALUES (?)",
        [newDept],
        function (err, res) {
          if (err) throw err;
          console.log(`-------------------------------------`);
          console.log("Added A New Department!");
          console.log(`-------------------------------------`);
          init();
        }
      );
    });
}

function addNewRole() {
  inquirer
    .prompt({
      name: "newRole",
      type: "input",
      message: "What would you like the name the Role?",
    })
    .then((res) => {
      const newRole = res.newRole;
      connection.query(
        "INSERT INTO role (title) VALUES (?)",
        [newRole],
        function (err, res) {
          if (err) throw err;
          console.log(`-------------------------------------`);
          console.log("Added A New Role!");
          console.log(`-------------------------------------`);
          init();
        }
      );
    });
}

function removeAnEmployee() {
  console.log("Removing an Employee Functionality Coming Soon");
  init();
}

function updateEmployeeRole(user_id, role_name) {
  console.log("Updated Employee Role");
  connection.query("SELECT * FROM role", (err, data) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "updated_role",
          message: "WHat is the new role for this employee?",
          choices: data.map((role) => role.title),
        },
      ])
      .then((res) => {
        console.log(res);

        connection.query(
          `UPDATE employee SET role = ${role_name} WHERE id=${user_id};`,
          (err) => {
            init();
          }
        );
      });
  });
}

function updateEmployeeManager() {
  console.log("Updating Employee Manager Functionality Coming Soon");
  init();
}

function endScreen() {
  console.log(`-------------------------------------`);
  console.log("Application Ended! Have a nice day!");
  console.log(`-------------------------------------`);
  connection.end();
}
