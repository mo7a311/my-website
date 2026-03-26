require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = new User({
      name: 'Test',
      email: 'test' + Date.now() + '@test.com',
      password: 'pwd',
      role: 'user'
    });
    await user.save();
    console.log('Created!', user);
  } catch (err) {
    console.error('ERROR CREATING:', err);
  }
}

test();
