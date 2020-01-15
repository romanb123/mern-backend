var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "sql12.freemysqlhosting.net",
    user: "sql12319203",
    password: " zUv6AWbGvf",
    database: "sql12319203"
});


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = con;