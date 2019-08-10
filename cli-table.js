var Table = require('cli-table');

// instantiate
var table = new Table({
    head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity', 'product_sales'],
    colWidths: [10, 30, 18, 10, 15, 15]
});

// table is an Array, so you can `push`, `unshift`, `splice` and friends
table.push(
    [1, 'Coleman 2 person tent', 'Outdoor', 100, 20000],
    [200, 'something something', 'Automotive', 20000, 1000000]
);

console.log(table.toString());