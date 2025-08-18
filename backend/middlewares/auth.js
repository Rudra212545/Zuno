import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authorization token missing or malformed.',
        code: 'AUTH_HEADER_INVALID'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token and decode payload
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      _id: decoded._id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired.',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      message: 'Invalid token.',
      code: 'TOKEN_INVALID'
    });
  }
};
