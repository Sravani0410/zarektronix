const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5030;

mongoose.connect('mongodb://localhost:27017/schrodingers-signup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  verified: Boolean,
});

app.use(bodyParser.json());

app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email is already registered.');
    }
    const newUser = new User({ name, email, password, verified: false });
    await newUser.save();

    res.json({ success: true, message: 'User signed up successfully.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
