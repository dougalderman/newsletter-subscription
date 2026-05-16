import jwt from 'jsonwebtoken';

export class AuthenticationController {

  signToken: any = (req: any, res: any, next: any) => {
    const { body } = req;
    const { username, password } = body;

    if (username === )
  }  

  authenticateToken: any = (req: any, res: any, next: any) => {
    // Get token from Header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatu(401); // Unauthorized

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
      if (err) return res.sendStatus(403); // Forbidden

      // Attach user info to the request for the next handler
      req.user = user;
      next();
    });
  };
}  
  