// When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window.
// The total_profit column should be calculated on the fly using the difference between over_head_costs and product_sales. total_profit is NOT stored in any database.

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

// connect to mysql and start supervisor view
function startApp() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);
        console.log('\n');
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

// get product sales by joining departments and products table; calculate total profit from product_sales - over_head_costs
function productSales() {

    // join products and departments tables as non duplicates; calculate total profit from product_sales - over_head_costs; list by department_id
    var query =
        `SELECT department_id, departments.department_name, over_head_costs, SUM(product_sales) AS product_sales, SUM(product_sales) - over_head_costs AS total_profit 
        FROM departments 
        INNER JOIN products ON departments.department_name = products.department_name 
        GROUP BY department_id`

    connection.query(query, function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['department_id', 'department_name', 'over_head_costs', 'product_sales', 'total_profit'],
            colWidths: [15, 20, 20, 18, 18]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]);
        }

        console.log('\n');
        console.log(table.toString());
        console.log('Here are all of the coss and sales of each deparment!');
        superView();
    });
};

// creates a new department in departments db
function createNewDept() {
    console.log('create new dept')
    console.log('\n');
    superView();

};

// quit app
function quit() {
    console.log('Exiting System. Good Bye.');
    connection.end();
    process.exit();
};

startApp();