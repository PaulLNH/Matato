const Validator = require('validator');
const isEmpty = require('./is-empty');


// Server side validation function
module.exports = function validateLoginInput(data) {
  let errors = {};

  // Validator requires a string to check against, below
  // we check to see if the valie is empty using our custom
  // function, if it is not, keep the value the same, 
  // if it is store it as an empty string
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  
  // Check email field to see if it's a valid email format
  if (!Validator.isEmail(data.email)) {
    errors.email = `Email is invalid`;
  }
  
  // Check email field to see if it is empty
  if (Validator.isEmpty(data.email)) {
    errors.email = `Email field is required`;
  }
  
  // Check password field to see if it is empty
  if (Validator.isEmpty(data.password)) {
    errors.password = `Password field is required`;
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
};