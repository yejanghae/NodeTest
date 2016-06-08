/**
 * 정적 파일 웹 서버
 */
var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

// __dirname : 노드에서 제공하는 매직 변수로 파일의 directory path를 가지고 있다. 같은 프로그램이라도 파일이 여러
// directory에 퍼져 있는 경우 서로 다른 값을 가질 수 있기 때문이다.
var root = __dirname;

var server = http.createServer(function(req, res) {
	console.log('url : ' + req.url);
	console.log('root : ' + root);

	var url = parse(req.url);
	var path = join(root, url.pathname); // 절대 경로 만들기

	console.log('path : ' + path);

	// stream.addListener('data', function(chunk) {
	// res.write(chunk); //응답에 파일 데이터를 작성
	// });
	// stream.addListener('end', function() {
	// res.end(); //파일이 완료되면 응답을 종료
	// });

	
//	var stream = fs.createReadStream(path); // fs.ReadStream 생성
//	stream.pipe(res); // resend()는 streampipe()에서 내부적으로 호출된다.
//	stream.addListener('error', function(err) {
//		res.statusCode = 500;
//		res.end('Internal Server Error\n');
//	})
	
	fs.stat(path, function(err, stat){
		if(err){
			if('ENOENT' == err.code){
				res.statusCode = 404;
				res.end('Not Found\n');
			}else{
				res.statusCode = 500;
				res.end('Internal Server Error\n');
			}
		}else{
			res.setHeader('Content-Length', stat.size);
			var stream = fs.createReadStream(path);
			stream.pipe(res);
			stream.addListener('error', function(err) {
				res.statusCode = 500;
				res.end('Internal Server Error\n');
			});
		}
	});
}).listen(3000, function() {
	console.log('static file server start...');
});