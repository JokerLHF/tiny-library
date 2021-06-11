const express = require('./likeKoa');


const app = express();

app.use(async (ctx, next) => {
  console.log('中间件1');
  await next();
  console.log('中间件结束')
}, async (ctx, next) => {
  console.log('中间件2');
  await next();
  console.log('中间件2结束')
})

app.use(async (ctx, next) => {
  console.log('啦啦啦222');
  return;
})

app.listen(3000, () => {
  console.log('动起来')
})
