var express = require('express');
var router = express.Router();
var fs = require('fs');
var admincheck=require('./admincheck');
var sql=require('../database/database');
var multer  = require('multer');
var auth=require('./auth');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/picters')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage })
router.use('/static', express.static(__dirname + '/public'));

/* show all vacations */
router.get('/', function(req, res, next) {
  res.send(
    `<form action="http://localhost:3000/vacation/add" method="POST"  enctype="multipart/form-data" >
  description:<br>
  <input type="text" name="description" value="Mickey">
  <br>
  destenation:<br>
  <input type="text" name="destenation" value="Mouse">
  <br><br>
  image:<br>
  <input type="file" name="avatar"/>
  <br><br>
  date_from:<br>
  <input type="date" name="date_from" value="Mouse">
  <br><br>
  date_to:<br>
  <input type="date" name="date_to" value="Mickey">
  <br>
  price:<br>
  <input type="text" name="price" value="Mouse">
  <br><br>
  folowers:<br>
  <input type="number" name="folowers" value="Mouse">
  <br><br>
  <input type="submit" value="Submit">
</form> `)
});
router.get('/vacation',auth, function(req, res, next) { 
  sql.query("SELECT * FROM  vacations", function (err, vacs) {
     if (err) throw err;
     var vacations = vacs;
     var follown_vacation = `SELECT vacation_id FROM folowers WHERE user_id = ${req.userid}`;
     sql.query(follown_vacation, function (err, result) {
      if (err) throw err;
      var followed_by_user=result;
      res.send({vacations:vacations,followers:followed_by_user});
    });
   });
});
router.get('/vacation/pic/:filename', function(req, res, next) { 
 fs.readFile(`./public/picters/${req.params.filename}`, function (err, data) {
  if (err) throw err;
  res.write(data);
  // console.log(data);
  res.end(req.params.filename);
});
});

/* add vacation */
router.post('/vacation/add',auth,admincheck,upload.single('avatar'), function (req, res, next) {
  var comment = `INSERT INTO vacations (description, destenation, image, date_from, date_to, price) 
  VALUES('${req.body.description}','${req.body.destenation}','${req.file.filename}','${req.body.date_from}','${req.body.date_to}','${req.body.price}')`;
  sql.query(comment, function (err, result) {
    if (err) throw err;
    console.log(req.body);
    res.send('news');
  });
});



/* single vacation */
router.get('/vacation/single/:id', function (req, res, next) {
  sql.query(`SELECT * FROM vacations WHERE id = '${req.params.id}'`, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

/* delete vacation */
router.post('/vacation/delete',auth,admincheck, function (req, res, next) {
  var vacationdelete = `DELETE FROM vacations WHERE id = ${req.body.vacation_id}`;
  sql.query(vacationdelete, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
    res.send("deleted");
  });
});
/* manage vacation */
router.get('/vacation/manage',auth,admincheck, function (req, res, next) {
  res.send(
    `<form action="http://localhost:3000/vacation/manage" method="POST"  enctype="multipart/form-data">
  description:<br>
  <input type="text" name="description" value="Mickey">
  <br>
  destenation:<br>
  <input type="text" name="destenation" value="Mouse">
  <br><br>
  image:<br>
  <input type="file" name="avatar"/>
  <br><br>
  date_from:<br>
  <input type="date" name="date_from" value="Mouse">
  <br><br>
  date_to:<br>
  <input type="date" name="date_to" value="Mickey">
  <br>
  price:<br>
  <input type="text" name="price" value="Mouse">
  <br><br>
  folowers:<br>
  <input type="number" name="folowers" value="Mouse">
  <br><br>
  vacationid:<br>
  <input type="number" name="vacationid" value="Mouse">
  <br><br>
  <input type="submit" value="Submit">
</form> `)
});
router.post('/vacation/edit/:id',auth,admincheck, upload.single('avatar'), function (req, res, next) {
  var updated = `UPDATE vacations 
  SET 
  description = '${req.body.description}',
  destenation = '${req.body.description}',
  image = '${req.file.filename}',
  date_from = '${req.body.date_from}',
  date_to = '${req.body.date_to}',
  price = '${req.body.price}'
  WHERE id = '${req.params.id}'`;
      sql.query(updated, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
    console.log(req.body);
    res.send("updated");
  });
});

module.exports = router;
