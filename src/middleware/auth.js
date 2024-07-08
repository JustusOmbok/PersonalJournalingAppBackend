const jwt = require('jsonwebtoken');

your_secret_key = 34293560;

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decoded; 
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  authenticateJWT
};

