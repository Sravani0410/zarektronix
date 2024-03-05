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

    res.json({ success: true, message: 'User signed up successfully.Please check your email for verification.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
app.get('/api/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      throw new Error('Invalid verification token.');
    }

    user.verified = true;
    await user.save();

    res.send('Email verified successfully. You can now log in.');
  } catch (error) {
    res.status(400).send(error.message);
  }
});
function sendVerificationEmail(user) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sravanipyla04@gmail.com',
      pass: 'Demo@123',
    },
  });

  const mailOptions = {
    from: 'sandhyapyla.8@gmail.com',
    to: user.email,
    subject: 'Email Verification',
    text: `Hi ${user.name}, please click the following link to verify your email: http://localhost:5000/api/verify/${user.verificationToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
