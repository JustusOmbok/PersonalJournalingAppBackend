import { verify } from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || '34293560';

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.sendStatus(403);
      }

      req.user = decoded;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export { authenticateJWT }; // Correct way to export the authenticateJWT function
