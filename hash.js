const bcrypt = require('bcryptjs');

const password = 'AdminAccount123@';

async function hashPassword() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword);
}

hashPassword();