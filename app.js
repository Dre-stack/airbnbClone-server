const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');

const userRoutes = require('./routes/userRoutes');
const listingsRoutes = require('./routes/listingsRoutes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * ROUTES
 *
 */

app.get('/api', (req, res) => res.send('welcome to airbnb server'));
app.use('/api/users', userRoutes);
app.use('/api/listings', listingsRoutes);

/**
 * UNHANDLED ROUTE
 */
app.all('*', (req, res, next) => {
  next(
    new AppError(`cant find ${req.originalUrl} on this server`, 404)
  );
});

/**
 * ERROR MIDDLEWARE
 */

app.use(errorHandler);

module.exports = app;
