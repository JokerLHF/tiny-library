const express = require('./likeExpress');


const app = express();

app.use((req, res, next) => {
  console.log('中间件1开始');
  next();
  console.log('中间件1结束')
})

app.get('/', (req, res, next) => {
  console.log('get1请求开始');
  next();
  console.log('get2请求结束');
}, (req, res, next) => {
  console.log('get请求2开始');
  next();
  console.log('get请求2结束');
})

app.get('/api', (req, res, next) => {
  console.log('get请求的api');
  next();
})

app.post('/api', (req, res, next) => {
  console.log('post请求');
  next();
})

app.use((req, res, next) => {
  console.log('啦啦啦222');
  res.json({ success: true });
  return;
})

app.post('/', (req, res, next) => {
  console.log('post请求');
  res.json({ success: true });
  return;
})
app.listen(3001, () => {
  console.log('动起来')
})