var mysql = require('mysql');
var inquirer = require('inquirer');

// create connection to mysql
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connectSQL();

// connect to mysql
function connectSQL() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);

        // comment in or out to stop or start connection
        connection.end();
    });
};


// query mysql for all data
function queryAll() {

};

// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.



// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.



// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.