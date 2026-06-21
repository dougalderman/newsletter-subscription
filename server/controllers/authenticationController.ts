import jwt from 'jsonwebtoken';

export class AuthenticationController {

  static signToken: any = (req: any, res: any, next: any) => {
    const { body } = req;
    const { email, adminAuthorized } = body;

    jwt.sign(
      { email, adminAuthorized }, process.env.JWT_TOKEN_SECRET as string, (err: any, token: any) => {
        if (err) {
          console.error('Error signing token', err);
          return res.status(500).send('Error signing token');
        }
        else {
          res.json({ token });
        }
      });
  }  

  static authenticateToken: any = (req: any, res: any, next: any) => {
    // Get token from Header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_TOKEN_SECRET as string, (err: any, user: any) => {
      if (err) return res.sendStatus(403); // Forbidden

      // Attach user info to the request for the next handler
      req.user = user;
      next();
    });
  };
}  
  