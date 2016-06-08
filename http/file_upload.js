/**
 * file upload formidable 사용
 */
var http = require('http');
var formidable = require('formidable');

var server = http.createServer(function(req, res) {
	switch (req.method) {
	case 'GET':
		show(req, res);
		break;
	case 'POST':
		upload(req, res);
		break;
	default:
	}
}).listen(3000, function() {
	console.log('http server start...');
});

function show(req, res) {
	var html = '<form method="post" action="/" enctype="multipart/form-data">'
			+ '<p><input type="text" name="name"/></p>'
			+ '<p><input type="file" name="file"/></p>'
			+ '<p><input type="submit" value="Upload"/></p>' + '</form>';
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', Buffer.byteLength(html));
	res.end(html);
}

function upload(req, res) {
	if (!isFormData(req)) {
		res.statusCode = 400;
		res.end('Bad Request: expecting multipart/form-data');
		return;
	}

	var form = new formidable.IncomingForm(); // IncomingForm 객체는 자체적으로 다양한 이벤트를 발생시키며 기본적으로 업로드되는 파일을 /tmp 디렉터리로 스트림한다.
	form._uploadPath('./upload/');

	// 항목의 수신이 완료되면 field 이벤트 발생
	form.addListener('field', function(field, value) {
		console.log('field : ' + field);
		console.log('value : ' + value);
	});

	// file을 받아서 처리
	form.addListener('file', function(name, file) {
		console.log('name : ' + name);
		console.log(file);
	});

	form.addListener('end', function() {
		console.log('upload complete!');
		/* Temporary location of our uploaded file */
//		var temp_path = this.openedFiles[0].path;
		/* The file name of the uploaded file */
//		var file_name = this.openedFiles[0].name;
	});
	
	//formidable의 progress 이벤트는 수신한 바이트 수와 수신 받을 전체 바이트 수를 알려준다.
	form.addListener('progress', function(bytesReceived, bytesExpected){
		var percent = Math.floor(bytesReceived / bytesExpected * 100);
		console.log(percent);
		//실시간 모듈을 이용하여 client에서의 progress 만들기
	});

//	form.parse(req); // formidable이 파싱을 위해 요청의 data 이벤트에 접근할 수 있게 한다.
	form.parse(req, function(err,fields,files) {
		console.log(fields);
		console.log(files);
		
		res.setHeader('Location', 'http://localhost:3000/');
		res.statusCode = 302;
		res.end();
	});

//	res.setHeader('Location', 'http://localhost:3000/');
//	res.statusCode = 302;
//	res.end();
}

function isFormData(req) {
	var type = req.headers['content-type'] || '';
	return 0 == type.indexOf('multipart/form-data');
}