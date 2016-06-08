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

function listTasks(file){
	
}

function addTask(file, taskDescription){
	
}