var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var sql=require('../database/database');

router.post('/register',function (req, res, next) {
 
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const username = req.body.username;
    const password = req.body.password;
      sql.query(`SELECT * FROM users WHERE username = "${username}"`, function (err, result) {
        if (err) throw err;
    if(result.length!==0){
      console.log(typeof result);
      res.send(" exist"+result.length);
    }else if(result.length===0){
      console.log(result)
       bcrypt
      .hash(password, 12)
      .then(hashedPw => {
        var user = `INSERT INTO users ( first_name, last_name, username, password) 
        VALUES('${ first_name}','${last_name}','${username}','${hashedPw}')`;
        sql.query(user, function (err, result) {
          if (err) throw err;
          console.log(req.body);
        });
      })
      .then(result => {
        res.status(201).json({ message: 'User created!'});
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
    }
      });

   


  });
  router.get('/register',function (req, res, next) {
    res.send(
      `<form action="http://localhost:3000/register" method="POST">
      first_name:<br>
    <input type="text" name="first_name">
    <br>
    <br><br>
    last_name:<br>
    <input type="text" name="last_name">
    <br>
    username:<br>
    <input type="text" name="username">
    <br>
    password:<br>
    <input type="text" name="password">
    <br>
    <input type="submit" value="Submit">
  </form> `)

  });
  

module.exports = router;