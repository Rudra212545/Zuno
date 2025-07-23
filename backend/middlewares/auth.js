// middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const verifyToken = (req, res, next) => {
  try {
    // Usually token comes in header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or malformed.' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token and decode payload
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info (e.g. id) to req object
    req.user = {
      _id: decoded._id, // ✅ Use _id as per your token payload
      email: decoded.email,
    };
    

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
