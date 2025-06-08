// Simple mock authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // For mock server, we'll accept any token that starts with 'Bearer '
  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'Provide a valid Bearer token in Authorization header'
    });
  }

  // Mock user data based on token
  if (token === 'mock-token-12345') {
    req.user = { id: '12345', name: 'Кирилл Романов' };
  } else {
    req.user = { id: 'user_456', name: 'Mock User' };
  }

  next();
};

// Optional authentication - for routes that work with or without auth
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    if (token === 'mock-token-12345') {
      req.user = { id: '12345', name: 'Кирилл Романов' };
    } else {
      req.user = { id: 'user_456', name: 'Mock User' };
    }
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth
};