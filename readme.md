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

## 에러, BSONError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer