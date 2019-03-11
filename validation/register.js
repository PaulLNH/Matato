const Validator = require('validator');
const isEmpty = require('./is-empty');


// Server side validation function
module.exports = function validateRegisterInput(data) {
  let errors = {};

  // Validator requires a string to check against, below
  // we check to see if the valie is empty using our custom
  // function, if it is not, keep the value the same, 
  // if it is store it as an empty string
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  // Check name field to see if the length is NOT between 2 and 30 characters
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = `Name must be between 2 and 30 characters`;
  }

  // Check name field to see if it is empty
  if (Validator.isEmpty(data.name)) {
    errors.name = `Name field is required`;
  }

  // Check email field to see if it is empty
  if (Validator.isEmpty(data.email)) {
    errors.email = `Email field is required`;
  }

  // Check email field to see if it's a valid email format
  if (!Validator.isEmail(data.email)) {
    errors.email = `Email is invalid`;
  }

  // Check password field to see if it is empty
  if (Validator.isEmpty(data.password)) {
    errors.password = `Password field is required`;
  }
  
  // Check password to see if it is between 6 and 30 characters
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = `Password must be at least 6 characters`;
  }

  // Check second password field to see if it is empty
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = `Password field is required`;
  }

  // Check to see if the two passwords match
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = `Passwords must match`;
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
};