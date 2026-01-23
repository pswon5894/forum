html 파일 서버데이터에 넣는 방법 -template engine
-pug /ejs / handlerbars

<h4><%= 글목록[0].title %></h4>    <!-- 서버사이드 렌더링 -->
html을 서버측에서 데이터채워서 완성해서 유저에게 보내주는걸 서버사이드렌더링

클라이언트사이드 렌더링을 사용시 앱처럼 빨라짐
1. 빈 html 파일 + 데이터만 보내고
2. 유저 브라우저에서 html 생성
클라이언트사이드 렌더링 단점
1. 웹페이지가 무거워져서 퍼포먼스도 안좋아지고 2. SEO도 안좋다는 단점


ejs 쓰면 html 안에 서버데이터 꽂기 가능
ejs 파일은 views 폴더안에서 만들고
응답.render로 유저에게 보내줄 수 있음
ejs파일로 서버데이터 전송하고 <%= 데이터명 %> 써서 html에 넣기 가능

ejs 파일 안에서 자바스크립트 문법 쓰기
<% %> 안에 작성하면 됩니다.

<%- %> <%= %> 차이
<%- %> html이 렌더링됨, <button></button> 버튼나옴
<%= %> html이 렌더링 안됨, 일반 문자처럼 보여줌

유저가 서버와 소통하려면
1. method
GET은 서버에게 데이터를 달라고할 때 
POST는 서버에게 데이터를 보내고싶을 때
UPDATE, PUT은 서버에게 DB 수정요청같은걸 할 때
DELETE는 서버에게 DB 삭제요청같은걸 할 때 

2. url
URL을 엔드포인트라고 부르기도 함

정확히는 요청을 HTTP 요청,
method를 HTTP method

유저는 당연히 서버에 미리 정의해놓은 method와 URL 조합을 입력해서 요청해야합니다. 

api는 간단히 말하면 프로그램 사용법


app.get( ) 이것들은 서버라는 프로그램 사용법 아닙니까 
그래서 서버 API라고 부릅니다.

.get을 .post로 바꾸면 "어떤 유저가 /list로 POST요청하면~" 이라는 뜻
.get을 .delete로 바꾸면 "어떤 유저가 /list로 DELETE 요청하면~" 이라는 뜻 

유저는 GET요청을 어떻게 함?

유저가 서버에게 요청을 보내는 방법은 웹브라우저 주소창에 URL을 입력하면 그걸로 GET 요청이 
됨, get요청방법 중 가장 쉬운 방법

유저가 POST 요청은? 그건 html <form> 태그를 쓰면 됨

REST API
representational state transfer를 잘 따르는 API
좋은 api 디자인하는 6원칙
1. unifrom interface -일관성있는 URL이 좋음, 하나의 URL+method는 하나의 데이터를 보내야 함, 간결하고 예측가능하게 URL과 method를 만들어야함
2. Client-server 구분 -유저에게 서버역할 맡기거나 db를 직접 입출력 시키면 안됨
3. stateless -요청끼리 서로 의존성 없어야함, 각각 독립적으로 처리되야함
4. cacheability -요청은 캐싱이 가능해야함, 자주 수신되는 자료는 요청을 날리지 않고 하드에 저장해놓고 씀, 캐싱은 보통 자동으로 됨
5. Layered system -요청하나는 최종 응답전까지 여러 단계를 거쳐도 됨
6. code on demand -서버는 유저에게 실행가능한 코드를 보내줄 수 있음

 method, URL만 잘 기입해두면 관습적으로 REST하다고 함

 서버에서 html을 보내는게 아니라 array, object 데이터만 달랑 보내는 API들을 REST API라고 가끔 부르기도 합니다.
그 경우엔 서버들은 array, object 데이터만 보내고
프론트엔드에선 그걸 받아와서 html에 실시간으로 박아주고
그런 식으로 웹페이지들을 만드는 경우들이 있습니다.
이걸 "클라이언트 사이드 렌더링"

좋은 url 작명 관습
-동사보다는 명사 위주로
-띄어쓰기는 언더바_ 대신 대시- 기호
-파일 확장자 쓰지 말기 (.html 같은거)
-하위 문서들을 뜻할 떈 /기호를 사용함 (하위 폴더 같은 느낌)

예시
facebook.com/bbc/photos
instagram.com/explore/tags/food

bbc 뉴스 페북 계정 사진들
해시태그 #food 달린 인스타 사진

서버로 데이터를 보내는 방법
ajax, query string, URL parameter
URL 파라미터를 이용해서 API를 만들기

URL 파라미터 / query string 의 장점은
둘 다 아무 API로 GET, POST, PUT, DELETE 요청할 때 전부 쓸 수 있다는게 장점,
단점은 URL에 정보가 노출 
그래서 짧고 안중요한 데이터 전송하는데 쓰는게 좋음

새로고침없이 서버로 요청날리고 싶으면 AJAX 사용 
AJAX로 데이터도 가져올 수 있다보니까 클라이언트사이드 렌더링이라는것도 가능하구요 
dataset 문법 이용하면 html에 몰래 데이터 숨겨놓을 수도 있습니다. 

페이지네이션, pagination

passport 라이브러리
Node.js 환경에서 로그인 기능 구현시
session, jwt, OAuth 중 원하는 방식 자유롭게 사용할 수 있음

passport는 회원인증 도와주는 메인라이브러리,
passport-local은 아이디/비번 방식 회원인증쓸 때 쓰는 라이브러리
express-session은 세션 만드는거 도와주는 라이브러리

TypeError: MongoStore.create is not a function
https://stackoverflow.com/questions/66398388/typeerror-mongostore-is-not-a-constructor
const MongoStore = require('connect-mongo').default; // <-- Use .default here

