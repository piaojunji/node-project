var express = require('express');
var MongoClient = require('mongodb').MongoClient
var router = express.Router();

var url = 'mongodb://127.0.0.1:27017';

/* GET users listing. */
//localhost:3000/users
router.get('/', function (req, res, next) {

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
    if (err) {
      console.log('连接数据库失败', err);
      res.render('error', {
        message: '连接数据库失败',
        error: err
      })
      return;
    }
    var db = client.db('project')
    db.collection('user').find().toArray(function (err, data) {
      if (err) {
        console.log('查询用户数据失败', err);
        res.render('error', {
          message: '查询失败',
          error: err
        })
      } else {
        console.log(data);
        res.render('users', {
          list: data
        })
      };
      client.close();
    })
  })
});

//登录操作
router.post('/login', function (req, res) {
  //1.获取前端传递过来的参数
  var username = req.body.name;
  var password = req.body.pwd;

  //2.参数验证
  if (!username) {
    res.render('error', {
      message: '用户名不能为空',
      error: new Error('用户名不能为空')
    })
    return;
  }
  if (!password) {
    res.render('error', {
      message: '密码不能为空',
      error: new Error('密码不能为空')
    })
    return;
  }
  //3.连接数据库做验证
  MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
    if (err) {
      console.log('连接失败', err);
      res.render('error', {
        message: '连接失败',
        error: err
      })
      return;
    }

    var db = client.db('project');
    // db.collection('user').find({
    //   username: username,
    //   password: password
    // }).count(function (err, num) {
    //   if (err) {
    //     console.log('查询失败', err);
    //     res.render('error', {
    //       message: '查询失败',
    //       error: err
    //     })
    //   } else if (num > 0) {
    //     //登陆成功
    //     // res.render('index')

    //     //登陆成功 写入cookie
    //     res.cookie('nickname',)
    //     res.redirect('/')
    //   } else {
    //     //登录失败
    //     res.render('error', {
    //       message: '登录失败',
    //       error: new Error('登录失败')
    //     })
    //   }
    //   client.close()
    // })

    db.collection('user').find({
      username: username,
      password: password
    }).toArray(function (err, data) {
      if (err) {
        console.log('查询失败', err);
        res.render('error', {
          message: '查询失败',
          error: err
        })
      } else if (data.length <= 0) {
        // 没找到,登录失败
        res.render('error', {
          message: '登录失败',
          error: new Error('登录失败')
        })
      } else {
        //登陆成功
        console.log(data)
        //cookie操作
        res.cookie('nickname', data[0].nickname, {
          maxAge: 60 * 60 * 1000
        })
        res.redirect('/');
      }
      client, close()
    })
  })
})




module.exports = router;
