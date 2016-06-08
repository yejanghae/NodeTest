/**
 * in memory repository 사용
 * 변수를 사용하서 데이터를 저장
 * 데이터를 읽고 쓰는 것은 빠르지만 서버와 application을 다시 시작하면 데이터를 잃게 된다.
 */
var http = require('http');
var counter = 0;

var server = http.createServer(function(request, response) {
	counter++;
	response.write('I have been accessed ' + counter + ' itmes');
	response.end();
}).listen(3000, function() {
	console.log('server start...');
});