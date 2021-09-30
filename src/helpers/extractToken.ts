import { NextApiResponse } from 'next';
import * as cookie from 'cookie';
import { NextHandler } from 'next-connect';
import jwtDecode from 'jwt-decode';
import { lAdmin } from './loginAdmin';
import { NextApiRequestExt } from '../types';

export async function validateToken(req: NextApiRequestExt, res: NextApiResponse, next: NextHandler) {
  try {
    const cookies = cookie.parse(req.headers.cookie ? req.headers.cookie : '');
    const { authToken } = cookies;
    if (!authToken) return next(401);
    const { udata } = jwtDecode(authToken) as { [key: string]: string };
    const valid = await lAdmin.verifyToken(authToken, udata); // validate  and extract data from token
    if (!valid) return next(401);
    req.token = authToken;
    req.user = { username: udata };
    return next();
  } catch (error) {
    console.log(error);
    return next(500);
  }
}
