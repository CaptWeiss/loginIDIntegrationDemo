import { NextApiResponse } from 'next';

export async function onError(err: any, req: any, res: NextApiResponse) {
  try {
    if (typeof err === 'number') {
      switch (err) {
        case 401:
          res.status(401).end('unauthenticated');
          break;

        default:
          res.status(err).end();
          break;
      }
    } else {
      res.status(500).end(err.toString());
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).end(error.message);
  }
}

export async function onNoMatch(req: any, res: NextApiResponse) {
  res.status(403).json({ msg: `Method ${req.method} not allowed!` });
}
