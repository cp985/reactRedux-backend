const emailReg = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const textReg = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
const usernameReg = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);

module.exports = { emailReg, textReg, usernameReg };