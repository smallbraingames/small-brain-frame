import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from "@vercel/kv";
import { IQ_KEY } from './vote';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
   const iq = await kv.get(IQ_KEY)
   res.send(iq);
}

export default handler;
