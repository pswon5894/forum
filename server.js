const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'))

const { MongoClient } = require('mongodb')

const username = encodeURIComponent("<username>");
const password = encodeURIComponent("<password>");

let db
const url = 'mongodb+srv://pswon5894_db_user:${password}@cluster0.gpc6rzd.mongodb.net/?appName=Cluster0'
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
  응답.send('오늘 비옴')
}) 
