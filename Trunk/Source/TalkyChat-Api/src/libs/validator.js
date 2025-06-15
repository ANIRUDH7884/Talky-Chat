const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
const phoneRegex = /^[6-9]\d{9}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

const validateEmail = (email) => emailRegex.test(email);
const validatePassword = (password) => passwordRegex.test(password);
const validatePhoneNumber = (phoneNumber) => phoneRegex.test(phoneNumber);
const validateUsername = (username) => usernameRegex.test(username);

module.exports = {validateEmail, validatePassword, validatePhoneNumber, validateUsername};
