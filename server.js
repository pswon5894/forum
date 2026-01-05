const express = require('express')
const app = express()

const methodOverride = require('method-override')
app.use(methodOverride('_method')) 
// 이제 폼태그에서도 풋이나 딜리트 요청가능

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
//body 요청하려면 필요

const { MongoClient, ObjectId } = require('mongodb')
const config = require("./dev");

const username = encodeURIComponent(config.DB_USERNAME);
const password = encodeURIComponent(config.DB_PASSWORD);

let db
const url = `mongodb+srv://${username}:${password}@cluster0.gpc6rzd.mongodb.net/?appName=Cluster0`
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})
}).catch((err)=>{
  console.log(err)
})

app.get('/', (요청, 응답) => {
  응답.sendFile(__dirname + '/index.html')
}) 

app.get('/news', (요청, 응답) => {
  // db.collection('post').insertOne({title : '테스트'})
  응답.send('오늘 비옴')
}) 

app.get('/list', async (요청, 응답) => {
  result = await db.collection('post').find().toArray()
  console.log(result[0].title)
  // 응답.send(result[0].title)
  응답.render('list.ejs', {글목록 : result})
}) 
// db 컬렉션의 모든 document 출력하는 법

app.get('/time', (요청, 응답) => {
  // db.collection('post').insertOne({title : '테스트'})
  응답.render('time.ejs', {data : new Date()} )
  // 응답.render('time.ejs', data = new Date() )
}) 

// q 글 작성 기능?
// 1. 글 작성 페이지에 글써서 서버로 전송
//  writeConcern.ejs
// 2. 서버는 글을 검사
// 3. 이상 없으면 db에 저장
// https://www.mongodb.com/ko-kr/docs/manual/tutorial/insert-documents/

app.get('/write', (요청, 응답) => {
  // db.collection('post').insertOne({title : '테스트'})
  응답.render('write.ejs')
})

app.post('/add', async (요청, 응답) => {
  // console.log(요청.body)

  try {
    if(요청.body.title == ''){
    응답.send('제목이 비었음, 입력 바람')
  } else {
    await db.collection('post').insertOne({title : 요청.body.title,
    content : 요청.body.content})
    // 응답.send('서버에 저장됨')
    응답.redirect('/list')
  }
  } catch(e) {
    console.log(e)
    응답.status(500).send('서버 에러 발생')
  }
  
})

try{
  app.get('/detail/:id', async (요청, 응답) => {
  let result = await db.collection('post').findOne({
     _id: new ObjectId(요청.params.id)
  })
  응답.render('detail.ejs', {result : result})
  if (result == null){
    응답.status(404).send('잘못된 url')
  }
})
//  /detail/:aa 라우터는  /detail 과 매칭되지 않음
}catch(e){
  console.log(e)
  응답.status(404).send('잘못된 url')
}

app.get('/edit/:id', async (요청, 응답) => {

  // db.collection('post').updateOne({어떤document}, {$set :
  //   {어떤 내용으로 수정할지}
  // })

  let result = await db.collection('post').findOne({
    _id: new ObjectId(요청.params.id)
  })
  console.log(result)
  응답.render('edit.ejs', {result : result})
})


app.put('/edit', async (요청, 응답) => {

  let result = await db.collection('post').updateOne({_id : new ObjectId (요청.body.id)},
    {$set :{ title : 요청.body.title , content : 요청.body.content }}
  )
  console.log(요청.body)
  console.log(result)
  응답.redirect('/list')
})