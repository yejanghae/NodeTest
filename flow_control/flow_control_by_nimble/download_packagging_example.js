//Nimble을 이용하여 병렬 제어를 이용해 2개의 파일을 동시에 내려받아서 직렬 흐름 제어를 통해 하나로 압축한다.
var flow = require('nimble');
var exec = require('child_process').exec;

//주어진 버전과 노드 소스 코드 내려받기
function downloadNodeVersion(version, destination, callback){
	var url = 'http://nodejs.org/dist/node-v' + version + '.tar.gz';
	var filepath = destination + '/' + version + '.tgz';
	exec('curl ' + url + ' >' + filepath, callback);
}

//연속적인 작업을 차례로 실행
flow.series([
             function(callback) {
            	//병렬로 내려받기 실행
            	flow.parallel([
            	               	function (callback){
            	               		console.log('Downloading Node v0.4.6...');
            	               		downloadNodeVersion('0.4.6', '/tmp', callback);
            	               	}, function (callback){
            	               			console.log('Downloading Node v0.4.7...');
            	               			downloadNodeVersion('0.4.7', '/tmp', callback);
            	               	}
            	               ], callback); 
             }], function(callback){
						console.log('Creating archive of downloaded files...');
						//압측 파일 생성
						exec('tar cvf node_distros.tar /tmp/0.4.6.tgz /tmp/0.4.7.tgz', function(err, stdout, stderr){
							console.log('All done!');
							callback();
						});
});