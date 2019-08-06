DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
    item_id INT NOT NULL PRIMARY KEY,
    product_name TINYTEXT NOT NULL,
    department_name TINYTEXT NOT NULL,
    price INT NOT NULL,
    stock_quantity INT NOT NULL
);

INSERT INTO products
    (product_name, department_name, price, stock_quantity)
VALUE
('Coleman 2-Person Tent',
'Outdoor',
90,
10
),
('Headlamp', 'Electronics', 20, 2000),
('Go Pro', 'Electronics', 500, 5),
('Yeti Cooler', 'Outdoor', 50, 15),
('Shimano Fishing Pole', 'Sporting Goods', 50, 100),
('Hobie Kayak', 'Sporting Goods', 2000, 2),
('Propane', 'Outdoor', 30, 10),
('Water', 'Food', 12, 600),
('Sleeping Bag', 'Outdoor', 40, 50),
('Toyota Tacoma', 'Automotive', 35000, 3);

SELECT *
FROM products;

-- END --