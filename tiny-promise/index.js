const Promise = require('./promise');
let p = new Promise((resolve, reject) => {
  // setTimeout(() => {
  //   reject(1);
  // }, 100)
  reject(1);
}).then(
  value => {
    console.log('resolve1', value);
    return 2;
  },
  reason => {
    console.log('rejecte1', reason);
    return Promise.reject(1);
  }
).then(
  value => { console.log('resolve2', value) },
  reason => { console.log('rejecte2', reason) }
)


let p1 = Promise.resolve(1);
let p2 = Promise.resolve(2);
let p3 = Promise.reject(3);
Promise.all([p1, p2, p3]).then(
  value => {
    console.log(value);
  },
  reason => {
    console.log(reason);
  }
)


Promise.race([p1, 7, p2, p1]).then(
  value => {
    console.log(value);
  },
  reason => {
    console.log(reason);
  }
)


Promise.resolveDelay(1, 2000).then(value => { console.log(value) });
Promise.rejectDelay(2, 3000).catch(reason => { console.log(reason) });
