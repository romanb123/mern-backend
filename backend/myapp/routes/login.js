const jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var sql=require('../database/database');

router.post('/login',function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username,password);
      sql.query(`SELECT * FROM users WHERE username = "${username}"`, function (err, result) {
        if (err) throw err;
    if(result.length===0){
      console.log(result);
      res.send("user dont exist");
    }else if(result.length!==0){
      bcrypt.compare(password, result[0].password).then(isEqual => {
        if (!isEqual) {
          // const error = new Error('Wrong password!');
          // error.statusCode = 401;
          // throw error;
          res.send("wrong password");
        }
        else if(isEqual){
           const token = jwt.sign(
          {
          role:result[0].role,
          name:result[0].username,
          id:result[0].id,
          },
          'secret',
          { expiresIn: '1h' }
        );
        res.status(200).json({ token: token, username:result[0].username,loggedin:true,
        role:result[0].role}); 
        }
      
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
  router.get('/login',function (req, res, next) {
    res.send(
      `<form action="localhost:3000/login" method="POST">
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