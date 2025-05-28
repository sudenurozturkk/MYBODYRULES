const bcrypt = require('bcrypt');
const password = 'sude2025';
const hashedPassword = bcrypt.hashSync(password, 10);
console.log(hashedPassword);