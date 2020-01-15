module.exports = (req, res, next) => {
    console.log(req.userrole+"             userrole");
    const error = new Error('your role is not director');
    if(req.userrole!="director"){
      err.statusCode = 500;
       throw error;
    }
    next();
  };