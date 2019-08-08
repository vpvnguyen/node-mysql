// -------------------
// Challenge #2: Manager View (Next Level)
// Create a new Node application called bamazonManager.js. Running this application will:



// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

// experiemnt with getting query response to global
var queryAllProducts;
var mysql = require('mysql');
var inquirer = require('inquirer');

// create connection to mysql
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
function managerView() {
    inquirer.prompt([
        {
            type: "list",
            message: "Manager View - Select Options",
            name: "managerOption",
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'EXIT']
        }
    ]).then(function (choice) {
        console.log(choice.managerOption)
        if (choice.managerOption === 'View Products for Sale') {
            productsForSale();
        } else if (choice.managerOption === 'View Low Inventory') {
            lowInventory(queryAllProducts);
        } else if (choice.managerOption === 'Add to Inventory') {
            console.log(choice.managerOption);
        } else if (choice.managerOption === 'Add New Product') {
            console.log(choice.managerOption);
        } else if (choice.managerOption === 'EXIT') {
            quit();
        }

    });
};
// connect to mysql
function connectSQL() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);
    });
};
// experiemnt with getting query response to global
function queryAll() {
    connection.query('SELECT * FROM products', function (err, allProducts) {
        if (err) throw err;
        for (var i = 0; i < allProducts.length; i++) {
            // console.log(res[i]);
            console.log(`\n`);
            console.log(`id: ${allProducts[i].item_id}`);
            console.log(`Item: ${allProducts[i].product_name}`);
            console.log(`Department: ${allProducts[i].department_name}`);
            console.log(`Price: ${allProducts[i].price}`);
            console.log(`Stock: ${allProducts[i].stock_quantity}`);
        }
        queryAllProducts = allProducts;
    });
}


// query mysql for all data
function productsForSale() {
    connection.query('SELECT * FROM products', function (err, allProducts) {
        if (err) throw err;
        for (var i = 0; i < allProducts.length; i++) {
            // console.log(res[i]);
            console.log(`\n`);
            console.log(`id: ${allProducts[i].item_id}`);
            console.log(`Item: ${allProducts[i].product_name}`);
            console.log(`Department: ${allProducts[i].department_name}`);
            console.log(`Price: ${allProducts[i].price}`);
            console.log(`Stock: ${allProducts[i].stock_quantity}`);
        }
        managerView();
    });
};

function lowInventory() {
    connection.query('SELECT * FROM products', function (err, allProducts) {
        if (err) throw err;
        for (var i = 0; i < allProducts.length; i++) {
            // console.log(res[i]);
            console.log(`\n`);
            console.log(`id: ${allProducts[i].item_id}`);
            console.log(`Item: ${allProducts[i].product_name}`);
            console.log(`Department: ${allProducts[i].department_name}`);
            console.log(`Price: ${allProducts[i].price}`);
            console.log(`Stock: ${allProducts[i].stock_quantity}`);
        }
    });
};

function quit() {
    console.log('Exiting System');
    connection.end();
    process.exit();
};

connectSQL();
// managerView();

// experiemnt with getting query response to global
queryAll();
console.log(queryAllProducts)