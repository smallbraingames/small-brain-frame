import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from "@vercel/kv";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";

const HUB_URL = "nemes.farcaster.xyz:2283"
const client = getSSLHubRpcClient(HUB_URL);


const HOST = process.env.NEXT_PUBLIC_HOST;
export const IQ_KEY = "IQ";
export const AVERAGE_IQ = 100;


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'POST') {
        try {
            let validatedMessage: Message | undefined = undefined;
            try {
                const frameMessage = Message.decode(Buffer.from(req.body?.trustedData?.messageBytes || '', 'hex'));
                const result = await client.validateMessage(frameMessage);
                if (result.isOk() && result.value.valid) {
                    validatedMessage = result.value.message;
                }
            } catch (e) {
                return res.status(400).send(`Failed to validate message: ${e}`);
            }

            const buttonId = validatedMessage?.data?.frameActionBody?.buttonIndex || 0;
            const iq = (await kv.get<number>(IQ_KEY)) ?? AVERAGE_IQ;

            await kv.set<number>(IQ_KEY, Math.max(0, iq + (buttonId === 1 ? 5 : -5)));

            console.log(`Voted, IQ is now ${await kv.get<number>(IQ_KEY)}, button pressed ${buttonId}`);

            const imageUrl = `${HOST}/api/image?noCache=${Math.floor(Math.random() * 500)}`;

            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Small Brain</title>
          <meta property="og:title" content="Brain Size Changed">
          <meta property="og:image" content="${imageUrl}">
          <meta name="fc:frame" content="vNext">
          <meta name="fc:frame:image" content="${imageUrl}">
          <meta name="fc:frame:post_url" content="${HOST}/api/vote">
          <meta name="fc:frame:button:1" content="Bigger">
          <meta name="fc:frame:button:2" content="Smaller">
        </head>
        <body>
          <p>You have made my brain ${buttonId === 1 ? "smaller" : "bigger"}.</p>
        </body>
      </html>
    `);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error generating image');
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
