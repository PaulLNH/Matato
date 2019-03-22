// Require dependencies
const express = require('express');
const router = express.Router();
// Gravatar used for our avatar images: 
// https://www.npmjs.com/package/gravatar
const gravatar = require('gravatar');
// bcryptjs used to salt and hash (encrypt) passwords:
// https://www.npmjs.com/package/bcryptjs
const bcrypt = require('bcryptjs');
// jwt used to create our Bearer token:
// https://www.npmjs.com/package/jsonwebtoken
const jwt = require('jsonwebtoken');
// Passport used to generate a login strategy and authenticate
// https://www.npmjs.com/package/passport
const passport = require('passport');

// Load keys.js config, you will need to make this
// file, see /config/keys-example.js for instructions
const keys = require('../../config/keys');
const User = require('../../models/User');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Time set for token to expire
const ONE_HOUR = 3600;

/**
 * @route   GET api/users/test
 * @desc    Tests user route
 * @access  Public
 */
router.get('/test', (req, res) => res.json({
  message: "Users route works"
}));

/**
 * @route   GET api/users/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', (req, res) => {
  const {
    errors,
    isValid
  } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) return res.status(400).json(errors);

  // Search MongoDB 'User' to find one match to the provided email
  User.findOne({
    email: req.body.email
  }).then(user => {
    // If a user was found:
    if (user) {
      // Add the exisiting email error to errors object
      errors.email = `Email already exists`;
      // return a 400 status code with the error response
      return res.status(400).json(errors);
    } else {
      // If no user was found:

      // Create an avatar config object (using Gravatar)
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size in px
        r: 'pg', // Rating
        d: 'mm', // Default img (person outline)
      });
      // Creates a new user based off the
      // User MongoDB Schema in /models/User.js
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar,
      });

      // By generating a 'salt' we add random data we can pass into the generated hash
      // In this example we are adding 10 bytes of random data
      bcrypt.genSalt(10, (err, salt) => {
        // Create a hash of the password sprinkling in the random data from our salt
        // This makes it harder to crack by things like rainbow table attacks
        // See this article for more details: https://auth0.com/blog/hashing-in-action-understanding-bcrypt/
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // Set the newUser's password to our encrypted password
          newUser.password = hash;
          // Save the newUser in our MongoDB database
          newUser.save()
            // Return the user object back to the client
            .then(user => res.json(user))
            .catch(err => console.error(err));
        })
      })
    }
  })
  .catch(err => res.json(err));
});

/**
 * @route   GET api/users/login
 * @desc    Login User / Returing JWT Token
 * @access  Public
 */
router.post('/login', (req, res) => {
  const {
    errors,
    isValid
  } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  };

  const { email, password } = req.body;

  // Search MongoDB 'User' to find one match to the provided email
  User.findOne({ email }).then(user => {
      // If no user was found:
      if (!user) {
        errors.email = `User not found`;
        // Return a 404 not found status code with the error response
        return res.status(404).json(errors);
      }

      // If a user was found:
      // Check the incoming password against the hash'd password in DB
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          // If password is a match:
          if (isMatch) {
            // Creates new JWT payload
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar,
            };

            // Sign token with a payload, 
            // secret key (from our /config/keys.js 'secret'),
            // and expiration time (in this case it's valid for 1 hour)
            jwt.sign(
              payload,
              keys.secretOrKey, {
                expiresIn: ONE_HOUR
              },
              // Callback function after token is signed:
              (err, token) => {
                // Return the success code and signed token to client
                res.json({
                  success: true,
                  token: 'Bearer ' + token,
                });
                console.log(`${user.name} has successfully logged in.`);
              }
            );
          } else {
            errors.password = `Password incorrect`;
            // If password did not match the hashed password in DB:
            // Return a 400 bad request status code 
            // with the incorrect password error response
            return res.status(400).json(errors);
          }
        })
        .catch(err => res.json(err));
    })
    .catch(err => res.json(err));
});

/**
 * @route   GET api/users/current
 * @desc    Return current user
 * @access  Private
 */
router.get('/current', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  // NOTE: Destructuring the req.user object
  // This ES6 syntax is the same as:
  // const id = req.user.id;
  // const name = req.user.name;
  // const email = req.user.email;
  // const avatar = req.user.avatar;
  const {
    id,
    name,
    email,
    avatar
  } = req.user;

  // Returns the authenticated user data (minus the password)
  res.json({
    id,
    name,
    email,
    avatar,
  });
});

module.exports = router;