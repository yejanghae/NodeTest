//병렬 흐름 제어 : 어떤 작업이 다른 작업 이후에 실행될 필요가 없는 경우. 
//					작업 들은 서로 언제 시작되고 끝나는지 크게 중요하진 않지만 그 다음 로직을 실행하기 전까지 모든 작업이 완료되어야 한다. 또한, 지금까지 완료된 작업을 추적할 수 있어야한다.
//					각 작업은 완료된 작업의 개수를 하나씩 증가시키는 처리 함수를 호출해야한다. 모든 작업이 완료된 후에는 처리 함수가 뒤이은 다른 작업을 수행해야 한다.					

//여러개의 파일을 병렬로 읽어서 모든 파일에 걸쳐 사용된 단어의 사용 빈도를 계산
var fs = require('fs');
var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './text';

function checkIfComplete(){
	completedTasks++;
	if(completedTasks == tasks.length){
		//모든 작업이 완료되면 파일에서 어떤 단어가 몇 번씩 사용됐는지 보여줌
		for(var index in wordCounts){
			console.log(index + ' : ' + wordCounts[index]);
		}
	}
}

function countWordsInText(text){
	var words = text.toString().toLowerCase().split(/\W+/).sort();
	//text에서 단어 사용 횟수를 셈
	for(var index in words){
		var word = words[index];
		if(word){
			wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
		}
	}
}

//텍스트 디렉터리의 파일 목록을 가져옴
fs.readdir(filesDir, function(err, files){
	if(err){
		throw err;
	}
	for(var index in files){
		//각 파일을 처리하는 작업을 정의. 각 작업은 비동기로 파일을 읽어서 사용한 단어의 수를 세는 함수를 호출
		var task = (function(file){
			return function(){
				fs.readFile(file, function(err, text) {
					if(err){
						throw err;
					}
					console.log('file : ' + file + '\ncontext : ' + text);
					countWordsInText(text);
					checkIfComplete();
				});
			}
		})(filesDir + '/' + files[index]);
		tasks.push(task);			//각 작업을 병렬로 호출할 함수의 배열에 저장
	}
	//모든 작업의 병렬 실행을 시작
	for(var task in tasks){
		tasks[task]();
	}
})