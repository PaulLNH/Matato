const Validator = require('validator');
const isEmpty = require('./is-empty');


// Server side validation function
module.exports = function validateExperienceInput(data) {
  let errors = {};

  // Validator requires a string to check against, below
  // we check to see if the valie is empty using our custom
  // function, if it is not, keep the value the same, 
  // if it is store it as an empty string
  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  // Check to make sure title field is not empty
  if (Validator.isEmpty(data.title)) {
    errors.title = `Job title is required`;
  }

  // Check to make sure company field is not empty
  if (Validator.isEmpty(data.company)) {
    errors.company = `Company field is required`;
  }

  // Check to make sure from field is not empty
  if (Validator.isEmpty(data.from)) {
    errors.from = `From date field is required`;
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
};