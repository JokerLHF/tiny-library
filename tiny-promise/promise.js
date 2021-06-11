const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

// function Promise (excutor) {
//   const _self = this;
//   this.status = PENDING;
//   this.data = undefined;
//   this.callbacks = []; // { onResolves () {}, onRejected () {} }

//   function resolve (value) {
//     if (_self.status !== PENDING) {
//       return;
//     }
//     _self.status = RESOLVED;
//     _self.data = value;
//     if (_self.callbacks.length) {
//       setTimeout(() => {
//         _self.callbacks.forEach(item => {
//           item.onResolved(value);
//         });
//       })
//     }
//   }
//   function reject (reason) {
//     if (_self.status !== PENDING) {
//       return;
//     }
//     _self.status = REJECTED;
//     _self.data = reason;
//     if (_self.callbacks.length) {
//       setTimeout(() => {
//         _self.callbacks.forEach(item => {
//           item.onRejected(reason);
//         });
//       })
//     }
//   }
//   try {
//     excutor(resolve, reject);
//   } catch (err) {
//     reject(err);
//   }
// }

// Promise.prototype.then = function (onResolved, onRejected) {
// // onResolve的正常传递
// onResolved = typeof onResolved === 'function' ? onResolved : value => { return value };
// // 考虑用户不传onRejected函数 (实现异常穿透)
// onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

//   const _self = this;
//   // 因为then返回一个promise需要状态， 所以在执行onResolve需要执行新的promise的resolve。 所以要写在promise里面
//   return new Promise((resolve, reject) => {

//     function handle (callback) {
// 1. 如果抛出异常, return的promise就会失败 reason就是error
// 2. 如果回调函数返回值不是promise, return的promise就会成功 value就是返回的值
// 3. 如果回调函数的返回值是promise return的promise就是这个promise的结果
//       try {
//         const result = callback(_self.data);
//         if (result instanceof Promise) {
//           result.then(
//             value => { resolve(value) },
//             reason => { reject(reason) }
//           )
//           // result.then(resolve, reject);
//         } else {
//           resolve(result);
//         }
//       } catch (err) {
//         reject(err);
//       }
//     }

// 1. 如果此时的promise的状态是pending, 就证明promise里面是异步， 所以需要保存回调函数
// 2. 如果此时promise的状态是resolved 需要执行onResolved
// 3. 如果此时的promise的状态是rejected 需要执行onRejected
// if (_self.status === PENDING) {
//   _self.callbacks.push({
//     onResolved (value) { handle(onResolved); },
//     onRejected (reason) { handle(onRejected); }
//   });
// } else if (_self.status === RESOLVED) { // exculor是同步
//   setTimeout(() => {
//     handle(onResolved);
//   })
// } else {
//   setTimeout(() => {
//     handle(onRejected);
//   })
// }

//   })
// }

// Promise.prototype.catch = function (onRejected) {
//   return this.then(undefined, onRejected);
// }

// Promise.reject = function (reason) {
//   return new Promise((resolve, reject) => {
//     reject(reason);
//   })
// }

// // 1. 如果value是普通的数值， 返回值为成功的ppromise
// // 2. 如果value是promise， 返回值就是这个promise的结果
// Promise.resolve = function (value) {
//   return new Promise((resolve, reject) => {
//     if (value instanceof Promise) {
//       value.then(resolve, reject);
//     } else {
//       resolve(value);
//     }
//   })
// }


// // 只要一个失败， 返回的promise就是失败
// // 返回全部的promise结果的数组
// // promises 可以不是promise数组
// Promise.all = function (promises) {
//   let result = []; // 保留结果的数组
//   return new Promise((resolve, reject) => {
//     promises.forEach((p, index) => {
//       Promise.resolve(p).then(
//         value => {
//           result[index] = value;
//           if (result.length === promises.length) {
//             resolve(result);
//           }
//         },
//         reason => { reject(reason) }
//       )
//     })
//   })
// }

// // 看哪一个promise最先完成
// // 一旦有一个成功了，就返回的promise就是成功
// // ，一旦有一个失败， 返回的promise就是失败
// // prmoseis可以不是promise数组， 不过Promise.resolve(数字) 比Promise.resolve(promise) 快
// Promise.race = function (promises) {
//   return new Promise((resolve, reject) => {
//     promises.forEach((p, index) => {
//       Promise.resolve(p).then(
//         value => { resolve(value) },
//         reason => { reject(reason) }
//       )
//     })
//   })
// }

