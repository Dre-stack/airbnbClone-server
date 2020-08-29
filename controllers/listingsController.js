const Listing = require('../models/Listing');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/AppError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  // console.log(file);
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('only images allowed', 400), false);
  }
};
const imageUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadImages = imageUpload.array('photos', 10);

exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();
  // console.log('req filess ------------', req.files);
  req.body.photos = [];
  const uploadPromises = req.files.map(async (file, i) => {
    const filename = `listing-${req.user._id}-${Date.now()}-${
      i + 1
    }.jpg`;
    await sharp(file.buffer)
      .resize(1000, 563, { fit: 'cover', position: 'top' })
      .toFormat('jpg')
      .jpeg()
      .toFile(`public/images/listings/${filename}`);

    req.body.photos.push(filename);
  });
  await Promise.all(uploadPromises);
  next();
});

exports.createNewListing = catchAsync(async (req, res, next) => {
  // console.log('Form Data', req.body);
  req.body.host = req.user._id;
  req.body.location = JSON.parse(req.body.location);
  req.body.address = JSON.parse(req.body.address);
  req.body.addressCoordinates = JSON.parse(
    req.body.addressCoordinates
  );

  const listing = await Listing.create(req.body);

  res.status(201).json({
    listing,
  });
});

exports.getListingById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate('host');
  if (!listing) {
    return next('Invalid id please try again', 400);
  }

  res.status(201).json({ listing });
});

exports.searchListings = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const { location, startDate, endDate } = req.query;
  let guests = req.query.guests ? parseInt(req.query.guests, 10) : 0;
  console.log(guests);
  const listings = await Listing.find(
    {
      $text: { $search: location },
      guestNumber: { $gte: guests },
    },
    { $score: { $meta: 'textScore' } }
  ).sort({ $score: { $meta: 'textScore' } });
  // console.log('listingsssssss', listings);

  res.status(201).json({ listings });
});
