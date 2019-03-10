const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const ONE_HOUR = 3600; // Time for jwt to expire
const passport = require('passport');

const User = require('../../models/User');

/**
 * @route   GET api/user/test
 * @desc    Tests user route
 * @access  Public
 */
router.get('/test', (req, res) => res.json({
  message: "Authentication route works"
}));

/**
 * @route   GET api/user/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', (req, res) => {
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        return res.status(400).json({
          email: 'Email already exists'
        });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm', // Default
        })
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.error(err));
          })
        })
      }
    });
});

/**
 * @route   GET api/user/login
 * @desc    Login User / Returing JWT Token
 * @access  Public
 */
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({
      email
    })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          email: 'User not found'
        });
      }

      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // User matched

            // Create jwt payload
            const payload = { 
              id: user.id,
              name: user.name,
              avatar: user.avatar,
            };
            
            // Sign token
            jwt.sign(
              payload, 
              keys.secretOrKey, 
              { expiresIn: ONE_HOUR }, 
              (err, token) => {
                if(err) throw new Error(err);
                res.json({
                  success: true,
                  token: `Bearer ${token}`,
                });
            });
          } else {
            return res.status(400).json({
              password: 'Password incorrect'
            });
          }
        });
    });
});

/**
 * @route   GET api/user/current
 * @desc    Return current user
 * @access  Private
 */
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
  });
});

module.exports = router;