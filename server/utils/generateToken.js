import jwt from 'jsonwebtoken';

export const generateToken = (id, rememberMe = false) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? process.env.JWT_REMEMBER_EXPIRE : process.env.JWT_EXPIRE,
  });
};
