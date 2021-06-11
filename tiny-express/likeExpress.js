const http = require('http');
class LikeExpress {
  constructor() {
    this.routes = {
      all: [],
      get: [],
      post: [],
      midIndex: 0, // 用来记录中间件写入的顺序
    }
  }

  registor (path) { // 接受argumemnt的列表
    let info = {};
    if (typeof path === 'string') {
      info.path = path;
      info.stack = Array.prototype.slice.call(arguments, 1);  // 截取第一个以后的所有中间函数 转换维数组
    } else {
      info.path = '/'
      info.stack = Array.prototype.slice.call(arguments, 0); // 全部中间函数转为数组
    }
    info.midIndex = this.routes.midIndex++; // 记录中间件的顺序
    // console.log(info);
    return info;
  }

  get () {
    const info = this.registor.apply(this, arguments);
    this.routes.get.push(info);
  }

  post () {
    const info = this.registor.apply(this, arguments);
    this.routes.post.push(info);
  }

  use () {
    const info = this.registor.apply(this, arguments);
    this.routes.all.push(info);
  }

  match (req) {
    const { method, url } = req;
    const { all, get, post } = this.routes;
    let midWareList = [];

    // 获取现在的对应方法的中间件
    let curRoutes = [].concat(all);
    curRoutes = curRoutes.concat(this.routes[method.toLowerCase()]);

    // 获取路由匹配的中间件 
    curRoutes.forEach(item => {
      const { path, midIndex, stack } = item;
      if (url.indexOf(path) !== -1) { // 比如现在的路由是 url = '/api/bolg/list'   中间件监听的是 path = '/api'
        midWareList[midIndex] = stack; // 按照桶排序排列 midIndex就是位置
      }
    })

    let indexMidList = [];

    // 去除空桶
    midWareList.forEach(item => {
      item && (indexMidList = indexMidList.concat(item));
    })
    return indexMidList;
  }

  handle (req, res, runMidList) {
    const next = () => {
      let midware = runMidList.shift();
      midware && midware(req, res, next);
    }
    next();
  }
  callback () {
    return (req, res) => {
      res.json = (data) => {
        res.setHeader('Contet-type', 'application/json');
        res.end(JSON.stringify(data));
      }
      const runMidList = this.match(req);
      this.handle(req, res, runMidList);
    }
  }
  listen (...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }
}

module.exports = () => {
  return new LikeExpress();
}