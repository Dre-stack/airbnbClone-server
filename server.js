const dotenv = require('dotenv');
const mongoose = require('mongoose');

/**
 * ENVIRONMENT VARIABLE
 */

dotenv.config({ path: '.env' });

/**
 * APP
 */

const app = require('./app');

/**
 * DATABASE
 */

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connected'))
  .catch((err) => console.log(`Database Error : ${err}`));

/**
 * SERVER CONNECTION
 */

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`app running at port: ${port} `));
