var mysql= require ('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database:'ghuyshop',
    multipleStatements:true
});
db.connect(function (err) {
    if (err) throw err;
    console.log("đã kết nối db");
});
module.exports = db