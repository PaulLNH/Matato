const Validator = require('validator');
const isEmpty = require('./is-empty');


// Server side validation function
module.exports = function validateEducationInput(data) {
  let errors = {};

  // Validator requires a string to check against, below
  // we check to see if the valie is empty using our custom
  // function, if it is not, keep the value the same, 
  // if it is store it as an empty string
  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  // Check to make sure title field is not empty
  if (Validator.isEmpty(data.school)) {
    errors.school = `School field is required`;
  }

  // Check to make sure company field is not empty
  if (Validator.isEmpty(data.degree)) {
    errors.degree = `Degree field is required`;
  }

  // Check to make sure fieldofstudy field is not empty
  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = `Field of study field is required`;
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