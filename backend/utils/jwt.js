const jwt = require('jsonwebtoken');

class JWTUtil {
  // Generate JWT token
  generateToken(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '7d',
        issuer: 'task-manager-api',
        audience: 'task-manager-client'
      }
    );
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'task-manager-api',
        audience: 'task-manager-client'
      });
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Generate access token with user info
  generateAccessToken(user) {
    return this.generateToken({
      userId: user._id,
      username: user.username,
      email: user.email,
      type: 'access'
    });
  }

  // Generate refresh token
  generateRefreshToken(user) {
    return this.generateToken({
      userId: user._id,
      type: 'refresh'
    });
  }

  // Decode token without verification (for expired tokens)
  decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = new JWTUtil();