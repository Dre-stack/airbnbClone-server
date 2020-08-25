const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  streetAddress: String,
  apartment: String,
  city: String,
  country: String,
  region: String,
});

const listingSchema = mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    maxLength: 50,
    required: true,
  },
  description: {
    type: String,
    maxLength: 500,
    required: true,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    locationName: String,
  },
  addressCoordinates: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    name: String,
  },
  address: {
    type: [addressSchema],
  },
  price: { type: Number, required: true },
  spaceType: {
    type: String,
    enum: ['Entire place', 'Private room', 'Shared room'],
    required: true,
  },
  guestNumber: Number,
  houseType: {
    type: String,
    enum: [
      'Apartment',
      'House',
      'Secondary unit',
      'Unique space',
      'Bed Space',
      'Boutique hotel',
    ],
  },
  hostType: {
    type: String,
    enum: ['individual', 'business'],
  },
  bedrooms: Number,
  bathrooms: Number,
  amenities: String,
  photos: [String],
  accessibility: Boolean,
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
