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
var product;
var price;
var quantity;

// connection.connect(function (err) {
//     if (err) throw err;

//     getProducts();
// })

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
        // removeStock(str);
    })
}

// function removeStock(str) {
//     connection.query("UPDATE products SET WHERE product_name = ?", [str], {
//         stock_quantity: 20
//     },
//     function (err, res) {
//         if (err) throw err;
//     });
// }

function connectionEnd() {
    connection.end();
}

getProducts();

connectionEnd();