성능 팁

비효율적으로 보이는 포인트가 몇개 있어보이는데 
1. deserializeUser는 항상 유저가 서버로 요청을 날릴 때마다 세션용 쿠키가 있으면 실행됩니다.
그럼 모든 요청을 날릴 때 쓸데없는 DB조회가 발생하는 것 아닙니까  
지금 메인페이지 같은 곳에 방문할 땐 굳이 저걸 실행할 필요가 없어보입니다. 
그래서 deserializeUser를 특정 route에서만 실행시키는법 이런거 찾아보시면 약간 더 효율적으로 동작시킬 수 있습니다.


2. 근데 그렇게 해도 요청이 너무 많이 들어와서 DB조회가 너무 많이 발생할거같으면 
Redis 같은 가벼운 메모리기반 데이터베이스를 호스팅받아서 쓰는 사람들도 있습니다.
하드디스크 보다 램이 훨씬 빠르니까요.
connect-redis 그런걸 한번 찾아봅시다.
 
3. 유저가 1억명이거나 아니면 백엔드에서 운영중인 마이크로 서비스가 많다면
세션 말고 JWT 쓰는게 편리할 수도 있습니다. 그건 DB조회할 필요가 없으니까요. 
그것도 passport로 구현할 수 있는 예제가 많기 때문에 찾아보면 쉽게 구현가능합니다. 
물론 DB 조회를 안하면 유저를 강제로 로그아웃 시키거나 그런 기능 만드는게 어려울 수 있습니다.

환경변수: 개발자나 컴퓨터에 따라 달라져야하는 변수

CORS(Cross-origin Resource Sharing)란, 교차 출처 리소스 공유의 영문 줄임말로 어떠한 오리진에서 작동하고 있는 웹 어플리케이션이 다른 오리진 서버로의 엑세스를 오리진 사이의 HTTP 요청에 의해 허가를 할 수 있는 체계라고 할 수 있다.

체계적으로는 서버에서 응답 헤더에 리소스를 공유하기 위해 헤더를 추가해 허가하는 형태이다.

CORS의 필요성
Same-Origin Policy
웹 시큐리티의 중요한 정책 중 하나로 Same-Origin Policy가 있다. 이는 오리진 사이의 리소스 공유에 제한을 거는 것으로 다음과 같은 위험을 막는 것을 목적으로 하고 있다.

XSS(Corss Site Scripting)
유저가 웹 사이트에 접속하는 것으로 정상적이지 않은 요청이 클라이언트(웹 브라우저)에서 실행되는 것을 나타내며, Cookie 내에 Session정보를 탈취 당하는 등의 예시가 있다.

CSRF(Cross-Site Request Forgeries)
웹 어플리케이션의 유저가 의도하지 않은 처리를 웹 어플리케이션에서 실행되는 것을 나타내며, 원래는 로그인한 유저 밖에 실행할 수 없는 처리가 멋대로 되는 등의 예시가 있다.
https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/CORS

index 검색 속도 향상 가능
단점 만들면 용량차지, 필요한 필드만 만들자, 인덱스 늘어난만큼 document 수정 발행작업에도 시간소모

// .find({$text : { $search : 요청.query.val } }).explain('executionStats')
  // console.log(result)
  //.explain('executionStats') 성능평가

  // 인덱스를 사용하니 정규식이 사용안됨
  // 정규식을 사용하면 인덱스를 거의 못사용한다
  // 문자말고 숫자검색 인덱스를 주로하자

  search index 만들면 해결
다른 데이터베이스에서는 full text index라고 부르기도 함
검색속도 빠름, 단어 부분검색 가능

search index 동작원리 (한글자는 검색안됨)
1. 일단 index를 만들 때 document에 있는 문장들을 가져와서 조사나 쓸데없는 불용어들을 다 제거, 그러니까 and or the ~s 이런거 제거
한국어도 비슷하게 을, 를, 이, 가, 그리고, 또는 이런걸 제거
_id : 1
title : 'Seafood restaurnt(s)'
_id : 2
title : 'Seafood (and) chicken'
_id : 3
title : '(The) game review(!)'

2. 단어들을 다 뽑아서 정렬
단어들 chicken, game, restaurant, review, seafood

3. 그 다음에 이 단어들이 어떤 document에 등장했는지 그 document id같은걸 함께 단어 옆에 기재

let 검색조건 = [
  {$search : {
    index : '사용할 인덱스 이름',
    text : { query : '검색어', path : '검색할 필드이름' }
  }},
  { $sort : { _id : 1 } },
  { $limit : 10 },
  { $project : { 제목 : 1, _id : 0 } }
] 

- $sort 쓰면 검색 결과를 정렬해주는데 _id를 기입하면 _id 순으로 정렬해줍니다.
안쓰면 기본적으로 score 순으로 정렬됨

- $limit쓰면 결과를 제한해줍니다. 검색결과 중에 맨 위의 10개 document만 가져올 수 있습니다. 
당연히 { $skip : 5 } 이거 연산자도 쓸 수 있습니다. 그래서 이런거 쓰면 페이지네이션도 구현가능

- $project쓰면 찾아온 결과 중에 원하는 필드만 가져오라고 걸러줄 수 있습니다. 
예를 들어 {title : 1, content : 0} 이러면 title은 보여줌, content는 숨김이라는 뜻입니다.

관계형 db: 글에 유저의 _id만 적어둠 (정규화)
비관계형 db: 글에 온갖거 다 적음(비정규화)

db입출력 속도 높음, 데이터 정확도 낮음-mongodb
db입출력 속도 낮음, 데이터 정확도 높음

Mongodb는 보통 입출력속도를 빠르게하려고 비정규화하는 DB

## 에러, BSONError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer