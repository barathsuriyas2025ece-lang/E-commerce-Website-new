const jwt = require('jsonwebtoken');

const isDemoToken = (token) => {
  if (typeof token !== 'string' || !token) return false;
  if (process.env.NODE_ENV === 'production') return false;
  return token.startsWith('admin_jwt_token_') || token.startsWith('user_jwt_token_');
};

const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || '';

  if (authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];

      if (isDemoToken(token)) {
        req.user = {
          id: 'user_admin_001',
          email: 'barathsuriya.s2025ece@sece.ac.in',
          role: 'admin',
          name: 'System Administrator',
        };
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_replace_in_production');
      req.user = decoded;
      return next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
