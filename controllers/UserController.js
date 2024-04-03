const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const bcrypt = require('bcrypt');

const signIn = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        message: 'Email or password is invalid',
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash,
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Email or password is invalid',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'someHashKey',
      {
        expiresIn: '30d', // Token has been kept for 30 days
      },
    );

    // eslint-disable-next-line no-unused-vars
    const { passwordHash, ...otherUserData } = user._doc;

    res.json({ token, ...otherUserData });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Some error at the server',
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        error: 'User is not found',
      });
    }

    // eslint-disable-next-line no-unused-vars
    const { passwordHash, ...otherUserData } = user._doc;

    res.json({ ...otherUserData });
  } catch (error) {
    console.log(error);
  }
};

const signUp = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'someHashKey',
      {
        expiresIn: '30d', // Token has been kept for 30 days
      },
    );

    // eslint-disable-next-line no-unused-vars
    const { passwordHash, ...otherUserData } = user._doc;

    res.json({ token, ...otherUserData });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Some error at the server',
    });
  }
};

module.exports = { signIn, signUp, getMe };
