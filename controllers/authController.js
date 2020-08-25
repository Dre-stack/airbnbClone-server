const User = require('../models/User');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { promisify } = require('util');

const signAndSendToken = (id, res, user) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET);

  res.status(201).json({ token, user });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  signAndSendToken(user._id, res, user);
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //No email or password
  if (!email || !password) {
    return next(
      new AppError('Please enter your email and password', 400)
    );
  }

  const user = await User.findOne({ email }).select('+password');
  // console.log(user);
  if (
    !user ||
    !(await user.comparePassword(password, user.password))
  ) {
    return next(new AppError('Incorrect emal or password', 401));
  }
  user.password = undefined;
  signAndSendToken(user._id, res, user);
});

exports.protectRoute = catchAsync(async (req, res, next) => {
  const token = req.header('x-auth-token');
  //check if there is token
  if (!token) {
    return next(
      new AppError(
        'you are not logged in, please log in to continue',
        401
      )
    );
  }

  //if there is token check if the user still exists
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return next(new AppError('user no longer exist', 401));
  }

  //check if user changed password after the token was issued
  if (user.changedPasswordAfterTokenIssued(decodedToken.iat)) {
    return next(new AppError('user recently changed password', 401));
  }

  req.user = user;
  next();
});

exports.retstrictRoute = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have the permission to perform this request',
          403
        )
      );
    }
    next();
  };
};
