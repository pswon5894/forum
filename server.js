const express = require('express')
const app = express()

const methodOverride = require('method-override')

const bcrypt = require('bcrypt')

require('dotenv').config()

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
const MongoStore = require('connect-mongo').default

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
// app.use(passport.initialize())
app.use(passport.session())

const { S3Client } = require('@aws-sdk/client-s3')
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = new S3Client({
  region : 'ap-northeast-2',
  credentials : {
      accessKeyId : process.env.S3_KEY,
      secretAccessKey : process.env.S3_SECRET
  }
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'pswon5894forum',
    key: function (요청, file, cb) {
      cb(null, Date.now().toString()) //업로드시 파일명 변경가능
    }
  })
})


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

// 비효율 포인트1 세션정보 적인 쿠키가지고 있는 유저가 요청을 날릴 때 마다 실행됨
// 특정 api에서만 deserializeUser 실행도 가능
// 그래도 요청이 너무 많이서 db가 부담되면 -redis 사용가능


const { MongoClient, ObjectId, deserialize } = require('mongodb')

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

function checkLogin(요청, 응답){
  if(!요청.user){
    응답.send('로그인하세요')
  }
}

app.get('/', (요청, 응답) => {
  checkLogin(요청, 응답)
  응답.sendFile(__dirname + '/index.html')
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

app.post('/add', upload.single('img1'), async (요청, 응답) => {
  // upload.single() 라고 미들웨어를 추가
  // console.log(요청.user)

  // 요청.file.location

  try {
    if(요청.body.title == ''){
    응답.send('제목이 비었음, 입력 바람')
  } else {
    await db.collection('post').insertOne(
      {
        title : 요청.body.title,
        content : 요청.body.content,
        img : 요청.file ? 요청file.location : '',
        user : 요청.user._id,
        username : 요청.user.username
      }
    )
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
  // console.log(요청.query)
  // db에 있던 document 삭제
  await db.collection('post').deleteOne({
    _id: new ObjectId(요청.query.docid),
    user : new ObjectId(요청.user._id)
  })
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

app.use('/shop', require('./routes/shop.js'))

app.get('/search', async (요청, 응답) => {
  // console.log(요청.query.val)
  // let result = await db.collection('post')
  // .find({title : 요청.query.val}).toArray()
  //완벽히 똑같아야지만 찾아옴
  // .find({title : { $regex : 요청.query.val } }).toArray()
  // 정규식을 사용하면 비슷한것 찾아옴, 정규식 문자를 검사하는 식, 문제점 느림

  // let result = await db.collection('post')
  // .find({$text : { $search : 요청.query.val } }).toArray()
  // 인덱스를 사용해서 텍스트 오름차순으로 검색

  // .find({$text : { $search : 요청.query.val } }).explain('executionStats')
  // console.log(result)
  //.explain('executionStats') 성능평가

  // 인덱스를 사용하니 정규식이 사용안됨
  // 정규식을 사용하면 인덱스를 거의 못사용한다
  // 문자말고 숫자검색 인덱스를 주로하자

  let 검색조건 = [
    {$search : {
      index : 'title_index',
      text : { query : 요청.query.val, path : 'title' }
    }},
    {$sort : {_id}}
  ]

  let result = await db.collection('post')
  .aggregate(검색조건).toArray()

  응답.render('search.ejs', {글목록 : result })
})

