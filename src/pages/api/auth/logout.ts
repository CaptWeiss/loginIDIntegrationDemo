import { NextApiResponse } from 'next';
import nc from 'next-connect';
import * as cookie from 'cookie';
import { validateToken } from '../../../helpers/extractToken';
import { onError, onNoMatch } from '../../../helpers';
import { NextApiRequestExt } from '../../../types';

const handler = nc<NextApiRequestExt, NextApiResponse>({ onError, onNoMatch })
  .use(validateToken)
  .post((req, res) => {
    const { token, user } = req;
    if (!token) return res.status(400).send({ message: 'bad request' });
    try {
      res.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: -60 * 30,
        expires: new Date(Date.now() - (60 * 30)),
        path: '/'
      }));
      return res.status(200).send(user.username);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  });

export default handler;
