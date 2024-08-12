var db = require('../models/database')
var express = require('express');
var router = express.Router();

/* GET users listing. */
const jwt = require('node-jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('private-key.txt');
router.post('/t', function(req, res, next) {
  const un = req.body.un;
  const pw = req.body.pw;
  if (checkUserPass(un,pw) == true) {
    const userInfo = getUserInfo(un);
    const Token = jwt.sign({}, PRIVATE_KEY, {expiresIn:3600, subject:userInfo.id});
    res.json({token:Token , expiresIn:3600 , userInfo:userInfo})
  }res.status(400).json({thongbao:'lỗi đăng nhập'})
});
const checkUserPass = (un,pw) =>{ 
  if(un=='huy' && pw=='123') return true;
  return false;
}
const getUserInfo =(un) =>{
  if(un == 'huy') return {'id':'1',"UserName":'Nguyễn Văn Gia Huy'};
  return {'id':'-1',"UserName":''}
}



module.exports = router;
