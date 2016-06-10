/**
 * HTML 전송, 폼 생성 및 데이터 수신을 위한 헬퍼 함수
 */
//html 응답 전송
var qs = require('querystring');
exports.sendHtml = function(res, html){
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Content-Length', Buffer.byteLength(html));
	res.end(html);
}

//http post 데이터 파싱
exports.parseReceivedData = function(req, cb){
	var body = '';
	req.setEncoding('utf8');
	req.on('data', function(chunk){
		body += chunk;
	});
	req.on('end', function(){
		var data = qs.parse(body);
		cb(data);
	});
};

//단순한 폼을 화면에 표시
exports.actionForm = function(id, path, label){
	var html = '<form method="POST" action="' + path + '">'
	+ '<input type="hidden" name="id" value="' + id + '/>'
	+ '<input type="submit" value="' + label + '"/>'
	+ '</form>'
	return html;
};

//작업 기록 추가하기
exports.add = function(db, req, res){
	//HTTP POST 데이터 파싱하기
	exports.parseReceivedData(req, function(work){
		db.query(		//작업 기록을 추가하는 SQL
				'INSERT INTO work(hours, date, description) ' + 'VALUES(?,?,?)',
				[work.hours, work.date, work.description],	//작업 기록 데이터
				function(err){
					if(err){
						throw err;
					}
					exports.show(db, res);	//사용자에게 작업 기록 목록을 보여준다
				}
		);
	});
};

//작업 기록 삭제
exports.del = functon(db, req, res){
	//HTTP POST 데이터 파싱
	exports.parseReceivedData(req, function(work) {
		db.query(
				'DELETE FROM work WHERE id=?',	//작업 기록 SQL
				[work.id],
				function(err){
					if(err){
						throw err;
					}
					exports.show(db, res);	//작업 기록 목록을 보여준다
				}
		);
	});
};

//작업 기록을 저장 상태로 변경
exports.archive = function(db, req, res){
	//HTTP POST 데이터 파싱
	exports.parseReceivedData(req, function(work) {
		db.query(
				//작업 기록을 갱신하는 SQL
				'UPDATE work SET archived=1 WHERE id=?',
				[work.id],		//작업 기록 ID
				function(err){
					if(err){
						throw err;
					}
					exports.show(db, res);		//작업 기록 목록을 보여준다.
				}
		);
	});
};

//작업 기록 검색하기
exports.show = function(db, res, showAchived){
	//작업 기록을 가져오는 SQL
	var query = 'SELECT * FROM work ' + 'WHERE archived=? ' + 'ORDER BY date DESC';
	var archiveValue = (showAchived) ? 1 : 0;
	db.query(
			query,
			[archiveValue],		//작업 기록의 저장 상태값이 필요
			function(err){
				if(err){
					throw err;
				}
				html = (showArchived) ? '' : '<a href="/archived">Archived Work</a><br/>';
				html += exports.workHitlistHtml(rows);		//HTML 테이블 혀태로 결과 서식을 만듦
				html += exports.workFormHtml();
				exports.sendHtml(res, html);				//사용자에게 HTML 응답을 전송
			}
	);
};

exports.showArchived = function(db, res){
	exports.show(db, res, true);		//저장된 작업 기록만 표시
}