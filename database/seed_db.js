//This JS file generates data using faker and populates it to the database.
//This script will truncate all tables before creating new data.

//pacakage declarations
var faker = require('faker');
var mysql = require('mysql');

//database connection: change if
var mysqlConfig = require('./config.js');
var db = mysql.createConnection(mysqlConfig);

//truncate tables
const tables = ['reviews', 'product_list', 'products', 'shops', 'customers'];

for (let i = 0; i < tables.length; i++) {
  db.query(`delete from ${tables[i]};`);
  console.log(`${tables[i]} cleared.`);
}

//create a list of fake customers.  Customers will have a random chance
//to have an avatar (to reflect some users not uploading one.)
for(let i = 0; i < 25; i ++) {
  let customerName = faker.fake("{{internet.userName}}");
  let cutomerAvatar = null;
  if(Math.random() > 0.4) {
    customerAvatar = faker.fake("{{image.avatar}}");
    db.query(`insert into customers (customer_name, customer_avatar) values ("${customerName}", "${customerAvatar}")`);
  } else {
    db.query(`insert into customers (customer_name) values ("${customerName}")`);
  }

}
console.log("Customers seeded.");

//close db connection when finished
db.end();

//testing faker calls
// console.log(faker.fake("{{internet.userName}}"));
// console.log(faker.fake("{{commerce.productName}}"));
// console.log(faker.fake("{{company.companyName}}"));
// console.log(faker.fake("{{date.past}}"));
// console.log(faker.fake("{{lorem.paragraph}}"));
// console.log(faker.fake("{{lorem.sentence}}"));
// console.log(faker.fake("{{image.avatar}}"));
// console.log(faker.fake("{{image.cats}}"));