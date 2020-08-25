const express = require('express');
const { signup, signin } = require('../controllers/authController');
const { protectRoute } = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(signup);
router.post('/signin', signin);
router.get('/me', protectRoute, (req, res) => {
  res.status(201).json({ user: req.user });
});
module.exports = router;
