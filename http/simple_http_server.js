var http = require('http');

var server = http.createServer(function(request, response) {
	//서버에 접속하면 단순히 Hello world를 텍스트로 볼 수 있다.
//	response.write('Hello world');
//	response.end();
	
	//내용이 짧으면 write()와 end()를 간단히 하나의 문장으로 합쳐서 사용 가능.
	//response.end('Hello world');
	
//	헤더 값 설정
//	var body = 'Hello world';
//	response.setHeader('Content-Length', body.length);
//	response.setHeader('Content-type', 'text/plain');
//	response.end(body);
	
//	redirection
	var url = 'http://google.com';
	var body = '<p>Redirecting to <a href="' + url + '">' + url + '</a></p>';
//	header의 Location을 바꾸지 않으면 status code를 302로 바꾸더라도 redirection하지 않는다.
	response.setHeader('Location', url);
	response.setHeader('Content-Length', body.length);
	response.setHeader('Content-type', 'text/html');
//	status code 302 -> 302(임시 이동): 현재 서버가 다른 위치의 페이지로 요청에 응답하고 있지만 요청자는 향후 요청 시 원래 위치를 계속 사용해야 한다.
//	status code를 302로 바꾸지 않으면 body의 내용이 web browser에 적용되어 랜더링된다.
//	status cpde를 302로 바꿈으로써 헤더의 Location 속성값으로 redirection 
	response.statusCode = 302;
	response.end(body);
}).listen(3000, function() {
	console.log('http server start...');
});