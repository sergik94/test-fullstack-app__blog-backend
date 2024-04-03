const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    try {
      const decodedToken = jwt.verify(token, 'someHashKey');

      req.userId = decodedToken._id;
      next();
    } catch (error) {
      return res.status(403).json({
        error: 'Token can not be decoded',
      });
    }
  } else {
    return res.status(403).json({
      error: 'Access is denied',
    });
  }
};
