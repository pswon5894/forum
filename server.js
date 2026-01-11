const express = require('express')
const app = express()

const methodOverride = require('method-override')

const bcrypt = require('bcrypt')
const config = require("./dev");

const username = encodeURIComponent(config.DB_USERNAME);
const password = encodeURIComponent(config.DB_PASSWORD);

app.use(methodOverride('_method')) 
// 이제 폼태그에서도 풋이나 딜리트 요청가능

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//body 요청하려면 필요

const session = require('express-session')
// 라이브러리 사용법 참조
const passport = require('passport')
const LocalStrategy = require('passport-local')
const MongoStore = require('connect-mongo')

app.use(session({
  secret: '암호화에 쓸 비번',
  // 세션의 document id는 암호화해서 유저에게 보냄
  // 사이트 개인정보 유출 조심
  resave : false,
  // 유저가 서버로 요청할 때마다 갱신할 건지?
  saveUninitialized : false,
  // 로그인 안해도 세션 만들 것인지?
  cookie : {maxAge : 60 * 60 * 1000},
  // 밀리세컨드 단위, 1초 * 60 * 60 = 1시간
  store: MongoStore.create({
    mongoUrl : `mongodb+srv://${username}:${password}@cluster0.gpc6rzd.mongodb.net/?appName=Cluster0`,
    dbName: 'forum',
  })
}))
app.use(passport.initialize())
app.use(passport.session())


passport.use(new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
  let result = await db.collection('user').findOne({ username : 입력한아이디})
  if (!result) {
    return cb(null, false, { message: '아이디 DB에 없음' })
  }

  if (await bcrypt.compare(입력한비번, result.password)) {
    return cb(null, result)
  } else {
    return cb(null, false, { message: '비번불일치' });
  }
}))

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user._id, username: user.username })
  })
})

passport.deserializeUser( async (user, done) => {
  let result = await db.collection('user').findOne({_id : new ObjectId
    (user.id)
  })
  delete result.password
  process.nextTick(() => {
    done(null, result)
  })
})


const { MongoClient, ObjectId } = require('mongodb')

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
  // console.log(result[0].title)
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
  // console.log(result)
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

app.delete('/delete', async (요청, 응답) => {
  console.log(요청.query)
  // db에 있던 document 삭제
  await db.collection('post').deleteOne({_id: new ObjectId(요청.query.docid) })
  응답.send('삭제완료')

  // let result = await db.collection('post').updateOne({_id : new ObjectId (요청.body.id)},
  //   {$set :{ title : 요청.body.title , content : 요청.body.content }}
  // )
  // 응답.redirect('/list')
})

// app.get('/list/1', async (요청, 응답) => {
//   result = await db.collection('post').find().limit(5).toArray()
//   응답.render('list.ejs', {글목록 : result})
// })

// app.get('/list/2', async (요청, 응답) => {
//   result = await db.collection('post').find().skip(5).limit(5).toArray()
//   응답.render('list.ejs', {글목록 : result})
// })

// 아래는 url 파라미터 문법

// app.get('/list/:id', async (요청, 응답) => {
//   result = await db.collection('post')
//   .find().skip(5*(요청.params.id - 1)).limit(5).toArray()
//   응답.render('list.ejs', {글목록 : result})
// })
// // .skip()성능 안좋음

app.get('/list/next/:id', async (요청, 응답) => {
  result = await db.collection('post')
  .find({_id : {$gt : new ObjectId(요청.params.id) }}).limit(5).toArray()
  응답.render('list.ejs', {글목록 : result})
})
// skip보다는 빠르다, 단점 페이지네이션버튼 못만들고 다음버튼으로 만들어야한다, 페이지 건너뛰기가 안됨

app.get('/login', async (요청, 응답) => {
  
  응답.render('login.ejs')
})

app.post('/login', async (요청, 응답, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) return 응답.status(500).json(error)
    if (!user) return 응답.status(401).json(info.message)
    요청.logIn(user, (err)=>{
      if (err) return next(err)
      응답.redirect('/')
    })
  })(요청, 응답, next)
})

app.get('/register', (요청, 응답) => {
  응답.render('register.ejs')
})

app.post('/register', async (요청, 응답) => {
  let 해시 = await bcrypt.hash(요청.body.password, 10)
  // console.log(해시)

  // await db.collectio('user').insertOne(요청.body)
  // 이런 식으로 하면, 해킹으로 <input> 여러개 생성가능
  await db.collection('user').insertOne({
    username : 요청.body.username,
    password : 해시
  })
  응답.redirect('/')
})