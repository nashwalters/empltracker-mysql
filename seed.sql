USE employees_db;

INSERT INTO department (name)
VALUES 
('IT'),
('Finance'),
('Legal'),
('Human Resources'),
('Security'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
('Web Developer', 90000, 1),
('Accountant', 70000, 2),
('Paralegal', 50000, 3),
('Manager', 70000, 4),
('Engineer', 90000, 5),
('Sales Rep', 40000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Ryan', 'Reynolds', 1, 458),
('Justin', 'Bieber', 2, 276),
('Keanu', 'Reeves', 3, 486),
('Elvis', 'Presley', 4, 126),
('Rachel', 'McAdams', 5, 724),
('Jim', 'Carrey', 6, 157);