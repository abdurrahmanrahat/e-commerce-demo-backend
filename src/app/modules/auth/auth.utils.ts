import jwt, { JwtPayload } from 'jsonwebtoken';

export const createJwtToken = (
  jwtPayload: JwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyJwtToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
