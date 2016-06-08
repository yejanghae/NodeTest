/**
 * 간단한 발행/구독 시스템 서버
 */

var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};

//이벤트 발생자에 추가할 리스너 개수를 늘리고, 리스너가 10개 이상 등록됐을 때 노드가 출력하는 경고를 무시할 수 있다.
//channel.setMaxListeners(50);

channel.on('join', function(id, client){
	this.clients[id] = client;					//application이 사용자에게 데이터를 전송할 수 있게 사용자의 client 객체를 저장하는 listener를 join event에 추가
	this.subscriptions[id] = function(senderId, message){
		if(id != senderId){						//사용자가 직접 전체에 뿌린 데이터는 무시
			this.clients[id].write(message);
		}
	}
	this.on('broadcast', this.subscriptions[id]);
});

channel.on('leave', function(id) {			//leave event listener 생성
	channel.removeListener('broadcast', this.subscriptions[id]);	//특정 client의 broadcast listener 제거
	channel.emit('broadcast', id, id + 'has left the chat\n');
})

channel.on('shutdown', function(){
	channel.emit('broadcast', '', 'Chat has shut down.\n');
	channel.removeAllListeners('broadcast');
});

//이벤트 발생자를 만들 때, 보통 오류를 직접 던지기 보다는 오류 타입의 이벤트를 발생시키는 구문 규칙을 사용할 수 있다. 
//이를 이용하면, 오류 이벤트 타입에 나ㅏ 이상의 리스너를 추가해 별도의 이벤트 응답 로직을 정의할 수 있다.
channel.on('error', function(err){
	console.log('ERROR : ' + err.message);
});

//error 타입의 이벤트가 발생했을 때, 등록된 리스너가 없으면 발생자는 stack strace(오류가 발생했을 때, 그 지점까지 수행된 프로그램 명령의 목록)를 출력
//channel.emit('error', new Error('Something is wrong.'));

var server = net.createServer(function(client) {
	var id = client.remoteAddress + ':' + client.remotePort;
	client.on('connect', function(){
		channel.emit('join', id, client);		//사용자가 서버에 접속했을 때 사용자 id와 client 객체를 명시해 join event를 발생
	});
	
	client.on('data', function(data) {			//어떤 사용자라도 데이터를 보내면 사용자 id와 메시지를 명시해 채널에 broadcast event를 발생
		data = data.toString();
		if(data == 'shutdown\r\n'){
			channel.emit('shutdown');
		}
		channel.emit('broadcast', id, data);
	});
	
	client.on('close', function(){
		channel.emit('leave', id);				//client 연결이 종료됐을 때 leave event 발생
	});
});

server.listen(8888);