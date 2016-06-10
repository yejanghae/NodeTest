/**
 * 파일 기반 저장소
 * 데이터를 저장하기 위해 파일시스템을 사용
 * 보통 application의 설정 정보를 저장할 때 사용
 * 여러 사용자가 사용하는 application에서는 동시성 문제가 발생할 수 있다.
 */
var fs = require('fs');
var path = require('path');
var args = process.argv.splice(2);		//node cli_taskjs를 나누어 인자로 사용
var command = args.shift();		//첫번쨰 인자를 꺼낸다
var taskDescription = args.join(' ');	//나머지 인자를 연결한다
var file = path.join(process.cwd(), '/.tasks');	//현재 작업 디렉터리의 상대 경로로 데이터베이스 경로를 지정

switch(command){
case 'list':
	listTasks(file);
	break;
case 'add':
	addTask(file, taskDescription);
	break;
default:
	console.log('Usage: ' + progress.argv[0] + ' list|add [taskDescription]');
}

function loadOrInitializeTaskArray(file, cb){
	//tasks file이 있는지 검사
	fs.exists(file, function(exists) {
		var tasks = [];
		if(exists){
			//tasks 파일에서 할 일 데이터 읽기
			fs.readFile(file, 'utf8', function(err, data) {
				if(err){
					throw err;
				}
				var data = data.toString();
				//JSON으로 인코딩된 할 일 데이터를 작업의 배열로 파싱
				var tasks = JSON.parse(data || '[]');
				cb(tasks);
			});
		}else{
			//작업 파일이 존재하지 않으면 빈 작업 배열 생성
			cb([]);
		}
	});
}

function listTasks(file){
	loadOrInitializeTaskArray(file, function(tasks) {
		for(var i in tasks){
			console.log(tasks[i]);
		}
	});
}

function storeTasks(file, tasks){
	fs.writeFile(file, JSON.stringify(tasks), 'utf8', function(err) {
		if(err){
			throw err;
		}
		console.log('saved.');
	});
}

function addTask(file, taskDescription){
	loadOrInitializeTaskArray(file, function(tasks) {
		tasks.push(taskDescription);
		storeTasks(file, tasks);
	});
}