/**
 * http://usejsdoc.org/
 */
var http = require('http');
var cnt = 0

var server = http.createServer(function(request, response) {
	response.end();
	this.close();
}).listen(3000, function(){
	console.log('server start...' + ++cnt);
});


server.addListener('close', function() {
	console.log('closed...!!');
	this.listen(3000, function(){
		console.log('server start...' + ++cnt);
	});
});

