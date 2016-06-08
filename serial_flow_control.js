//직렬 흐름 제어 : 비동기 작업을 배열. 어떤 작업이 실행된 후에 다른 작업이 실행
//					현재 실행중인 작업을 추적하고 아직 완료되지 않은 대기 작업을 관리하는 부분에 신경 써야 한다.
//					비동기 작업을 순차처리 해야하는 경우 callback을 사용할 수 있지만 callback의 중첩 때문에 코드가 엉망이 되어 버릴 수 있다.

//이 코드는 지저분하며 다른 작업을 추가하는 쉬운 방법은 없지만 Nimble과 같은 흐름 제어 도구를 사용하여 처리할 수 있다.
//Nimble : 사용하기 쉽고 코드량이 매우 적은 장점이 있다.
/*setTimeout(function() {
	console.log('I execute first.');
	setTimeout(function() {
		console.log('I execute next.');
		setTimeout(function() {
			console.log('I execute last.');
		}, 100);
	}, 500);
}, 1000);*/

var flow = require('nimble');
//Nimble이 작업을 하나씩 차례로 실행할 수 있게 함수의 배열 제공
flow.series([
             function (callback){
            	 setTimeout(function(){
            		 console.log('I execute first.');
            		 callback();
            	 }, 1000);
             },
             function (callback){
            	 setTimeout(function(){
            		 console.log('I execute next.');
            		 callback();
            	 },500);
             },
             function (callback){
            	 setTimeout(function() {
            		 console.log('I execute last.');
            		 callback();
            	 }, 100);
             }
             ]);