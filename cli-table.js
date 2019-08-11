var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// for cli header
var data1 = [1, 'Coleman 2 person tent', 'Outdoor', 100, 20000]
var data2 = [200, 'something something', 'Automotive', 20000, 1000000]

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

function tableHeader() {
    connectSQL();
    // select * from information_schema.columns where table_name = 'products';
    // productColumns should reflect table columns: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity', 'product_sales']
    connection.query(`SELECT * FROM information_schema.columns WHERE table_name = 'products'`, function (err, res) {
        if (err) throw err;

        // create array to hold column names after query for columns from a table
        var productsColumns = [];
        var productsWidths = [];
        var width;
        for (var i = 0; i < res.length; i++) {
            // console.log(res[i])
            // console.log(res[i].COLUMN_NAME)
            productsColumns.push(res[i].COLUMN_NAME);
            width = Number(res[i].COLUMN_NAME.length) * 2;
            productsWidths.push(width)
        }

        // instantiate
        var table = new Table({
            head: productsColumns,
            colWidths: productsWidths
        });

        showTable(table);

    });
}


function showTable(header, data) {

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    header.push(
        data1, data2
    );
    console.log(header.toString());
};
// connect to sql and push column names into cli table
tableHeader();