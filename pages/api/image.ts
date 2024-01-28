import type { NextApiRequest, NextApiResponse } from 'next';
import "@alxcube/lens-jimp";
import Jimp from "jimp";
import { distortUnwrap } from "@alxcube/lens";
import { kv } from '@vercel/kv';
import { AVERAGE_IQ, IQ_KEY } from './vote';

const HOST = process.env.NEXT_PUBLIC_HOST;
const MAX_DISTORTION = 100;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const iq = await kv.get<number>(IQ_KEY) ?? AVERAGE_IQ;

        const isSmaller = iq < AVERAGE_IQ;
        const distortionAmount = Math.min(Math.abs(iq - AVERAGE_IQ) + 1, MAX_DISTORTION);
        const image = await Jimp.read(`${HOST}/smallbrain.jpg`);
        isSmaller && image.rotate(180)
        const distorted = await distortUnwrap(image, "Arc", [distortionAmount], { imageBackgroundColor: "white" });
        distorted.resize(340, 340);

        isSmaller && distorted.rotate(180);

        const base = await Jimp.read(`${HOST}/base.png`);
        base.composite(distorted, 175, 175);

        const buffer = await base.getBufferAsync("image/png");

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'max-age=10');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating image');
    }
}
