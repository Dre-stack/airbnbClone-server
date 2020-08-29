const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    phone: {
      type: String,
    },
    birthday: {
      type: Date,
      required: true,
    },
    photo: String,
    isHost: Boolean,
    passwordResetToken: String,
    passwordResetTokenExpiresIn: Date,
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenExpiresIn = Date.now() * 20 * 60 * 1000;

  return resetToken;
};

userSchema.methods.changedPasswordAfterTokenIssued = function (
  jwtTimestamp
) {
  if (this.passwordChangedAt) {
    const time = this.passwordChangedAt.getTime() / 1000;
    return jwtTimestamp < time;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
