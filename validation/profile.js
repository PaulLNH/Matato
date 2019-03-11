const Validator = require('validator');
const isEmpty = require('./is-empty');


// Server side validation function
module.exports = function validateProfileInput(data) {
  let errors = {};

  // Validator requires a string to check against, below
  // we check to see if the valie is empty using our custom
  // function, if it is not, keep the value the same, 
  // if it is store it as an empty string
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  // Check to see if valid handle
  if (!Validator.isLength(data.handle, {
      min: 2,
      max: 40
    })) {
    errors.handle = `Handle needs to be between 2 and 4 characters`;
  }

  // Check to see if a handle field is empty
  if (Validator.isEmpty(data.handle)) {
    errors.handle = `Profile handle is required`;
  }

  // Check status field to see if it is empty
  if (Validator.isEmpty(data.status)) {
    errors.status = `Status field is required`;
  }

  // Check password field to see if it is empty
  if (Validator.isEmpty(data.skills)) {
    errors.skills = `Skills field is required`;
  }

  // First checks to makesure the field is not empty
  // this is an optional filed, if it is entered
  // we add validation to it
  if (!isEmpty(data.website)) {
    // Check to see if website field is a valid URL format
    if (!Validator.isURL(data.website)) {
      errors.website = `Not a valid URL`;
    }
  }

  // First checks to makesure the field is not empty
  // this is an optional filed, if it is entered
  // we add validation to it
  if (!isEmpty(data.youtube)) {
    // Check to see if website field is a valid URL format
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = `Not a valid URL`;
    }
  }

  // First checks to makesure the field is not empty
  // this is an optional filed, if it is entered
  // we add validation to it
  if (!isEmpty(data.twitter)) {
    // Check to see if website field is a valid URL format
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = `Not a valid URL`;
    }
  }

  // First checks to makesure the field is not empty
  // this is an optional filed, if it is entered
  // we add validation to it
  if (!isEmpty(data.facebook)) {
    // Check to see if website field is a valid URL format
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = `Not a valid URL`;
    }
  }

  // First checks to makesure the field is not empty
  // this is an optional filed, if it is entered
  // we add validation to it
  if (!isEmpty(data.linkedin)) {
    // Check to see if website field is a valid URL format
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = `Not a valid URL`;
    }
  }

  // First checks to makesure the field is not empty
  // this is an optional filed, if it is entered
  // we add validation to it
  if (!isEmpty(data.instagram)) {
    // Check to see if website field is a valid URL format
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = `Not a valid URL`;
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
};