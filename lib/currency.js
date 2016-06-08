/*var canadianDollar = 0.91;			//private 변수처럼 동작하여 application에서 직접적으로 접근은 불가

function roundTwoDecimals(amount){
	return Math.round(amount * 100) / 100;
}

//canadianToUS 함수는 exports module에 할당되어 이 module을 불러들인 코드에서 사용 가능
exports.canadianToUS = function(canadian){
	return roundTwoDecimals(canadian * canadianDollar);
}

//USToCanadian 함수 또한 exports에 정의
exports.USToCanadian = function(us){
	return roundTwoDecimals(us / canadianDollar);
}
*/

//객체지향적인 구현
var Currency = function(canadianDollar){
	this.canadianDollar = canadianDollar;
}

Currency.prototype.roundTwoDecimals = function(amount){
	return Math.round(amount * 100) / 100;
}

Currency.prototype.canadianToUS = function(canadian){
	return this.roundTwoDecimals(canadian * this.canadianDollar);
}

Currency.prototype.USToCanadian = function(us){
	return this.roundTwoDecimals(us / this.canadianDollar);
}

//exports = Currency;	//노드는 exports를 덮어 쓸 수 없다
module.exports = exports = Currency;	//module.exports가 다시 exports를 참조하게 한다
											//exports에 다른 값이 할당되면 module.exports와 exports의 참조가 깨진다