require("dotenv").config();

var mysql = require("mysql");
var inquirer = require("inquirer");
// var keys = require("./keys.js");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bamazon_DB"
})


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

        res.forEach(function(str) {
            console.log(`item: ${str.product_name} | id: ${str.item_id} | department: ${str.department_name} | price: $${str.price} | stock: ${str.stock_quantity}`);
        })
    })

    connectionEnd();
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;

        res.forEach(function(str) {
            console.log(`item: ${str.product_name} | id: ${str.item_id} | department: ${str.department_name} | price: $${str.price} | stock: ${str.stock_quantity}`);
        })
    })

    connectionEnd();
}

function addInventory() {
    connectionEnd();
}

function addProduct() {
    connectionEnd();
}

// Function works correctly but removed during debugging until I get the rest of the application running.
// function passwordEnter() {
//     inquirer.prompt([
//         {
//             type: "password",
//             message: 'Type in the manager password to access this app:',
//             name: password,
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

function connectionEnd() {
    connection.end();
}

connection.connect(function (err) {
    if (err) throw err;

    // passwordEnter();

    start();

})
