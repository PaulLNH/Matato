const Validator = require('validator');
const isEmpty = require('./is-empty');


// Server side validation function
module.exports = function validatePostInput(data) {
  let errors = {};

  // Validator requires a string to check against, below
  // we check to see if the valie is empty using our custom
  // function, if it is not, keep the value the same, 
  // if it is store it as an empty string
  data.text = !isEmpty(data.text) ? data.text : '';
  
  // Check to see if post is between 10 and 300 characters
  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = `Post must be between 10 and 300 characters`;
  }

  // Check email field to see if it's a valid email format
  if (Validator.isEmpty(data.text)) {
    errors.text = `Text field is required`;
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
};