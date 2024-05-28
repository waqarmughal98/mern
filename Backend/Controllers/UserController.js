const AsyncHandler = require('express-async-handler');
const User = require('../Models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const signup = AsyncHandler(async (req, res) => {
  let { name, email, password } = req.body;
  let user;
  // Verify email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    //check user email exist
    user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ error: 'User with this email is already exists!' });
    }

    //hash password
    let salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    //create user in db
    user = await User.create({ name, email, password });

    //generate jwt token
    let token = generateToken(user._id.toString());

    //if user created
    if (user) {
      res.status(201).json({
        success: true,
        message: 'User Created successfully!',
        data: {
          name,
          email,
          id:user._id.toString(),
          token,
        },
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: 'Something went wrong' });
  }
});

const login = AsyncHandler(async (req, res) => {
  let { email, password } = req.body;
  let user;

  // Verify email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    //Check Email
    user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'User not found with these credentials!' });
    }

    //Check Password
    let matchedPassword = await bcrypt.compare(
      password,
      user.password
    );
    if (!matchedPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorect Password!' });
    }

    //generate jwt token
    let token = generateToken(user._id.toString());

    //if both are correct move on
    if (user && matchedPassword) {
      return res.status(200).json({
        success: true,
        message: 'User Logged In Successfully!',
        data: {
          name:user.name,
          email,
          id:user._id.toString(),
          token,
        },
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: 'Something went wrong' });
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_Secret, {
    expiresIn: '30d',
  });
};

const logout = async (req, res) => {
  let token = req.headers.authorization;
  console.log(token, 'token');
};

const ChangePassword = async (req, res) => {
  let { old_password, current_password, password_confirmation } =
    req.body;

  // Ensure inputs are strings
  old_password = old_password.toString();
  current_password = current_password.toString();
  password_confirmation = password_confirmation.toString();

  let validation_error = false;
  let error_message = '';

  if (!old_password) {
    error_message = 'Old password is required';
    validation_error = true;
  } else if (!current_password) {
    error_message = 'Current password is required';
    validation_error = true;
  } else if (!password_confirmation) {
    error_message = 'Password confirmation is required';
    validation_error = true;
  } else if (current_password.length < 8) {
    error_message = 'Password length must be 8 or greater';
    validation_error = true;
  } else if (current_password !== password_confirmation) {
    error_message = 'Passwords must match';
    validation_error = true;
  } else if (current_password === old_password) {
    error_message =
      'New password must be different from old password';
    validation_error = true;
  }

  if (validation_error) {
    return res
      .status(422)
      .json({ success: false, message: error_message });
  }

  try {
    // Find the user with the provided ID
    let user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Compare the old password with the stored hashed password
    const passwordMatch = await bcrypt.compare(
      old_password,
      user.password
    );

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect old password' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(current_password, salt);

    // Update user's password
    await User.findByIdAndUpdate(req.user.id, {
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: 'Something went wrong' });
  }
};



const deleteUser = async (req, res) => {
  try {
    // Find the user with the provided ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }


    // Delete the user
    await User.findByIdAndDelete(req.user.id);

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'quincy.gislason84@ethereal.email',
        pass: 'eqsTRMSHF1fSTyRwdm'
    }
});
  

  const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
      from: 'abdullahnaveed20640@gmail.com',
      to: email,
      subject: 'Reset Your Password',
      text: `Your OTP to reset the password is: ${otp}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully.');
    } catch (error) {
      console.error('Error sending OTP email:', error);
    }
  };
  
  const generateOTP = () => {
    return uuidv4().substr(0, 6); // Generating a random 6-digit OTP
  };
  
  const sendOTP = async (req, res) => {
    const { email } = req.body;
    if(!email){
        return res.status(400).json({ success: false, message: 'Email is required' });
    }
    try {
      if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }
  
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      const otp = generateOTP();
  
      user.otp = otp;
      await user.save();
  
      // Send OTP via email
      await sendOTPEmail(email, otp);
  
      return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Error in sendOTP:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };
  
  const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    let validationError=false
    let errorMessage
    if(!email){
       errorMessage="'Email is required'"
       validationError=true  
    } 
    else if(!otp){
        errorMessage="'Otp is required'"
        validationError=true
    }
    if(validationError){
        return res.status(400).json({ success: false, message: errorMessage });
    }
    try {
      if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }
  
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      if (!isValidOTP(otp, user.otp)) {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
      }
  
      return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
      console.error('Error in verifyOTP:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };
  
  const resetPassword = async (req, res) => {
    let { email, newPassword, confirmPassword } = req.body;
    let validationError=false
    let errorMessage
    if(!email){
       errorMessage="'Email is required'"
       validationError=true  
    } 
    else if(!newPassword){
        errorMessage="'New Password is required'"
        validationError=true
    }
    else if(!confirmPassword){
        errorMessage="Confirm Password is required'"
        validationError=true
    }
    if(validationError){
        return res.status(400).json({ success: false, message: errorMessage });
    }
    try {
      if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Password and confirmation do not match' });
      }
  
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

          //hash password
    let salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);
  
      // Update user's password
      user.password = newPassword;
      user.otp = ''; 
      await user.save();
  
      return res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };
  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const isValidOTP = (inputOTP, storedOTP) => {
    return inputOTP === storedOTP;
  };

module.exports = { signup, login, logout, ChangePassword , deleteUser , sendOTP , verifyOTP , resetPassword };
