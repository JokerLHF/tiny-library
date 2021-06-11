const http = require('http');


function compose (middlewareList) {
  return (ctx) => {
    function dispatch (i) {
      const fn = middlewareList[i];
      try {
        return Promise.resolve(
          fn(ctx, dispatch.bind(null, i + 1))
        )
      } catch (err) {
        return Promise.reject(err);
      }
    }
    dispatch(0);
  }
}

class LikeKoa {
  constructor() {
    this.middlewareList = []
  }

  use () {
    let list = Array.from(arguments); // 变为数组
    this.middlewareList.push(...list);
    return this; // 为了支持链式调用  app.use().use()
  }

  returnCtx (req, res) {
    let ctx = {
      req,
      res,
      request: {},
    }
    ctx.query = req.query;
    ctx.request.body = req.body;
    return ctx;
  }

  callback () {
    console.log(this.middlewareList);
    let fn = compose(this.middlewareList);
    return (req, res) => {
      let ctx = this.returnCtx(req, res);
      return fn(ctx);
    }
  }

  listen (...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }

}

module.exports = () => {
  return new LikeKoa();
}