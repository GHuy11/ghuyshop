var db = require('../models/database')
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/product', function (req, res, next) {
  let sql = `SELECT * FROM products ORDER BY creatDate desc`;
  db.query(sql, function (err, data) {
    if (err) res.json({ "Thông Báo": `lỗi ${err}` })
    else res.json(data)
  })
});

router.get('/product/:id', function (req, res, next) {
  let id = req.params.id
  if (isNaN(id) == true) {
    res.json({ 'Thông báo': 'Sai tham số' });
    return;
  }
  if (id <= 0) {
    res.json({ 'Thông báo': 'Sai tham số' });
    return;
  }
  let sql = `SELECT * FROM products WHERE productID = ${id} ORDER BY creatDate desc;
              SELECT * FROM product_detail WHERE productID = ${id} 
  `;
  db.query(sql, function (err, data) {
    if (err) res.json({ "Thông Báo": `lỗi ${err}` })
    let product = data[0][0];
    let detail = data[1][0];
    var obj = Object.assign(product, detail);
    res.json(obj)
  })
});

router.post('/product', function (req, res) {
  let data = req.body;
  let sp = {
    productName: data.productName ,
    categoryID: data.categoryID || 0,
    price: data.price || 0,
    img: data.img || 0 ,
    sale: data.sale || 0,

  }
  let sql = 'INSERT INTO products SET ?';
  db.query(sql, sp, (err, result) => {
    if (err) res.json({ "thongbao": "Lỗi chèn 1 sp", err });
    else {
      let productID = result.insertId;
      let thuoctinh = {
        productID: productID,
        stock: data.stock || 0,
        size: data.size || 0 ,
        color: data.color ||0,
        origin: data.origin ||0,
        material: data.material ||0 ,
      }
      let sql = 'INSERT INTO product_detail SET ?';
      db.query(sql, thuoctinh, (err, result) => {
        if (err) {
          res.json({ "thongbao": "Lỗi chèn 1 thuộc tính", err });
        } else {
          res.json({ "thongbao": "Đã chèn 1 sp và thuộc tính", "id_sp": productID, "id_thuoctinh": result.insertId });
        }
      });
    }
  });

});

router.put('/product/:id', function (req, res) {
  let data = req.body;
  let id = req.params.id;
  let sql = 'UPDATE 	products SET ? WHERE productID = ?';
  
  db.query(sql, [data, id], (err, result) => {
    if (err) res.json({ "thongbao": "Lỗi cập nhật sp", err });
    else{     
      let sql = 'UPDATE 	product_detail SET ? WHERE productID = ?';
      db.query(sql, [thuoctinh,id], (err, result) => {
        if (err) {
          res.json({ "thongbao": "Lỗi cập nhật 1 thuộc tính", err });
        } else {
          res.json({ "thongbao": "Đã cập nhật 1 sp và thuộc tính", "id_sp": productID, "id_thuoctinh": productID });
        }
      });
    }
  });

});

router.delete('/product/:id', function (req, res) {
  let id = req.params.id;
  let sql = 'DELETE FROM 	products WHERE productID= ?';
  db.query(sql, id, (err, d) => {
    if (err) res.json({ "thongbao": "Lỗi khi xóa sp", err });
    else res.json({ "thongbao": "Đã xóa sp" });
  });
});


//loại
router.get('/category', function (req, res, next) {
  let sql = `SELECT * FROM 	categories `;
  db.query(sql, function (err, data) {
    if (err) res.json({ "Thông Báo": `lỗi ${err}` })
    else res.json(data)
  })
});

router.get('/category/:id', function (req, res, next) {
  let id = req.params.id
  if (isNaN(id) == true) {
    res.json({ 'Thông báo': 'Sai tham số' });
    return;
  }
  if (id <= 0) {
    res.json({ 'Thông báo': 'Sai tham số' });
    return;
  }
  let sql = `SELECT * FROM categories WHERE categoryID = ? `;
  db.query(sql, id, function (err, data) {
    if (err) res.json({ "Thông Báo": `lỗi ${err}` })
    else res.json(data[0])
  })
});

router.post('/category', function (req, res) {
  let data = req.body;
  let sql = 'INSERT INTO categories SET ?';
  db.query(sql, data, (err, data) => {
    if (err) res.json({ "thongbao": "Lỗi chèn 1 sp", err });
    else res.json({ "thongbao": "Đã chèn 1 sp", "id": data.insertId });
  });

});

router.put('/category/:id', function (req, res) {
  let data = req.body;
  let id = req.params.id;
  let sql = 'UPDATE 	categories SET? WHERE categoryID = ?';
  db.query(sql, [data, id], (err, d) => {
    if (err) res.json({ "thongbao": "Lỗi cập nhật sp", err });
    else res.json({ "thongbao": "Đã cập nhật sp" });
  });

});

router.delete('/category/:id', function (req, res) {
  let id = req.params.id;
  let sql = 'DELETE FROM 	categories WHERE categoryID= ?';
  db.query(sql, id, (err, d) => {
    if (err) res.json({ "thongbao": "Lỗi khi xóa sp", err });
    else res.json({ "thongbao": "Đã xóa sp" });
  });
});



module.exports = router;
