/*var currency = require('./lib/currency');

console.log('50Canadian dollars equals this amount of US dollars: ');
console.log(currency.canadianToUS(50));
console.log('30 US dollars qeuals this amount of Canadian dollars: ');
console.log(currency.USToCanadian(30));*/


//객체지향적인 구현
var Currency = require('./lib/currency');
var canadianDollar = 0.91;

var currency = new Currency(canadianDollar);
console.log(currency.canadianToUS(50));
currency.print();