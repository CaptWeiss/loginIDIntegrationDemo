import { NextApiRequest } from 'next';

export interface NextApiRequestExt extends NextApiRequest {
  token: string;
  user: {
    username: string;
  }
}
