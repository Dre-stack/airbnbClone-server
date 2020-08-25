const AppError = require('../utils/AppError');

const handleDuplicateFieldsDB = (err) => {
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const string = Object.keys(err.keyValue)[0];
  const value = string.charAt(0).toUpperCase() + string.slice(1);

  const message = `${value} already exists!`;
  return new AppError(message, 400);
};

const sendError = (err, res) => {
  //If Error is operational (trusted error created by the user)

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    //programming error or other unknown errors

    console.error('ERROR 👿', err);
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  let error = { ...err };
  error.message = err.message;

  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  sendError(error, res);
};
