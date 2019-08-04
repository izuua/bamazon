var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bamazon_DB"
})

var products = [];
var productNames = [];
var price;

function getProducts() {
    console.log("Reading all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        products = res;  

        products.forEach(function(str) {
            console.log(`${str.product_name}: $${str.price}`)
            productNames.push(str.product_name);
        });

        productSelect();
    })
};

function productCheck(name) {
    products.forEach(function(str) {
        if (name === str.product_name) {
            price = str.price;
        }
    })
}

function productSelect() {
    inquirer.prompt([
        {
            type: "list",
            message: "Which item do you want to bid on?",
            choices: productNames,
            name: "product"
        }
    ]).then(function (inquirerResponse) {
        productCheck(inquirerResponse.product);
        console.log(`\nYou chose ${inquirerResponse.product} for ${price}`);
    });
}

function connectionEnd() {
    connection.end();
}

getProducts();

connectionEnd();
