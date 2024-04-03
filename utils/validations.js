const { body } = require('express-validator');

const signIn = [
  body('email', 'Your email is not valid').isEmail(),
  body('password', 'Your password is less than 6 characters').isLength({
    min: 6,
  }),
];

const signUp = [
  body('email', 'Your email is not valid').isEmail(),
  body('password', 'Your password is less than 6 characters').isLength({
    min: 6,
  }),
  body('fullName', 'Your full name is less than 3 characters').isLength({
    min: 3,
  }),
  body('avatarUrl', 'Your avatar URL is not valid').optional().isURL(),
];

const createPost = [
  body('title', 'Your title is not valid').isLength({ min: 3 }).isString(),
  body('text', 'Your text is not valid').isLength({ min: 10 }).isString(),
  body('tags', 'Your tags is not valid').optional().isArray(),
  body('imgUrl', 'Your URL of image is not valid').optional().isString(),
];

module.exports = { signIn, signUp, createPost };
