DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

use bamazon_DB;

CREATE TABLE products (
    item_id INT(11) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NULL,
    department_name VARCHAR(255) NULL,
    price DECIMAL(11, 2) NOT NULL DEFAULT 0.00,
    stock_quantity INT(11) NOT NULL DEFAULT 0,
    PRIMARY KEY (item_id)
);