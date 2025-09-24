import jwt from 'jsonwebtoken';

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { 
      _id: user._id,
      email: user.email 
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  const refreshToken = jwt.sign(
    { 
      _id: user._id,
      email: user.email 
    },
    process.env.REFRESH_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

export default generateTokens;
