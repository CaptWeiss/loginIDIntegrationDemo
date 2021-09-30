import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { onError, onNoMatch } from '../../../helpers';
import { lAdmin } from '../../../helpers/loginAdmin';

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .get((req, res) => {
    // generate service token
    try {
      const { scope } = req.query as { [key: string]: string[] };
      if (scope[0] === 'tx') {
        const { txPayload } = req.query as { [key: string]: string };
        const txAuthToken = lAdmin.generateTxAuthToken(txPayload);
        res.send({ serviceToken: txAuthToken });
      } else {
        const serviceToken = lAdmin.generateServiceToken(`${scope.join('.')}`);
        res.send({ serviceToken });
      }
    } catch (error: any) {
      res.status(500).send({ message: error.message });
    }
  });

export default handler;
