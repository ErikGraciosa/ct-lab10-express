// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status || 500;

  res.status(status);
  console.log(err.status);
  console.log(err);
  
  res.send({
    status: err.status,
    message: `Entry at ${req.url} ${err.message}` 
  });
};
