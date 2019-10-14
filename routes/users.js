const express = require('express');
const md5 = require('js-md5')

const router = express.Router();
const User = require('../db_modules/users');
const JWT = require('jsonwebtoken');
const config = require('../config/config')
const app = express();

const sendEmailCode = require('../utils/mail-code')

const codeArr = {}

router.get('/captcha', (req, res, next) => {
  const { email } = req.query
  if (codeArr[email] && ((new Date - codeArr[email].date) < 300000)) {
    res.json({ code: 200, success: false, msg: '请稍后，5分钟内只能发送一次' })
    return
  }
  const code = parseInt(Math.random() * 10000)
  sendEmailCode(email, code).then(() => {
    codeArr[email] = {
      code,
      date: new Date()
    }
    res.json({ code: 200, success: true, msg: 'success' })
  }).catch((err) => {
    res.json({ code: 500, success: false, msg: err })
  })
});

router.post('/sign-in', (req, res) => {
  const { username, password, email, captcha } = req.body
  if (!email) {
    res.json({ code: 200, success: false, msg: '邮箱账号不能为空！' })
    return
  }

  if (!username || !password) {
    res.json({ code: 200, success: false, msg: '用户名或密码不能为空！' })
    return
  }

  if (!codeArr[email] || ((new Date - codeArr[email].date) > 300000)) {
    res.json({ code: 200, success: false, msg: '验证码失效，请重新获取验证码！' })
    return
  }

  if (!codeArr[email].code == captcha) {
    res.json({ code: 200, success: false, msg: '验证码不匹配！' })
    return
  }

  User.findOne({ username: username }, (err, user) => {
    console.log(err, 'err')
    console.log(user, 'user')
    if (err) {
      res.json({ code: 500, success: false, msg: '服务器错误！' })
      return
    }
    if (user) {
      res.json({ code: 200, success: false, msg: '用户名已存在' })
      return
    }

    delete codeArr[email]

    const users = new User({
      username: username,
      password: md5(password),
      email: email,
      songList: []
    })
    users.save((err) => {
      if (err) {
        res.json({ code: 200, success: false, msg: '用户创建失败！' })
        return
      }
      res.json({ code: 200, success: true, msg: 'success' })
    })
  })
});

router.post('/login', (req, res) => {
  const { username, password } = req.body
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      res.json({ code: 500, success: false, msg: '服务器错误' })
      return
    }
    if (!user) {
      res.json({ code: 200, success: false, msg: '用户不存在' })
      return
    }
    if (user.password !== password) {
      res.json({ code: 200, success: false, msg: '密码错误！' })
      return
    }
    const token = JWT.sign(user.toJSON(), config.secret);
    res.json({ code: 200, success: true, result: { token: token }, msg: 'success' })
  })
});

router.get('/info', (req, res) => {
  const token = req.get('Authorization')
  JWT.verify(token.split(' ')[1], config.secret, (err, data) => {
    
    if (err) {
      res.json({code: 200, success: false, msg: err})
      return
    }
    User.findOne({_id: data._id}, (err, user) => {
      if (err) {
        res.json({code: 500, success: false, msg: err})
        return
      }
      if (!user) {
        res.json({code: 200, success: false, msg: '用户不存在！'})
        return
      }
      res.json({code: 200, success: true, msg: 'success', result: {username: user.username, userId: user._id, songList: user.songList, email: user.email}})
    })
  })
  
})

router.post('/logout', (req, res) => {
  res.json({code: 200, success: true, msg: 'success'})
})

module.exports = router
