const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

/**
 * @route   GET api/profile/test
 * @desc    Tests profile route
 * @access  Public
 */
router.get('/test', (req, res) => res.json({
  message: "Profile route works"
}));

/**
 * @route   GET api/profile
 * @desc    Get current users profile
 * @access  Private
 */
router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const errors = {};

  Profile.findOne({
      user: req.user.id
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = `There is no profile for this user`;
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

/**
 * @route   GET api/profile/all
 * @desc    Get array of all profiles
 * @access  Public
 */
router.get('/all', (req, res) => {
  const errors = {};
  errors.noprofiles = `There are no profiles`;

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        return res.status(404).json(errors)
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json(errors));
});

/**
 * @route   GET api/profile/handle/:handle
 * @desc    Get profile by handle
 * @access  Public
 */
router.get('/handle/:handle', (req, res) => {
  const errors = {};
  // Set default error for this route, if no match on handle throw error
  errors.noprofile = `There is no profile for this user`;

  // Search DB for the passed in handle
  Profile.findOne({
      handle: req.params.handle
    })
    // Attach the user's name and avatar to the response
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      // If no profile was found
      if (!profile) {
        // Send 404 not found status code and error obj
        res.status(404).json(errors);
      }
      // If profile was found, send profile to client
      res.json(profile);
    })
    .catch(err => res.status(404).json(errors));
});

/**
 * @route   GET api/profile/user/:user_id
 * @desc    Get profile by user ID
 * @access  Public
 */
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  // Set default error for this route, if no match on id throw error
  errors.noprofile = `There is no profile for this user`;

  // Search DB for the passed in handle
  Profile.findOne({
      user: req.params.user_id
    })
    // Attach the user's name and avatar to the response
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      // If no profile was found
      if (!profile) {
        // Send 404 not found status code and error obj
        res.status(404).json(errors);
      }
      // If profile was found, send profile to client
      res.json(profile);
    })
    .catch(err => res.status(404).json(errors));
});

/**
 * @route   POST api/profile
 * @desc    Create or edit user profile
 * @access  Private
 */
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validateProfileInput(req.body);

  // Check validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  const profileFields = {
    user: req.user.id,

  };
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  // Skills - Split into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      if (profile) {
        // Update existing profile
        Profile.findOneAndUpdate({
            user: req.user.id
          }, {
            $set: profileFields
          }, {
            new: true
          })
          .then(profile => res.json(profile));
      } else {
        // Create new profile

        // Check to see if the handle exists
        Profile.findOne({
          handle: profileFields.handle
        }).then(profile => {
          if (profile) {
            errors.handle = `That handle alreadt exists`;
            res.status(400).json(errors);
          }

          // Save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
});

/**
 * @route   POST api/profile/experience
 * @desc    Add experience to profile
 * @access  Private
 */
router.post('/experience', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validateExperienceInput(req.body);

  // Check validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  // Find by user, req.user.id comes from the token authenticated in the header
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      // Crete new experience object, values from client form
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      }

      // Add to experience array in the profile from MongoDB
      profile.experience.unshift(newExp);

      // Save the updated changes then send the new profile back to client as response
      profile.save().then(profile => res.json(profile));
    });
});

/**
 * @route   POST api/profile/education
 * @desc    Add education to profile
 * @access  Private
 */
router.post('/education', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validateEducationInput(req.body);

  // Check validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  // Find by user, req.user.id comes from the token authenticated in the header
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      // Crete new experience object, values from client form
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      }

      // Add to experience array in the profile from MongoDB
      profile.education.unshift(newEdu);

      // Save the updated changes then send the new profile back to client as response
      profile.save().then(profile => res.json(profile));
    });
});

/**
 * @route   DELETE api/profile/experience/:exp_id
 * @desc    Delete experience to profile
 * @access  Private
 */
router.delete('/experience/:exp_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  // Find by user, req.user.id comes from the token authenticated in the header
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      // Get remove index
      const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

      // Splice out of array
      profile.experience.splice(removeIndex, 1);

      // Save
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;