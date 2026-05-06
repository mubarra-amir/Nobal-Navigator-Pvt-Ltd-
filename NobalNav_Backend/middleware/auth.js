import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  // Read token from cookie instead of Authorization header
  const token = req.cookies?.nn_token;

  if (!token)
    return res.status(401).json({ message: 'Not authorized — please log in' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired — please log in again' });
  }
};

// Admin-only guard — use AFTER protect
export const adminOnly = (req, res, next) => {
  if (!req.user.is_admin)
    return res.status(403).json({ message: 'Admins only' });
  next();
};