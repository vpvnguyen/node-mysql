// When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window.
// The total_profit column should be calculated on the fly using the difference between over_head_costs and product_sales. total_profit is NOT stored in any database.

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

// connect to mysql and start supervisor view
function startApp() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        console.log('\n');
        superView();
    });
};

// prompt for supervisor options
function superView() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Supervisor View - Select Options',
            name: 'managerOption',
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
        GROUP BY department_id`;

    connection.query(query, function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['department_id', 'department_name', 'over_head_costs', 'product_sales', 'total_profit'],
            colWidths: [15, 20, 20, 18, 18]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]);
        }

        console.log(table.toString());
        console.log('Department Overview');
        console.log('\n');
        superView();
    });
};

// start creating a new department by querying for all avalable department names
function createNewDept() {

    connection.query('SELECT * FROM departments', function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['department_id', 'department_name', 'over_head_costs'],
            colWidths: [15, 20, 20]
        });

        // hold avilable department names to check if name already exists
        var deptNames = [];
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs]);
            deptNames.push(res[i].department_name.toLowerCase());

        }

        console.log('\n');
        console.log(table.toString());
        addDeptDetails(deptNames);
    });
};

// start prompt for department details and insert new department into db
function addDeptDetails(deptNames) {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter new department name:',
            name: 'departmentName',
            validate: function (input) {
                // if department already exists, return false
                if (!deptNames.includes(input.toLowerCase())) {
                    return true;
                }
                console.log(' <-- Duplicate department name')
                return false;
            }
        },
        {
            type: 'input',
            message: 'Enter new department over head cost:',
            name: 'overHeadCost',
            // input is > 0
            validate: function (input) {
                if (!isNaN(input) && input > 0) {
                    return true;
                }
                console.log(' <-- Enter a number > 0')
                return false;
            }
        }
    ]).then(function (newDept) {
        console.log('\n');
        // pass in new department name and over head costs
        insertNewDept(newDept.departmentName, newDept.overHeadCost);
    });
};

// insert new department into departments table
function insertNewDept(departmentName, overHeadCost) {

    var table = new Table({
        head: ['department_name', 'over_head_costs'],
        colWidths: [25, 20]
    });
    table.push([departmentName, overHeadCost]);

    connection.query(`INSERT INTO departments (department_name, over_head_costs)
        VALUE (?, ?)`, [departmentName, overHeadCost],
        function (err, res) {
            if (err) throw err;
            console.log(table.toString());
            console.log('New department has been added!');
            console.log('\n');
            superView();
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