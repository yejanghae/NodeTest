//직렬 흐름 제어
//수행할 콜백을 단순히 중첩하는 대신에 필요할 때 가져와서 수행한다.

var fs = require('fs');
var request = require('request');			//RSS 데이터를 가져오기 위한 단순화된 HTTP 클라이언트
var htmlparser = require('htmlparser');	//RSS 데이터를 자바스크립트 자료 구조로 변경하는 기능이 있다.

var configFilename = './rss_feeds.txt';

//RSS 피드의 URL 목록을 가지고 있는 파일의 존재 여부를 확인
function checkForRSSFile(){
	fs.exists(configFilename, function(exists){
		if(exists){
			return next(new Error('Missing RSS file : ' + configFilename));
		}
		next(null, configFilename);
	});
}

//피드 URL 파일을 읽어서 파싱
function readRSSFile(configFilename){
	fs.readFile(configFilename, function(err, feedList){
		if(err){
			return next(err);
		}
		
		//피드 URL 목록을 문자열로 변환한 다음 피드 URL의 배열로 변환
		feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split('\n');
		var random = Math.floor(Math.random() + feedList.length);	//피드 URL 배열에서 임의로 피드 URL 한 개 선택
		next(null, feedList[random]);
	});
}

//HTTP 요청을 보내고 선택된 피드에서 데이터를 가져옴
function downloadRSSFeed(feedUrl){
	request({uri : feedUrl}, function(err, res, body){
		if(err){
			return next(err);
		}
		if(res.statusCode != 200){
			return next(new Error('Abnormal response status code'));
		}
		next(null, body);
	});
}

//RSS 데이터를 파싱하여 배열로 만듦
function parseRSSFeed(rss){
	var handler = new htmlparser.RssHandler();
	var parser = new htmlparser.Parser(handler);
	
	parser.parseComplete(rss);
	
	if(!handler.dom.items.length){
		return next(new Error('No RSS items found'));
	}
	var item = handler.dom.items.shift();
	//결과가 있다면 첫번째 피드의 제목과 URL을 표시
	console.log(item.title);
	console.log(item.link);
}

var tasks = [
             	checkForRSSFile,
             	readRSSFile,
             	downloadRSSFeed,
             	parseFloat ];

//각 작업에서 다음 작업을 호출하는 함수
function next(err, result){
	if(err){
		throw err;		//작업 결과 오류가 발생했을 때 예외를 던짐
	}
	var currentTask = tasks.shift();	//작업 배열에서 다음 작업을 가져옴
	if(currentTask){
		currentTask(result);				//현재 작업을 실행
	}
}

next();		//현재 작업의 시작점