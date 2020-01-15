
module.exports = (req, res, next) => {
  console.log(req.userrole);
  const error = new Error('your role is not user');
  if(req.userrole!="user"){
    err.statusCode = 500;
     throw error;
  }
  next();
};