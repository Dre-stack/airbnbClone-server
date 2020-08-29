const router = require('express').Router();
const {
  createNewListing,
  getListingById,
  uploadImages,
  resizeImages,
  searchListings,
} = require('../controllers/listingsController');
const { protectRoute } = require('../controllers/authController');

router.get('/getlisting/:id', getListingById);
router.post(
  '/new',
  protectRoute,
  uploadImages,
  resizeImages,
  createNewListing
);
router.get('/search', searchListings);

module.exports = router;
