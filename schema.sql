DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;


USE employee_trackerDB;

CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    PRIMARY KEY (id)
);

CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30),
    PRIMARY KEY (id)
);
CREATE TABLE role (
    id INTEGER NOT NULL AUTO_INCREMENT,
    dept_id INTEGER,
    title VARCHAR(30),
    salary DECIMAL(6,2),
    PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Saul", "Terra", 1, null),
("Bramble", "Bloodgut", 2, 1),
("Bruns", "Wick", 3, 1);

INSERT INTO department (dept_name)
VALUES ("Engineer"),
("Accounting"),
("Accounting");

INSERT INTO role (dept_id, title)
VALUES (1, "Manager"),
(2, "Employee"),
(3, "Engineer");

SELECT * FROM department;

SELECT * FROM role;

SELECT * FROM employee;

SELECT manager_id FROM employee GROUP BY manager_id;



INSERT INTO employee (first_name, last_name, manager_id)
VALUES ("Jamie", "Jones", 1);

INSERT INTO role (title, salary)
VALUES ("lead engineer", "8000");

SELECT employee.id, employee.first_name, employee.last_name, department.dept_name, role.title, employee.manager_id, role.salary FROM employee
INNER JOIN role ON employee.role_id = role.id
INNER JOIN department ON role.dept_id = department.id;

SELECT department.dept_name, employee.first_name, employee.last_name FROM employee
INNER JOIN role ON employee.role_id = role.id
INNER JOIN department ON role.dept_id = department.id;

SELECT employee.manager_id, employee.first_name, employee.last_name FROM employee WHERE employee.manager_id IS NOT NULL; 