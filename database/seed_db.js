//this JS file generates data using faker and populates it to the database.

var faker = require('faker');


//testing faker calls
console.log(faker.fake("{{name.lastName}}, {{name.firstName}} {{name.suffix}}"));
console.log(faker.fake("{{commerce.productName}}"));
console.log(faker.fake("{{company.companyName}}"));