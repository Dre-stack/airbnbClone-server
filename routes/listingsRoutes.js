const router = require('express').Router();
const {
  createNewListing,
  getListingById,
  uploadImages,
  resizeImages,
} = require('../controllers/listingsController');
const { protectRoute } = require('../controllers/authController');

router.get('/:id', getListingById);
router.post(
  '/new',
  protectRoute,
  uploadImages,
  resizeImages,
  createNewListing
);

module.exports = router;
