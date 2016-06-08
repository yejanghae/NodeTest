/**
 * https server
 */
var https = require('https');
var fs = require('fs');

//SSL key와 인증을 옵션으로 사용
var options = {
	key : fs.readFileSync('./keys/key.pem'),
	cert : fs.appendFileSync('./keys/key-cert.pem')
};

https.createServer(options, function(request, response) {
	response.writeHead(200);
	response.end('hello world\n');
}).listen(3000, function() {
	console.log('https server start...');
});