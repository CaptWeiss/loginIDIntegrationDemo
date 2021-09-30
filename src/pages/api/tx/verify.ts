import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { onError, onNoMatch, validateToken, lAdmin } from '../../../helpers';

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(validateToken)
  .post(async (req, res) => {
    try {
      const { txPayload, txToken } = req.body;
      const valid = await lAdmin.verifyTransaction(txToken, txPayload);
      res.json({ txPayload, valid });
    } catch (error: any) {
      res.status(500).send({ message: error.message });
    }
  });

export default handler;
