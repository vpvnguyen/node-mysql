# Ecommerce CLI Store Front (Node.js & MySQL)

An Amazon-like storefront built with Node.js & MySQL. 

The app will:
- Take in orders from customers and deplete stock from the store's inventory.
- Track product sales across your store's departments and then provide a summary of the highest-grossing departments in the store.
- Add and create new products and departments.

### Requirements
- Node.js
- MySQL

### Setup
- `git clone <repo>` or download zip
- `npm install`
- Configure your own MySQL connection in `bamazonCustomer.js`, `bamazonManager.js`, `bamazonSupervisor.js`
> Make sure you save and require the MySQL and Inquirer npm packages--your app will need them for data input and storage.

### Application
- run in terminal: `node <filename.js>`
