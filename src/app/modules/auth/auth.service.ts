import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TDecodedUser, TLoginUser } from './auth.interface';
import { createJwtToken, verifyJwtToken } from './auth.utils';

// post
const loginUserIntoDb = async (payload: TLoginUser) => {
  // check if user already exists or not
  const existingUser = await User.isUserExistsByEmail(payload.email);
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // compare hashed password
  const isPasswordValid = await User.isPasswordMatched(
    payload.password,
    existingUser.password,
  );
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
  }

  // Generate JWT token
  const jwtPayload = {
    name: existingUser.name,
    email: existingUser?.email,
    role: existingUser.role,
  };

  const accessToken = createJwtToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createJwtToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return { accessToken, refreshToken };
};

const refreshToken = async (refreshToken: string) => {
  // check if refresh token valid
  const decoded = verifyJwtToken(
    refreshToken,
    config.jwt_refresh_secret as string,
  ) as TDecodedUser;

  if (!decoded) {
    throw new Error('Invalid refresh token');
  }

  // check if user exists
  const existingUser = await User.isUserExistsByEmail(decoded.email);
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Generate JWT token
  const jwtPayload = {
    name: existingUser.name,
    email: existingUser?.email,
    role: existingUser.role,
  };

  const accessToken = createJwtToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return accessToken;
};

export const AuthServices = {
  loginUserIntoDb,
  refreshToken,
};
