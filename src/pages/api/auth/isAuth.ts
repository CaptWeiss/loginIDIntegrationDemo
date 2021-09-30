import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { validateToken, onError, onNoMatch } from '../../../helpers';
import { NextApiRequestExt } from '../../../types';

const handler = nc<NextApiRequestExt, NextApiResponse>({ onError, onNoMatch })
  .use(validateToken)
  .get((req, res) => {
    const { token, user } = req;
    if (!token) return res.status(401).send({ message: 'unauthorized' });
    try {
      return res.status(200).send({ message: 'authorized', user });
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  });

export default handler;
