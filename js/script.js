/////////////////////////////////////////
// DOM SELECTION
const inputs = document.querySelectorAll('.input');
const form = document.querySelector('form');
const successMsg = document.querySelector('.form-success-msg');
const errorMsg = document.querySelector('.form-error-msg');
const submitBtn = form.querySelector('[type="submit"]');

// Regex pattern to test email
const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,5}$/;

// Regex pattern to test contact number
const telPattern =
  /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

// Loader html
const loader = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;

/////////////////////////////////////////
// FUNCTIONS

// To set form is loading status
const startLoader = () => {
  submitBtn.innerHTML = loader;
};

// To remove form is loading status
const stopLoader = () => {
  submitBtn.textContent = 'Send';
};

// Hide Success message
const hideSuccessMsg = () => successMsg.classList.add('d-none');

// Display Success message
const showSuccessMsg = () => successMsg.classList.remove('d-none');

// Hide Error message
const hideErrorMsg = () => errorMsg.classList.add('d-none');

// Display Error message
const showErrorMsg = () => errorMsg.classList.remove('d-none');

// To set 'data-error'
const setDataError = (formGroup, msg) => {
  formGroup.setAttribute('data-error', msg);
};

// To remove 'data-error'
const removeDataError = formGroup => {
  formGroup.removeAttribute('data-error');
};

// Check if input is empty
const checkEmpty = (value, formGroup, placeholder) => {
  if (value.length === 0) {
    setDataError(formGroup, `${placeholder} cannot be empty`);
  } else {
    removeDataError(formGroup);
  }
};

// Check if email is valid
const checkEmail = (value, formGroup) => {
  if (!value.match(emailPattern)) {
    setDataError(formGroup, 'Email is not valid');
  } else {
    removeDataError(formGroup);
  }
};

// Check if number is valid
const checkTel = (value, formGroup) => {
  if (!value.match(telPattern)) {
    setDataError(formGroup, 'Number is not valid');
  } else {
    removeDataError(formGroup);
  }
};

// Check if password is valid
const checkPassowrd = (value, formGroup) => {
  if (value.length < 6) {
    setDataError(formGroup, 'Password should be atleast six characters long');
  } else {
    removeDataError(formGroup);
  }
};

// Validate is the main function that runs all the above mini validator functions. It accepts input element as an argument
const validate = el => {
  // We will hide success and error message by default
  hideSuccessMsg();
  hideErrorMsg();

  /*
value = vlaue entered by user
formGroup = Parent of input element, this is where we will set 'data-error' attr.
type = type of input, to run multiple tests depending on type
placeholder = This makes our 'data-error' message resuable.
*/
  const value = el.value;
  const formGroup = el.closest('.form-group');
  const type = el.getAttribute('type');
  const placeholder = el.getAttribute('placeholder');

  checkEmpty(value, formGroup, placeholder);

  // If type is text we will not run further validators.
  if (type === 'text') return;

  // Run if only type is email and value is not empty
  if (type === 'email' && value.length !== 0) {
    checkEmail(value, formGroup);
  }

  // If type is email we will not run further validators.
  if (type === 'email') return;

  // Run if only type is tel and value is not empty
  if (type === 'tel' && value.length !== 0) {
    checkTel(value, formGroup);
  }

  // If type is number we will not run further validators.
  if (type === 'tel') return;

  // Run if only type is password and value is not empty
  if (type === 'password' && value.length !== 0) {
    checkPassowrd(value, formGroup);
  }
  // Return at the end
  return;
};

/////////////////////////////////////////
// EVENT LISTNERS

// We need to validate input value on three events. On input change, on blur and when form is submitted.

// On input change
inputs.forEach(input => {
  input.addEventListener('input', function (e) {
    validate(e.target);
  });
});

// On blur
inputs.forEach(input => {
  input.addEventListener('blur', function (e) {
    validate(e.target);
  });
});

// When form is submitted
form.addEventListener('submit', async function (e) {
  // Prevent reload of the page
  e.preventDefault();
  inputs.forEach(input => validate(input));

  // If there are no ele with 'data-error' attr then form is valid.
  const numError = form.querySelectorAll('.form-group[data-error]');
  // Use guard clause to validate form, return immediately if errors are present
  if (numError.length !== 0) return;

  // At this point form is valid make backend request

  // Collect all the data that needs to be sent from DOM
  const contactData = {
    firstName: document.getElementById('name').value,
    email: document.getElementById('email').value,
    contactNum: document.getElementById('tel').value,
    link: document.getElementById('link').value,
  };

  // Set form status to loading
  startLoader();

  try {
    // Try making request
    const response = await fetch('./backend/contact-us.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    const data = await response.json();
    if (data.status === 'success') showSuccessMsg();
    if (data.status === 'error') showErrorMsg();
  } catch (err) {
    // If request fails catch error and show error msg
    showErrorMsg();
  }

  // Remove form status from loading
  stopLoader();
  // Empty all fields
  form.reset();
});
