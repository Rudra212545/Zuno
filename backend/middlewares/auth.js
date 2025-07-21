// middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

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
      id: decoded.id, // or decoded.userId depending on your token payload
      email: decoded.email, // optional
      // other user info as needed
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
