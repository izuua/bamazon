require("dotenv").config();

var mysql = require("mysql");
var inquirer = require("inquirer");
var keys = require("./keys.js");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: keys.connection_pass,
    database: "bamazon_DB"
})

var products = [];
var productNames = [];
var price;
var quantity;

function getProducts() {
    console.log("Reading all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        products = res;

        products.forEach(function (str) {
            console.log(`${str.product_name}: $${str.price}`)
            productNames.push(str.product_name);
        });

        productSelect();
    })
};

function productCheck(name) {
    products.forEach(function (str) {
        if (name === str.product_name) {
            price = str.price;
            quantity = str.stock_quantity;
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
    ]).then(function (answer) {
        productCheck(answer.product);
        console.log(`\nYou chose ${answer.product} for $${price}.\nWe have ${quantity} available.`);
        quantitySelect(answer.product);
    });
}

function quantitySelect(str) {
    inquirer.prompt([
        {
            type: "input",
            message: `How many ${str}s do you want?`,
            name: "quantity",
            validate: function (value) {
                if (isNaN(value) === false && value <= quantity) {
                    return true;
                }
                console.log(`\nPlease select a valid quantity. We have ${quantity} available.`)
                return false;
            }
        }
    ]).then(function (answer) {
        console.log(`You chose ${answer.quantity} ${str}s.`);
        quantity -= answer.quantity;
        removeStock(str, answer.quantity);
    })
}

function removeStock(str, num) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: quantity
            },
            {
                product_name: str
            }
        ],
        function (err, res) {
            if (err) throw err;
        }
    );
    console.log(`${num} ${str}s removed from stock.`)
    connectionEnd();
    totalPrice(num);
}

function totalPrice(num) {
    price = price * num;
    console.log(`Your total cost is $${price}.`)
}

function connectionEnd() {
    connection.end();
}

connection.connect(function (err) {
    if (err) throw err;

    getProducts();

})