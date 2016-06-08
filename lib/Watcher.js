//EventEmitter를 상속 받은 자바스크립스 클래스
var events = require('events'), util = require('util');
var fs = require('fs');

function Watcher(watchDir, processdDir){
	this.watchDir = watchDir;
	this.processdDir = processdDir;
}

//util.inherits : 다른 객체의 행위를 상속하는 명확한 방법 제공
//Watcher.prototype = new events.EventEmitter(); 와 같은 의미
util.inherits(Watcher, events.EventEmitter);

//file을 처리하는 메서드로 EventEmmiter 확장
Watcher.prototype.watch = function(){
	//readdir콜백에서 사용할 수 있도록 Watcher 객체의 참조 저장
	var watcher = this;
	fs.readdir(this.watchDir, function(err, files){
		if(err){
			throw err;
		}
		for(var index in files){
			//관찰중인 디렉터리에서 각 파일 처리
			watcher.emit('process', files[index]);
		}
	})
}

//관찰을 시작하는 메서드로 EventEmiitter 확장 
//node의 fs.warchFile 함수를 사용
//관찰 중인 디렉터리에서 어떤 일이 발생하면 watch 메서드가 수행되고 관찰 중인 디렉터리를 순환하며 모든 파이에 대해서 process 이벤트를 발생시킨다
Watcher.prototype.start = function(){
	var watcher = this;
	fs.watchFile(this.watchDir, function(){
		watcher.watch();
	});
}


//사용
var watcher = new Watcher('./watch', './done');

//관찰중인 디렉터리에 파일을 놓으면 파일 이름이 소문자로 변경되어 처리 완료된 디렉터리로 이동된다.
watcher.on('process', function process(file){
	var watchFile = this.watchDir + '/' + file;
	var processedFile = this.processdDir + '/' + file.toLocaleLowerCase();
	
	fs.rename(watchFile, processedFile, function(err){
		if(err){
			throw err;
		}
	})
});

watcher.start();