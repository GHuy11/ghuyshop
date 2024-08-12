var db = require('../models/database')
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')

/* GET home page. */
//show tour
router.get('/home', function (req, res, next) {
  let sql = `SELECT * FROM products ORDER BY creatDate desc`;
  db.query(sql, function (err, data) {
    if (err) res.json({ "Thông Báo": `lỗi ${err}` })
    else res.json(data)
  })
});

//giày theo loại
router.get('/spTheoloai/:id_loai', function (req, res, next) {
  let id_loai = req.params.id_loai
  if (isNaN(id_loai) == true) {
    res.json({ 'Thông báo': 'Sai tham số' });
    return;
  }
  let sql = `SELECT * FROM products WHERE categoryID = ? ORDER BY creatDate desc`;
  db.query(sql, id_loai, function (err, data) {
    if (err) res.json({ "Thông Báo": `lỗi ${err}` })
    else res.json(data)
  })
});

//sp theo tên
router.get('/sptheoten/:name', function (req, res, next) {
  let name = req.params.name
  if (!name) {
    return res.status(400).json({ "Thông Báo": "productName is required" });
  }
  let sql = `SELECT * FROM products WHERE productName LIKE ? ORDER BY creatDate desc`;
  const queryValue = `%${name}%`;
  db.query(sql, [queryValue], function (err, data) {
    if (err) res.json({ "Thông Báo": `lỗi ${err}` })
    else res.json(data)
  })
});

//sp mới
router.get('/home/hangmoi', function (req, res, next) {
  let sql = `SELECT * FROM products WHERE new = 1 ORDER BY creatDate desc`;
  db.query(sql, function (err, data) {
    if (err) res.json({ "Thông Báo": `lỗi ${err}` })
    else res.json(data)
  })
});
//sp sale
router.get('/home/sale', function (req, res, next) {
  let sql = `SELECT * FROM products WHERE sale != 0 ORDER BY sale desc`;
  db.query(sql, function (err, data) {
    if (err) res.json({ "Thông Báo": `lỗi ${err}` })
    else res.json(data)
  })
});

//sp hot
router.get('/home/hot', function (req, res, next) {
  let sql = `SELECT * FROM products WHERE hot=1 ORDER BY creatDate desc`;
  db.query(sql, function (err, data) {
    if (err) res.json({ "Thông Báo": `lỗi ${err}` })
    else res.json(data)
  })
});

//chi tiết sản phẩm
router.get('/sp/:id', function (req, res, next) {
  let id = req.params.id
  if (isNaN(id) == true) {
    res.json({ 'Thông báo': 'Sai tham số' });
    return;
  }
  if (id <= 0) {
    res.json({ 'Thông báo': 'Sai tham số' });
    return;
  }
  let sql = `SELECT * FROM products WHERE productID = ? ORDER BY creatDate desc`;
  db.query(sql, id, function (err, data) {
    if (err) res.json({ "Thông Báo": `lỗi ${err}` })
    else res.json(data[0])
  })
});

//loai
router.get('/loai', function (req, res, next) {
  let sql = `SELECT * FROM categories`;
  db.query(sql, function (err, data) {
    if (err) res.json({ "Thông Báo": `lỗi ${err}` })
    else res.json(data)
  })
});
//lấy thông tin của 1 loai
router.get('/loai/:id', function (req, res, next) {
  let id = req.params.id
  let sql = `SELECT * FROM categories WHERE categoryID = ${id}`;
  db.query(sql, function (err, data) {
    if (err) res.json({ "Thông Báo": `lỗi ${err}` })
    else res.json(data[0])
  })
});

//luu đơn hàng
router.post('/luudonhang/', function (req, res) {
  let data = req.body;
  let sql = `INSERT INTO orders SET ?`;
  db.query(sql, data, function (err, data) {
    if (err) res.json({ "id_dh": -1, "thongbao": "lỗi lưu đơn hàng", err })
    else {
      id_dh = data.insertId
      res.json({ "id_dh": id_dh, "thông báo": "đã thêm đơn hàng" })
    }
  })
});

//luu gio hang(chi tiết đơn hàng)
router.post('/luugiohang/', function (req, res) {
  let data = req.body;
  let sql = `INSERT INTO order_details SET ?`;
  db.query(sql, data, function (err, d) {
    if (err) res.json({ "thongbao": "lỗi lưu sp", err })
    else {
      res.json({ "thông báo": "đã lưu sp vào db", "id_sp": data.id_sp });
    }
  });
});

//đăng kí
router.post("/dangky", (req, res) => {
  const em = req.body.em;
  const pw = req.body.pw;
  const un = req.body.un;

  console.log(em, pw, un);

  let sql = `INSERT INTO customers (email, password, name) VALUES (?, ?, ?)`;
  bcrypt.hash(pw, 10, (err, hash) => {
    db.query(sql, [em, hash, un], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ "thongbao": "Lỗi server", err });
      }
      res.status(200).json({ "thongbao": "Đã đăng ký" });
    })
  })
})
//authen

router.post("/signup", (req, res) => {
  const em = req.body.em;
  const pw = req.body.pw;
  const un = req.body.un;

  console.log(em, pw, un);

  let sql = `INSERT INTO customers (Email, Password, UserName) VALUES (?, ?, ?)`;
  bcrypt.hash(pw, 10, (err, hash) => {
    db.query(sql, [em, hash, un], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ "thongbao": "Lỗi server", err });
      }
      res.status(200).json({ "thongbao": "Đã đăng ký" });
    })
  })
})

const jwt = require('node-jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('private-key.txt');
router.post("/login", function (req, res) {
  const un = req.body.un;
  const pw = req.body.pw;

  let sqlCheckUser = `SELECT * FROM 	customers WHERE 	UserName = ?`;
  db.query(sqlCheckUser, [un], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ "thongbao": "Lỗi server", err });
    }
    if (data.length > 0) {
      const user = data[0];
      const getUserInfo = (un) => {
        if (un === user.UserName) {
          return {
            id: String(user.CustomerID),
            ht: String(user.UserName),
            role: String(user.role)
          };
        }
        return { 'id': "-1", "hoten": '' };
      }
      const userInfo = getUserInfo(un);
      const Token = jwt.sign({}, PRIVATE_KEY, { expiresIn: 3600, subject: userInfo.id });
      res.status(200).json({ token: Token, expiresIn: 3600, userInfo })
    }
    else res.status(400).json({ thongbao: 'Đăng nhập thất bại' });

  });

})


// router.post("/login", (req, res) => {
//   const un = req.body.un;
//   const pw = req.body.pw;

//   let sqlCheckUser = `SELECT * FROM 	customers WHERE 	UserName = ?`;
//   db.query(sqlCheckUser, [un], (err, data) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ "thongbao": "Lỗi server", err });
//     }
// if (data.length > 0) {
//   const userInfo = data[0];
//   bcrypt.compare(pw, userInfo.Password, (err, checkUser) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ "thongbao": "Lỗi server", err });
//     }
//     if (checkUser) {
//       const jwtBearToken = jwt.sign(
//         {},
//         PRIVATE_KEY,
//         { algorithm: "RS256", expiresIn: 3600, subject: String(userInfo.id) }
//       );
//       res.status(200).json({
//         "thongbao": "Dang nhap thanh cong",
//         token: jwtBearToken,
//         expiresIn: 3600,
//         userInfo: userInfo
//       });
//     } else {
//       res.status(500).json({ "thongbao": "Sai mật khẩu" });
//     }
//   });
// } else {
//   res.status(401).json({ "thongbao": "Dang nhap that bai" });
// }
//   });
// });


module.exports = router;
