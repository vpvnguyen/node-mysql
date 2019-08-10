var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// create connection to mysql
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});


// connect to mysql
function connectSQL() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);
    });
};

// query mysql for all data
function buy() {
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

        // pass in results of all products in db
        promptBuy(allProducts);

    });
};

// start a prompt to ask what items the customer wants to buy
function promptBuy(allProducts) {

    inquirer.prompt([
        {
            type: "input",
            message: "Enter the ID of item you want to buy:",
            name: "id",
            validate: function (input) {
                if (isNaN(input) == false && Number(input) <= allProducts.length && Number(input) > 0) {
                    return true;
                } else {
                    console.log(' <- is not a valid number.');
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "How many would you like to buy?",
            validate: function (input) {
                if (isNaN(input)) {
                    console.log(' <- is not a valid number.');
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function (item) {
        console.log('\n');

        // start purchase transaction
        purchase(item.id, item.quantity);
    });
};

// pass in product ID and quantity; run transaction if stock is available
function purchase(productID, quantity) {
    connection.query('SELECT * FROM products WHERE item_id=?', productID, function (err, item) {
        if (err) throw err;
        var updatedQuantity = item[0].stock_quantity - quantity;
        var totalSale = item[0].price * item[0].stock_quantity;
        console.log(`Purchase of ${updatedQuantity}x ${item[0].product_name} complete!`);
        console.log(`Total: $${totalSale}`);
        console.log(`Previous Quantity: ${item[0].stock_quantity}`);
        console.log(`Updated Quantity: ${updatedQuantity}`);

        if (updatedQuantity > 0) {
            connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [updatedQuantity, productID], function (err, res) {
                if (err) throw err;
                console.log(`Thank you for your purchase!\n`);
                buyAgain();
            });
        } else {
            console.log('Sorry! We are out of stock!');
            welcome();
        }
    });
};

function buyAgain() {
    inquirer.prompt([
        {
            type: "list",
            message: "Would you like to purchase another product?",
            name: "buyAgain",
            choices: ['BUY AGAIN', 'EXIT']
        }
    ]).then(function (choice) {
        if (choice.buyAgain === 'BUY AGAIN') {
            buy();
        } else if (choice.buyAgain === 'EXIT') {
            quit();
        }

    });
};

// start a prompt to ask what items the customer wants to buy
function welcome() {

    inquirer.prompt([
        {
            type: "list",
            message: "Welcome! What would you like to do?",
            name: "welcome",
            choices: ['BUY', 'EXIT']
        }
    ]).then(function (choice) {

        // ask customer's what they want to buy from the list of items in inventory
        console.log(`User Selected: ${choice.welcome}`);

        if (choice.welcome === 'BUY') {
            // connect to mysql and start buying process
            connectSQL();
            buy();
        } else if (choice.welcome === 'EXIT') {
            // end mysql connection and app
            quit();
        }
    });
};

function quit() {
    console.log('Thank you! Good Bye.');
    connection.end();
    process.exit();
};



// // instantiate
// var table = new Table({
//     head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity', 'product_sales'],
//     colWidths: [10, 30, 18, 10, 15, 15]
// });

// // table is an Array, so you can `push`, `unshift`, `splice` and friends
// table.push(
//     [1, 'Coleman 2 person tent', 'Outdoor', 100, 20000],
//     [200, 'something something', 'Automotive', 20000, 1000000]
// );

// console.log(table.toString());

welcome();

// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.



// -------------------
// Challenge #2: Manager View (Next Level)
// Create a new Node application called bamazonManager.js. Running this application will:

// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product

// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

// -------------------
// Challenge #3: Supervisor View (Final Level)

// Create a new MySQL table called departments. Your table should include the following columns:
// department_id
// department_name
// over_head_costs (A dummy number you set for each department)

// Modify the products table so that there's a product_sales column, and modify your bamazonCustomer.js app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.
// Make sure your app still updates the inventory listed in the products column.

// Create another Node app called bamazonSupervisor.js. Running this application will list a set of menu options:
// View Product Sales by Department
// Create New Department

// When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.
// department_id
// department_name
// over_head_costs
// product_sales
// total_profit

// 01
// Electronics
// 10000
// 20000
// 10000

// 02
// Clothing
// 60000
// 100000
// 40000

// The total_profit column should be calculated on the fly using the difference between over_head_costs and product_sales. total_profit should not be stored in any database. You should use a custom alias.
// If you can't get the table to display properly after a few hours, then feel free to go back and just add total_profit to the departments table.
// Hint: You may need to look into aliases in MySQL.
// Hint: You may need to look into GROUP BYs.
// Hint: You may need to look into JOINS.
// HINT: There may be an NPM package that can log the table to the console. What's is it? Good question :)

