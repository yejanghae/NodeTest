/**
 * simple RESTful web service
 * POST 요청 바디 문자열 버퍼링하기
 */
var http = require('http');
var url = require('url');
var items = [];	//데이터는 메모리에 일반 자바크스립트 배열로 저장됨

//테스트용 데이터
items.push('buy groceries');
items.push('buy node in action');

var server = http.createServer(function(req, res) {
//	//새로운 데이터 묶음을 읽을 때마다 data 이벤트가 생성
//	req.on('data', function(chunk){
//		//기본적으로 데이터 묶음은 Buffer 객체(byte array)
//		console.log('parsed', chunk);
//	});
//	
//	//모든 데이터를 읽고 나면 end 이벤트가 발생
//	req.on('end', function(){
//		console.log('done parsing');
//		res.end();
//	});
	
	switch(req.method){		//req.method는 요청받은 HTTP method의 종류
	case 'POST':
		var item = '';		//유입되는 항목에 대한 문자열 버퍼를 준비
		req.setEncoding('utf8');		//유입되는 data 이벤트에 대해 utf8 문자열로 인코딩
		req.on('data', function(chunk){
			item += chunk;			//버퍼에 데이터 묶음을 계속 연결
		});
		req.on('end', function(){
			items.push(item);			//버퍼링이 완료되면 items 배열에 새로운 item 추가
			res.end('OK\n');
		});
		break;
	case 'GET':
//		items.forEach(function(item, i){
//			res.write(i + ') ' + item + '\n');
//		});
//		res.end();
		
		//빠른 응답을 위해 되도록 Content-Length 필드를 함께 보내는 것이 좋다.
		//이 경우, 문자열을 길이를 구하고 한 번에 모든 목록을 내보내 응답 바디를 곧바로 구설할 수 있다.
		//Content-Length 헤더를 설정하면, 좀 더 적은 양의 데이터를 전송해서 성능을 극대화하기 위해, 노드의 데이터 묶음 인코딩을 암묵적으로 사용할 수 없다.
		var body = items.map(function(item, i) {
			return i + ') ' + item;
		}).join('\n');
		//Content-Length의 값을 문자열의 길이가 아닌, 바이트 길이가 돼야 하며, 문자열이 다중바이트 문자를 사용하고 있다면, 그 두 개의 값이 다를 수 있다. 
		//node는 Buffer.byteLength() 메서드를 제공하여 이러한 문제를 해결한다.
		res.setHeader('Content-Length', Buffer.byteLength(body));
		res.setHeader('Content-type', 'text/plain; charset="utf-8"');
		res.end(body + '\n');
		break;
	case 'DELETE':
		var path = url.parse(req.url).pathname;
		var i = parseInt(path.slice(1), 10);
		
		//숫자가 맞는지 확인
		if(isNaN(i)){
			res.statusCode = 400;
			res.end('Invalid item id');
		}else if(!items[i]){		//요청한 인덱스가 배열에 존재하는지 확인
			res.statusCode = 404;
			res.end('Item not found');
		}else{
			items.splice(i, 1);		//요청한 항목 삭제
			res.end('OK\n');
		}
		break;
	case 'PUT':
//		할 일 목록의 기존 항목을 수정하는 PUT HTTP 구현
		var path = url.parse(req.url).pathname;
		var query = url.parse(req.url, true).query;	//url.parse()의 2번재 parameter는 queryString을 파싱할 것인지에 대한 boolean 값으로 true를 하면 map타입의 Object로 queryString이 파싱되어 반환된다.
//		console.log('path : ' + path);
//		console.log('query');
//		for(var index in query){
//			console.log(index + ' = ' + query[index] + '\n');
//		}
		
		//숫자가 맞는지 확인
		var i = parseInt(path.slice(1), 10);
		if(isNaN(i)){
			res.statusCode = 400;
			res.end('Invalid item id\n');
		}else if(!items[i]){		//요청한 인덱스가 배열에 존재하는지 확인
			res.statusCode = 404;
			res.end('Item not found\n');
		}else{
			var changeValue = query['item'];
			if(!changeValue){
				res.statusCode = 400;
				res.end('Invalid query string key\n');
			}
			items[i] = changeValue;
			res.end('OK\n');
		}
		break;
	}
}).listen(3000, function() {
	console.log('http server start...');
});
