var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var auth=require('./auth');
var usercheck=require('./usercheck');
var sql=require('../database/database');

router.post('/follow',auth,usercheck,function (req, res, next) {
 const user_id=req.userid;
  const vacation_id=req.body.vacation_id;
  console.log(req.body);
  var followers = `INSERT INTO folowers (user_id, vacation_id) 
   VALUES('${user_id}','${vacation_id}')`;
   sql.query(followers, function (err, folowers) {
    if (err) throw err;
          var numofvacations = `SELECT user_id FROM folowers WHERE vacation_id = ${vacation_id}`;
    sql.query(numofvacations, function (err, number) {
            if (err) throw err;
            var follown_vacation = `UPDATE vacations SET folowers=${number.length} WHERE id=${vacation_id}`;
            sql.query(follown_vacation, function (err, result) {
              if (err) throw err;
              console.log("number      "+result);
              console.log("1 record inserted");
      res.send(number);
            });
          });
  });
  });

  router.post('/unfollow',auth,usercheck,function (req, res, next) {
    const vacation_id=req.body.vacation_id;
     console.log(req.body);
     var unfollow = `DELETE FROM folowers WHERE vacation_id ='${vacation_id}' AND user_id='${req.userid}'`;
      sql.query(unfollow, function (err, folowers) {
       if (err) throw err;
             var numofvacations = `SELECT user_id FROM folowers WHERE vacation_id = ${vacation_id}`;
       sql.query(numofvacations, function (err, number) {
               if (err) throw err;
               var follown_vacation = `UPDATE vacations SET folowers=${number.length} WHERE id=${vacation_id}`;
               sql.query(follown_vacation, function (err, result) {
                 if (err) throw err;
                 console.log("number      "+result);
                 console.log("1 record inserted");
         res.send(number);
               });
             });
     });
     });
    
 

  router.get('/follow',function (req, res, next) {
    res.send(
        `<form action="localhost:3000/follow" method="POST">
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