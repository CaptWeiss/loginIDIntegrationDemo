import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import prisma from '../../../lib/prisma';
import { onError, onNoMatch, validateToken } from '../../helpers';

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(validateToken)
  .get(async (req, res) => {
    try {
      const notifications = await prisma.notification.findMany();
      res.send({ notifications });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  });

export default handler;
