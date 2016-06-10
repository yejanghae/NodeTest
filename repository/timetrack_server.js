/**
 * mysql 연동
 */
var http = require('http');
var work = require('./lib/timetrck');
var MySQL = require('MySQL');

var db = MySQL.createConnection({
	host: '127.0.0.1',
	user: 'myuser',
	password: 'mypassword',
	database: 'timetrack'
});

var server = http.createServer(function(request, response) {
	switch(request.method){
	case 'POST':
		switch(request.url){
		case '/':
			work.add(db, request, response);
			break;
		case '/archive':
			work.archive(db, request, response);
			break;
		case 'delete':
			work.del(db, request, response);
			break;
		}
		break;
	case 'GET':
		switch(request.url){
		case '/':
			work.show(db, response);
			break;
		case '/archived':
			work.showArchived(db, response);
			break;
		}
		break;
	}
});

//테이블 생성 sql
db.query(
		'CREATE TABLE IF NOT EXISTS work('
		+ 'id INT(10) NOT NULL AUTO_INCREMENT, '
		+ 'hours DECIMAL(5,2) DEFAULT 0, '
		+ 'date DATE, '
		+ 'archived INT(1) DEFAULT 0, '
		+ 'description LONGTEXT, '
		+ 'PRIMARY KEY(id))', function(err){
			if(err){
				throw err;
			}
			//HTTP server 시작
			server.listen(3000, function(){
				console.log('Server started...');
			});
		}
);