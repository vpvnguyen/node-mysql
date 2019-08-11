// The app should then prompt users with two messages.
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
// However, if your store does have enough of the product, you should fulfill the customer's order.
// This means updating the SQL database to reflect the remaining quantity.

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

// connect to mysql and start customer view / prompt
function startApp() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);
        customerView();
    });
};

// query mysql for all data
function buy() {
    connection.query('SELECT * FROM products', function (err, allProducts) {
        if (err) throw err;
        // instantiate
        var table = new Table({
            head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'],
            colWidths: [10, 28, 18, 10, 18]
        });

        for (var i = 0; i < allProducts.length; i++) {
            table.push(
                [allProducts[i].item_id, allProducts[i].product_name, allProducts[i].department_name, allProducts[i].price, allProducts[i].stock_quantity]
            );
        }

        // log cli table of products
        console.log(table.toString());
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
        // start purchase transaction
        purchase(item.id, item.quantity);
    });
};

// pass in product ID and quantity; run transaction if stock is available
function purchase(productID, quantity) {
    connection.query('SELECT * FROM products WHERE item_id=?', productID, function (err, item) {
        if (err) throw err;

        // update stock quantity and product sales based on transaction
        var updatedQuantity = item[0].stock_quantity - quantity;
        var totalSale = item[0].price * item[0].stock_quantity;
        var productSalesTotal = item[0].product_sales + totalSale;

        console.log(`Product Sales Total: ${productSalesTotal}`)
        console.log(`Selected [${quantity}x] of [${item[0].product_name}]...`);

        // if quantity is in stock, fulfill transaction
        if (updatedQuantity > 0) {
            connection.query('UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?', [updatedQuantity, productSalesTotal, productID], function (err, res) {
                if (err) throw err;
                console.log(`Total: $${totalSale}`);
                console.log(`Thank you for your purchase!\n`);
                buyAgain();
            });
        } else {
            console.log('Sorry! We are out of stock!');
            customerView();
        }
    });
};

// prompt customer if they want to buy after transaction
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
function customerView() {
    inquirer.prompt([
        {
            type: "list",
            message: "Welcome! What would you like to do?",
            name: "welcome",
            choices: ['BUY', 'EXIT']
        }
    ]).then(function (choice) {
        if (choice.welcome === 'BUY') {
            // connect to mysql and start buying process
            buy();
        } else if (choice.welcome === 'EXIT') {
            // end mysql connection and app
            quit();
        }
    });
};

// quit app
function quit() {
    console.log('\n');
    console.log('Thank you! Good Bye.');
    connection.end();
    process.exit();
};

startApp();