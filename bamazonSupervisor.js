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
        superView();
    });
};

// prompt for supervisor options
function superView() {
    inquirer.prompt([
        {
            type: "list",
            message: "Supervisor View - Select Options",
            name: "managerOption",
            choices: ['View Product Sales by Department', 'Create New Department', 'EXIT']
        }
    ]).then(function (choice) {
        if (choice.managerOption === 'View Product Sales by Department') {
            productSales();
        } else if (choice.managerOption === 'Create New Department') {
            createNewDept();
        } else if (choice.managerOption === 'EXIT') {
            quit();
        }
    });
};

// department_id 01 02
// department_name Electronics Clothing - department
// over_head_costs 10000 60000 - products
// product_sales 20000 100000 - products
// total_profit 10000 40000 - product_sales(prod) - over_head_costs(prod)


// get product sales by 
function productSales() {
    console.log('product sales');
    superView();

};

function createNewDept() {
    console.log('create new dept')
    superView();

};

// quit app
function quit() {
    console.log('Exiting System');
    connection.end();
    process.exit();
};
connectSQL();

// Modify the products table so that there's a product_sales column, and modify your bamazonCustomer.js app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.
// Make sure your app still updates the inventory listed in the products column.

// When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.
// department_id 01 02
// department_name Electronics Clothing
// over_head_costs 10000 60000
// product_sales 20000 100000
// total_profit 10000 40000
// total profit = product_sales - over_head_costs ON THE FLY

// The total_profit column should be calculated on the fly using the difference between over_head_costs and product_sales. total_profit should not be stored in any database. You should use a custom alias.
// If you can't get the table to display properly after a few hours, then feel free to go back and just add total_profit to the departments table.
// Hint: You may need to look into aliases in MySQL.
// Hint: You may need to look into GROUP BYs.
// Hint: You may need to look into JOINS.
// HINT: There may be an NPM package that can log the table to the console. What's is it? Good question :)