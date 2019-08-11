-- create db with products table --
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
    item_id INT NOT NULL
    AUTO_INCREMENT PRIMARY KEY,
    product_name TINYTEXT NOT NULL,
    department_name TINYTEXT NOT NULL,
    price INT NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales INT NOT NULL
);

    -- reuse insert query to add new products
    INSERT INTO products
        (
        product_name,
        department_name,
        price,
        stock_quantity,
        product_sales
        )
    VALUE
    (
    'Toyota Tacoma',
    'Automotive',
    35000,
    3,
    0
    );

    -- create departments table
    CREATE TABLE departments
    (
        department_id INT NOT NULL
        AUTO_INCREMENT PRIMARY KEY,
    department_name TINYTEXT NOT NULL,
    over_head_costs INT NOT NULL
);


        INSERT INTO departments
            (
            department_name,
            over_head_costs
            )
        VALUE
        (
        'Food',
        1100
        );

        SELECT *
        FROM products;

        SELECT *
        FROM departments;

        SELECT *
        FROM products, departments;

-- END --