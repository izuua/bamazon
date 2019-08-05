DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

use bamazon_DB;

CREATE TABLE products (
    item_id INT(11) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NULL,
    department_name VARCHAR(255) NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock_quantity INT(11) NOT NULL DEFAULT 0,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("Hairband", "Accessories", 10.00, 30),
("Mythril Axe", "Weapons", 50.00, 10),
("Bronze Sword", "Weapons", 10.00, 50),
("Chainmail", "Armor", 80.00, 15),
("Iron Helmet", "Armor", 25.00, 30),
("Iron Shield", "Accessories", 30.00, 20),
("Crystal Mail", "Armor", 500.00, 3),
("Mythril Bow", "Weapons", 50.00, 10),
("Kunai", "Weapons", 20.00, 50),
("Flametongue", "Weapons", 450.00, 2),
("Partisan", "Weapons", 100.00, 8),
("Ice Brand", "Weapons", 430.00, 3);