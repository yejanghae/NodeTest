/**
 * telnet을 이용한 echo server
 */
var net = require('net');

var server = net.createServer(function(socket) {
//	socket.on('data', function(data) {
//		socket.write(data);
//	});
	
	//첫번째 데이터에 대해서만 반응(once : event에 대해 한번만 응답)
	socket.once('data', function(data) {
		socket.write(data);
	})
});
server.listen(8888);