// // 延迟resove
// Promise.resolveDelay = function (value, time) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (value instanceof Promise) {
//         value.then(resolve, reject);
//       } else {
//         resolve(value);
//       }
//     }, time);
//   })
// }

// // 延迟reject
// Promise.rejectDelay = function (reason, time) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject(reason);
//     }, time);
//   })
// }

class Promise {
  constructor(excutor) {
    const _self = this;
    this.status = PENDING;
    this.data = undefined;
    this.callbacks = []; // { onResolves () {}, onRejected () {} }

    function resolve (value) {
      if (_self.status !== PENDING) {
        return;
      }
      _self.status = RESOLVED;
      _self.data = value;
      if (_self.callbacks.length) {
        setTimeout(() => {
          _self.callbacks.forEach(item => {
            item.onResolved(value);
          });
        })
      }
    }
    function reject (reason) {
      if (_self.status !== PENDING) {
        return;
      }
      _self.status = REJECTED;
      _self.data = reason;
      if (_self.callbacks.length) {
        setTimeout(() => {
          _self.callbacks.forEach(item => {
            item.onRejected(reason);
          });
        })
      }
    }
    try {
      excutor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }


  then (onResolved, onRejected) {
    // onResolve的正常传递
    onResolved = typeof onResolved === 'function' ? onResolved : value => { return value };
    // 考虑用户不传onRejected函数 (实现异常穿透)
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    const _self = this;
    // 因为then返回一个promise需要状态， 所以在执行onResolve需要执行新的promise的resolve。 所以要写在promise里面
    return new Promise((resolve, reject) => {

      function handle (callback) {
        // 1. 如果抛出异常, return的promise就会失败 reason就是error
        // 2. 如果回调函数返回值不是promise, return的promise就会成功 value就是返回的值
        // 3. 如果回调函数的返回值是promise return的promise就是这个promise的结果
        try {
          const result = callback(_self.data);
          if (result instanceof Promise) {
            result.then(
              value => { resolve(value) },
              reason => { reject(reason) }
            )
            // result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (err) {
          reject(err);
        }
      }

      // 1. 如果此时的promise的状态是pending, 就证明promise里面是异步， 所以需要保存回调函数
      // 2. 如果此时promise的状态是resolved 需要执行onResolved
      // 3. 如果此时的promise的状态是rejected 需要执行onRejected
      if (_self.status === PENDING) {
        _self.callbacks.push({
          onResolved (value) { handle(onResolved); },
          onRejected (reason) { handle(onRejected); }
        });
      } else if (_self.status === RESOLVED) { // exculor是同步
        setTimeout(() => {
          handle(onResolved);
        })
      } else {
        setTimeout(() => {
          handle(onRejected);
        })
      }

    })
  }

  catch (onRejected) {
    return this.then(undefined, onRejected);
  }

  static reject (reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    })
  }

  // 1. 如果value是普通的数值， 返回值为成功的ppromise
  // 2. 如果value是promise， 返回值就是这个promise的结果
  static resolve (value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    })
  }


  // 只要一个失败， 返回的promise就是失败
  // 返回全部的promise结果的数组
  // promises 可以不是promise数组
  static all (promises) {
    let result = []; // 保留结果的数组
    return new Promise((resolve, reject) => {
      promises.forEach((p, index) => {
        Promise.resolve(p).then(
          value => {
            result[index] = value;
            if (result.length === promises.length) {
              resolve(result);
            }
          },
          reason => { reject(reason) }
        )
      })
    })
  }

  // 看哪一个promise最先完成
  // 一旦有一个成功了，就返回的promise就是成功
  // ，一旦有一个失败， 返回的promise就是失败
  // prmoseis可以不是promise数组， 不过Promise.resolve(数字) 比Promise.resolve(promise) 快
  static race (promises) {
    return new Promise((resolve, reject) => {
      promises.forEach((p, index) => {
        Promise.resolve(p).then(
          value => { resolve(value) },
          reason => { reject(reason) }
        )
      })
    })
  }

  // 延迟resove
  static resolveDelay (value, time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (value instanceof Promise) {
          value.then(resolve, reject);
        } else {
          resolve(value);
        }
      }, time);
    })
  }

  // 延迟reject
  static rejectDelay (reason, time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(reason);
      }, time);
    })
  }
}







module.exports = Promise;