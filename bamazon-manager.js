//DO NOT GRADE THIS ASSIGNMENT SINCE I DID NOT ADD IMAGES. I DID IT JUST TO LEARN>

require("dotenv").config();

var mysql = require("mysql");
var inquirer = require("inquirer");
var keys = require("./keys.js");
var quantity;

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: keys.connection_pass,
    database: "bamazon_DB"
})

// Function works correctly but removed during debugging until I get the rest of the application running.
// function passwordEnter() {
//     inquirer.prompt([
//         {
//             type: "password",
//             message: 'Type in the manager password to access this app:',
//             name: "password",
//             validate: function (value) {
//                 if (value === keys.password) {
//                     return true;
//                 }
//                 console.log(`\nIncorrect password.`);
//                 return false;
//             }
//         }
//     ]).then(function (answer) {
//         console.log(`Password correct.`)
//         start();
//     })
// }

function start() {
    inquirer.prompt([
        {
            type: "list",
            message: "What do you want to do?",
            choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "choice"

        }
    ]).then(function (answer) {
        console.log(`You chose to ${answer.choice}.`)
        switch (answer.choice) {
            case "View Products":
                viewProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
                connectionEnd();
                break;
        }

    })

}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        res.forEach(function (str) {
            console.log(`item: ${str.product_name} | id: ${str.item_id} | department: ${str.department_name} | price: $${str.price} | stock: ${str.stock_quantity}`);
        })
    })

    connectionEnd();
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;

        res.forEach(function (str) {
            console.log(`item: ${str.product_name} | id: ${str.item_id} | department: ${str.department_name} | price: $${str.price} | stock: ${str.stock_quantity}`);
        })
    })

    connectionEnd();
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var productNames = [];
        var products = res;

        res.forEach(function (str) {
            productNames.push(str.product_name);
        })

        productSelect(productNames, products);

    })
}

function productSelect(productNames, products) {
    inquirer.prompt([
        {
            type: "list",
            message: "Which item do you want to increase the stock for",
            choices: productNames,
            name: "product"
        }
    ]).then(function (answer) {
        productCheck(answer.product, products);
        console.log(`\nYou chose ${answer.product}.`);
        quantitySelect(answer.product)
    })
}

function productCheck(name, arr) {
    arr.forEach(function (element) {
        if (name === element.product_name) {
            quantity = element.stock_quantity;
        }
    })
}

function quantitySelect(name) {
    inquirer.prompt([
        {
            type: "input",
            message: `How many ${name}s do you want to add to stock?`,
            name: "quantity",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                console.log(`\nPlease select a number.`);
                return false;
            }
        }
    ]).then(function (answer) {
        console.log(`You chose to add ${answer.quantity} ${name}s to stock.`);
        addStock(name, answer.quantity);
    })
}

function addStock(name, num) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: quantity += parseInt(num)
            },
            {
                product_name: name
            }
        ],
        function (err) {
            if (err) throw err;
        }
    );

    console.log(`${num} ${name}s added to stock.`)

    connectionEnd();
}

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the product name?",
            name: "name"
        },
        {
            type: "list",
            message: "What department does it belong to?",
            choices: [
                "Weapons", "Armor", "Accessories"
            ],
            name: "department"
        },
        {
            type: "input",
            message: "How much does it cost?",
            name: "price",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                console.log(`\nPlease select a number.`)
                return false;
            }
        },
        {
            type: "input",
            message: "How many do you want to add to stock?",
            name: "stock",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                console.log(`\nPlease select a number.`)
                return false;
            }
        }
    ]).then(function (answer) {
        insertProduct(answer.name, answer.department, answer.price, answer.stock);
    })
}

function insertProduct(name, department, price, stock) {
    connection.query("INSERT INTO products SET ?", {
        product_name: name,
        department_name: department,
        price: price,
        stock_quantity: stock
    }),
    function(err, res) {
        if (err) throw err;
    }

    console.log(`\nProduct added.`);

    connectionEnd();
}


function connectionEnd() {
    connection.end();
}

connection.connect(function (err) {
    if (err) throw err;

    // passwordEnter();

    start();

})
