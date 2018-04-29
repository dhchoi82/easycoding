/**
 * 사전 정의 변수, 함수 저장 객체 선언
 */
var libraryObj = {
    // navigation 정보를 저장하는 객체
    'navigationData': null,
    // 'to home' 그림파일 html
    'homeNavImg': '<img src="contents/home.png" alt="To Home" title="Home">',
    /**
     * AJAX로 다른 파일에서 문자열을 불러와 처리하는 함수
     */
    'doAjax': function(fileName, doSomething){
        fetch(fileName).then(function(response){
            response.text().then(function(resultText){
                doSomething(resultText);
            });
        });
    },
    /**
     * navigation html 갱신 함수
     */
    'makeNavHtml': function(domId,isTop,listObj,params,textElement,onClickEventName){
        if(isTop==true){
            var listType = 'ul';
            // 삽입할 html 문자열 변수 선언 및 'to home' 항목 설정
            var htmlInsert = '<li onclick="' + onClickEventName + '(\'\')">' + libraryObj['homeNavImg'] + '</li>';
        } else {
            var listType = 'ol';
            var htmlInsert = '';
        }
        
        for(var i=0; i<listObj.length; i++){
            // 이벤트 처리 함수의 매개변수 문자열 선언
            var paramStr = '';
            for(var j=0; j<params.length; j++){
                // 이벤트 처리 함수의 매개변수 문자열 추가
                paramStr += ',\'' + (listObj[i][params[j]]) + '\''
            }
            // 이벤트 처리 함수의 매개변수 문자열 완성
            paramStr = paramStr.slice(1)
            
            // navigation html에 언어별 li 항목 추가
            htmlInsert += '<li onclick="' + onClickEventName + '(' + paramStr + ')">' + listObj[i][textElement] + '</li>';
        }
        
        // navigation html 문자열을 html 문서에 삽입
        document.getElementById(domId).innerHTML = '<' + listType + '>' + htmlInsert + '</' + listType + '>';
    },
    /**
     * 본문 제목 갱신 함수
     */
    'setContentHeader': function(languageName,topicTitle){
        // 본문 제목 객체 불러오기
        sectionHeader = document.getElementById('sectionTitle');
        // 본문 제목 갱신
        if(languageName!=''){
            sectionHeader.firstElementChild.innerText=languageName; // 언어
        }
        sectionHeader.children[1].innerText=topicTitle; // 주제
    }
};


/** 
 * navigation을 구성할 data를 읽어오는 동작
 * AJAX를 이용해서 비동기적으로 JSON 파일을 읽어온다.
 */
libraryObj.doAjax('contents/languageTopicList.json',function(jsonText){
    // JSON 정보를 전역변수에 저장
        libraryObj.navigationData = JSON.parse(jsonText);
        
        // 화면 상단 navigation html 문자열을 html 문서에 삽입
        libraryObj.makeNavHtml('topNavigationBar',true,libraryObj.navigationData,['lang'],'lang','topNavEvent');
});

/** 
 * 화면 상단 navigation 항목을 클릭했을 때 발생하는 이벤트
 * navigation 정보에서 해당 언어의 항목을 불러와서
 * 본문과 화면 좌측 navigation 항목을 갱신한다.
 */
function topNavEvent(languageName){
    // 입력 인자가 길이가 0인 문자일 경우 'to home' 동작
    if(languageName.length==0) location.reload();
    
    // 본문 제목 갱신
    libraryObj.setContentHeader(languageName,'');
    
    // 본문 내용 갱신
    document.getElementById('sectionContent').innerHTML = '';
    
    // 좌측 navigation 항목 취급 객체 선언
    var topics = null;
    
    for(var i in libraryObj.navigationData){
        // navigation 정보 전체에서 해당언어가 아닌 정보를 배제
        if(libraryObj.navigationData[i]['lang'] != languageName){
            continue;
        }
        // navigation 정보 전체에서 해당언어의 정보 취득
        topics = libraryObj.navigationData[i]['topics'];
    }
    
    // 화면 좌측 navigation 갱신
    libraryObj.makeNavHtml('leftNavigationList',false,topics,['file','title'],'title','leftNavEvent');
}

/** 
 * 화면 좌측 navigation 항목을 클릭했을 때 발생하는 이벤트
 * navigation 정보에서 해당 언어의 항목을 불러와서
 * 본문 제목과 내용을 갱신한다.
 * 본문의 내용은 별도의 파일에서 비동기적으로 읽어온다.
 */
function leftNavEvent(fileName, title){
    // 본문 제목 갱신
    libraryObj.setContentHeader('',title);
    
    // 본문 내용 갱신
    libraryObj.doAjax(fileName,function(contentText){
        document.getElementById('sectionContent').innerHTML = contentText;
    });
}
