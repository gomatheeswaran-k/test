const jwt = require('jsonwebtoken');
const secretKey = 'fECq9wPbwi73VcY9sFUW30ZC2b775Njz-emVihPm3142ZbxGcn76cfz29KqfSxCM'

// check for authentication:
const authorizeMiddleware = (req, res, next) => {
  
    // Perform token verification logic here
    const authToken = req.headers.authorization;

    if (!authToken) {
      return res.status(401).json({ message: 'Authorization token not found' });
    }

    const token = authToken.split(' ')[1]; // Extract the token part (remove "Bearer ")
  
    // Verify JWT token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token', error: err });
      }
      // If token is valid, store decoded user information in request object
      req.user = decoded;
      next(); // Proceed to the next middleware or route handler
    });
  };

  module.exports = authorizeMiddleware;