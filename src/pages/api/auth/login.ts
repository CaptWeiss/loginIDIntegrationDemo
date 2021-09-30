import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import * as cookie from 'cookie';
import { Result } from '@loginid/sdk/base';
import prisma from '../../../../lib/prisma';
import { onError, onNoMatch } from '../../../helpers';

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .post(async (req, res) => {
    const { jwt, user } = req.body as Result;
    if (!jwt) return res.status(400).send({ message: 'bad request' });
    try {
      const updatedUser = await prisma.user.upsert({
        create: {
          username: user.username,
          id: user.id,
          lastLoggedIn: new Date()
        },
        update: {
          lastLoggedIn: new Date()
        },
        where: {
          id: user.id
        },
        include: {
          notifications: {
            where: {
              read: false
            }
          }
        }
      });

      res.setHeader('Set-Cookie', cookie.serialize('authToken', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 30,
        expires: new Date(Date.now() + (60 * 30)),
        path: '/'
      }));
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  });

export default handler;
