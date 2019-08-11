// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager 'add more' of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// create connection to mysql
var connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

// connect to mysql and start manager view
function startApp() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        console.log('\n');
        managerView();
    });
};

// prompt manager view options
function managerView() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Manager View - Select Options',
            name: 'managerOption',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'EXIT']
        }
    ]).then(function (choice) {
        if (choice.managerOption === 'View Products for Sale') {
            productsForSale();
        } else if (choice.managerOption === 'View Low Inventory') {
            lowInventory();
        } else if (choice.managerOption === 'Add to Inventory') {
            inventoryOptions();
        } else if (choice.managerOption === 'Add New Product') {
            addNewProduct();
        } else if (choice.managerOption === 'EXIT') {
            quit();
        }
    });
};

// query mysql for all data
function productsForSale() {
    connection.query('SELECT * FROM products', function (err, allProducts) {
        if (err) throw err;

        var table = new Table({
            head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity', 'product_sales'],
            colWidths: [10, 25, 20, 10, 18, 15]
        });

        for (var i = 0; i < allProducts.length; i++) {
            table.push([allProducts[i].item_id, allProducts[i].product_name, allProducts[i].department_name, allProducts[i].price, allProducts[i].stock_quantity, allProducts[i].product_sales]);
        }

        console.log(table.toString());
        console.log('\n');
        managerView();
    });
};

// check if inventory is low
function lowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity <= 5', function (err, allProducts) {
        if (err) throw err;

        var table = new Table({
            head: ['item_id', 'product_name', 'stock_quantity'],
            colWidths: [10, 25, 18]
        });

        for (var i = 0; i < allProducts.length; i++) {
            table.push([allProducts[i].item_id, allProducts[i].product_name, allProducts[i].stock_quantity]);
        }

        console.log(table.toString());
        console.log(`Found ${allProducts.length} items low in stock!`);
        console.log('\n');
        managerView();
    });
};

// prompt inventory options
function inventoryOptions() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'stock',
            choices: ['Add to Stock', 'EXIT']
        }
    ]).then(function (choice) {
        if (choice.stock === 'Add to Stock') {
            updateStock();
        } else if (choice.stock === 'EXIT') {
            quit();
        }
    });
};

// select item quantity and update stock
function updateStock() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the ID of item you want to add:',
            name: 'id',
            validate: function (input) {
                if (!isNaN(input) && Number(input) > 0) {
                    return true;
                } else {
                    console.log(' <- is not a valid number.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to add?',
            validate: function (input) {
                if (isNaN(input) && Number(input) >= 0) {
                    console.log(' <- is not a valid number.');
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function (item) {

        // select stock of product from id and calculate new stock quantity
        connection.query(`SELECT stock_quantity, product_name FROM products WHERE item_id = ?`, item.id, function (err, stock) {
            if (err) throw err;

            var updatedStock = Number(item.quantity) + Number(stock[0].stock_quantity);
            var table = new Table({
                head: ['item_id', 'product_name', 'stock_quantity'],
                colWidths: [10, 15, 18]
            });

            table.push([Number(item.id), stock[0].product_name, updatedStock]);

            console.log(`Adding [${item.quantity}x] of [${stock[0].product_name}] to stock!`);
            console.log(table.toString());
            console.log(`New stock total!`);

            // update item_id and item_quantity
            connection.query(`UPDATE products SET stock_quantity = ? WHERE item_ID = ?`, [updatedStock, item.id], function (err, res) {
                if (err) throw err;
                console.log('\n');
                managerView();
            });
        });
    });
};

// prompt user to input description of new product
function addNewProduct() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter product name: ',
            name: 'productName'
        },
        {
            type: 'input',
            message: 'Enter department name: ',
            name: 'departmentName'
        },
        {
            type: 'input',
            message: 'Price: ',
            name: 'price',
            validate: function (input) {
                if (isNaN(input) && Number(input) >= 0) {
                    console.log(' <- is not a valid number.');
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            type: 'input',
            message: 'How many would you like to add?',
            name: 'stock',
            validate: function (input) {
                if (isNaN(input) && Number(input) >= 0) {
                    console.log(' <- is not a valid number.');
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function (newProduct) {
        // pass in new product to insert into mysql
        insertNewProduct(newProduct);
    });
};

// insert new product into products table
function insertNewProduct(newProduct) {

    var table = new Table({
        head: ['product_name', 'department_name', 'price', 'stock_quantity'],
        colWidths: [25, 20, 10, 20]
    });

    table.push([newProduct.productName, newProduct.departmentName, newProduct.price, newProduct.stock]);
    console.log(table.toString());
    console.log('New Product has been added!');

    connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
        VALUE (?, ?, ?, ?, 0)`, [newProduct.productName, newProduct.departmentName, newProduct.price, newProduct.stock],
        function (err, res) {
            if (err) throw err;
            console.log('\n');
            managerView();
        });
};

// quit app
function quit() {
    console.log('\n');
    console.log('Exiting System. Good Bye.');
    connection.end();
    process.exit();
};

startApp();