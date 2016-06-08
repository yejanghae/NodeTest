/**
 * 
 */

var http = require('http');
var fs = require('fs');
/*
//HTTP 서버를 생성하고 응답 로직을 정의한 콜백을 사용
http.createServer(function(request, response) {
	if(request.url == '/'){
		fs.readFile('./titles.json', function(err, data) {		//JSON 파일을 읽고 파일 내용을 처리할 방법을 정의한 콜백을 사용
			if(err){
				console.error(err);
				response.end('Server error');
			}else{
				var titles = JSON.parse(data.toString());			//JSON 텍스트를 파싱
				fs.readFile('./template.html', function(err, data) {	//HTML 템플릿을 읽고 템플릿이 로드 됐을 때 콜백 사용
					if(err){
						console.error(err);
						response.end('Server error');
					}else{
						var tmpl = data.toString();
						var html = tmpl.replace('%', titles.join('</li><li>'));		//블로그 글의 제목을 보여줄 HTML 페이지 조합
						response.writeHead(200, {'Content-type': 'text/html'});
						response.end(html);
					}
				})
			}
		})
	}
}).listen(8000, '127.0.0.1');*/



//HTTP 서버를 생성하고 응답 로직을 정의한 콜백을 사용
var server = http.createServer(function(request, response) {	//client 요청의 최초 진입점
	getTitles(response);
}).listen(8000, '127.0.0.1');

function getTitles(response){			//getTitles에서 제목을 가져오고 getTemplate에 제어를 넘김
	fs.readFile('./titles.json', function(err, data) {
//		if(err){
//			hadError(err, response);
//		}else{
//			getTemplate(JSON.parse(data.toString()), response);
//		}
		
		//오류가 발생하면 함수를 더는 실행할 필요가 없으므로 else 분기를 만드는 대신 반환
		if(err) return hadError(err, response);
		getTemplate(JSON.parse(data.toString()), response);
	})
}

function getTemplate(titles, response){		//getTemplate에서 템플릿 파일을 읽은 후 formatHtml에 제어를 넘김
	fs.readFile('./template.html', function(err, data) {
//		if(err){
//			hadError(err, respnse);
//		}else{
//			formatHtml(titles, data.toString(), response);
//		}
		
		if(err) return hadError(err, response);
		formatHtml(titles, data.toString(), response);
	})
}

function formatHtml(titles, tmpl, response){		//formatHtml은 제목과 템플릿으로 클라이언트에 응답할 페이지를 랜더링
	var html = tmpl.replace('%', titles.join('</li><li>'));
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.end(html);
}

function hadError(err, response){			//실행과정에서 오류 발생 시 hadError는 console에 오류 내용을 기록하고 클라이언트에 'Server Error'를 응답으로 보냄
	console.error(err);
	response.end('Server Error');
}