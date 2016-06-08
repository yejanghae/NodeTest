/**
 * simple RESTful web service
 * POST 요청 바디 문자열 버퍼링하기
 * 할 일 목록 폼 처리
 */
var http = require('http');
var url = require('url');
var items = [];	//데이터는 메모리에 일반 자바크스립트 배열로 저장됨

var qs = require('querystring');

//테스트용 데이터
items.push('buy groceries');
items.push('buy node in action');

var server = http.createServer(function(req, res) {
	if('/' == req.url){
		switch(req.method){
		case 'GET':
			show(res);
			break;
		case 'POST':
			add(req, res);
			break;
		default :
			badRequest(res);
		}
	}else{
		notFound(res);
	}
}).listen(3000, function() {
	console.log('http server start...');
});

function show(res){
	var html = '<html><head><title>Todo List</title></head><body>'
		+ '<h1>Todo List</h1>'
		+ '<ul>'
		+ items.map(function(item){
			return '<li>' + item + '</li>';
		}).join('')
		+ '</ul>'
		+ '<form method="post" action="/">'
		+ '<p><input type="text" name="item"/></p>'
		+ '<p><input type="submit" value="Add Item"/></p>'
		+ '</form></body></html>';
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', Buffer.byteLength(html));
	res.end(html);
}

//응답 객체를 받아서 상태 코드를 404롤 설정하고 응답 바디를 Not Found로 설정
function notFound(res){
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Not Found\n');
}

//클라이언트의 요청이 잘못됐음을 알려준다
function badRequest(res){
	res.statusCode = 400;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Bad Request\n');
}

//할 일 추가
function add(req, res){
	var body = '';
	req.setEncoding('utf8');
	req.addListener('data', function(chunk) {
		body += chunk;
	});
	req.addListener('end', function() {
		var obj = qs.parse(body);
		items.push(obj.item);
		show(res);
	});
}