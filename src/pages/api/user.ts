import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import prisma from '../../../lib/prisma';
import { validateToken } from '../../helpers/extractToken';

const handler = nc<NextApiRequest, NextApiResponse>()
  .use(validateToken)
  .post(async (req, res) => {
    const { username, id } = req.body;
    try {
      const userAdded = await prisma.user.create({
        data: {
          username,
          id,
          lastLoggedIn: new Date()
        }
      });
      res.status(201).send({ userAdded });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  });

export default handler;
